import { z } from "zod"

export const cityies = [
  "Kabul",
  "Herat",
  "Mazar-i-Sharif",
  "Kandahar",
  "Jalalabad",
]

export const EngeneerSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 50 characters long" }),

  lastName: z.string()
    .min(3, { message: "Last name must be at least 3 characters long" })
    .max(50, { message: "Last name must be less than 50 characters long" }),

  address: z.string()
    .min(5, { message: "Address must be at least 5 characters long" })
    .max(100, { message: "Address must be less than 100 characters long" }),

  city: z.string().refine(
    (val) => cityies.includes(val),
    { message: "City must be one of: " + cityies.join(", ") }
  ),

  email: z.string()
    .email({ message: "Invalid email address" }),

  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 characters long" })
    .max(15, { message: "Phone number must be less than 15 characters long" }),

  tid:z.string().min(5,{message:"Telegram can be less than 5 "}).max(50,{message:"Telegram ID cant be greater thatn 50"}),
  Images: z.array(z.instanceof(File))
    .min(3, { message: "At least 3 images are required" }),
})
