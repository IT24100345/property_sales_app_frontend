import {ListingForm} from "@/components/listing_form";
export default async function Home() {
  

  const res = await fetch("http://localhost:8080/api/test/hello");
  const data = await res.text()

  console.log("Data fetched from API:", data);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-lg p-6 rounded-md shadow-lg bg-blue-400"> 
        <ListingForm />
      </div>
    </main>
  );
}


