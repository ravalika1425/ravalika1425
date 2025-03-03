import React from "react";
import ReactApexChart from "react-apexcharts";


const BehaviorChart = ({  series,options }:any) => {
  
  // var series = [98, 63, 35];
  console.log("series", series)
  return (
    <React.Fragment>
      <ReactApexChart dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="donut"
        height={300}
      />
    </React.Fragment>
  );
};

export default BehaviorChart;
