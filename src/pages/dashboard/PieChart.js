import React from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import chart from "chart.js/auto";

function PieChart(props) {
  const { title, data = [] } = props;
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const color = data.map((d) => d.color);
  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10, // Adjust the box width as needed
        },
      },
      title: {
        display: true,
        text: "sales",
      },
    },
  };

  const datas = {
    labels,
    datasets: [
      {
        label: "sales",
        data: values,
        backgroundColor: color,
        // borderColor: ["black"],
        // borderWidth: 1,
      },
    ],
  };
  return (
    <div style={{ margin: "auto", height:"250px" }}>
      <Doughnut options={options} data={datas} />
    </div>
  );
}

export default PieChart;
