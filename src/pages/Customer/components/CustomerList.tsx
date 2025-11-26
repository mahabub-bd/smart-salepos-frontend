import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
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
import CustomerFormModal from "./CustomerFormModal";


export default function CustomerList() {
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
        null
    );

    const canCreate = useHasPermission("customer.create");
    const canUpdate = useHasPermission("customer.update");
    const canDelete = useHasPermission("customer.delete");
    const canView = useHasPermission("customer.view");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 on new search
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

    const openCreateModal = () => {
        setEditCustomer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditCustomer(customer);
        setIsModalOpen(true);
    };

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
                addLabel="Add Customer"
                onAdd={openCreateModal}
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

                <select
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/5">
                            <TableRow>
                                <TableCell isHeader className="table-header">
                                    Customer Name
                                </TableCell>
                                <TableCell isHeader className="table-header">
                                    Contact
                                </TableCell>
                                <TableCell isHeader className="table-header">
                                    Address
                                </TableCell>
                                <TableCell isHeader className="table-header">
                                    Account
                                </TableCell>
                                <TableCell isHeader className="table-header">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="table-header text-right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="table-body">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {customer.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    ID: {customer.id}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="table-body">
                                            <div className="text-sm">
                                                <p className="text-gray-900 dark:text-white">
                                                    {customer.phone}
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="table-body">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {customer.address || "-"}
                                            </p>
                                        </TableCell>

                                        <TableCell className="table-body">
                                            {customer.account ? (
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {customer.account.code}
                                                    </p>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        {customer.account.name}
                                                    </p>
                                                </div>
                                            ) : (
                                                <Badge size="sm" color="warning">
                                                    No Account
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="table-body">
                                            <Badge
                                                size="sm"
                                                color={customer.status ? "success" : "error"}
                                            >
                                                {customer.status ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {canView && (
                                                    <Link to={`/customers/${customer.id}`}>
                                                        <IconButton
                                                            icon={Eye}
                                                            tooltip="View"

                                                            color="green"
                                                        />
                                                    </Link>
                                                )}
                                                {canUpdate && (
                                                    <IconButton
                                                        icon={Pencil}
                                                        tooltip="Edit"
                                                        onClick={() => openEditModal(customer)}
                                                        color="blue"
                                                    />
                                                )}
                                                {canDelete && (
                                                    <IconButton
                                                        icon={Trash2}
                                                        tooltip="Delete"
                                                        onClick={() => openDeleteDialog(customer)}
                                                        color="red"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
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

                {/* Pagination */}
                {customers.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/5">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing page {page} ({customers.length} items)
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                Previous
                            </button>

                            <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Page {page}
                            </span>

                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={customers.length < limit}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {(canCreate || canUpdate) && (
                <CustomerFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    customer={editCustomer}
                />
            )}

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