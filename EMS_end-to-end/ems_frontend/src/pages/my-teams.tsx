import Sidebar from "@/components/sidebar";

export default function MyTeams() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Teams</h1>
        </div>
      </main>
    </div>
  ); 
}
