import { Loader2, AlertCircle } from "lucide-react";

export const DataRenderer = ({
  loading = false,
  error = null,
  normalContent,
}) => {
  console.log('loading: ', loading);
  console.log("error: ", error);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-red-600">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-xl font-medium">Something went wrong</p>
        <p className="text-sm mt-2 text-gray-500 max-w-md text-center">
          {error.message || "An unknown error occurred"}
        </p>
      </div>
    );
  }

  return typeof normalContent === "function" ? normalContent() : normalContent;
};
