"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

type AttendanceCell = {
  entrance?: string;
  leaving?: string;
  latency?: number; // minutes
  present: boolean;
};

type AttendanceMap = {
  [email: string]: {
    [day: number]: AttendanceCell;
  };
};

export default function MonthReport() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});
  const [city, setCity] = useState("all");
  const [month, setMonth] = useState("2026-02");
  const tableRef = useRef<HTMLDivElement>(null);

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    fetch("http://localhost:8000/all_engineers")
      .then((res) => res.json())
      .then(setEmployees)
      .catch(console.error);
  }, []);

  /* ================= FETCH ATTENDANCE ================= */
  useEffect(() => {
    if (!employees.length) return;

    const loadAttendance = async () => {
      const map: AttendanceMap = {};

      for (const emp of employees) {
        const res = await fetch(
          `http://localhost:8000/allattendance/${emp.email}`
        );
        if (!res.ok) continue;

        const records = await res.json();
        map[emp.email] = {};

        records.forEach((r: any) => {
          const dateStr = r.entrance_time || r.leaving_time || r.date;
          if (!dateStr) return;

          const date = new Date(dateStr);
          if (date.toISOString().slice(0, 7) !== month) return;

          const day = date.getDate();

          const isPresent =
            r.present === true ||
            r.present === 1 ||
            r.present === "1" ||
            r.present === "true";

          map[emp.email][day] = {
            entrance: r.entrance_time
              ? new Date(r.entrance_time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined,
            leaving: r.leaving_time
              ? new Date(r.leaving_time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined,
            latency: r.latency || 0,
            present: isPresent,
          };
        });
      }

      setAttendanceMap(map);
    };

    loadAttendance();
  }, [employees, month]);

  /* ================= HELPERS ================= */
  const filteredEmployees =
    city === "all"
      ? employees
      : employees.filter(
          (e) => e.city?.toLowerCase() === city.toLowerCase()
        );

  const formatLatency = (minutes = 0) => {
    if (!minutes) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? `${h}h ` : ""}${m}m`;
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(attendanceMap, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${month}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4">

      {/* ===== Controls ===== */}
      <div className="flex gap-4 items-center print-hidden">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="Herat">Herat</SelectItem>
            <SelectItem value="Kabul">Kabul</SelectItem>
            <SelectItem value="Kandahar">Kandahar</SelectItem>
            <SelectItem value="Badghis">Badghis</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-40"
        />

        <button
          onClick={() => window.print()}
          className="px-3 py-2 border rounded-md text-sm"
        >
          Print
        </button>

        <button
          onClick={downloadJSON}
          className="px-3 py-2 border rounded-md text-sm"
        >
          Backup JSON
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div ref={tableRef} className="overflow-x-auto">
        <Table className="border border-gray-400 border-collapse w-full bg-white dark:bg-gray-900">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-400 text-center bg-gray-100 dark:bg-gray-800">
                Name
              </TableHead>
              {DAYS.map((d) => (
                <TableHead
                  key={d}
                  className="border border-gray-400 text-center bg-gray-100 dark:bg-gray-800"
                >
                  {d}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp._id}>
                <TableCell className="border border-gray-400 font-semibold bg-gray-50 dark:bg-gray-800">
                  {emp.name}
                </TableCell>

                {DAYS.map((day) => {
                  const cell = attendanceMap[emp.email]?.[day];

                  if (!cell)
                    return (
                      <TableCell
                        key={day}
                        className="border border-gray-400 bg-gray-50 dark:bg-gray-800"
                      />
                    );

                  if (!cell.present)
                    return (
                      <TableCell
                        key={day}
                        className="border border-gray-400 bg-red-300 dark:bg-red-700 text-center font-bold absent-cell"
                      >
                        Upsent
                      </TableCell>
                    );

                  return (
                    <TableCell
                      key={day}
                      className="border border-gray-400 bg-green-200 dark:bg-green-800 text-xs present-cell"
                    >
                      In: {cell.entrance || "--"}
                      <br />
                      Out: {cell.leaving || "--"}
                      <br />
                      Late: {formatLatency(cell.latency)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ===== PRINT STYLES ===== */}
      <style jsx global>{`
        @media print {
          .print-hidden {
            display: none !important;
          }

          table {
            font-size: 9px;
          }

          .absent-cell {
            background-color: #f87171 !important; /* red for print */
          }

          .present-cell {
            background-color: #86efac !important; /* green for print */
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}