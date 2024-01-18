import React, { useEffect } from "react";

const StackBarChart = ({ data }) => {
  useEffect(() => {
    const chartId = "myChart";

    const countryKeys = Array.from(
      new Set(
        data.flatMap((item) =>
          Object.keys(item).filter((key) => key !== "label")
        )
      )
    );

    var myTheme = {
      palette: {
        bar3d: [
          // ["#99C55A"],
          // ["#7E5CA3"],
          ["#31E3E2"],
          ["#50BCFF"],

          // ["#7F0127"],
          // ["#8B4A9E"],
          // ["#225587"],
        ],
      },
    };

    const chartConfig = {
      backgroundColor: "#d4d6dd",
      type: "bar3d",
      "3d-aspect": {
        true3d: false,
        depth: "25px",
        "x-angle": 0,
        "y-angle": 0,
        "z-angle": 0,
      },
      plot: {
        tooltip: {
          text: "%v",
        },
        animation: {
          delay: 600,
          effect: "ANIMATION_FADE_IN",
          sequence: "ANIMATION_BY_NODE",
          speed: 700,
        },
        stacked: true,
      },
      plotarea: {
        margin: "dynamic",
        backgroundColor: "#d4d6dd",
      },
      scaleX: {
        maxItems: 12,
        labels: data.slice(-6).map((item) => {
          const date = new Date(item.label);
          const month = date.toLocaleString("default", { month: "short" });
          const day = date.getDate();
          const year = date.getFullYear().toString().slice(-2);
          return `${month} ${day}`;
        }),
        item: {
          fontSize: 12,
          offsetStart: 50,
        },
      },
      scaleY: {
        label: {
          text: "Employees",
        },
      },
      legend: {
        layout: "x2", // Display labels in a row with a maximum of 4 labels per line
        backgroundColor: "#d4d6dd",
        "vertical-align": "bottom",
        align: "center",
        marginBottom: "0px",
        border: "none",
        // x: "5%",
        // y: "90%",
        // verticalAlign: "bottom",
        // marker: {
        //   type: "square",
        //   width: 8,
        //   height: 8,
        // },
      },
      series: countryKeys.map((region, regionIndex) => ({
        values: data.slice(-6).map((item) => item[region] || 0), // Slice the series data as well
        backgroundColor: myTheme.palette.bar3d[regionIndex],
        text: region === "total_count" ? "" : region,
      })),
    };

    zingchart.render({
      id: chartId,
      data: chartConfig,
      height: "100%",
      width: "100%",
      defaults: myTheme,
    });

    return () => {
      const chartInstances = zingchart.exec(chartId, "getall");

      if (chartInstances && chartInstances.length > 0) {
        chartInstances.forEach((chart) => {
          zingchart.exec(chart.id, "destroy");
        });
      }
    };
  }, [data]);

  return (
    <div>
      <div
        id="myChart"
        style={{ minHeight: "260px", width: "100%", height: "100%" }}
      ></div>
    </div>
  );
};

export default StackBarChart;
