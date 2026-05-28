/**
 * @param {{
 *  columns: Array<{ key: string, label: string }>,
 *  rows: Array<Record<string, string | number>>
 * }} props
 */
function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="border-b border-gray-100 px-4 py-3 text-xs font-bold uppercase tracking-wider">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${row[columns[0].key]}`} className="bg-white hover:bg-slate-50/80 transition-colors border-b border-gray-50 last:border-0">
              {columns.map((column) => (
                <td key={`${index}-${column.key}`} className="px-4 py-3 text-charcoal">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
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
