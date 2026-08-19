
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function OnePersonReport() {
  const [engineer, setEngineer] = useState(null);
  const [engId, setEngID] = useState("EMP0000");
  const [attendances, setAttendances] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  /* ================= FETCH ENGINEER ================= */

  const fetchEngineer = async () => {
    if (!engId) return;

    try {
      const res = await fetch(`http://localhost:8000/eng/${engId}`);

      if (!res.ok) {
        setEngineer(null);
        setAttendances([]);
        return;
      }

      const data = await res.json();
      setEngineer(data);
    } catch (err) {
      console.error(err);
      setEngineer(null);
    }
  };

  /* ================= FETCH ATTENDANCES ================= */

  useEffect(() => {
    if (!engineer?.email) return;

    const fetchAttendances = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/allattendance/${engineer.email}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setAttendances(data);
        } else if (Array.isArray(data.attendance)) {
          setAttendances(data.attendance);
        } else {
          setAttendances([]);
        }
      } catch (err) {
        console.error(err);
        setAttendances([]);
      }
    };

    fetchAttendances();
  }, [engineer]);

  /* ================= REFRESH ENGINEER ================= */

  useEffect(() => {
    fetchEngineer();
  }, [engId]);

  /* ================= HELPERS ================= */

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleTimeString("en-GB", {
      hour12: false,
    });
  };

  const formatDay = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
    });
  };

  const formatLatency = (minutes = 0) => {
    if (!minutes || minutes <= 0) return "0 min";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs ? hrs + "h " : ""}${mins}m`;
  };

  const monthsWorked = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return (
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth())
    );
  };

  /* ================= GROUP ATTENDANCES ================= */

  const groupedAttendances = (
    Array.isArray(attendances) ? attendances : []
  ).reduce((acc, curr) => {
    const dateValue = curr.entrance_time || curr.leaving_time;
    if (!dateValue) return acc;

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return acc;

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }

    acc[monthKey].push(curr);
    return acc;
  }, {});

  const availableMonths = Object.keys(groupedAttendances).sort((a, b) =>
    b.localeCompare(a)
  );

  const displayedMonths = selectedMonth ? [selectedMonth] : availableMonths;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      {/* SEARCH & CONTROLS */}
      <div className="w-full mb-6 flex flex-wrap gap-3 items-center justify-between print:hidden bg-card border p-4 rounded-xl shadow-sm">
        <div className="flex gap-3 items-center">
          <Input
            value={engId}
            onChange={(e) => setEngID(e.target.value)}
            placeholder="Search By ID ..."
            className="w-48 bg-background"
          />

          <select
            className="border bg-background px-3 py-2 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {new Date(m + "-01").toLocaleString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>

        <Button variant="default" size="sm" onClick={() => window.print()}>
          Print Report
        </Button>
      </div>

      {/* REPORT CONTENT */}
      {displayedMonths.map((monthKey) => (
        <div key={monthKey} className="mb-4 printable-section">
          <Card className="overflow-hidden border shadow-sm print:shadow-none print:border-none">
            {/* COMPACT HEADER */}
            <CardHeader className="bg-muted/40 p-4 flex flex-row justify-between items-center print:bg-transparent print:p-2">
              <div className="flex gap-10 items-center">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:text-sm">
                  <span className="text-muted-foreground font-medium">Name:</span>
                  <span className="font-semibold text-foreground">{engineer?.name || "—"}</span>

                  <span className="text-muted-foreground font-medium">Last Name:</span>
                  <span className="font-semibold text-foreground">{engineer?.lastName || "—"}</span>

                  <span className="text-muted-foreground font-medium">Address:</span>
                  <span className="font-semibold text-foreground">{engineer?.address || "—"}</span>

                  <span className="text-muted-foreground font-medium">Start Date:</span>
                  <span className="font-semibold text-foreground">{formatDate(engineer?.created_at)}</span>

                  <span className="text-muted-foreground font-medium">Months Worked:</span>
                  <span className="font-semibold text-foreground">{monthsWorked(engineer?.created_at)}</span>
                </div>
              </div>

              <img
                src={engineer?.image || "/placeholder.png"}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border shadow-sm print:w-20 print:h-20"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            </CardHeader>

            <CardContent className="p-3 sm:p-6 print:p-2">
              <Table>
                <TableCaption className="text-[11px] text-muted-foreground mt-1">
                  Attendance Records -{" "}
                  {new Date(monthKey + "-01").toLocaleString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </TableCaption>

                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="py-1.5 text-xs">Date</TableHead>
                    <TableHead className="py-1.5 text-xs">Enter</TableHead>
                    <TableHead className="py-1.5 text-xs">Exit</TableHead>
                    <TableHead className="py-1.5 text-xs">Day</TableHead>
                    <TableHead className="py-1.5 text-xs">Latency</TableHead>
                    <TableHead className="py-1.5 text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {groupedAttendances[monthKey]?.length > 0 ? (
                    groupedAttendances[monthKey].map((a, i) => (
                      <TableRow key={i} className="text-xs print:text-[11px]">
                        <TableCell className="py-1.5">{formatDate(a.entrance_time)}</TableCell>
                        <TableCell className="py-1.5">{formatTime(a.entrance_time)}</TableCell>
                        <TableCell className="py-1.5">{formatTime(a.leaving_time)}</TableCell>
                        <TableCell className="py-1.5">{formatDay(a.entrance_time)}</TableCell>
                        <TableCell className="py-1.5">{formatLatency(a.latency)}</TableCell>
                        <TableCell className="py-1.5">
                          {a.present ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Present
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Absent
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground text-xs">
                        No attendance found for this period
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* STRICT SINGLE-PAGE PRINT STYLING */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm;
          }

          body {
            background: white !important;
            color: black !important;
            zoom: 78%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          .printable-section,
          .printable-section * {
            visibility: visible;
          }

          .printable-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

export default OnePersonReport;