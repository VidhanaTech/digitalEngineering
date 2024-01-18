import React from "react";
// import { Pie } from "react-chartjs-2";
// import chart from "chart.js/auto";
import ReactApexChart from "react-apexcharts";

function PieChart1(props) {
  const { title, data = [] } = props;
  const label = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const color = data.map((d) => d.color);
  const options = {
    legend: {
      position: "right",
    },
    labels: label,
    colors: color,

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -3,
        },
      },
    },
    dataLabels: {
      formatter(val, opts) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return ["", val.toFixed(0) + "%"];
      },
    },

    stroke: {
      show: false, // Hide pie slice borders
    },
  };

  const datas = {
    labels: label,
    series: values,
    color: color,
    // backgroundColor: color,
    // borderWidth: 2,
    // borderRadius: 5,
    // borderSkipped: false,
    // borderColor: color,
  };
  return (
    // width: "20vw", "margin-left": "3vw"
    // <div style={{ height: "35vh" }} align="center">
    //   <Pie options={options} data={datas} />
    // </div>
    <ReactApexChart
      options={options}
      series={datas.series}
      type="pie"
      height="250px"
    />
  );
}

export default PieChart1;
