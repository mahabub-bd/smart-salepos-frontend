interface FullScreenLoaderProps {
  message?: string;
}

export default function Loading({
  message = "Loading...",
}: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/80 z-9999">
      <div className="w-12 h-12 border-4 border-[#465FFF] border-t-transparent rounded-full animate-spin"></div>
      {message && (
        <p className="mt-4 text-sm font-medium text-[#465FFF] dark:text-[#465FFF]">
          {message}
        </p>
      )}
    </div>
  );
}
