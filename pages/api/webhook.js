const axios = require("axios").default;

async function webhook(req, res) {
  console.log(req.body.message);

  let message = req.body.message;
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
  let text =
    stockResponse.status == 200
      ? stockResponseJson.nomres
      : "Num achei bixo, tenta outro.";
  await axios.post(
    "https://api.telegram.org/bot1555054396:AAGOhY8_3KbwjVPZgoBtKII1XTn5WyggB9Q/sendMessage",
    {
      chat_id: message.chat.id,
      reply_to_message_id: message.message_id,
      text: text,
    }
  );
  console.log("fim");
  res.json([]);
}

export default webhook;
