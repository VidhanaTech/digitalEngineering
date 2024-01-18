import React from "react";
import { Bar } from "react-chartjs-2";
import chart from "chart.js/auto";

function BarLineChart(props) {
  const { title, data = [] } = props;
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const values1 = data.map((d) => d.value1);
  const values2 = data.map((d) => d.value2);
  const color = data.map((d) => d.color);

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 5, // Adjust the box width as needed
        },
      },
      title: {
        display: true,
        text: title,
        position: "left",
      },
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false, // Remove horizontal grid lines
        },
      },
      y: [
        {
          id: "y-axis-1",
          position: "left",
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
          },
        },
        {
          id: "y-axis-2",
          position: "right",
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const datas = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "HeadCount",
        data: values,
        backgroundColor: "#21decf",
        borderWidth: 2,
        borderColor: "#21decf",
        yAxisID: "y-axis-1",
      },
      {
        type: "bar",
        label: "Utilization",
        data: values1,
        backgroundColor: color,
        borderWidth: 2,
        borderColor: color,
        yAxisID: "y-axis-1",
      },
      {
        type: "line",
        label: "Utilization (%)",
        data: values2,
        backgroundColor: "#11e33a",
        borderWidth: 2,
        borderColor: "#11e33a",
        yAxisID: "y-axis-2",
      },
    ],
  };

  return (
    // <div className="mt-12">
    <Bar options={options} data={datas} />
    // </div>
  );
}

export default BarLineChart;
