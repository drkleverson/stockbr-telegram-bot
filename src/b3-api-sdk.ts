import { getChartFluctuationStringEmoji } from "../src/getChartFluctuationStringEmoji";
import { getPercentageChange, moneyFormat, datePtBr } from "../src/tools";
import { replyMessage } from "../src/telegram";

export async function requestStockPrice(stock: string) {
  return await fetch(`${process.env.API_URL}${stock}`);
}

export function getTickerNameFromMention(message, mention) {

  const start = mention.offset + 1;
  const substrLen = mention.length;

  const ticker = message.text.substr(start, substrLen);
/*
  if (ticker.length < 4 || ticker.length > 5)
    throw new Error('Invalid ticker!');
  */
  return ticker;
}

export async function  replyStockPriceTicker(message, ticker: string): Promise<any[]> {

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
  reply += `\n<b>R$ ${currentPriceStr}</b> | ${chartEmoji} ${change}%`;
  reply += '\n';
  reply += `\n🟢 R$ <b>${openningPriceStr}</b>`;
  reply += `\n🔼 R$ <b>${highestPriceStr}</b>`;
  reply += `\n🔽 R$ <b>${lowestPriceStr}</b>`;
  reply += '\n';
  reply += `\n<i>Atualizado em ${datePtBr(stockResponseJson.tradetime)}</i>`;

  await replyMessage(message, reply);

  console.log("fim");

  return [];
}

export async function invalidStockReply(message: any, ticker: any) {
  const reply = `Desculpe ${message.from.first_name}, não consegui encontrar a ação "${ticker}".`;
  await replyMessage(message, reply);
  console.log("fim - resposta não positiva do stock");
}