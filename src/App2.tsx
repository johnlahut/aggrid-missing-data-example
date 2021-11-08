import React, { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import chartData from "./data/sample-chart-data.json"

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { LicenseManager } from 'ag-grid-enterprise';
import { ChartCreated, ChartRef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

function App2() {

  const [api, setApi] = useState<GridApi>()
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  const [charts, setCharts] = useState<HTMLElement[]>([])
  const [selectedChart, setSelectedChart] = useState<number>();
  const [isFocusedView, setFocusedView] = useState<boolean>(false);

  const chartRef = useRef(charts);
  const selectedRef = useRef(selectedChart);

  // update refs as base objects are changed
  useEffect(() => {
    chartRef.current = charts
    selectedRef.current = selectedChart
  }, [charts])

  // when selected plot changes, re-render the HTML element with the correct plot
  useEffect(() => {
    const plotPanel = document.querySelector('#plot-panel');
    
    if (selectedChart !== undefined && plotPanel) {
      plotPanel.innerHTML = ''
      plotPanel.appendChild(charts[selectedChart])
    }
  }, [selectedChart])

  const columns = ['item1', 'item2', 'item3', 'item4', 'item5']
  const gridOptions: GridOptions = {
    enableCharts: true,
    enableRangeSelection: true,
    suppressContextMenu: false,
    defaultColDef: {
      suppressMenu: false,
      filter: 'agTextColumnFilter'
    },
    createChartContainer: createChartContainer,

    // when charts are created, set the most recently created chart as the selected chart
    // append the HTML element to our list of created charts
    onChartCreated: (event: ChartCreated) => {
      const chart = event.api.getChartRef(event.chartId)
      setCharts([...chartRef.current, chart?.chartElement.closest(`#${event.chartId}`)!])
      setSelectedChart(chartRef.current.length)
    },
    onGridReady: (event: GridReadyEvent) => {
      setApi(event.api)
      setColumnApi(event.columnApi)
    }
  }

  const prevPlot = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (selectedChart && selectedChart > 0) {
      setSelectedChart(selectedChart - 1)
    }
  }

  const nextPlot = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (selectedChart !== undefined && selectedChart < charts.length - 1) {
      setSelectedChart(selectedChart + 1)
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
            {columns.map(col => <AgGridColumn field={col} key={col}></AgGridColumn>)}
        </AgGridReact>
      </div>

      <div>
        <div>
          <button onClick={prevPlot}>Prev</button>
          <button onClick={nextPlot}>Next</button>
          <button onClick={focusedView}>Show Only Plotted Cols</button>
          {/* <button>Next</button> */}
        </div>
        <div id='plot-panel'>
          
        </div>
      </div>
    </div>
  );
}

// https://www.ag-grid.com/react-data-grid/integrated-charts-container/#example-provided-container
export const createChartContainer = (chartRef: ChartRef) => {

  const chartPanel = (
    <div
      className="chart-wrapper ag-theme-alpine-dark" 
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'}}
      // id='chart-wrapper'
  
    >
      <div className="chart-wrapper-body" 
        style={{height: '100%'}}
      ></div>
    </div>
  )

  // return _createChartContainer(chartRef);
  // get the chart element itself coming as a ref from AG-Grid
  var chartElement = chartRef.chartElement;

  // create a temp element to put everything into
  var tempElement = document.createElement('div');

  // then render the plot panel into the temp div
  tempElement.innerHTML = renderToStaticMarkup(chartPanel);
  var chartWrapper = tempElement.firstChild as HTMLDivElement;

  // get the chart's parent element
  var parentElement = document.querySelector('#plot-panel');

  if (!parentElement) {
    console.log('error setting plot - null parent element')
    return;
  }


  // ID of the wrapper is the ID of the chart
  // we should be able to query select this from anywhere in the app
  // to get the direct HTML element
  chartWrapper.id = chartRef.chartId

  // put the wrapper in the parent defined above in the component itself
  parentElement.appendChild(chartWrapper);
  // renderedCharts.push(chartWrapper)

  // put the actual chart contents/events into the DOM
  chartWrapper.querySelector('.chart-wrapper-body')?.appendChild(chartElement);
}

LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-27_November_2021_[v2]_MTYzNzk3MTIwMDAwMA==bcaae24d146da8e49838739128d51330");
export default App2;

