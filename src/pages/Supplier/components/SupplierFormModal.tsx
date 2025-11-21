import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../components/ui/modal";

import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";



import { Supplier } from "../../../types";
import { useCreateSupplierMutation, useUpdateSupplierMutation } from "../../../features/suppliers/suppliersApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export default function SupplierFormModal({ isOpen, onClose, supplier }: Props) {
  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();

  const isEdit = !!supplier;

  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    payment_terms: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact_person: supplier.contact_person || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        payment_terms: supplier.payment_terms || "",
      });
    } else {
      setFormData({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        payment_terms: "",
      });
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && supplier) {
        await updateSupplier({ id: supplier.id, body: formData }).unwrap();
        toast.success("Supplier updated successfully");
      } else {
        await createSupplier(formData).unwrap();
        toast.success("Supplier created successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Supplier" : "Add New Supplier"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <Label>Name</Label>
          <Input
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Contact Person</Label>
          <Input
            value={formData.contact_person}
            onChange={(e) =>
              setFormData({ ...formData, contact_person: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Address</Label>
          <Input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Payment Terms</Label>
          <Input
            value={formData.payment_terms}
            onChange={(e) =>
              setFormData({ ...formData, payment_terms: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          {isEdit ? "Update Supplier" : "Create Supplier"}
        </button>
      </form>
    </Modal>
  );
}
