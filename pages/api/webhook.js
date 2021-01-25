async function webhook(req, res) {
  console.log(req.query);
  console.log(req.query);

  const stockResponse = await fetch(
    `https://bovespa.nihey.org/api/quote/${req.query.stock}/2021-01-22`
  );
  const stockResponseJson = await stockResponse.json();
  console.log(stockResponseJson);
  res.json([req.query, req.body]);
}

export default webhook;
