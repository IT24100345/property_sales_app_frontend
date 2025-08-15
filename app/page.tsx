

export default async function Home() {

  const res = await fetch("http://localhost:8080/api/test/hello");
  const data = await res.text()

  console.log("Data fetched from API:", data);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>{data}</h1>
    </div>
  );
}
