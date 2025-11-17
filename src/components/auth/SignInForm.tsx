import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";

import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";


import { useLoginMutation } from "../../features/auth/authApi";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!identifier || !password) {
      // toast.error("Email / Username and password required");
      return;
    }

    try {
      await login({ identifier, password }).unwrap();
      // toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      // toast.error(error?.data?.message || "Invalid credentials!");
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <Label>
            Email or Username <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="example@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <Label>
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="size-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <EyeCloseIcon className="size-5 text-gray-500 dark:text-gray-400" />
              )}
            </span>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-3">
          <Checkbox checked={remember} onChange={setRemember} />
          <span className="text-gray-700 dark:text-gray-400 text-sm">
            Keep me logged in
          </span>
        </div>

        {/* Login Button */}
        <Button className="w-full" size="sm" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
