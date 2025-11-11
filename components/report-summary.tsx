import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { Else, If, Then, When } from "react-if";
import { titleCase } from "../lib/utils";
import { PaginatedData, Report } from "../types";
import { Paginator } from "./ui/paginator";

interface Props {
  report: PaginatedData<Report> | null;
  from: string | Date | Dayjs;
  to: string | Date | Dayjs;
}

export function ReportSummary({ report, from, to }: Props) {
  // Utility to generate a range of dates
  const generateDateRange = (start: Dayjs, end: Dayjs) => {
    const dates = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }
    return dates;
  };

  const processedData = useMemo(() => {
    if (!report) return [];

    const fullDateRange = generateDateRange(dayjs(from), dayjs(to));

    const dataMap = report.data.reduce(
      (acc, entry) => {
        acc[entry.date.split("T")[0]] = entry;
        return acc;
      },
      {} as Record<string, Report>,
    );

    return fullDateRange.map((date) => {
      if (dataMap[date]) {
        return dataMap[date];
      }
      // Fill missing dates with default values
      return {
        id: `empty-${date}`,
        country: "",
        date,
        data: {
          sales: {
            total_profit: "0",
            total_gross_profit: "0",
            total_quantity_sold: 0,
            average_profit_per_kg: "0",
            average_selling_price_per_kg: "0",
          },
          payments: {
            total_auxiliary_cost: "0",
            total_spent_on_stock: "0",
            average_cost_per_kg_of_stock: "0",
            average_auxiliary_cost_per_kg: "0",
            total_auxiliary_cost_to_deliver: "0",
          },
          inventory: {
            inventory_left: 0,
            total_quantity_sold: 0,
            total_quantity_bought: 0,
            inventory_brought_over: 0,
          },
        },
        created_at: "",
        updated_at: "",
      };
    });
  }, [report, from, to]);

  const dates = useMemo(() => {
    return processedData.map((entry) => entry.date.split("T")[0]);
  }, [processedData]);

  const metrics = useMemo(() => {
    if (processedData.length > 0) {
      return [
        ...Object.keys(processedData[0].data.sales),
        ...Object.keys(processedData[0].data.payments),
        ...Object.keys(processedData[0].data.inventory),
      ];
    }
    return [];
  }, [processedData]);

  return (
    <>
      <If condition={dates.length > 0 && metrics.length > 0}>
        <Then>
          <div className="flex flex-col space-y-8">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-[#343A46] text-white">
                  <tr>
                    <th className="sticky left-0 z-20 w-60 border border-x-0 border-gray-300 bg-[#343A46] px-4 py-4 text-left font-medium">
                      <div>Metric</div>
                    </th>

                    {dates.map((date, index) => (
                      <th
                        key={index}
                        className="border border-x-0 border-gray-300 px-4 py-4 text-left font-medium"
                      >
                        <div className="w-44">{date}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {metrics.map((metric, metricIndex) => (
                    <tr
                      key={metricIndex}
                      className={
                        metricIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }
                    >
                      <td className="sticky left-0 z-10 border border-x-0 border-gray-300 bg-white px-4 py-2 font-medium">
                        <div className="w-60">
                          {titleCase(metric.split("_").join(" "))}
                        </div>
                      </td>

                      {processedData.map((entry, dateIndex) => {
                        const value =
                          (entry.data.sales as any)[metric] ||
                          (entry.data.payments as any)[metric] ||
                          (entry.data.inventory as any)[metric];
                        return (
                          <td
                            key={dateIndex}
                            className="border border-x-0 border-gray-300 px-4 py-2 text-[#808080]"
                          >
                            {value ?? "0"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="self-end">
              <Paginator
                links={report?.links ?? []}
                prevPageUrl={report?.prev_page_url}
                nextPageUrl={report?.next_page_url}
              />
            </div>
          </div>
        </Then>

        <Else>
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-500">No data</p>
          </div>
        </Else>
      </If>
    </>
  );
}
