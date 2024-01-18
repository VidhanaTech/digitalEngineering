import React from "react";
import { Line } from "react-chartjs-2";
import chart from "chart.js/auto";

function LineChart(props) {
  const { title, data = [], casedata = [], knowdata = [], vx = [] } = props;
  const labels = data.map((d) => d.label);
  const caselabels = casedata.map((d) => d.label);
  const knowlabels = knowdata.map((d) => d.label);
  const vxlabels = vx.map((d) => d.label);
  let mergedArray = [
    ...new Set([...labels, ...caselabels, ...knowlabels, ...vxlabels]),
  ];
  const monthSlice = (arr) => (arr ? arr.slice(0, 3) : '');

  function compareMonthNames(a, b) {
    const monthOrder = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    const monthA = monthSlice(a);
    const monthB = monthSlice(b);
    return monthOrder[monthA] - monthOrder[monthB];
  }
  mergedArray = mergedArray.sort(compareMonthNames);

  const aMap = new Map(data.map((item) => [item.label, item.value]));
  const artval = mergedArray.map((label) => ({
    label,
    value: aMap.has(label) ? aMap.get(label) : 0,
  }));

  const bMap = new Map(casedata.map((item) => [item.label, item.value]));
  const casval = mergedArray.map((label) => ({
    label,
    value: bMap.has(label) ? bMap.get(label) : 0,
  }));

  const cMap = new Map(knowdata.map((item) => [item.label, item.value]));
  const knoswval = mergedArray.map((label) => ({
    label,
    value: cMap.has(label) ? cMap.get(label) : 0,
  }));

  const dMap = new Map(vx.map((item) => [item.label, item.value]));
  const vxswval = mergedArray.map((label) => ({
    label,
    value: dMap.has(label) ? dMap.get(label) : 0,
  }));
  const values = artval.map((d) => d.value);
  const caseval = casval.map((d) => d.value);
  const knowval = knoswval.map((d) => d.value);
  const vxwval = vxswval.map((d) => d.value);
  const color = data.map((d) => d.color);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
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
    labels: mergedArray,
    datasets: [
      {
        label: "Artifacts",
        data: values,
        backgroundColor: "#9bc55b",
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        borderColor: "#9bc55b",
      },
      {
        label: "Searches",
        data: caseval,
        backgroundColor: "#7c5ea0",
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        borderColor: "#7c5ea0",
      },
      // {
      //   label: "Knowledge",
      //   data: knowval,
      //   backgroundColor: "#b44555",
      //   borderWidth: 2,
      //   borderRadius: 5,
      //   borderSkipped: false,
      //   borderColor: "#b44555",
      // },
      // {
      //   label: "Value Adds",
      //   data: vxwval,
      //   backgroundColor: "#eb954f",
      //   borderWidth: 2,
      //   borderRadius: 5,
      //   borderSkipped: false,
      //   borderColor: "#eb954f",
      // },
    ],
  };
  return (
    <div
      className="chart-container"
      style={{ width: "auto", maxWidth: "100%", margin: "0 auto",marginTop:"10px" }}
    >
      <Line options={options} data={datas} />
    </div>
  );
}

export default LineChart;
