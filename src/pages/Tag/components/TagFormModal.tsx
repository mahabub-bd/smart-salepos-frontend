import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Switch from "../../../components/form/switch/Switch";
import { Modal } from "../../../components/ui/modal";
import {
  useCreateTagMutation,
  useUpdateTagMutation,
} from "../../../features/tag/tagApi";
import { Tag } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tag: Tag | null;
}

export default function TagFormModal({ isOpen, onClose, tag }: Props) {
  const isEdit = !!tag;
  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    if (isEdit && tag) {
      setForm({
        name: tag.name || "",
        slug: tag.slug || "",
        description: tag.description || "",
        status: tag.status ?? true,
      });
    } else {
      setForm({ name: "", slug: "", description: "", status: true });
    }
  }, [isEdit, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      if (isEdit && tag) {
        await updateTag({ id: tag.id, body: form }).unwrap();
        toast.success("Tag updated");
      } else {
        await createTag(form).unwrap();
        toast.success("Tag created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Tag" : "Create New Tag"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3">
          <Label>Status</Label>
          <Switch
            label="Active"
            defaultChecked={form.status}
            onChange={(checked) => setForm({ ...form, status: checked })}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 text-white rounded"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
