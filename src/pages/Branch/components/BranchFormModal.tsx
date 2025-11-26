import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { Modal } from "../../../components/ui/modal";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "../../../features/branch/branchApi";
import { Branch } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
}

export default function BranchFormModal({ isOpen, onClose, branch }: Props) {
  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();

  const isEdit = !!branch;

  const [formData, setFormData] = useState({
    code: branch?.code || "",
    name: branch?.name || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    email: branch?.email || "",
    is_active: branch?.is_active ?? true,
    default_warehouse_id: branch?.default_warehouse_id || "",
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isEdit && branch) {
      setFormData({
        code: branch.code,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        is_active: branch.is_active,
        default_warehouse_id: branch.default_warehouse_id || "",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        is_active: true,
        default_warehouse_id: "",
      });
    }
  }, [isEdit, branch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      default_warehouse_id: formData.default_warehouse_id
        ? Number(formData.default_warehouse_id)
        : null,
    };

    console.log("Submitting payload:", payload);

    try {
      if (isEdit && branch) {
        await updateBranch({ id: branch.id, body: payload }).unwrap();
        toast.success("Branch updated successfully!");
      } else {
        await createBranch(payload).unwrap();
        toast.success("Branch created successfully!");
      }
      onClose();
    } catch (err: any) {
      console.error("Error submitting branch:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Branch" : "Create New Branch"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Branch Code */}
        <div>
          <Label className="text-sm font-medium mb-1 block">Branch Code</Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="BR-001"
            required
          />
        </div>

        {/* Branch Name */}
        <div>
          <Label className="text-sm font-medium mb-1 block">Branch Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Main Branch"
            required
          />
        </div>

        {/* Address */}
        <div>
          <Label className="text-sm font-medium mb-1 block">Address</Label>
          <Input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="123 Street, City"
            required
          />
        </div>

        {/* Phone & Email - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-1 block">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+8801712345678"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="branch@example.com"
              required
            />
          </div>
        </div>

        {/* Default Warehouse ID */}
        <div>
          <Label className="text-sm font-medium mb-1 block">
            Default Warehouse ID (Optional)
          </Label>
          <Input
            type="number"
            value={formData.default_warehouse_id}
            onChange={(e) =>
              setFormData({ ...formData, default_warehouse_id: e.target.value })
            }
            placeholder="1"
          />
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <Label htmlFor="is_active" className="text-sm font-medium">
            Active Branch
          </Label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg disabled:opacity-50"
        >
          {isEdit ? "Update Branch" : "Create Branch"}
        </button>
      </form>
    </Modal>
  );
}