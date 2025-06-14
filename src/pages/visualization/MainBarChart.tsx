
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MainBarChartProps {
  data: any[];
  mode: "sales" | "quantity";
}

export default function MainBarChart({ data, mode }: MainBarChartProps) {
  return (
    <div className="bg-white/10 rounded-lg p-4 shadow w-[340px]">
      <div className="font-semibold mb-2 text-cosmic-blue text-center">
        Histogram: {mode === "sales" ? "Sales" : "Quantity"} per Product (Top 5 & Bottom 5)
      </div>
      <ResponsiveContainer width={300} height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={mode} fill="#4884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
