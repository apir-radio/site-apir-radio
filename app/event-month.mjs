import { parseFrenchEventDate } from "./event-date.mjs";

export function getFrenchEventMonth(date) {
  return parseFrenchEventDate(date).month;
}
