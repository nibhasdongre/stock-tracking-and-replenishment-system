
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CustomBarChartProps {
  data: any[];
  mode: "sales" | "quantity";
}

export default function CustomBarChart({ data, mode }: CustomBarChartProps) {
  return (
    <div className="mb-6">
      <div className="font-semibold mb-2 text-cosmic-blue text-center">
        Histogram: {mode === "sales" ? "Sales" : "Quantity"} (Selected Products)
      </div>
      <ResponsiveContainer width={340} height={220}>
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
