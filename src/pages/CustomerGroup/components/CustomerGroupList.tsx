import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
  useDeleteCustomerGroupMutation,
  useGetCustomerGroupsQuery,
} from "../../../features/customer-group/customerGroupApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { CustomerGroup } from "../../../types";
import CustomerGroupFormModal from "./CustomerGroupFormModal";

export default function CustomerGroupList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<CustomerGroup | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<CustomerGroup | null>(
    null
  );

  const canCreate = useHasPermission("customer.group.create");
  const canUpdate = useHasPermission("customer.group.update");
  const canDelete = useHasPermission("customer.group.delete");

  const { data, isLoading, isError } = useGetCustomerGroupsQuery({});

  const [deleteGroup] = useDeleteCustomerGroupMutation();
  const groups = data?.data || [];

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await deleteGroup(groupToDelete.id).unwrap();
      toast.success("Customer group deleted successfully");
    } catch {
      toast.error("Failed to delete customer group");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading customer groups..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch groups.</p>;

  return (
    <>
      <PageHeader
        title="Customer Group Management"
        icon={<Plus size={16} />}
        addLabel="Add Group"
        onAdd={() => {
          setEditGroup(null);
          setIsModalOpen(true);
        }}
        permission="customer.group.create"
      />

      <div className="border rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Name</TableCell>
                <TableCell isHeader>Discount (%)</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader className="text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group: CustomerGroup) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.discount_percentage || 0}%</TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      color={group.is_active ? "success" : "error"}
                    >
                      {group.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    {canUpdate && (
                      <IconButton
                        icon={Pencil}
                        tooltip="Edit"
                        onClick={() => {
                          setEditGroup(group);
                          setIsModalOpen(true);
                        }}
                      />
                    )}
                    {canDelete && (
                      <IconButton
                        icon={Trash2}
                        tooltip="Delete"
                        onClick={() => {
                          setGroupToDelete(group);
                          setIsDeleteModalOpen(true);
                        }}
                        color="red"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {canCreate || canUpdate ? (
        <CustomerGroupFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          group={editGroup}
        />
      ) : null}

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Customer Group"
        message={`Are you sure you want to delete "${groupToDelete?.name}"?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
