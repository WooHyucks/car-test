"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateWheelSpeedData } from "@/lib/mock-scenarios";

const data = generateWheelSpeedData();

export function SensorChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">실시간 휠 속도</p>
        <span className="rounded bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
          교육용 가상 센서 데이터
        </span>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#64748B" }}
              stroke="#E2E8F0"
            />
            <YAxis
              unit=" km/h"
              tick={{ fontSize: 11, fill: "#64748B" }}
              stroke="#E2E8F0"
              domain={[0, 50]}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="좌측전륜"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="우측전륜"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="좌측후륜"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="우측후륜"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        정상 바퀴 약 40km/h · 좌측 전륜만 간헐적 0km/h 신호 (교육용 시나리오)
      </p>
    </div>
  );
}
