import React from "react";

export default function EmptyState({
  title = "No data",
  message = "Nothing to show.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
