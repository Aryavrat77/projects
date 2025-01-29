import Sidebar from "@/components/sidebar";

export default function Analytics() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>
      </main>
    </div>
  ); 
}
