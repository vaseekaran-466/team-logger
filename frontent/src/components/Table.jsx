export function Table({ columns, data, emptyMessage }) {
  if (data.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#d6dfeb] bg-[#f8fbfe] p-10 text-center text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#d6dfeb] bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#f8fbfe]">
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-[#d6dfeb] px-4 py-4 text-left text-[0.76rem] font-bold uppercase tracking-[0.14em] text-slate-500"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row._id ?? index} className="align-top transition-colors hover:bg-[#fbfdff]">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border-b border-[#edf2f7] px-4 py-4 text-left text-sm text-slate-700"
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
