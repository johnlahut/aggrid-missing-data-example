import React from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import badChartData from "./data/not-working-data.json"
import goodChartData from "./data/working-data.json"

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { LicenseManager } from 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';

function App() {

  const columns = badChartData.columns.filter(col => col.name === 'MP_1005_N_0_0' || col.name === 'OBJID')
  const gridOptions: GridOptions = {
    enableCharts: true,
    enableRangeSelection: true,
    suppressContextMenu: false,
    defaultColDef: {
      suppressMenu: false,
      filter: 'agTextColumnFilter'
    }
  }

  return (
    <div>
      <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={badChartData.data}>
            {columns.map(col => <AgGridColumn field={col.name} key={col.name} chartDataType="series"></AgGridColumn>)}
        </AgGridReact>
      </div>

      <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={goodChartData.data}>
            {columns.map(col => <AgGridColumn field={col.name} key={col.name}></AgGridColumn>)}
        </AgGridReact>
      </div>
    </div>
  );
}

LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-27_November_2021_[v2]_MTYzNzk3MTIwMDAwMA==bcaae24d146da8e49838739128d51330");
export default App;
