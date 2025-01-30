import React from "react";
import Experience from "~/AnalyticalBalanceLab/components/Experience";
import { useLabAccess } from "~/hooks/useLabAccess";
import LabAccessDeniedPage from "~/components/access_denied";

function AnalyticalBalanceLab() {
  const { canAccess, isLoading } = useLabAccess("Analytical Balances");

  if (isLoading) {
    return null;
  }

  return canAccess ? (
    <div>
      <Experience />
    </div>
  ) : (
    <LabAccessDeniedPage />
  );
}

export default AnalyticalBalanceLab;
