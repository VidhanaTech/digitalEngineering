import React from "react";
import ReactApexChart from "react-apexcharts";

function KMStackedBarChart2(props) {
  const { title, data = [] } = props;
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const values1 = data.map((d) => d.value1);
  const values2 = data.map((d) => d.value2);
//   const values3 = data.map((d) => d.value3);
  const color = data.map((d) => d.color);

  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },
    xaxis: {
      categories: labels,
    },

    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      formatter: function (val, opts) {
        // Calculate percentage and format the label
        const seriesData = datas.datasets[opts.seriesIndex].data;
        let labelTotal = 0;
        labelTotal = datas.datasets.reduce(
          (acc, series) => acc + (series.data[opts.dataPointIndex] || 0),
          0
        );
        if (labelTotal === 0) {
          return "0%"; // Handle division by zero
        }
        const percentage = ((val / labelTotal) * 100).toFixed(0);
        return `${percentage}%`;
      },
    },

    legend: {
      position: "bottom",
    },
    yaxis: {
      title: {
        text: title,
      },
    },
    fill: {
      opacity: 1,
    },
    grid: { show: false },
  };
  const datas = {
    labels,
    datasets: [
      {
        name: "Article",
        data: values,
        color: "#9bc55b",
      },
      {
        name: "CaseStudy",
        data: values1,
        color: "#7c5ea0",
      },
      {
        name: "Knowledge",
        data: values2,
        color: "#b44555",
      },
    //   {
    //     name: "Value Adds",
    //     data: values3,
    //     color: "#eb954f",
    //   },
    ],
  };
  return (
    <ReactApexChart
      options={options}
      series={datas.datasets}
      type="bar"
      height="200"
    />
  );
}

export default KMStackedBarChart2;
