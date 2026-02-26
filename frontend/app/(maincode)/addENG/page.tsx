"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ImagePlus, Loader } from "lucide-react";
import { toast } from "sonner";
import { EngeneerSchema, cityies } from "@/lib/ZoneSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function Page() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof EngeneerSchema>>({
    resolver: zodResolver(EngeneerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      address: "",
      city: "",
      email: "",
      phone: "",
      tid: "",
      Images: [],
    },
  });

  async function onSubmit(data: z.infer<typeof EngeneerSchema>) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("phone", data.phone);
      formData.append("tid", data.tid);
      data.Images.forEach((file) => formData.append("images", file));

      const res = await fetch("http://localhost:8000/add-engineer", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        toast("Faild for adding new Employee");
        return;
      }

      toast.success("Employee added successfully");
      form.reset();
      setPreviews([]);
    } catch (error) {
      console.error(error);
      alert("Error saving engineer");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-10 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-6xl rounded-3xl backdrop-blur-xl bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/50 shadow-2xl overflow-hidden transition-colors duration-500">
        {/* HEADER */}
        <div className="px-10 py-6 border-b border-white/20 dark:border-gray-700/50 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-md transition-colors duration-300">
            Add Employee
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mt-1 transition-colors duration-300">
            Fill out the form to add a new Employee
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
          {/* LEFT FORM */}
          <div className="flex flex-col gap-6">
            {[
              { name: "name", label: "Name", placeholder: "First name" },
              {
                name: "lastName",
                label: "Last Name",
                placeholder: "Last name",
              },
              {
                name: "address",
                label: "Address",
                placeholder: "Street / Area",
              },
              {
                name: "email",
                label: "Email",
                placeholder: "example@mail.com",
                type: "email",
              },
              { name: "phone", label: "Phone", placeholder: "+93..." },
              { name: "tid", label: "TelegramID", placeholder: "987...." },
            ].map((item) => (
              <FieldGroup key={item.name}>
                <Controller
                  name={item.name as any}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="w-full">
                      <FieldLabel className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">
                        {item.label}
                      </FieldLabel>
                      <Input
                        {...field}
                        type={item.type ?? "text"}
                        placeholder={item.placeholder}
                        className="w-full rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/30 dark:bg-gray-700/30 backdrop-blur-md transition-colors duration-300"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            ))}

            {/* CITY SELECT */}
            <FieldGroup>
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">
                      City
                    </FieldLabel>
                    <select
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="w-full rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/30 dark:bg-gray-700/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-300"
                    >
                      <option value="" disabled>
                        Select a city
                      </option>
                      {cityies.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* IMAGE PICKER */}
            <FieldGroup>
              <Field>
                <FieldLabel className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">
                  Employee Images
                </FieldLabel>
                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-300 bg-white/20 dark:bg-gray-700/20 backdrop-blur-lg hover:border-indigo-400 hover:bg-white/30 dark:hover:bg-gray-600/30">
                  <ImagePlus className="w-10 h-10 text-indigo-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Click to select images (min 3)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      form.setValue("Images", files, { shouldValidate: true });
                      const urls = files.map((file) =>
                        URL.createObjectURL(file),
                      );
                      setPreviews(urls);
                    }}
                  />
                </label>
                {form.formState.errors.Images && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.Images.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="mt-4 w-full py-3 font-semibold rounded-2xl shadow-lg backdrop-blur-md bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors duration-300"
              onClick={form.handleSubmit(onSubmit)}
            >
              {loading ? (
                <div>
                  <Loader className="animate-spin size-6" />
                </div>
              ) : (
                "Save Employee"
              )}
            </Button>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="rounded-2xl p-6 shadow-inner backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/50 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
              Selected Images
            </h3>
            {previews.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">
                No images selected
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-300"
                  >
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
