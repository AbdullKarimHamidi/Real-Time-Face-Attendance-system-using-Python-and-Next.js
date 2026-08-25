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
  isFriday?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
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
        console.log('The record is :',records)
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
            isFriday: r.isFriday || false,
            isHoliday: r.isHoliday || false,
            holidayName: r.HoldayName || r.HoldayName,
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
    <div className="p-6 space-y-4">
      {/* ===== Controls (Hidden during print) ===== */}
      <div className="flex gap-4 items-center print-hidden no-print">
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Print Report
        </button>

        <button
          onClick={downloadJSON}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          Backup JSON
        </button>
      </div>

      {/* ===== TABLE CONTAINER ===== */}
      <div ref={tableRef} id="printable-table" className="overflow-x-auto">
        <h2 className="hidden print:block text-xl font-bold mb-4">
          Attendance Report - {month} ({city === "all" ? "All Cities" : city})
        </h2>
        <Table className="border border-gray-400 border-collapse w-full bg-white dark:bg-gray-900">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-400 text-center bg-gray-100 dark:bg-gray-800 font-bold text-black">
                Name
              </TableHead>
              {DAYS.map((d) => (
                <TableHead
                  key={d}
                  className="border border-gray-400 text-center bg-gray-100 dark:bg-gray-800 text-[10px] p-1"
                >
                  {d}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp._id}>
                <TableCell className="border border-gray-400 font-semibold bg-gray-50 dark:bg-gray-800 whitespace-nowrap">
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

                  // Check for Holiday first
                  if (cell.isHoliday)
                    return (
                      <TableCell
                        key={day}
                        className="border border-gray-400 bg-yellow-200 dark:bg-yellow-900 text-center font-bold text-[9px] holiday-cell"
                      >
                        {cell.holidayName || "Holiday"}
                      </TableCell>
                    );

                  // Check for Friday next
                  if (cell.isFriday)
                    return (
                      <TableCell
                        key={day}
                        className="border border-gray-400 bg-yellow-200 dark:bg-yellow-900 text-center font-bold text-[9px] friday-cell"
                      >
                        Friday
                      </TableCell>
                    );

                  // Check for Absent
                  if (!cell.present)
                    return (
                      <TableCell
                        key={day}
                        className="border border-gray-400 bg-red-300 dark:bg-red-900 text-center font-bold text-[9px] absent-cell"
                      >
                        Absent
                      </TableCell>
                    );

                  // Present
                  return (
                    <TableCell
                      key={day}
                      className="border border-gray-400 bg-green-100 dark:bg-green-900 text-[8px] p-1 leading-tight present-cell"
                    >
                      In: {cell.entrance || "--"}
                      <br />
                      Out: {cell.leaving || "--"}
                      <br />
                      L: {formatLatency(cell.latency)}
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
          body * {
            visibility: hidden;
          }

          #printable-table, 
          #printable-table * {
            visibility: visible;
          }

          #printable-table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          table {
            border-spacing: 0;
            border-collapse: collapse !important;
            width: 100% !important;
            table-layout: auto;
          }

          th, td {
            border: 1px solid #000 !important;
            padding: 2px !important;
            word-wrap: break-word;
          }

          .absent-cell {
            background-color: #fca5a5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .present-cell {
            background-color: #dcfce7 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .friday-cell, .holiday-cell {
            background-color: #fef08a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: landscape;
            margin: 10mm;
          }

          .print-hidden, .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}