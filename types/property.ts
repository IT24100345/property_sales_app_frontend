
export type PropertyForm = {
  title: string
  description: string
  price: string
  location: string
  landSize: string
  type: "residential" | "commercial" | "agricultural" | ""
  features: string[]
  contactPhone: string
  contactEmail: string
  images: File[]
}