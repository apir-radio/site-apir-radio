const frenchMonths = [
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
];

const frenchWeekdays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const monthIndexes = new Map(frenchMonths.map((month, index) => [month, index]));
const datePattern = /^(?:(?<weekday>[\p{L}]+)\s+)?(?<day>\d{1,2})\s+(?<month>[\p{L}]+)\s+(?<year>\d{4})$/iu;

const formatError = "La date de la soirée doit suivre le format français « Jour JJ mois AAAA » ou « JJ mois AAAA ».";

function calendarDate(year, monthIndex, day) {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, monthIndex, day);

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== monthIndex || date.getUTCDate() !== day) {
    return null;
  }

  return date;
}

function formatIsoDate(year, monthIndex, day) {
  return `${String(year).padStart(4, "0")}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseFrenchEventDate(value) {
  if (typeof value !== "string") {
    throw new RangeError(formatError);
  }

  const match = datePattern.exec(value.trim());
  if (!match?.groups) {
    throw new RangeError(formatError);
  }

  const day = Number(match.groups.day);
  const month = match.groups.month.toLocaleLowerCase("fr-FR");
  const monthIndex = monthIndexes.get(month);
  const year = Number(match.groups.year);

  if (monthIndex === undefined) {
    throw new RangeError(`${formatError} Mois français inconnu : « ${match.groups.month} ».`);
  }
  if (year < 1) {
    throw new RangeError("L’année de la soirée doit être comprise entre 0001 et 9999.");
  }

  const date = calendarDate(year, monthIndex, day);
  if (!date) {
    throw new RangeError(`La date de la soirée est impossible : ${day} ${month} ${year}.`);
  }

  const suppliedWeekday = match.groups.weekday?.toLocaleLowerCase("fr-FR");
  if (suppliedWeekday && !frenchWeekdays.includes(suppliedWeekday)) {
    throw new RangeError(`Jour de semaine français inconnu : « ${match.groups.weekday} ».`);
  }
  if (suppliedWeekday && frenchWeekdays[date.getUTCDay()] !== suppliedWeekday) {
    throw new RangeError(`Le jour « ${match.groups.weekday} » ne correspond pas au ${day} ${month} ${year}.`);
  }

  return {
    isoDate: formatIsoDate(year, monthIndex, day),
    year,
    monthIndex,
    month,
    day,
    weekday: frenchWeekdays[date.getUTCDay()],
  };
}

function parseIsoCalendarDate(value) {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;
  const day = Number(dayText);
  if (year < 1 || monthIndex < 0 || monthIndex > 11 || !calendarDate(year, monthIndex, day)) return null;
  return value;
}

export function getParisCalendarDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Paris",
    year: "numeric",
  }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  const year = part("year");
  const month = part("month");
  const day = part("day");

  if (!year || !month || !day) {
    throw new RangeError("Impossible de déterminer la date du jour en Europe/Paris.");
  }

  return `${year}-${month}-${day}`;
}

export function isFrenchEventDatePast(value, todayIsoDate) {
  const event = parseFrenchEventDate(value);
  const today = parseIsoCalendarDate(todayIsoDate);
  if (!today) {
    throw new RangeError("La date de référence doit être une date calendaire valide au format AAAA-MM-JJ.");
  }

  return event.isoDate < today;
}
