import type { ReactNode } from "react";

export type DataColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
  header?: ReactNode;
  className?: string;
  headerClassName?: string;
  sticky?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  emptyState,
  tableClassName,
  wrapperClassName
}: {
  columns: DataColumn<T>[];
  rows: T[];
  emptyState?: string;
  tableClassName?: string;
  wrapperClassName?: string;
}) {
  return (
    <div
      className={`overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm ${wrapperClassName ?? ""}`}
    >
      <table
        className={`min-w-full border-separate border-spacing-0 text-left ${tableClassName ?? ""}`}
      >
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 ${
                  column.align === "right" ? "text-right" : "text-left"
                } ${column.sticky ? "sticky left-0 z-20 bg-slate-50" : ""} ${column.headerClassName ?? ""}`}
              >
                {column.header ?? column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-slate-500"
              >
                {emptyState ?? "No rows to display."}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index} className="odd:bg-white even:bg-slate-50/50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`border-b border-slate-100 px-4 py-4 align-top text-sm text-slate-700 ${
                      column.align === "right" ? "text-right" : "text-left"
                    } ${column.sticky ? "sticky left-0 z-10 bg-inherit" : ""} ${column.className ?? ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
