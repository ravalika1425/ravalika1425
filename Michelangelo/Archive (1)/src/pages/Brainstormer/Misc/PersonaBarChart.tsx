import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";

const Basic = ({ dataColors, series }:any) => {
    var BasicColors = getChartColorsArray(dataColors);
    // const series = [{
    //     data: [380, 430, 450]
    // }];

    const options = {
        chart: {
            toolbar: {
                show: !1,
            }
        },
        plotOptions: {
            bar: {
                horizontal: !0,
            }
        },
        dataLabels: {
            enabled: !1
        },
        colors: BasicColors,
        grid: {
            borderColor: "#f1f1f1",
        },
        xaxis: {
            categories: ["Laptop", "Smart Phone", "Tablet"],
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                className="apex-charts"
                options={options}
                series={series}
                type="bar"
                height={350}
            />
        </React.Fragment>
    );
};

export default Basic;