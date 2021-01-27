export function moneyFormat(value: string): string {
  return parseFloat(value)
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

export function timePtBr(time = Date()): string {

  const data = new Date(datePtBr(time));

  const hora = data.getHours().toString();
  const horaF = hora.length === 1 ? "0" + hora : hora;
  const minuto = data.getMinutes().toString();
  const minutoF = minuto.length === 1 ? "0" + minuto : minuto;

  return horaF + ":" + minutoF;
}

export function datePtBr(date = Date()): string {
  return new Date(date).toLocaleString("pt-br", {
    timeZone: "America/Sao_Paulo",
  });
}

export function getPercentageChange(oldNumber: number, newNumber: number): string {
  const decreaseValue = newNumber - oldNumber;
  const result = (decreaseValue / oldNumber) * 100;
  const mathSymbol = result > 0 ? "+" : "";
  const formatted = moneyFormat(result.toFixed(2));
  return mathSymbol + formatted;
}
