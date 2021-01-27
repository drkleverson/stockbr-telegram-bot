import { getPercentageChange, moneyFormat } from "../../src/tools";
import { getChartFluctuationStringEmoji } from "./getChartFluctuationStringEmoji";
import { replyMessage } from "../../src/telegram";
import { getTickerName, requestStockPrice } from "../../src/b3-api-sdk";


async function replyStockPriceRequest(message, mention) {

  const ticker = getTickerName(message, mention);

  console.log(ticker);

  const stockResponse = await requestStockPrice(ticker);

  console.log(stockResponse);

  if (stockResponse.status !== 200) {
    await invalidStockReply(message, ticker);
    return [];
  }

  const stockResponseJson = await stockResponse.json();

  console.log(stockResponseJson);

  const change = getPercentageChange(
    stockResponseJson.closeyest,
    stockResponseJson.price
  );

  const chartEmoji = getChartFluctuationStringEmoji(change);

  const openningPriceStr = moneyFormat(stockResponseJson.priceopen);
  const highestPriceStr = moneyFormat(stockResponseJson.high);
  const lowestPriceStr = moneyFormat(stockResponseJson.low);
  const currentPriceStr = moneyFormat(stockResponseJson.price);

  let reply = `<b>${stockResponseJson.code}</b>\n`;
  reply += `\n<b>R$ ${currentPriceStr}</b>      ${chartEmoji} ${change}%`;
  reply += '\n';
  reply += `\nAbertura...R$ <b>${openningPriceStr}</b>`;
  reply += `\nAlta.......R$ <b>${highestPriceStr}</b>`;
  reply += `\nBaixa......R$ <b>${lowestPriceStr}</b>`;

  await replyMessage(message, reply);

  console.log("fim");

  return [];
}

async function invalidStockReply(message: any, ticker: any) {
  const reply = `Desculpe ${message.from.first_name}, não consegui encontrar a ação "${ticker}".`;
  await replyMessage(message, reply);
  console.log("fim - resposta não positiva do stock");
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

  const mentioned: any[] = message.entities.map((entity) => {
    return entity.type == "hashtag" ? entity : null;
  });

  console.log(mentioned);

  if (!mentioned || mentioned[0] == null) {
    console.log("fim - bot não foi chamado");
    return res.json([]);
  }

  const resDataTaskList = mentioned.map((m) => replyStockPriceRequest(message, m));

  const resDataList = await Promise.all(resDataTaskList);

  const resData = resDataList.flat();

  return res.json(resData);
}

export default webhook;
