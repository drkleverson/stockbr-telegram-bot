export function moneyFormat(value: string) {
  return parseFloat(value)
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

export function timePtBr(time = Date()) {
  
  const data = new Date(
    new Date(time).toLocaleString("pt-br", {
      timeZone: "America/Sao_Paulo",
    })
  );

  const hora = data.getHours().toString();
  const horaF = hora.length === 1 ? "0" + hora : hora;
  const minuto = data.getMinutes().toString();
  const minutoF = minuto.length === 1 ? "0" + minuto : minuto;

  return horaF + ":" + minutoF;
}

export function datePtBr(date = Date()) {
  return new Date(date).toLocaleString("pt-br", {
    timeZone: "America/Sao_Paulo",
  });
}

export function getPercentageChange(oldNumber: number, newNumber: number) {
  const decreaseValue = newNumber - oldNumber;
  const result = (decreaseValue / oldNumber) * 100;
  const mathSymbol = result > 0 ? "+" : "";
  const moneyFormat = this.moneyFormat(result.toFixed(2));
  return mathSymbol + moneyFormat;
}
