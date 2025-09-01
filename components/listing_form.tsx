"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

// 1. Define the Zod schema for validation
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  price: z.number({
    message: "Price must be a number.",
  }).positive({
    message: "Price must be a positive number.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  photos: z.array(z.string()).min(1, {
    message: "You must upload at least one photo.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * A simple listing form component using standard HTML elements.
 * This version is for troubleshooting purposes to check for errors.
 *
 * @returns {JSX.Element} The form component.
 */
export function ListingForm() {
  const [photos, setPhotos] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      price: 0,
      description: "",
      photos: [],
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("Form data submitted:", data);
    alert("Form submitted successfully! Check the console.");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const photoUrl = URL.createObjectURL(file);
      const updatedPhotos = [...photos, photoUrl];
      setPhotos(updatedPhotos);
      setValue("photos", updatedPhotos, { shouldValidate: true });
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-lg p-6 border rounded-md shadow-lg bg-amber-100")}>
      <h1 className="text-2xl font-bold mb-6 text-center">Listing Form</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            {...register("title")}
            placeholder="e.g., Cozy Apartment in Downtown"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            id="location"
            {...register("location")}
            placeholder="e.g., New York, NY"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Price Field */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            id="price"
            type="number"
            {...register("price", {
              valueAsNumber: true,
            })}
            placeholder="e.g., 500000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Describe the property..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* photo field */}    
        <div>
          <label htmlFor="photos" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Photos</label>
          <input
            id="photos"
            type="file"
            onChange={handlePhotoUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((photoUrl, index) => (
                <img key={index} src={photoUrl} alt={`Property photo ${index + 1}`} className="size-20 object-cover rounded-md" />
              ))}
            </div>
          )}
          {errors.photos && (
            <p className="mt-1 text-sm text-red-500">{errors.photos.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit Listing
        </Button>
      </form>
    </div>
  );
}
