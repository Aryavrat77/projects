import React from "react";
import clsx from "clsx";

type ContainerProps = {
  className?: string | string[];
  children?: React.ReactNode; // Added this line
};

export default function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}