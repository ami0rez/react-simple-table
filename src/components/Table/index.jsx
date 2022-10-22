import React, { useState,useEffect } from "react";

import { BsSortAlphaDownAlt, BsSortAlphaDown } from 'react-icons/bs';

import useTable from "../../hooks/useTable";
import { ExportCSV } from "./ExportCsv/ExportCsc";
import styles from "./Table.module.css";
import TableFooter from "./TableFooter";

const Table = ({ data, rowsPerPage, title, columns }) => {
  const [page, setPage] = useState(1);
  const [sortMode, setSortMode] = useState(0); //0: Asc, 1:Desc
  const [sortCol, setSortCol] = useState();
  const [filterValues, setFilterValues] = useState({});
  const [dsiplayedData, setdsiplayedData] = useState(data);

  useEffect(() => {
    refreshDisplayedData()
  }, [sortMode, sortCol, filterValues])

  const { slice, range } = useTable(dsiplayedData, page, rowsPerPage);
  /*
  *  @description get the value to display in the row for the column
  */
  const getRowValue = (row, column, i = 0) => {
    return row[column?.name] ?? row[column?.label] ?? row[column] ?? Object.values(row)[i];
  }

  /*
  *  @description get the value of the filter in the passed column
  */
  const getFilterValue = (column, i = 0) => {
    let value = '';
    if (Object.keys(filterValues).includes(column?.name)) {
      value = filterValues[column?.name]
    } else if (Object.keys(filterValues).includes(column?.label)) {
      value = filterValues[column?.label]
    } else if (Object.keys(filterValues).includes(column)) {
      value = filterValues[column]
    } else if (Object.keys(filterValues).includes('col' + i)) {
      value = filterValues['col' + i]
    }
    return value;
  }

  /*
  *  @description get the value of the filter in the passed column
  */
  const getFilterName = () => {
    return (title ?? 'data') + (new Date()).toISOString();
  }

  /*
  *  @description gets the key depending on the passed columns
  */
  const getKey = (column, i = 0) => {
    return column?.name ?? column?.label ?? column ?? 'col' + i;
  }

  /*
  *  @description filters the data by applied filters
  */
  const handleFilterClick = (column, event, i = 0) => {
    const value = event?.target?.value;
    const key = getKey(column);
    setFilterValues({ ...filterValues, [key]: value })
  }

  const handleSortClick = (column) => {
    if (sortCol != column) {
      setSortMode(0)
      setSortCol(column)
    } else {
      setSortMode(sortMode == 0 ? 1 : 0)
    }
  }

  /*
  *  @description Re applies filters and sorting col and mode on displayed data
  */
  const refreshDisplayedData = () => {
    let displayedData = data;
    Object.keys(filterValues).forEach(filterKey => {
      displayedData = displayedData.filter(row => isValueFiltered(filterValues[filterKey], row[filterKey]) )
    })

    //Apply sort
    if (sortMode == 1) {
      displayedData = displayedData.sort((a, b) => (getRowValue(a, sortCol) - getRowValue(b, sortCol) || getRowValue(a, sortCol)?.localeCompare(getRowValue(b, sortCol))));
    } else {
      displayedData = displayedData.sort((b, a) => (getRowValue(a, sortCol) - getRowValue(b, sortCol) || getRowValue(a, sortCol)?.localeCompare(getRowValue(b, sortCol))));
    }
    setdsiplayedData([...displayedData])
  }


  /*
  *  @description checks if colvalue is valid after applying filterValue
  */
  const isValueFiltered = (filterValue, colValue) => {
    if(!filterValue){
      filterValue = '';
    }
    if(!colValue){
      colValue = '';
    }
    return filterValue.toLowerCase().includes(colValue.toLowerCase()) || colValue.toLowerCase().includes(filterValue.toLowerCase())
  }
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableControls}>
        <div className={styles.tableTitle}>{title}</div>
        <div className={styles.tableControlButtons}>
          <ExportCSV csvData={dsiplayedData} fileName={getFilterName()} />
          <button>Import</button>
        </div>
      </div>
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            {columns?.map((object, i) =>
              <th className={styles.tableHeader} key={'title' + i} onClick={() => handleSortClick(object)}>
                <div className={styles.tableHeaderCellContainer}>
                  {object?.label ?? object?.name ?? object}
                  <span className={styles.tableSortIcon}>{sortCol == object && sortMode == 0 ? <BsSortAlphaDownAlt /> : <BsSortAlphaDown />}</span>
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr className={styles.tableRowItems} key={'filter'}>
            {columns?.map((object, i) => <td className={styles.tableCell} key={'filter' + i}>
              <input
                value={getFilterValue(object, i)}
                onInput={(e) => handleFilterClick(object, e, i)}
                className={styles.tableFilterInput}
                key={'filterInput' + i} />
            </td>)}
          </tr>
          {slice.map((el) => (
            <tr className={styles.tableRowItems} key={el.id}>
              {columns?.map((object, i) => <td className={styles.tableCell} key={'col' + getRowValue(el, object, i) + i}>{el[object?.name] ?? el[object?.label] ?? el[object] ?? Object.values(el)[i]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </div>
  );
};

export default Table;
