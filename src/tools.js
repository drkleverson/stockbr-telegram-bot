module.exports = {
  moneyFormat: function (value) {
    return parseFloat(value)
      .toFixed(2)
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
  },
  timePtBr: function (time = Date()) {
    var data = new Date(
        new Date(time).toLocaleString("pt-br", {
          timeZone: "America/Sao_Paulo",
        })
      ),
      hora = data.getHours().toString(),
      horaF = hora.length == 1 ? "0" + hora : hora,
      minuto = data.getMinutes().toString(),
      minutoF = minuto.length == 1 ? "0" + minuto : minuto;
    return horaF + ":" + minutoF;
  },
  datePtBr: function (date = Date()) {
    return new Date(date).toLocaleString("pt-br", {
      timeZone: "America/Sao_Paulo",
    });
  },
  getPercentageChange: function (oldNumber, newNumber) {
    let decreaseValue = newNumber - oldNumber;
    let result = (decreaseValue / oldNumber) * 100;
    return (result > 0 ? "+" : "") + this.moneyFormat(result.toFixed(2));
  },
};
