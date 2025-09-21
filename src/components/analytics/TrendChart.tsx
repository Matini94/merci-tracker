"use client";

import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { TrendingUp } from "lucide-react";
import { Line } from "react-chartjs-2";
import { formatCurrency, formatDate } from "@/lib/validation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// [AI]
interface TrendChartProps {
  data: { date: string; amount: number }[];
  height?: number;
}

export default function TrendChart({ data, height = 300 }: TrendChartProps) {
  const chartRef = useRef(null);

  const chartData = {
    labels: data.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Daily Income",
        data: data.map((item) => item.amount),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgba(16, 185, 129, 1)",
        pointHoverBorderColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
        borderColor: "rgba(16, 185, 129, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function (context) {
            const dataIndex = context[0].dataIndex;
            return formatDate(data[dataIndex].date);
          },
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
          maxTicksLimit: 10, // Limit number of x-axis labels
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
    elements: {
      line: {
        borderCapStyle: "round" as const,
        borderJoinStyle: "round" as const,
      },
    },
  };

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-slate-700/50 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No trend data available for the selected period
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
// [/AI]
