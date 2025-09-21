// [AI]
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  className = "",
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        className={`rounded border border-[var(--border)] bg-[var(--surface-elevated)] p-8 text-center text-[var(--text-muted)] ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={`rounded border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden ${className}`}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--surface)] text-left">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="p-2 font-medium text-[var(--foreground)]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[var(--foreground)]">
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={index > 0 ? "border-t border-[var(--border)]" : ""}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`p-2 ${column.className || ""}`}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] || "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// [/AI]
