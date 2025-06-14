
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { pieColors } from "./visualizationUtils";

interface MainLineChartProps {
  products: any[];
  mode: "sales" | "quantity";
  trendData: any[];
}

export default function MainLineChart({ products, mode, trendData }: MainLineChartProps) {
  return (
    <div className="bg-white/10 rounded-lg p-4 shadow w-[700px] col-span-2">
      <div className="font-semibold mb-2 text-cosmic-blue text-center">
        Line: Annual Trend per Product (Top 5 & Bottom 5)
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trendData}>
          <XAxis dataKey="month"/>
          <YAxis />
          <Tooltip />
          {products.map((item, idx) => (
            <Line
              type="monotone"
              dataKey={item.name}
              key={item.name}
              stroke={pieColors[idx % pieColors.length]}
              dot={false}
            />
          ))}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
