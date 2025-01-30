"use client";
import { UserButton } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "../../components/ui/card";
import { BellIcon, InfoIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import { useUser } from "@clerk/nextjs";
import { api } from '~/utils/api'
import { User } from '@prisma/client';

//import Navbar from "@/components/Navbar";
//import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import Empty from "../../components/Empty";
//import { Notebook } from "@prisma/client";

interface Lab {
  id: string;
  image: string;
  name: string;
  updatedAt: Date;
  completed: string;
  link: string;
}

// Reusable card component to display notebook details
const LabCard: React.FC<{ lab: Lab }> = ({ lab }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started':
        return '#FF8888';
      case 'In Progress':
        return '#FFFF88';
      case 'Completed':
        return '#8DC8FF';
      default:
        return 'black';
    }
  };

  return (
    <Link href={lab.link} passHref>
      {/* 'passHref' ensures the href prop is passed to the underlying DOM element */}
      <Card>
        {lab.image !== "none" && <CardImage imageSrc={lab.image} />}
        <CardHeader>
          <div className="notebook-title">
            <CardTitle>{lab.name}</CardTitle>
          </div>
        </CardHeader>
        {
          // <CardContent>
          //   <div className="completed-status" style={{ color: getStatusColor(notebook.completed) }}>
          //     <CardDescription>
          //       {notebook.completed}
          //     </CardDescription>
          //   </div>
          //   {/* <div className="last-updated">
          //     <CardDescription>
          //       Last updated: {notebook.updatedAt.toLocaleDateString()}
          //     </CardDescription>
          //   </div> */}
          //   {/* Add additional notebook details here */}
          // </CardContent>
        }
      </Card>
    </Link>
  );
};

type LabPreviewProps = {
  labs: Lab[];
};

const NotebookPreview: React.FC<LabPreviewProps> = ({ labs }) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4 md:pr-10">
      {labs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
    </div>
  );
};

// const notebook: Notebook = {
//   id: "1",
//   image: "Abalance.png",
//   name: "Analytical Balances",
//   updatedAt: new Date(),
//   completed: "Not Started",
//   link: "/analytical_balance_lab",
// };

// const notebook2: Notebook = {
//   id: "2",
//   image: "rotovap.jpeg",
//   name: "RotoVap",
//   completed: "Not Started",
//   updatedAt: new Date(),
//   link: "/rotovap_lab",
// };

// const notebook3: Notebook = {
//   id: "3",
//   image: "buchner.jpeg",
//   name: "Buchner Funnel",
//   completed: "Not Started",
//   updatedAt: new Date(),
//   link: "/extraction_lab",
// };
const labArr: Lab[] = [
  {
    id: "1",
    image: "Abalance.png",
    name: "Analytical Balances",
    updatedAt: new Date(),
    completed: "Not Started",
    link: "/analytical_balance_lab",
  },
  {
    id: "2",
    image: "rotovap.jpeg",
    name: "RotoVap",
    completed: "Not Started",
    updatedAt: new Date(),
    link: "/rotovap_lab",
  },
  {
    id: "3",
    image: "buchner.jpeg",
    name: "Buchner Funnel",
    completed: "Not Started",
    updatedAt: new Date(),
    link: "/extraction_lab",
  }
];

//const access_labs = [notebook, notebook2, notebook3]
interface LabNew {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  status: string;
  progress: number;
  userId: string;
}

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [labs, setLabs] = useState<LabNew[]>([]); // Changed type to Lab[]
  const { user } = useUser();
  const { mutate: createUser, isLoading: createUserLoading } = api.user.userCreate.useMutation();
  const { mutate: createLab, isLoading: createLabsLoading } = api.lab.createLab.useMutation();
  const userId = user?.id ?? null;
  const fullName = user?.fullName ?? "new user";
  const { data: currUser, refetch: userRefetch , isLoading: userLoading } = api.user.getUserById.useQuery({ id: userId });
  const { data: allLabs, refetch: labsRefetch, isLoading: labsLoading } = api.user.getAllLabs.useQuery({ userId: userId });
  
  useEffect(() => {
    if (!user || createUserLoading || createLabsLoading) {
      return;
    }
    userRefetch();
    labsRefetch().then((res) => {
      if (res.data) {
        setLabs(res.data);
      }
    }).catch((error) => {
      console.error('Error fetching labs:', error);
    });
  }, [userId, createUserLoading, createLabsLoading]);

  useEffect(() => {
    if (allLabs) {
      setLabs(allLabs);
    }
  }, [allLabs]);

  useEffect(() => {
    if (!user || userLoading || labsLoading) {
      return;
    }
    //console.log("currUser: ", currUser);
    if (!currUser) {
      createUser({ id: userId, name: fullName });
      // Create 3 labs for the user, need to update this to create labs based on user's access
      createLab({ id: `${userId}1`, name: "Analytical Balances", userId: userId });
      createLab({ id: `${userId}2`, name: "RotoVap", userId: userId });
      createLab({ id: `${userId}3`, name: "Buchner Funnel", userId: userId });
    }
  }, [userId, user, userLoading, labsLoading, currUser, createUser, createLab, fullName]);

  useEffect(() => {
    const fetchLabs = () => {
      if (!labs) {
        return;
      }
      const userNotebooks: Lab[] = [];
      labs.forEach((lab) => {
        const correspondingNotebook = findNotebookForLab(lab.name);
        if (correspondingNotebook) {
          userNotebooks.push(correspondingNotebook);
        }
      });
      setNotebooks(userNotebooks);
      setIsLoading(false);
    };
    if (labs) {
      fetchLabs();
    }
  }, [labs]);

  const findNotebookForLab = (labName: string): Lab | undefined => {
    return labArr.find(lab => lab.name === labName); // Assuming labArr is defined elsewhere
  };

  return (
    <div className="relative h-full bg-dashboard-bg"> {/*Relative H-full not filling the entire page for some reason */}
      <header className="flex h-14 items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40 lg:h-[60px]">
        <div className="ml-auto flex items-center gap-4">
          <div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <div className="dashboard flex flex-row">
        {
          // <div className="w-64 flex-shrink-0">
          //   <Sidebar />
          // </div>
        }
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
          <div className="main-content">
            {isLoading ? (
              // Add loading skeleton UI here
              <div>Loading...</div>
            ) : notebooks?.length > 0 ? (
              <NotebookPreview labs={notebooks} />
            ) : (
              <Empty label="No labs to access!" />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
