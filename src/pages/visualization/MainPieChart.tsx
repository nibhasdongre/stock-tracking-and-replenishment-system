
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { pieColors } from "./visualizationUtils";

interface MainPieChartProps {
  data: any[];
  mode: "sales" | "quantity";
}

export default function MainPieChart({ data, mode }: MainPieChartProps) {
  return (
    <div className="bg-white/10 rounded-lg p-4 shadow w-[340px]">
      <div className="font-semibold mb-2 text-cosmic-blue text-center">
        Pie: Product Categories (Top 5 & Bottom 5)
      </div>
      <ResponsiveContainer width={300} height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey={mode}
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={65}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name: string) => [value, "Value"]}
            labelFormatter={(_, payload) => {
              if (payload?.length > 0) return `Category: ${payload[0].payload.category}`;
              return "";
            }}
          />
          <Legend
            payload={data.map((entry, i) => ({
              id: entry.category,
              type: "rect",
              value: entry.category,
              color: pieColors[i % pieColors.length]
            }))}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
