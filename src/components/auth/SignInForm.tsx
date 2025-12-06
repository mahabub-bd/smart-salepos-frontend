import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import { toast } from "react-toastify";
import { useLoginMutation } from "../../features/auth/authApi";

// Validation schema
const formSchema = z.object({
  identifier: z.string().min(1, "Email / Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type FormFields = z.infer<typeof formSchema>;

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  });

  const remember = watch("remember");

  const onSubmit = async (data: FormFields) => {
    try {
      await login({
        identifier: data.identifier,
        password: data.password,
      }).unwrap();

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error?.data?.message || "Invalid credentials, please try again!";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-16">
      <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
        Sign In
      </h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Enter your login credentials to continue
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identifier */}
        <div>
          <Label>
            Email or Username <span className="text-red-500">*</span>
          </Label>
          <Input placeholder="example@gmail.com" {...register("identifier")} />
          {errors.identifier && (
            <p className="text-sm text-red-500 mt-1">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div>
          <Label>
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <EyeCloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <Checkbox
            checked={!!remember}
            onChange={(val) => setValue("remember", val)}
          />
          <span className="text-gray-700 dark:text-gray-400 text-sm">
            Keep me logged in
          </span>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
