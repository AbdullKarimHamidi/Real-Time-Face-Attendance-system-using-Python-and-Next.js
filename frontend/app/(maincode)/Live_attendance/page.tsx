"use client";
import { ModeToggle } from "@/components/Toggle";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";


const cameras = [
  { name: "herat", url: "http://localhost:8000/live_camera/herat" },
  { name: "kabul", url: "http://localhost:8000/live_camera/kabul" },
  { name: "mazar", url: "http://localhost:8000/live_camera/mazar" },
];
type RecognizedPerson = {
  name: string;
  image: string;
  lastName:string
};
export default function LiveCamerasPage() {
  const [recognized, setRecognized] = useState<
    Record<string, RecognizedPerson>
  >({});

  // Fetch recognized people per camera
  useEffect(() => {
    const fetchRecognized = async () => {
      try {
        const res = await fetch("http://localhost:8000/recognized");
        const data = await res.json();
        setRecognized(data);
      } catch (err) {
        console.error("Recognition fetch failed", err);
      }
    };

    fetchRecognized();
    const interval = setInterval(fetchRecognized, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="md:h-screen w-full p-2">
      <div className="header h-16 w-full bg-card rounded-md px-5 flex justify-between items-center">
        <Image src={"/Logo.svg"} alt="LgoFrom live" width={50} height={50} />
        <div className="w-[40%]">
          <Input placeholder="Search here ..." />
        </div>
        <ModeToggle/>
      </div>
      <main className="shadow-xl rounded-md  md:h-[85%] bg-card p-10 mt-4">
        <h1 className="text-2xl font-semibold mb-6  dark:text-white text-center underline">
          Live Camera Monitoring
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((cam) => {
            const person = recognized[cam.name];

            return (
              <div
                key={cam.name}
                className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 shadow"
              >
               
                <div className="px-4 py-2 text-sm font-medium bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white capitalize">
                  {cam.name} camera
                </div>
                <div className="relative aspect-video border-2 border-blue-400 rounded-md shadow-2xl">
                  <img
                    src={cam.url}
                    alt={cam.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />

                  {/* ✅ Recognized person overlay */}
                  {person && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur text-white rounded-lg p-2 flex items-center gap-3">
                      <img
                        src={`http://localhost:8000${person.image}`}
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover border border-white"
                      />
                      <div>
                        <p className="text-sm font-semibold">{person.name}</p>
                        <p className="text-sm font-semibold">{person.lastName}</p>
                        <p className="text-xs text-green-400">Recognized</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
