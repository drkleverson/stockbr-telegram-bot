const axios = require("axios").default;
const tools = require("../../src/tools");

async function webhook(req, res) {
  console.log(req.body.message);

  let message = req.body.message;
  let text = `Desculpe ${message.from.first_name}, não consegui encontrar esta ação.`;
  if (!"entities" in message) {
    res.json([]);
  }
  let mentioned = message.entities.map((entity) => {
    return entity.type == "hashtag" ? entity : null;
  });

  console.log(mentioned);

  if (mentioned[0] == null) {
    res.json([]);
  }

  let stock = message.text
    .substring(mentioned[0].offset, mentioned[0].length)
    .replace("#", "");

  console.log(stock);
  const stockResponse = await fetch(
    `https://bovespa.nihey.org/api/quote/${stock}`
  );

  console.log(stockResponse);
  if (stockResponse.status == 200) {
    const stockResponseJson = await stockResponse.json();
    console.log(stockResponseJson);

    let change = tools.getPercentageChange(
      stockResponseJson.preabe,
      stockResponseJson.preult
    );
    text = `*${stockResponseJson.nomres}*`;
    text += `\n*R$ ${tools.moneyFormat(stockResponseJson.preult)} | ${change}*`;
    text += `\n\n*Abertura:* R$ ${tools.moneyFormat(stockResponseJson.preabe)}`;
    text += `\n*Alta:* R$ ${tools.moneyFormat(stockResponseJson.premax)}`;
    text += `\n*Baixa:* R$ ${tools.moneyFormat(stockResponseJson.premin)}`;
  }

  await axios.post(
    "https://api.telegram.org/bot1555054396:AAGOhY8_3KbwjVPZgoBtKII1XTn5WyggB9Q/sendMessage",
    {
      chat_id: message.chat.id,
      reply_to_message_id: message.message_id,
      text: text,
      parse_mode: "markdown",
    }
  );
  console.log("fim");
  res.json([]);
}

export default webhook;
