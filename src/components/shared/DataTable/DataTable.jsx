/**
 * @param {{
 *  columns: Array<{ key: string, label: string }>,
 *  rows: Array<Record<string, string | number>>
 * }} props
 */
function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border-base">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-cream text-stone">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="border-b border-ash px-3 py-2 text-[11px] font-medium uppercase tracking-widest">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${row[columns[0].key]}`} className="bg-paper even:bg-cream/40">
              {columns.map((column) => (
                <td key={`${index}-${column.key}`} className="border-b border-ash px-3 py-2 text-charcoal">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
