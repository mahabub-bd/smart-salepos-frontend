import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  FormField,
  SelectField,
} from "../../../components/form/form-elements/SelectFiled";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useGetBranchesQuery } from "../../../features/branch/branchApi";
import { useGetDepartmentsQuery } from "../../../features/department/departmentApi";
import { useGetDesignationsQuery } from "../../../features/designation/designationApi";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../../../features/employee/employeeApi";
import {
  CreateEmployeePayload,
  Employee,
  EmployeeStatus,
  EmployeeType,
} from "../../../types";

// Zod schema for employee validation
const employeeSchema = z.object({
  employee_code: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  status: z.nativeEnum(EmployeeStatus),
  employee_type: z.nativeEnum(EmployeeType),
  designationId: z.string().min(1, "Designation is required"),
  departmentId: z.string().min(1, "Department is required"),
  base_salary: z.string().min(1, "Base salary is required"),
  branch_id: z.string().min(1, "Branch is required"),
  userId: z.string().min(1, "User ID is required"),
  notes: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export default function EmployeeFormModal({
  isOpen,
  onClose,
  employee,
}: Props) {
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  // State for date pickers
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [hireDate, setHireDate] = useState<Date | null>(null);

  // Fetch departments, designations, and branches
  const { data: departmentsData } = useGetDepartmentsQuery();
  const { data: designationsData } = useGetDesignationsQuery();
  const { data: branchesData } = useGetBranchesQuery();

  const isEdit = !!employee;
  const departments = departmentsData?.data || [];
  // designations API returns PaginatedResponse, so we need to access the items
  const designations = designationsData?.data?.items || [];
  const branches = branchesData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employee_code: employee?.employee_code || "",
      first_name: employee?.first_name || "",
      last_name: employee?.last_name || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      address: employee?.address || "",
      status: employee?.status || EmployeeStatus.ACTIVE,
      employee_type: employee?.employee_type || EmployeeType.FULL_TIME,
      designationId: employee?.designationId?.toString() || "",
      departmentId: employee?.departmentId?.toString() || "",
      base_salary: employee?.base_salary || "",
      branch_id: employee?.branch?.id?.toString() || "",
      userId: employee?.userId?.toString() || "",
      notes: employee?.notes || "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        employee_code: employee?.employee_code || "",
        first_name: employee?.first_name || "",
        last_name: employee?.last_name || "",
        email: employee?.email || "",
        phone: employee?.phone || "",
        address: employee?.address || "",
        status: employee?.status || EmployeeStatus.ACTIVE,
        employee_type: employee?.employee_type || EmployeeType.FULL_TIME,
        designationId: employee?.designationId?.toString() || "",
        departmentId: employee?.departmentId?.toString() || "",
        base_salary: employee?.base_salary || "",
        branch_id: employee?.branch?.id?.toString() || "",
        userId: employee?.userId?.toString() || "",
        notes: employee?.notes || "",
      });

      // Set date picker values with robust date parsing
      if (employee?.date_of_birth) {
        const dob = new Date(employee.date_of_birth);
        setDateOfBirth(isNaN(dob.getTime()) ? null : dob);
      } else {
        setDateOfBirth(null);
      }

      if (employee?.hire_date) {
        const hire = new Date(employee.hire_date);
        setHireDate(isNaN(hire.getTime()) ? null : hire);
      } else {
        setHireDate(null);
      }
    } else {
      // Reset dates when modal closes
      setDateOfBirth(null);
      setHireDate(null);
    }
  }, [isOpen, employee, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    // Validate date pickers
    if (!dateOfBirth) {
      toast.error("Date of birth is required");
      return;
    }
    if (!hireDate) {
      toast.error("Hire date is required");
      return;
    }

    const payload: CreateEmployeePayload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      date_of_birth: dateOfBirth.toISOString().split('T')[0],
      hire_date: hireDate.toISOString().split('T')[0],
      status: data.status,
      employee_type: data.employee_type,
      designationId: parseInt(data.designationId),
      departmentId: parseInt(data.departmentId),
      base_salary: parseFloat(data.base_salary) || 0,
      branch_id: parseInt(data.branch_id),
      userId: parseInt(data.userId),
      notes: data.notes,
      employee_code: data.employee_code || undefined,
    };

    try {
      if (isEdit && employee) {
        await updateEmployee({ id: employee.id, ...payload }).unwrap();
        toast.success("Employee updated successfully!");
      } else {
        await createEmployee(payload).unwrap();
        toast.success("Employee created successfully!");
      }
      onClose();
    } catch (err: any) {
      console.error("Error submitting employee:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto  scrollbar-hide"
      title={isEdit ? "Update Employee" : "Create New Employee"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Employee Code */}
          <FormField label="Employee Code">
            <Input
              {...register("employee_code")}
              placeholder="Enter employee code (optional)"
            />
          </FormField>

          {/* Email */}
          <FormField label="Email *">
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <FormField label="First Name *">
            <Input {...register("first_name")} placeholder="Enter first name" />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name.message}
              </p>
            )}
          </FormField>

          {/* Last Name */}
          <FormField label="Last Name *">
            <Input {...register("last_name")} placeholder="Enter last name" />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name.message}
              </p>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Phone */}
          <FormField label="Phone *">
            <Input {...register("phone")} placeholder="Enter phone number" />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </FormField>

          {/* Date of Birth */}
          <div>
            <DatePicker
              id="date_of_birth"
              label="Date of Birth *"
              value={dateOfBirth}
              onChange={(dates) => setDateOfBirth(Array.isArray(dates) ? dates[0] : dates)}
              placeholder="Select date of birth"
              disableFuture={true}
              isRequired={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Hire Date */}
          <div>
            <DatePicker
              id="hire_date"
              label="Hire Date *"
              value={hireDate}
              onChange={(dates) => setHireDate(Array.isArray(dates) ? dates[0] : dates)}
              placeholder="Select hire date"
              disableFuture={false}
              isRequired={true}
            />
          </div>

          {/* Base Salary */}
          <FormField label="Base Salary *">
            <Input
              {...register("base_salary")}
              type="number"
              step="0.01"
              placeholder="Enter base salary"
            />
            {errors.base_salary && (
              <p className="text-red-500 text-sm mt-1">
                {errors.base_salary.message}
              </p>
            )}
          </FormField>
        </div>

        {/* Address */}
        <FormField label="Address *">
          <textarea
            {...register("address")}
            placeholder="Enter address"
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </FormField>

        <div className="grid grid-cols-3 gap-4">
          {/* Department */}
          <SelectField
            label="Department *"
            data={departments.map((dept) => ({ id: dept.id, name: dept.name }))}
            value={watch("departmentId")}
            onChange={(value) => setValue("departmentId", value)}
          />

          {/* Designation */}
          <SelectField
            label="Designation *"
            data={designations.map((designation) => ({
              id: designation.id,
              name: designation.title,
            }))}
            value={watch("designationId")}
            onChange={(value) => setValue("designationId", value)}
          />

          {/* Branch */}
          <SelectField
            label="Branch *"
            data={branches.map((branch) => ({
              id: branch.id,
              name: branch.name,
            }))}
            value={watch("branch_id")}
            onChange={(value) => setValue("branch_id", value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Employee Type */}
          <SelectField
            label="Employee Type *"
            data={[
              { id: EmployeeType.FULL_TIME, name: "Full Time" },
              { id: EmployeeType.PART_TIME, name: "Part Time" },
              { id: EmployeeType.CONTRACT, name: "Contract" },
              { id: EmployeeType.INTERN, name: "Intern" },
            ]}
            value={watch("employee_type")}
            onChange={(value) =>
              setValue("employee_type", value as EmployeeType)
            }
          />

          {/* Status */}
          <SelectField
            label="Status *"
            data={[
              { id: EmployeeStatus.ACTIVE, name: "Active" },
              { id: EmployeeStatus.INACTIVE, name: "Inactive" },
              { id: EmployeeStatus.TERMINATED, name: "Terminated" },
              { id: EmployeeStatus.ON_LEAVE, name: "On Leave" },
            ]}
            value={watch("status")}
            onChange={(value) => setValue("status", value as EmployeeStatus)}
          />
        </div>

        {/* User ID */}
        <FormField label="User ID *">
          <Input
            {...register("userId")}
            type="number"
            placeholder="Enter user ID"
          />
          {errors.userId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userId.message}
            </p>
          )}
        </FormField>

        {/* Notes */}
        <FormField label="Notes">
          <textarea
            {...register("notes")}
            placeholder="Enter any additional notes"
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </FormField>

        {/* Submit */}
        <div className="flex gap-3 justify-end mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isEdit ? "Update Employee" : "Create Employee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
