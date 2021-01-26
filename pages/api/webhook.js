const axios = require("axios").default;
const tools = require("../../src/tools");

async function replyMessage(message, reply) {
  await axios.post(
    "https://api.telegram.org/bot1555054396:AAGOhY8_3KbwjVPZgoBtKII1XTn5WyggB9Q/sendMessage",
    {
      chat_id: message.chat.id,
      reply_to_message_id: message.message_id,
      text: reply,
      parse_mode: "markdown",
    }
  );
}

async function webhook(req, res) {
  console.log(req.body.message);

  const message = req.body.message;

  if (!(entities in message)) {
    console.log("fim - mensagem incompleta");
    return res.json([]);
  }

  const mentioned = message.entities.map((entity) => {
    return entity.type == "hashtag" ? entity : null;
  });

  console.log(mentioned);

  if (mentioned[0] == null) {
    res.json([]);
    console.log("fim - bot não foi chamado");
    return;
  }

  const stock = message.text
    .substring(mentioned[0].offset, mentioned[0].length)
    .replace("#", "");

  console.log(stock);

  const stockResponse = await fetch(
    `https://bovespa.nihey.org/api/quote/${stock}`
  );

  console.log(stockResponse);

  if (stockResponse.status !== 200) {
    const reply = `Desculpe ${message.from.first_name}, não consegui encontrar esta ação.`;
    await replyMessage(message, reply);
    console.log("fim - resposta não positiva do stock");
    res.json([]);
    return;
  }

  const stockResponseJson = await stockResponse.json();
  console.log(stockResponseJson);

  const change = tools.getPercentageChange(
    stockResponseJson.preabe,
    stockResponseJson.preult
  );

  let reply = `*${stockResponseJson.nomres}*`;
  reply += `\n*R$ ${tools.moneyFormat(stockResponseJson.preult)} | ${change}*`;
  reply += `\n\n*Abertura:* R$ ${tools.moneyFormat(stockResponseJson.preabe)}`;
  reply += `\n*Alta:* R$ ${tools.moneyFormat(stockResponseJson.premax)}`;
  reply += `\n*Baixa:* R$ ${tools.moneyFormat(stockResponseJson.premin)}`;

  await replyMessage(message, reply);
  console.log("fim");
  res.json([]);
}

export default webhook;
