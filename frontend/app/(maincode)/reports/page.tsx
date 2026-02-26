
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import All_users_report from "./_components/AllEngineersReport";
import OnePersonReport from './_components/OnePersonReport'
import Image from "next/image";
import { ModeToggle } from "@/components/Toggle";
import MonthReport from "./_components/monthreports";
function page() {
  return (
    <div>
      <div className="header w-full h-16 bg-card rounded-md shadow flex items-center justify-between px-5">
        <Image src={'/Logo.svg'} width={50} height={50} alt="Image" />
        <h1 className="text-xl font-bold ">Reports</h1>
        <ModeToggle/>
      </div>
      <div className="w-full flex justify-center items-center overflow-hidden">
      <Tabs defaultValue="all" className="w-full p-10" >
        <TabsList className={"flex justify-center items-center"}>
          <TabsTrigger value="all">All Stuff </TabsTrigger>
          <TabsTrigger value="specifc">Report for Specific Person</TabsTrigger>
          <TabsTrigger value="onemonth">Reports for One months</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className={"overflow-hidden"}>
          <All_users_report />
        </TabsContent>
        <TabsContent value="specifc">
          <OnePersonReport/>
          </TabsContent>
          <TabsContent value="onemonth">
            <MonthReport/>
          </TabsContent>
      </Tabs>
    </div>
    </div>
  );
}

export default page;
