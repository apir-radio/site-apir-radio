const frenchMonths = new Set([
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]);

export function getFrenchEventMonth(date) {
  const match = /^.+?\s+(\d{1,2})\s+([\p{L}]+)\s+\d{4}$/u.exec(date.trim());
  const day = Number(match?.[1]);
  const month = match?.[2]?.toLocaleLowerCase("fr-FR");

  if (!match || day < 1 || day > 31 || !frenchMonths.has(month)) {
    throw new RangeError("La date de la soirée doit suivre le format français « Jour JJ mois AAAA ».");
  }

  return month;
}
