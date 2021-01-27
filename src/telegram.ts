import axios from "axios";

const telegramSendMenssageUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

export async function replyMessage(message, replyText) {
  const chatId = message.chat.id;
  const messageId = message.message_id;

  await axios.post(
    telegramSendMenssageUrl,
    {
      chat_id: chatId,
      reply_to_message_id: messageId,
      text: replyText,
      parse_mode: "html",
    }
  );
}
