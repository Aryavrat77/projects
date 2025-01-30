import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from '~/utils/api';

export function useLabAccess(labName: string) {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: labAccess, refetch: labRefetch, isLoading: labLoading } = api.user.getOneUserLabByName.useQuery({ userId: userId, name: labName });

  useEffect(() => {
    // only fetch when userId is loaded
    if (!userId) return;

    labRefetch().then((res) => {
      if (res.data !== null) {
        setCanAccess(true);
      }
    }).catch((error) => {
      console.error('Error fetching lab:', error);
    }).finally(() => {
      setIsLoading(false);
    });

  }, [userId, labRefetch]);

  useEffect(() => {

    if (labLoading) return;
    if (userId && labAccess === null) {
      setCanAccess(false);
    }
  }, [userId, labLoading, labAccess]);

  return { canAccess, isLoading };
}
