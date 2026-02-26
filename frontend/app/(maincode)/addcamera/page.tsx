"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CameraFormData {
  name: string;
  username: string;
  password: string;
  ip: string;
}

interface CameraErrors {
  name?: string;
  username?: string;
  password?: string;
  ip?: string;
}

export default function Page() {
  const [formData, setFormData] = useState<CameraFormData>({
    name: "",
    username: "",
    password: "",
    ip: "",
  });

  const [errors, setErrors] = useState<CameraErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  /* ---------------- validation ---------------- */
  const validate = (): boolean => {
    const e: CameraErrors = {};
    if (!formData.name.trim()) e.name = "Camera name is required";
    if (!formData.username.trim()) e.username = "Username is required";
    if (!formData.password.trim()) e.password = "Password is required";

    if (!formData.ip.trim()) {
      e.ip = "IP address is required";
    } else {
      const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
      if (!ipPattern.test(formData.ip)) {
        e.ip = "Invalid IP address";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const form = new FormData();
    form.append("camname", formData.name);
    form.append("username", formData.username);
    form.append("password", formData.password);
    form.append("ipaddress", formData.ip);
    try {
      const res = await fetch("http://localhost:8000/addCamera", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        let message = "Camera added successfully";

        try {
          const data = await res.json();
          message = data?.message || message;
        } catch {}

        alert(message);
        setFormData({ name: "", username: "", password: "", ip: "" });
        setErrors({});
        return;
      }
      const errorText = await res.text();
      alert(errorText || "Server error");
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:h-screen p-5 bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-16 bg-card rounded-md flex justify-between items-center p-5 mb-5">
        <Image src="/Logo.svg" alt="logo" width={50} height={50} />
        <h1 className="font-bold text-xl">Add Camera IP</h1>
        <div />
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col gap-4">
      
          <div>
            <label className="font-semibold">Camera Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="font-semibold">Username</label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="font-semibold">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="font-semibold">Camera IP Address</label>
            <Input
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.ip && <p className="text-red-500 text-sm">{errors.ip}</p>}
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Camera"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
