/** @format */
// src/utils/DateUtils.ts
import moment from "moment";

export const formatDate = (
  dateString: string,
  format: string = "DD MMM YYYY"
): string => {
  return moment(dateString).format(format);
};

export const getCurrentDate = (): string => {
  return moment().format("YYYY-MM-DD");
};

export const getNextDay = (dateString?: string): string => {
  if (!dateString) {
    return moment().add(1, "days").format("YYYY-MM-DD");
  }
  return moment(dateString).add(1, "days").format("YYYY-MM-DD");
};

export const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};
