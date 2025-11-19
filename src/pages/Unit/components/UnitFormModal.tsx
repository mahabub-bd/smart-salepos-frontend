import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Switch from "../../../components/form/switch/Switch"; // Correct path based on usage
import { Modal } from "../../../components/ui/modal";
import {
  useCreateUnitMutation,
  useUpdateUnitMutation,
} from "../../../features/unit/unitApi";

import { Unit } from "../../../types";

interface UnitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
}

export default function UnitFormModal({
  isOpen,
  onClose,
  unit,
}: UnitFormModalProps) {
  const isEdit = !!unit;
  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (isEdit && unit) {
      setFormData({
        name: unit.name,
        code: unit.code,
        description: unit.description || "",
        isActive: unit.isActive,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        isActive: true,
      });
    }
  }, [unit, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && unit) {
        await updateUnit({ id: unit.id, ...formData }).unwrap();
        toast.success("Unit updated successfully!");
      } else {
        await createUnit(formData).unwrap();
        toast.success("Unit created successfully!");
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Unit" : "Create New Unit"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <Label>Unit Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Code */}
        <div>
          <Label>Unit Code</Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-4">
          <Switch
            label="Active"
            defaultChecked={formData.isActive}
            onChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
            color="gray" // optional: matches your UI style
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          {isEdit ? "Update Unit" : "Create Unit"}
        </button>
      </form>
    </Modal>
  );
}
