import React from "react";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

function PieChartNew(props) {
  const { title, data = [] } = props;
  const label = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const color = data.map((d) => d.color);
  const options = {
    legend: {
      position: "right",
    },
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
  };

  return (
    <div style={{ width: "100%",height:"100%", display: "flex", justifyContent: "center",marginTop:"10px" }}>
      <PieChart
        options={options}
        data={datas}
        margin={{ top: 30, left: 80, right: 80 }}
        slotProps={{
          legend: {
            labelStyle: {
              fontSize: 12,
            },
            itemMarkWidth: 10,
            itemMarkHeight: 10,
            markGap: 5,
            itemGap: 10,
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 50,
          },
        }}
        series={[
          {
            arcLabel: (item) => `${item.value}%`,
            arcLabelMinAngle: 5,
            innerRadius: 30,
            outerRadius: 120,
            paddingAngle: 0,
            cornerRadius: 0,
            startAngle: -90,
            endAngle: 90,
            cx: 150,
            cy: 150,
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: '#225587' },
          },
        ]}
        height={295}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
}

export default PieChartNew;
