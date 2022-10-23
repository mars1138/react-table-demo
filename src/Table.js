import React, { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';

import './Table.css';

export default function Table({ columns, data }) {
  const [filterInput, setFilterInput] = useState('');

  // Use the useTable hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    setFilter, // this hook provieds a way to set the filter
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useFilters, // adding the useFilters hook to the table; can add as many hooks as needed
    useSortBy,
    usePagination
  );

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter('show.name', value);
    setFilterInput(value);
  };

  console.log('headerGroups: ', headerGroups);
  console.log('rows: ', rows);

  // Render the UI for the table
  // react-table doesn't have UI, it's headless.
  // We just need to put the react-table props from the Hooks, and it will do its magic automatically
  return (
    <React.Fragment>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder={'Search name'}
      />

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <div class="arrow">
                    {/* {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""} */}
                    <ion-icon
                      size="small"
                      src={
                        column.isSorted
                          ? column.isSortedDesc
                            ? '/caret-down-outline.svg'
                            : '/caret-up-outline.svg'
                          : ''
                      }
                    ></ion-icon>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            // only render items on the current page
            if (
              i >= pageSize * pageIndex &&
              i + 1 <= pageSize * (pageIndex + 1)
            ) {
              // This line is necessary to prepare the rows and get the row props from react-table dynamically
              prepareRow(row);

              // Each row can be rendered directly as a string use the react-table render method
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </React.Fragment>
  );
}
