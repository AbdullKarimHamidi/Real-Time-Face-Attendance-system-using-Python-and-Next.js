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
  const [selectedMonth, setSelectedMonth] = useState(""); // YYYY-MM format

  /* ================= FETCH ENGINEER ================= */
  const fetchEngineer = async () => {
    if (!engId) return;
    try {
      const res = await fetch(`http://localhost:8000/eng/${engId}`);
      if (!res.ok) {
        setEngineer(null);
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
        setAttendances(data);
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
  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const formatTime = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleTimeString("en-GB", {
          hour12: false,
        })
      : "";

  const formatDay = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-GB", {
          weekday: "long",
        })
      : "";

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

  /* ================= GROUP ATTENDANCES BY MONTH ================= */
  const groupedAttendances = attendances.reduce((acc, curr) => {
    const date = new Date(curr.entrance_time || curr.leaving_time);
    if (!date) return acc;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(curr);
    return acc;
  }, {});

  /* ================= FILTER MONTHS ================= */
  const availableMonths = Object.keys(groupedAttendances).sort((a, b) => b.localeCompare(a));
  const displayedMonths = selectedMonth ? [selectedMonth] : availableMonths;

  /* ================= UI ================= */
  return (
    <div className="w-full">
      {/* Search & Filter */}
      <div className="w-full mt-3 mb-3 flex gap-3 print:hidden">
        <Input
          value={engId}
          onChange={(e) => setEngID(e.target.value)}
          placeholder="Search By ID ..."
          className="w-fit"
        />
        <select
          className="border px-2 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {new Date(m + "-01").toLocaleString("en-GB", { month: "long", year: "numeric" })}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Print Report
        </Button>
      </div>

      {displayedMonths.map((monthKey) => (
        <div key={monthKey} className="mb-8 page-break">
          <Card>
            {/* HEADER */}
            <CardHeader className="flex justify-between p-5 flex-col md:flex-row">
              <div className="flex gap-16">
                <div className="font-bold space-y-2">
                  <p>Name:</p>
                  <p>Last Name:</p>
                  <p>Address:</p>
                  <p>Start Date:</p>
                  <p>Months Worked:</p>
                </div>

                {engineer && (
                  <div className="font-semibold space-y-2">
                    <p>{engineer.name}</p>
                    <p>{engineer.lastName}</p>
                    <p>{engineer.address}</p>
                    <p>{formatDate(engineer.created_at)}</p>
                    <p>{monthsWorked(engineer.created_at)}</p>
                  </div>
                )}
              </div>

              <img
                src={engineer?.image || "/placeholder.png"}
                className="w-40 h-40 rounded-xl object-cover"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </CardHeader>

            {/* TABLE */}
            <CardContent>
              <Table>
                <TableCaption>
                  Attendance Records -{" "}
                  {new Date(monthKey + "-01").toLocaleString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Enter</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {groupedAttendances[monthKey]?.length > 0 ? (
                    groupedAttendances[monthKey].map((a, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          {a.entrance_time ? formatDate(a.entrance_time) : "—"}
                        </TableCell>
                        <TableCell>
                          {a.entrance_time ? formatTime(a.entrance_time) : "—"}
                        </TableCell>
                        <TableCell>
                          {a.leaving_time ? formatTime(a.leaving_time) : "—"}
                        </TableCell>
                        <TableCell>
                          {a.entrance_time ? formatDay(a.entrance_time) : "—"}
                        </TableCell>
                        <TableCell className="font-semibold text-orange-600">
                          {formatLatency(a.latency)}
                        </TableCell>
                        <TableCell>
                          {a.present ? (
                            <span className="bg-green-500 px-2 rounded text-white">
                              Present
                            </span>
                          ) : (
                            <span className="bg-red-500 px-2 rounded text-white">
                              Absent
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No attendance found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .page-break {
            page-break-after: always;
          }
          .page-break,
          .page-break * {
            visibility: visible;
          }
          .page-break {
            position: relative;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default OnePersonReport;