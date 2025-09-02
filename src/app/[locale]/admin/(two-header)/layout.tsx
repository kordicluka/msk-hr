import React from "react";

export default async function TwoHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <div className="flex-col flex-1 flex">{children}</div>
    </>
  );
}
