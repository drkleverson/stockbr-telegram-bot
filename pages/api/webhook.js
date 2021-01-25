const axios = require("axios").default;

async function webhook(req, res) {
  let message = JSON.parse(req.body.message);

  if (req.query.token !== "1555054396:AAGOhY8_3KbwjVPZgoBtKII1XTn5WyggB9Q") {
    return false;
  }
  if (!message.text.indexOf("@stockbrbot")) {
    return false;
  }

  let pieces = message.text.split(" ");

  const stockResponse = await fetch(
    `https://bovespa.nihey.org/api/quote/${pieces[1]}/2021-01-22`
  );

  const stockResponseJson = await stockResponse.json();

  await axios.post(
    "https://api.telegram.org/bot1555054396:AAGOhY8_3KbwjVPZgoBtKII1XTn5WyggB9Q/sendMessage",
    {
      chat_id: message.chat.id,
      reply_to_message_id: message.message_id,
      text: stockResponseJson.nomres,
    }
  );
}

export default webhook;
