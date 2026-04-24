export function Table({ columns, data, emptyMessage }) {
  if (data.length === 0) {
    return <div className="p-7 text-center text-slate-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="mt-3 w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-slate-200 px-3 py-4 text-left text-[0.9rem] text-slate-500"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row._id ?? index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border-b border-slate-200 px-3 py-4 text-left align-top"
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
