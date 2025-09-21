"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { formatCurrency } from "@/lib/validation";
import { BarChart3 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// [AI]
interface IncomeChartProps {
  data: { month: string; total: number }[];
  type?: "bar" | "line";
  height?: number;
}

export default function IncomeChart({
  data,
  type = "bar",
  height = 300,
}: IncomeChartProps) {
  const chartRef = useRef(null);

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Income",
        data: data.map((item) => item.total),
        backgroundColor:
          type === "bar"
            ? [
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(139, 92, 246, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(236, 72, 153, 0.8)",
                "rgba(20, 184, 166, 0.8)",
              ]
            : "rgba(59, 130, 246, 0.8)",
        borderColor:
          type === "bar"
            ? [
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(139, 92, 246, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(236, 72, 153, 1)",
                "rgba(20, 184, 166, 1)",
              ]
            : "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: type === "bar" ? 8 : 0,
        fill: type === "line" ? false : true,
        tension: type === "line" ? 0.4 : 0,
      },
    ],
  };

  const options: ChartOptions<typeof type> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "rgba(255, 255, 255, 1)",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `Income: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(107, 114, 128, 1)",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "rgba(107, 114, 128, 1)",
          font: {
            size: 12,
          },
          callback: function (value) {
            return formatCurrency(Number(value));
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-slate-700/50 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No data available for the selected period
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px` }}>
      {type === "bar" ? (
        <Bar ref={chartRef} data={chartData} options={options} />
      ) : (
        <Line ref={chartRef} data={chartData} options={options} />
      )}
    </div>
  );
}
// [/AI]
