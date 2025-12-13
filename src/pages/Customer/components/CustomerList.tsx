import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
} from "../../../features/customer/customerApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Customer } from "../../../types";

export default function CustomerList() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  const canUpdate = useHasPermission("customer.update");
  const canDelete = useHasPermission("customer.delete");
  const canView = useHasPermission("customer.view");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useGetCustomersQuery({
    search: debouncedSearch,
    page,
    limit,
  });

  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + customers.length;

  const openDeleteDialog = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete.id).unwrap();
      toast.success("Customer deleted successfully");
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading Customers" />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch customers.</p>;

  return (
    <>
      <PageHeader
        title="Customer Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={() => navigate("/customers/new")}
        permission="customer.create"
      />

      {/* Search & Filters */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className=" rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className=" overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader>Customer Code</TableCell>
                <TableCell isHeader>Customer Name</TableCell>
                <TableCell isHeader>Contact</TableCell>
                {/* <TableCell isHeader>Address</TableCell> */}
                <TableCell isHeader>Customer Group</TableCell>
                <TableCell isHeader>Account</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader className="text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.customer_code}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    {/* <TableCell>{customer.address}</TableCell> */}
                    <TableCell>
                      {customer.group ? (
                        <span>{customer.group.name}</span>
                      ) : (
                        <Badge size="sm" color="info">
                          No Group
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.account ? (
                        <span>Acc No: {customer.account.account_number}</span>
                      ) : (
                        <Badge size="sm" color="warning">
                          No Account
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        size="sm"
                        color={customer.status ? "success" : "error"}
                      >
                        {customer.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex justify-end gap-2">
                      {canView && (
                        <Link to={`/customers/${customer.id}`}>
                          <IconButton icon={Eye} tooltip="View" color="green" />
                        </Link>
                      )}
                      <Link to={`/customers/${customer.id}/ledger`}>
                        <IconButton
                          icon={BookOpen}
                          tooltip="View Ledger"
                          color="purple"
                        />
                      </Link>
                      {canUpdate && (
                        <Link to={`/customers/${customer.id}/edit`}>
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            color="blue"
                          />
                        </Link>
                      )}
                      {canDelete && (
                        <IconButton
                          icon={Trash2}
                          onClick={() => openDeleteDialog(customer)}
                          color="red"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchInput
                      ? "No customers found matching your search"
                      : "No customers found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 🔥 Updated Pagination Only 👇 */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-white/5">
            {/* Left – Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show
              </span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                per page
              </span>
            </div>

            {/* Middle – Showing range */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {startIndex + 1} - {Math.min(endIndex, totalItems)} of{" "}
              {totalItems}
            </div>

            {/* Right – Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                aria-label="Previous Page"
              >
                <ChevronLeft
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>

              <span className="px-3 text-sm text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="rounded p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                aria-label="Next Page"
              >
                <ChevronRight
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Customer"
          message={`Are you sure you want to delete "${customerToDelete?.name}"?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
