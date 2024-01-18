import React from "react";
import { Bar } from "react-chartjs-2";
import chart from "chart.js/auto";

function StackedBarChart(props) {
  const { title, data = [] } = props;
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const values1 = data.map((d) => d.value1);
  const values2 = data.map((d) => d.value2);
  const color = data.map((d) => d.color);

  const options = {
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: {
          boxWidth: 5,
        },
      },
      title: {
        display: true,
        text: title,
        position: "left",
      },
    },
    indexAxis: "y",
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false, // Remove horizontal grid lines
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false, // Remove horizontal grid lines
        },
      },
    },
  };

  const datas = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "",
        data: values,
        backgroundColor: "#ff0000",
        borderWidth: 2,
        borderColor: "#ff0000",
      },
      {
        type: "bar",
        label: "",
        data: values1,
        backgroundColor: "#e3ca43",
        borderWidth: 2,
        borderColor: "#e3ca43",
      },
      {
        type: "bar",
        label: "",
        data: values2,
        backgroundColor: "#11e33a",
        borderWidth: 2,
        borderColor: "#11e33a",
      },
    ],
  };
  return <Bar options={options} data={datas} />;
}

export default StackedBarChart;
