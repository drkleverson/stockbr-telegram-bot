import axios from "axios";
import * as tools from "../../src/tools";

const telegramSendMenssageUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

async function replyMessage(message, reply) {
  await axios.post(
    telegramSendMenssageUrl,
    {
      chat_id: message.chat.id,
      reply_to_message_id: message.message_id,
      text: reply,
      parse_mode: "html",
    }
  );
}

function getStockName(message, mention) {
  return message.text.substr(mention.offset, mention.length).replace("#", "");
}

function getChartFluctuationEmoji(fluctuation: number) {
  if (fluctuation < 0) return '📉';
  if (fluctuation > 0) return '📈';
  return '📊';
}

function getChartFluctuationStringEmoji(fluctuation: "+" | '-' | '') {
  if (fluctuation.includes('-')) return '📉';
  if (fluctuation.includes('+')) return '📈';
  return '📊';
}

async function requestStockPrice(stock: string) {
  return await fetch(`${process.env.API_URL}${stock}`);
}

async function replyStockPriceRequest(message, mention) {
  const stock = getStockName(message, mention);

  console.log(stock);

  const stockResponse = await requestStockPrice(stock);

  console.log(stockResponse);

  if (stockResponse.status !== 200) {
    const reply = `Desculpe ${message.from.first_name}, não consegui encontrar a ação "${stock}".`;
    await replyMessage(message, reply);
    console.log("fim - resposta não positiva do stock");
    return [];
  }

  const stockResponseJson = await stockResponse.json();

  console.log(stockResponseJson);

  const change = tools.getPercentageChange(
    stockResponseJson.closeyest,
    stockResponseJson.price
  );

  const chartEmoji = getChartFluctuationStringEmoji(change);

  let reply = `<b>${stockResponseJson.code}</b>\n`;
  reply += `\n<b>R$ ${tools.moneyFormat(stockResponseJson.price)}</b>      ${chartEmoji} ${change}%`;
  reply += '\n';
  reply += `\nAbertura...R$ <b>${tools.moneyFormat(stockResponseJson.priceopen)}</b>`;
  reply += `\nAlta.......R$ <b>${tools.moneyFormat(stockResponseJson.high)}</b>`;
  reply += `\nBaixa......R$ <b>${tools.moneyFormat(stockResponseJson.low)}</b>`;

  await replyMessage(message, reply);

  console.log("fim");

  return [];
}

async function webhook(req, res) {
  if (process.env.WEBHOOK_HASH !== req.query.webhook_hash) {
    console.log("fim - webhook hash invalido");
    return res.json([]);
  }

  const message = req.body.message;

  console.log(message);

  if (message && !("entities" in message)) {
    console.log("fim - mensagem incompleta");
    return res.json([]);
  }

  const mentioned = message.entities.map((entity) => {
    return entity.type == "hashtag" ? entity : null;
  });

  console.log(mentioned);

  if (!mentioned || mentioned[0] == null) {
    console.log("fim - bot não foi chamado");
    return res.json([]);
  }

  const resDataTaskList = mentioned.map((mention) =>
    replyStockPriceRequest(message, mention)
  );

  const resDataList = await Promise.all(resDataTaskList);

  const resData = resDataList.flat(resDataList);

  return res.json(resData);
}

export default webhook;
