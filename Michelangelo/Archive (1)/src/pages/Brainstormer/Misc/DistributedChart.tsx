import ReactApexChart from "react-apexcharts";

const DistributedColumn = ({ dataColors, series }: any) => {
  // var chartColumnDistributedColors = getChartColorsArray(dataColors);

  var options = {
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart: any, w: any, e: any) {}
      }
    },
    // colors: chartColumnDistributedColors,
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: ["Laptop", "Tablet", "Phone"],
      labels: {
        style: {
          colors: [
            "#038edc",
            "#51d28c",
            "#f7cc53",
            "#f34e4e",
            "#564ab1",
            "#5fd0f3"
          ],
          fontSize: "12px"
        }
      }
    }
  };

  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="bar"
      height={250}
    />
  );
};

export default DistributedColumn;
