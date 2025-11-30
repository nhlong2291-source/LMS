import React from "react";

export default function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" />
      <span className="ml-3">{message}</span>
    </div>
  );
}
