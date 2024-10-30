import {
  BarChart,
  Bar,
  Rectangle,
  LineChart,
  Legend,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function BarChartFilter({ name, filters, ...props }) {
  const CustomizedAxisTick = (...args) => {
    const { x, y, stroke, payload } = args[0];
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="#666"
        textAnchor="middle"
        dy={-6}
      >{` ${value}`}</text>
    );
  };

  function bar_click(value) {
    //event contains all values of ba
    //value is the index of the bar in the chart

    if (filters[name]["data_type"] == "select") {
      value = [value];
    }
    props.change_filters(name, "value", value);
  }

  for (var [key, value] of Object.entries(props.colours)) {
    const isActivity = (element) => element.name === key;
    var index = props.grouped_data.findIndex(isActivity);
    if (index != -1) {
      // if found (-1 is not found)
      props.grouped_data[index]["fill"] = value;
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div></div>
        <h1 className="inline-block justify-center text-2xl text-blue-600 dark:text-blue-500">
          {name[0].toUpperCase() + name.slice(1)}: {filters[name]["value"]}
        </h1>

        <button
          type="button"
          onClick={() =>
            props.change_filters(name, "value", filters[name]["filter_empty"])
          }
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Reset Activity Filter
        </button>
      </div>
      <ResponsiveContainer width={"99%"} height={300}>
        <BarChart
          width={800}
          height={300}
          data={props.grouped_data}
          onClick={(data) => {
            // do your history.push based on data.activePayload[0]
            if (data && data.activePayload && data.activePayload.length > 0) {
              console.log(data.activePayload[0]);
              value = data.activePayload[0]["payload"]["name"];
              //props.change_filters(name, "value", value);
              bar_click(value);
              // return history.push(`/${data.activePayload[0].x.y.id}`);
            }
          }}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="length"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
            label={renderCustomBarLabel}
            // onClick={(event, value) => bar_click(event, value)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
