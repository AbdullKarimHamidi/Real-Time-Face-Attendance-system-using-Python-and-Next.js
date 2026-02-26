"use client";
import { ModeToggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
function Page() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const add_time = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select start and end time");
      return;
    }
    const formData = new FormData();
    formData.append("start", startTime);
    formData.append("end", endTime);
    try {
      const res = await fetch("http://localhost:8000/time", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Could not add start and end time");
        return;
      }

      toast.success("Start and end Time is created!");
    } catch (error) {
      toast.error("Server error. Try again later.");
      console.error(error);
    }
  };
  return (
    <div className="w-full md:h-screen p-5">
      {/* HEADER */}
      <div className="header w-full h-16 bg-card shadow rounded-md flex justify-between items-center p-5">
        <Image src={"/Logo.svg"} alt="logo" width={50} height={50} />
        <h1 className="text-xl font-bold">Settings Page</h1>
        <ModeToggle />
      </div>


      <div className="mt-10 flex justify-center">
        <Card className="w-full max-w-md p-5">
          <CardContent>
            <h1 className="font-bold text-lg text-center">
              Choose Start & End Time
            </h1>
            <div className="flex gap-6 mt-5">
              <div className="flex-1">
                <Select onValueChange={(value) => setStartTime(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Start Time</SelectLabel>
                      <SelectItem value="1">1 AM</SelectItem>
                      <SelectItem value="2">2 AM</SelectItem>
                      <SelectItem value="3">3 AM</SelectItem>
                      <SelectItem value="4">4 AM</SelectItem>
                      <SelectItem value="5">5 AM</SelectItem>
                      <SelectItem value="6">6 AM</SelectItem>
                      <SelectItem value="7">7 AM</SelectItem>
                      <SelectItem value="8">8 AM</SelectItem>
                      <SelectItem value="9">9 AM</SelectItem>
                      <SelectItem value="10">10 AM</SelectItem>
                      <SelectItem value="11">11 AM</SelectItem>
                      <SelectItem value="12">12 AM</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select onValueChange={(value) => setEndTime(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>End Time</SelectLabel>
                      <SelectItem value="13">1 PM</SelectItem>
                      <SelectItem value="14">2 PM</SelectItem>
                      <SelectItem value="15">3 PM</SelectItem>
                      <SelectItem value="16">4 PM</SelectItem>
                      <SelectItem value="17">5 PM</SelectItem>
                      <SelectItem value="18">6 PM</SelectItem>
                      <SelectItem value="19">7 PM</SelectItem>
                      <SelectItem value="20">8 PM</SelectItem>
                      <SelectItem value="21">9 PM</SelectItem>
                      <SelectItem value="22">10 PM</SelectItem>
                      <SelectItem value="23">11 PM</SelectItem>
                      <SelectItem value="24">12 PM</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="mt-5 w-full font-bold" onClick={add_time}>
              Save
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;
