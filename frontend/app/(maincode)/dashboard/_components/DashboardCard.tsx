"use client";

import { ChartPieInteractive } from "@/components/Chart";
import { ChartBarMultiple } from "@/components/PieChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardSim, Cloud, Flower, User, Users } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Provinces = [
  { name: "Herat", color: "bg-green-500" },
  { name: "Kabul", color: "bg-red-500" },
  { name: "Mazar", color: "bg-pink-500" },
];

const Employees = [
  {
    name: "Jack",
    status: "present",
    check_in: "12/3/2",
    check_outTime: "4:30",
  },
  {
    name: "Ahmad",
    status: "present",
    check_in: "12/3/2",
    check_outTime: "4:30",
  },
  {
    name: "Karim",
    status: "upsent",
    check_in: "12/3/2",
    check_outTime: "4:30",
  },
];

export default function DashboardCard() {
  const [province, setProvince] = useState("Herat");
  const [activity, setActivity] = useState("");
  const [countEnginners, setCountEngineers] = useState('')
  const [presentedEMps, setPresentedEmps] = useState('')
  const [upsents,setUpsent]=useState('')


 const fetchCount = async () => {
  try {
    const resp = await fetch("http://localhost:8000/countall");
    const data = await resp.json();
    setCountEngineers(data.AllEngineers);
  } catch (err) {
    console.error(err);
  }
  };
  
    const fetchPrsentedEMps = async () => {
    const respons = await fetch('http://localhost:8000/presentedEmps')
      const data = await respons.json()
    
      setPresentedEmps(data.message)
  }


  const fetchUpsents = async () => {
    const respons = await fetch('http://localhost:8000/upsentEmps')
    const data = await respons.json()
    setUpsent(data.upsentEmp)
    
    
  }
  useEffect(() => {
    fetchPrsentedEMps()
    fetchUpsents();
  fetchCount();
 
}, []);
  

  return (
    <div className="w-full overflow-hidden px-2 md:px-4">
      {/* TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
        {[
          {
            title: "Total Employees",
            value: countEnginners,
            icon: <Users />,
            bg: "from-blue-400 to-blue-500",
          },
          {
            title: "Present Employees",
            value: presentedEMps,
            icon: <Users />,
            bg: "from-green-400 to-green-500",
          },
          {
            title: "Absent Employees",
            value: upsents,
            icon: <User />,
            bg: "from-red-400 to-red-500",
          },
          {
            title: "Late Arrival",
            value: 12,
            icon: <Flower />,
            bg: "from-yellow-400 to-pink-500",
            span: "md:col-span-2",
          },
        ].map((card, i) => (
          <Card
            key={i}
            className={`bg-gradient-to-br ${card.bg} text-white rounded-2xl shadow-lg hover:scale-[1.02] transition ${card.span ?? ""}`}
          >
            <CardContent className="p-5">
              <p className="text-sm font-semibold">{card.title}</p>
              <div className="flex justify-between items-center mt-4">
                <h1 className="text-2xl font-bold">{card.value}</h1>
                {card.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* CAMERA */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm">
              Live Camera Feed — {province}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
              <img
                src={`http://localhost:8000/video_feed/${province.toLowerCase()}`}
                alt="Camera"
                className="object-cover rouned border-2 border-primary shadow-lg w-full h-full"
              />
            </div>

            <div className="flex flex-col justify-center gap-2">
              {Provinces.map((p) => (
                <Tooltip key={p.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setProvince(p.name)}
                      className={`h-5 w-5 rounded-full ${p.color} border-2 hover:scale-110 transition`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">{p.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BAR CHART */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <ChartBarMultiple />
          </CardContent>
        </Card>
      </div>

      {/* ATTENDANCE SUMMARY */}
      <div className="flex justify-between items-center mt-4 bg-card rounded-xl px-4 py-2">
        <div className="flex gap-4 text-xs font-semibold">
          <span>Current Attendance</span>
          <span>96 / 128</span>
          <span>90%</span>
        </div>
        <div className="flex gap-2">
          <Cloud className="bg-blue-500 text-white p-1 rounded-xl size-5" />
          <CardSim className="bg-yellow-400 p-1 rounded-xl size-5" />
        </div>
      </div>

      {/* TABLE + PIE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* TABLE */}
        <Card className="md:col-span-2 overflow-hidden">
          <CardContent className="overflow-x-auto">
            <Table className="text-xs min-w-[500px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Employees.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>
                      {e.status === "present" ? (
                        <Button size="sm">Present</Button>
                      ) : (
                        <Button size="sm" variant="destructive">
                          Absent
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{e.check_in}</TableCell>
                    <TableCell>{e.check_outTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* PIE */}
        <Card className="flex items-center justify-center">
          <CardContent>
            <ChartPieInteractive />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
