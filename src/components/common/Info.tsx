const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-600 capitalize dark:text-gray-400">{label}</p>
    <p className=" capitalize font-medium text-gray-800 dark:text-white">
      {value || "N/A"}
    </p>
  </div>
);

export default Info;
