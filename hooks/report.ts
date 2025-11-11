import { InventoryReport, PaymentReport, SalesReport } from "@/types";
import { useMemo } from "react";

export const useReportTotal = <
  T extends PaymentReport | InventoryReport | SalesReport,
>(
  data: T[],
  property: keyof T["data"][0]["data"],
) => {
  return useMemo(() => {
    return data.reduce((acc, b) => {
      return (
        acc +
        b.data.reduce(
          // @ts-ignore
          (dAcc, day) => dAcc + ((day.data[property] as number) || 0),
          0,
        )
      );
    }, 0);
  }, [data, property]);
};

export const useReportAverage = <T extends PaymentReport | SalesReport>(
  data: T[],
  property: keyof T["data"][0]["data"],
) => {
  return useMemo(() => {
    const values = data.flatMap((report) =>
      // @ts-ignore
      report.data.map((entry) => entry.data[property]),
    );

    const sum = values.reduce((acc, val) => acc + (val as number), 0);

    // 2 decimal places
    return sum / values.length;
  }, [data, property]);
};
