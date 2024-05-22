"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { useState } from "react";
import { useFormStatus } from "react-dom";

interface LoginFormProps {
  signIn: (formData: FormData) => Promise<void>;
  message: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ signIn, message }) => {
  const roles = [
    { label: "Store Manager", value: "store-manager" },
    { label: "Vendor Manager", value: "vendor-manager" },
    { label: "Admin", value: "admin" },
  ];

  const [isInputUserPasswordVisible, setIsInputUserPasswordVisible] =
    useState(false);

  const { pending, action } = useFormStatus();
  const isPending = pending && action === signIn;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await signIn(formData);
  };

  return (
    <>
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2"
        onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          name="email"
          variant="underlined"
          isRequired
        />
        <Input
          type={isInputUserPasswordVisible ? "text" : "password"}
          label="Password"
          name="password"
          variant="underlined"
          isRequired
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() =>
                setIsInputUserPasswordVisible(!isInputUserPasswordVisible)
              }>
              {isInputUserPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        />
        <div className="self-end">
          <Select
            name="role"
            variant="flat"
            aria-label="Role"
            // label="Role"
            isRequired
            defaultSelectedKeys={["store-manager"]}
            className="w-44">
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Button type="submit" color="secondary" disabled={pending}>
          {isPending ? "Signing In..." : "Sign In"}
        </Button>

        {message && (
          <p className="mt-4 p-4 bg-foreground/10 text-center">{message}</p>
        )}
      </form>
    </>
  );
};

export default LoginForm;
