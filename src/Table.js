import React from 'react';
import { useTable } from 'react-table';

import './Table.css';

export default function Table({ columns, data }) {
  // Use the useTable hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data,
  });

  console.log('headerGroups: ', headerGroups);
  console.log('rows: ', rows);

  // Render the UI for the table
  // react-table doesn't have UI, it's headless.
  // We just need to put the react-table props from the Hooks, and it will do its magic automatically
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          // This line is necessary to prepare the rows and get the row props from react-table dynamically
          prepareRow(row);

          // Each row can be rendered directly as a string use the react-table render method
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
