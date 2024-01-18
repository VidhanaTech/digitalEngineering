import React from "react";
import { Bar } from "react-chartjs-2";
import chart from "chart.js/auto";

function Barchart(props) {
  const { title, data = [] } = props;
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const color = data.map((d) => d.color);

  const options = {
    plugins: {
      legend: {
        display: false,
        position: "top",
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
    scales: {
      x: {
        grid: {
          display: false, // Remove vertical grid lines
        },
      },
      y: {
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
        label: "",
        data: values,
        backgroundColor: color,
      },
    ],
  };
  return (
    // <div className="mt-12">
    <Bar options={options} data={datas} />
    // </div>
  );
}

export default Barchart;
