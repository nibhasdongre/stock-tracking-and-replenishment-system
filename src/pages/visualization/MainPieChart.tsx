
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
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
            // No nameKey provided to Pie; no names should show for slices
            cx="50%"
            cy="50%"
            outerRadius={65}
            label={false}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip
            // Only show value in tooltip, not name/category
            formatter={(value: number) => [value, "Value"]}
            labelFormatter={() => ""}
          />
          {/* No legend so that product/category names never display */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
