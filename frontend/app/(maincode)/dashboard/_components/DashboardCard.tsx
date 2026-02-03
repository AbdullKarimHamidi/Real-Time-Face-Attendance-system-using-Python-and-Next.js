"use client";

import { ChartPieInteractive } from "@/components/Chart";
import { ChartBarMultiple } from "@/components/PieChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { CardSim, Cloud, Flower, Flower2, User, Users, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Provinces = [
  { name: "Herat", color: "bg-green-500" },
  { name: "Kabul", color: "bg-red-500" },
  { name: "Mazar", color: "bg-pink-500" },
];

const Employees = [
  {
    name: "JAck",
    status: "present",
    check_in: "12/3/2",
    check_outTime: "4:30",
  },
  {
    name: "AHmad",
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

function DashboardCard() {
  const [province, setProvince] = useState("Herat");
  return (
    <div className="overflow-x-hidden ">
      <div className="grid md:grid-cols-5 grid-cols-2 bg-secondary rounded shadow p-2 mt-2 mr-2 md:gap-10 gap-5">
        <div className="card">
          <Card className="bg-gradient-to-br from-blue-400/60  to-blue-500 rounded-2xl shadow p-6 border-pink-200">
            <CardContent>
              <div>
                <p className="text-sm font-bold">Total Employees</p>
              </div>
              <div className="flex justify-between items-center mt-5">
                <h1 className="font-bold text-xl">128</h1>
                <Users />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="card">
          <Card className="bg-gradient-to-br from-green-400/40  to-green-500 rounded-2xl shadow p-6">
            <CardContent>
              <div>
                <p className="text-sm font-bold">Total Employees</p>
              </div>
              <div className="flex justify-between items-center mt-5">
                <h1 className="font-bold text-xl">128</h1>
                <Users />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="card">
          <Card className="bg-gradient-to-br from-red-400/40  to-red-500 rounded-2xl shadow p-6">
            <CardContent>
              <div>
                <p className="text-sm font-bold">Apsent Employees</p>
              </div>
              <div className="flex justify-between items-center mt-5">
                <h1 className="font-bold text-xl">128</h1>
                <User />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="card md:col-span-2">
          <Card className="bg-gradient-to-br from-yellow-400/60  to-pink-500 rounded-2xl shadow p-6">
            <CardContent>
              <div>
                <p className="text-sm font-bold">Late Arriveal</p>
              </div>
              <div className="flex justify-between items-center mt-5">
                <h1 className="font-bold text-xl">128</h1>
                <Flower />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="middle grid grid-cols-1 md:grid-cols-2  mt-1 bg-secondary p-2 rounded shadow mr-2 justify-center items-center gap-4">
        <div className="camera  w-full rounded shadow flex gap-5">
          <Card className="w-full flex justify-center items-center">
            <CardContent>
              <CardTitle className="text-xs font-bold mb-2">
                Live Camera Feed for [ {province} ] province
              </CardTitle>
              <Image
                src={"/cam.jpeg"}
                width={300}
                height={300}
                alt="Cam"
                className="object-cover rounded-md border-blue-300 border-2"
              />
            </CardContent>
          </Card>
          <div className="buttons  w-15 min-h-full  bg-card  rounded p-3 flex justify-center items-center py-4 ">
            <div>
              {Provinces.map((data) => (
                <Tooltip key={data.name}>
                  <TooltipTrigger asChild>
                    <div
                      className={`h-5 w-5 rounded-full ${data.color} cursor-pointer my-1 border-2`}
                      onClick={() => setProvince(data.name)}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{data?.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-red-500 w-full h-70 rounded">
          <Card className="h-full">
            <CardContent className="h-full overflow-hidden">
              <ChartBarMultiple />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-between w-full items-center mt-2 px-10 bg-card rounded-xl p-1">
        <div className="flex items-center justify-between   px-3  w-100 ">
          <h1 className="text-xs font-bold ">Current Attendance</h1>
          <h1 className="text-xs tracking-tighter font-bold">96/128</h1>
          <h1 className="text-xs tracking-tighter font-bold">%90</h1>
        </div>
        <div className="middle">
          <Cloud className="bg-blue-500 rounded-2xl p-1 size-5" />
        </div>
        <div>
          <CardSim className="bg-yellow-400 p-1 rounded-2xl size-5" />
        </div>
      </div>

      <div className="mt-1 flex h-62 gap-2 flex-col md:flex-row md:p-1 p-2">
        <Card className="text-sm"> 
          <CardContent>
            <div>
              <h2>Employee status</h2>
              <div>
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <h1>name</h1>
                      </TableHead>
                      <TableHead>
                        <h1>status</h1>
                      </TableHead>
                      <TableHead>
                        <h1>Check-in-Time</h1>
                      </TableHead>
                      <TableHead>
                        <h1>Check-out-Time</h1>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  {Employees.map((data) => (
                    <TableBody key={data?.name}>
                      <TableRow>
                              <TableCell>{data?.name}</TableCell>
                              <TableCell>{data.status == 'present' ? (
                                  <Button  className="text-xs">Present</Button>
                              ) :
                                  <Button variant={'destructive'} className="text-xs">Upsent</Button>
                              }</TableCell>
                              <TableCell>{ data?.check_in}</TableCell>
                              <TableCell>{ data?.check_outTime}</TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </div>
            </div>
          </CardContent>
              </Card >
              <div className="">
                  <Card className="flex justify-center items-center">
                      <CardContent>
                          <ChartPieInteractive/>
                      </CardContent>
                  </Card>
              </div>

              <div className="w-full bg-red-400">
                  <Card>
                      <CardContent>
                          <h1>Hamidi</h1>
                      </CardContent>
                  </Card>
              </div>
      </div>
    </div>
  );
}

export default DashboardCard;
