export function isoToDDMMYYYY(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function ddmmyyyyToISO(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  const [day, month, year] = ddmmyyyy.split(".");
  if (!day || !month || !year) return "";
  return new Date(`${year}-${month}-${day}`).toISOString();
}
