import React, { useEffect } from "react";
import ZingChart from "zingchart-react";
import "zingchart/es6";

function KMStackedBarChart(props) {
  const { title, data = [] } = props;

  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const values1 = data.map((d) => d.value1);
  const values2 = data.map((d) => d.value2);
  const values3 = data.map((d) => d.value3);

  const chartConfig = {
    type: "bar3d",
    stacked: true,
    plot: {
      stacked: true,
      tooltip: {
        text: "%v%",
      },
    },
    legend: {
      layout: "x4",
      backgroundColor: "none",
      borderColor: "none",
      marker: {
        borderRadius: "50px",
        borderColor: "transparent",
      },
      item: {
        fontColor: "#000000",
      },
      position: "bottom-middle", // Place legend at the bottom
    },
    scaleX: {
      labels: labels,
      item: {
        fontColor: "#000000",
      },
    },
    scaleY: {
      visible: true,
      title: {
        text: title,
        fontColor: "#000000",
      },
    },
    series: [
      {
        values: values,
        text: "Article",
        backgroundColor: "#9bc55b",
      },
      {
        values: values1,
        text: "CaseStudy",
        backgroundColor: "#2C7CB1",
      },
      {
        values: values2,
        text: "Knowledge",
        backgroundColor: "#b44555",
      },
      {
        values: values3,
        text: "Value Adds",
        backgroundColor: "#eb954f",
      },
    ],
    backgroundColor: "transparent", // Set the background color of the chart area to transparent
  };

  useEffect(() => {
    // You can add any additional logic or updates here if needed
  }, [data]);

  return <ZingChart data={chartConfig} height="250" />;
}

export default KMStackedBarChart;
