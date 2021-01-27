export async function requestStockPrice(stock: string) {
  return await fetch(`${process.env.API_URL}${stock}`);
}

export function getTickerNameFromMention(message, mention) {

  const start = mention.offset + 1;
  const substrLen = mention.length;

  const ticker = message.text.substr(start, substrLen);

  if (ticker.length < 4 || ticker.length > 5)
    throw new Error('Invalid ticker!');

  return ticker;
}