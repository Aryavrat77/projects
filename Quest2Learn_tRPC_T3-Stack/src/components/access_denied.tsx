
import { useRouter } from "next/router";
import { Button } from "./ui/button";

export default function LabAccessDeniedPage() {
    const router = useRouter();
  
    const handleBackToDashboard = () => {
      router.push("/dashboard");
    };
  
    return (
      <div className="relative flex flex-col items-center justify-center h-screen">
        <div className="text-3xl font-bold mb-4">You don't have access to the lab</div>
        <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>
    );
  }