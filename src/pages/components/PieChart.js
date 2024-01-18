import React from "react"
import { Pie } from "react-chartjs-2"
import chart from "chart.js/auto"

function LineChart(props) {
  const { title, data = [] } = props
  console.log(data)
  const labels = data.map((d) => d.label)
  const values = data.map((d) => d.value)
  const color = data.map((d) => d.color)

  const sum = values.reduce((acc, curr) => acc + curr, 0)
  values.map((row, i) => {
    values[i] = Number((row / sum) * 100).toFixed(2)
  })
  console.log(values)
  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          size: 5,
          boxHeight: 5,
          boxWidth: 10,
          fontSize: 5
        }
      },
      title: {
        display: true,
        text: title
      },
      height: 200,
      width: 200
    }
  }

  const datas = {
    labels,
    datasets: [
      {
        label: "",
        data: values,
        backgroundColor: color,
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        borderColor: color
      }
    ]
  }
  return (
    <div className="ml-[3vw] w-auto md:w-[20vw] h-[35vh]">
      <Pie options={options} data={datas} />
    </div>
  )
}

export default LineChart
