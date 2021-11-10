import React, { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import chartData from "./data/sample-chart-data.json"

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { LicenseManager } from 'ag-grid-enterprise';
import { ChartCreated, ChartModel, ChartRef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

function App2() {

  const [api, setApi] = useState<GridApi>()
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [isFocusedView, setFocusedView] = useState<boolean>(false);

  const gridOptions: GridOptions = {
    enableCharts: true,
    enableRangeSelection: true,
    suppressContextMenu: false,
    defaultColDef: {
      // suppressMenu: false,
      filter: 'agTextColumnFilter'
    },
    onGridReady: (event: GridReadyEvent) => {
      setApi(event.api)
      setColumnApi(event.columnApi)
    }
  }

  // only show the columns we have plotted
  const focusedView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const allColumns = columnApi?.getAllColumns()?.map(col => col.getColId()) ?? []

    if (isFocusedView) {
      columnApi?.setColumnsVisible(allColumns, true)
    } else {
      const plottedColumns: string[] = []
      api?.getCellRanges()?.forEach(range => range.columns.forEach(column => plottedColumns.push(column.getColId())))
      allColumns.forEach(col => columnApi?.setColumnVisible(col, plottedColumns.includes(col)))
    }

    setFocusedView(!isFocusedView)
  }

  return (
    <div>
      <div className="ag-theme-alpine" style={{height: 800, width: 1200}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={chartData}>
            <AgGridColumn field="time" chartDataType='time' valueGetter={(params) => new Date(params.data.time)}/>
            <AgGridColumn field="item1" chartDataType='series'/>
            <AgGridColumn field="item2" chartDataType='series'/>
            <AgGridColumn field="item3" chartDataType='series'/>
            <AgGridColumn field="item4" chartDataType='series'/>
            <AgGridColumn field="item5" chartDataType='series'/>
            {/* {columns.map(col => <AgGridColumn field={col} key={col}></AgGridColumn>)} */}
        </AgGridReact>
      </div>
  
      <button onClick={focusedView}>Show Only Plotted Columns</button>
    </div>
  );
}

LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-27_November_2021_[v2]_MTYzNzk3MTIwMDAwMA==bcaae24d146da8e49838739128d51330");
export default App2;

