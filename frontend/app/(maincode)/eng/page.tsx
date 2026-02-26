"use client";

import { ModeToggle } from "@/components/Toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Engineer {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  image: string;
}

function Page() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("Kabul");

  const fetchEngineers = async () => {
    const res = await fetch("http://localhost:8000/all_engineers");
    const data = await res.json();
    setEngineers(data);
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const cities = ["Kabul", "Kandahar", "Badghis", "Herat"];

  const filteredEngineers = engineers
    .filter((eng) => eng.city === activeCity)
    .filter(
      (eng) =>
        eng.name.toLowerCase().includes(search.toLowerCase()) ||
        eng.lastName.toLowerCase().includes(search.toLowerCase()) ||
        eng.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="w-full min-h-screen p-4">
      {/* Header */}
      <div className="bg-card px-5 rounded-md flex items-center justify-between shadow-md w-full h-16">
        <Image src="/Logo.svg" alt="Logo" width={50} height={50} />
        <div className="w-[40%]">
          <Input
            placeholder="Search engineers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ModeToggle />
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs value={activeCity} onValueChange={setActiveCity} className="w-full">
          <TabsList className="mb-6 flex justify-center gap-4 border-b border-gray-300">
            {cities.map((city) => (
              <TabsTrigger
                key={city}
                value={city}
                className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
              >
                {city}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCity}>
            {filteredEngineers.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No engineers found in {activeCity}.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEngineers.map((eng) => (
                  <Link key={eng._id} href={`editeng?id=${eng._id}`}>
                    <Card className="hover:shadow-lg transition rounded-xl cursor-pointer">
                      <CardContent className="p-5 space-y-4 text-center">
                        <div className="flex justify-center">
                          <img
                            src={eng.image}
                            alt={eng.name}
                            className="w-32 h-32 object-cover rounded-full border shadow-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-lg">
                            {eng.name} {eng.lastName}
                          </p>
                          <p className="text-muted-foreground">{eng.email}</p>
                          <p>
                            <b>City:</b> {eng.city}
                          </p>
                          <p>
                            <b>Phone:</b> {eng.phone}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Page;
