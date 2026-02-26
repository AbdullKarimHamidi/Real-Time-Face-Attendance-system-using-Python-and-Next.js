"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ImagePlus, Loader, Trash2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
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

export default function EditEngineerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ID = searchParams.get("id");

  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  /* ----------------------------------
     FETCH ENGINEER DATA
  ---------------------------------- */
  useEffect(() => {
    if (!ID) return;

    const fetchEngineer = async () => {
      try {
        const res = await fetch(`http://localhost:8000/specific/${ID}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        form.reset({
          name: data.name,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          email: data.email,
          phone: data.phone,
          tid: data.tid,
          Images: [],
        });

        setPreviews(data.images || []);
      } catch (err) {
        toast("Failed for loading engineer");
        router.push("/");
      } finally {
        setFetching(false);
      }
    };

    fetchEngineer();
  }, [ID]);

  /* ----------------------------------
     UPDATE ENGINEER
  ---------------------------------- */
  async function onSubmit(data: z.infer<typeof EngeneerSchema>) {
    if (!ID) return;
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

      if (data.Images.length > 0) {
        data.Images.forEach((file) => formData.append("images", file));
      }

      const res = await fetch(`http://localhost:8000/update-engineer/${ID}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        toast("Update failed");
        return;
      }

      toast("Engineer Updated successfully");
    } catch (error) {
      console.error(error);
      toast("Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!ID) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this engineer? This action cannot be undone!",
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/delete-engineer/${ID}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) {
        toast(result.detail || "Failed ");
        return;
      }
      toast.success("Engineer deleted successfully!");
      router.push("/"); // redirect to main page
    } catch (err) {
      console.error(err);
      toast("Delete error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center p-10 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-6xl rounded-3xl bg-white/20 dark:bg-gray-800/30 border shadow-2xl">
        {/* HEADER */}
        <div className="px-10 py-6 border-b">
          <h1 className="text-3xl font-bold">Edit Employee Info</h1>
          <p className="text-gray-500 mt-1">Update Employee information</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 p-10">
          {/* LEFT FORM */}
          <div className="flex flex-col gap-6">
            {[
              { name: "name", label: "Name" },
              { name: "lastName", label: "Last Name" },
              { name: "address", label: "Address" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone" },
              { name: "tid", label: "Telegram ID" },
            ].map((item) => (
              <FieldGroup key={item.name}>
                <Controller
                  name={item.name as any}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{item.label}</FieldLabel>
                      <Input {...field} type={item.type ?? "text"} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            ))}

            {/* CITY */}
            <FieldGroup>
              <Controller
                name="city"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <select {...field} className="w-full rounded-xl p-3 border">
                      <option value="">Select city</option>
                      {cityies.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Update Images (optional)</FieldLabel>
                <label className="flex flex-col items-center gap-3 border-dashed border-2 p-6 rounded-xl cursor-pointer">
                  <ImagePlus className="size-10" />
                  <span>Select new images</span>
                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      form.setValue("Images", files);
                      setPreviews(files.map((f) => URL.createObjectURL(f)));
                    }}
                  />
                </label>
              </Field>
            </FieldGroup>

            <div className="flex gap-4 mt-4">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="flex-1 py-3"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin size-6" />
                ) : (
                  "Update"
                )}
              </Button>

              <Button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin size-6 " />
                ) : (
                  <div className="flex text-sm font-bold cursor-pointer">
                    <Trash2 className="inline-block mr-2" />
                    <h1>Delete</h1>
                  </div>
                )}
              </Button>
            </div>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Images</h3>
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-28 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
