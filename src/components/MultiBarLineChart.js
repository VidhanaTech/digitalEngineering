import React from "react";
import { Bar } from "react-chartjs-2";
import chart from "chart.js/auto";

function MultiBarLineChart(props) {
  const { title, data = [] } = props;
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const values1 = data.map((d) => d.value1);
  const color = data.map((d) => d.color);
  const mvalue = [5, 2, 3, 1];

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
      // y: {
      //   grid: {
      //     display: false, // Remove horizontal grid lines
      //   },
      // },

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
        label: "Revenue ($)",
        data: values,
        backgroundColor: "#792709",
        borderWidth: 2,
        borderColor: "#792709",
        yAxisID: "y-axis-1",
        offset: true,
      },
      {
        type: "bar",
        label: "Target ($)",
        data: values1,
        backgroundColor: "#21decf",
        borderWidth: 2,
        borderColor: "#21decf",
        yAxisID: "y-axis-1",
        offset: true,
      },
      {
        type: "line",
        label: "Revenue (%)",
        data: values,
        backgroundColor: color,
        borderWidth: 2,
        borderColor: color,
        yAxisID: "y-axis-2",
        // offset: true,
      },
      {
        type: "line",
        label: "Target (%)",
        data: mvalue,
        backgroundColor: "#11e33a",
        borderWidth: 2,
        borderColor: "#11e33a",
        yAxisID: "y-axis-2",
        // offset: true,
      },
    ],
  };
  return (
    // <div className="mt-12">
    <Bar options={options} data={datas} />
    // </div>
  );
}

export default MultiBarLineChart;
