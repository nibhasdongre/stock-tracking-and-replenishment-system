
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { pieColors } from "./visualizationUtils";

interface CustomLineChartProps {
  selectedProducts: string[];
  trendData: any[];
}

export default function CustomLineChart({ selectedProducts, trendData }: CustomLineChartProps) {
  return (
    <div>
      <div className="font-semibold mb-2 text-cosmic-blue text-center">
        Line: Trend (Selected Products)
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={trendData}>
          <XAxis dataKey="month"/>
          <YAxis />
          <Tooltip />
          {selectedProducts.map((prod, idx) => (
            <Line
              key={prod}
              type="monotone"
              dataKey={prod}
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
