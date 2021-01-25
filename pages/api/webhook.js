const axios = require("axios").default;
const tools = require("../../src/tools");

async function webhook(req, res) {
  console.log(req.body.message);

  let message = req.body.message;
  let text = `Desculpe ${message.from.first_name}, não consegui encontrar esta ação.`;
  /*
  if (!message.text.indexOf("@stockbrbot")) {
    res.json([]);
  }
  */
  let pieces = message.text.split(" ");
  console.log(pieces);
  const stockResponse = await fetch(
    `https://bovespa.nihey.org/api/quote/${pieces[1]}/2021-01-22`
  );

  console.log(stockResponse);
  const stockResponseJson = await stockResponse.json();
  console.log(stockResponseJson);

  if (stockResponse.status == 200) {
    let change = tools.getPercentageChange(
      stockResponseJson.preabe,
      stockResponseJson.preult
    );
    text = `*${stockResponseJson.nomres}*`;
    text += `\n*R$ ${tools.moneyFormat(stockResponseJson.preult)} ${change}*`;
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
