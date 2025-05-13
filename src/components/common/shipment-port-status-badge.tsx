const ShipmentPortStatusBadge = ({ status }: { status: number }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 1:
        return {
          text: "Active",
          color: "bg-green-100/50 text-green-800 dark:text-green-50 dark:bg-green-800",
        };
      case 2:
        return {
          text: "Inactive",
          color: "bg-red-100/50 text-red-800 dark:text-red-50 dark:bg-red-800",
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-100/50 text-gray-800 dark:text-gray-50 dark:bg-gray-800",
        };
    }
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge().color}`}
    >
      {getStatusBadge().text}
    </span>
  );
};

export default ShipmentPortStatusBadge;
