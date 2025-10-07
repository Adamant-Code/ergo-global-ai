"use client";

// Hooks
import useToast from "@/hooks/useToast";
import { useError } from "@/hooks/useError";
import useComponentMounted from "@/hooks/useComponentMounted";

import { ZodError } from "zod";
import { User } from "../DataTable/types";
import { LoginErrors } from "../Auth/types";
import { useCallback, useMemo, useState } from "react";

import { users } from "@/constants";
import { parseError } from "@/lib/errors";
import { loginSchema } from "@/lib/schemas";
import { getColumns } from "../DataTable/Columns";

// Components
import Button from "../Button/Button";
import { Modal } from "../Modal/DisplayModal";
import ToastComponents from "./ToastComponents";
import { UrlInput } from "../UrlInput/UrlInput";
import ComponentWrapper from "./ComponentWrapper";
import { DataTable } from "../DataTable/DataTable";
import { FileUpload } from "../FileUpload/FileUpload";
import { EmailInput } from "../EmailInput/EmailInput";
import { ToggleSwitch } from "../ToggleSwitch/ToggleSwitch";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown";

const ReusableComponentWrapper = () => {
  const { setError } = useError();
  const [url, setUrl] = useState("");
  const { isMounted } = useComponentMounted();
  const { success, error, info } = useToast();
  const [isToggled, setIsToggle] = useState(false);
  const [, setSelectedFiles] = useState<File[]>([]);
  const [emailPasswordErrors, setEmailPasswordErrors] =
    useState<LoginErrors>({});
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const zodErrors = err.flatten().fieldErrors;
        setEmailPasswordErrors({
          email: zodErrors.email?.[0],
          password: zodErrors.password?.[0],
        });
      }
      return false;
    }
  };

  const handleEmailPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    const fieldValidators = {
      email: loginSchema.shape.email,
      password: loginSchema.shape.password,
    } as const;

    try {
      fieldValidators[name as keyof typeof fieldValidators].parse(
        value
      );
      setEmailPasswordErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    } catch (err) {
      if (err instanceof ZodError) {
        setEmailPasswordErrors((prev) => ({
          ...prev,
          [name]: err.errors[0]?.message || "Invalid input",
        }));
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailPasswordErrors({});

    validateForm();
    if (emailPasswordErrors.password || !formData.password) {
      setError(
        parseError(
          new Error(emailPasswordErrors.password),
          "Password Error"
        )
      );
      return;
    }
    setIsPasswordLoading(true);
    try {
      // Simulate login process
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (formData.password === "") {
            reject(new Error("Invalid password"));
          } else {
            success("Submission successful!");
            resolve(true);
          }
        }, 2000);
      });

      setIsPasswordLoading(false);
    } catch (err) {
      setIsPasswordLoading(false);
      setEmailPasswordErrors({
        general: "Login failed. Please try again.",
      });
      setError(parseError(err));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailPasswordErrors({});

    validateForm();
    if (emailPasswordErrors.email || !formData.email) {
      setError(
        parseError(
          new Error(emailPasswordErrors.email),
          "Email Error"
        )
      );
      return;
    }
    setIsEmailLoading(true);
    try {
      // Simulate login process
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (formData.email === "") {
            reject(new Error("Invalid email"));
          } else {
            success("Email submitted!");
            resolve(true);
          }
        }, 2000);
      });

      setIsEmailLoading(false);
    } catch (err) {
      setIsEmailLoading(false);
      setEmailPasswordErrors({
        general: "Submission failed. Please try again.",
      });
      setError(parseError(err));
    }
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFilesRemove = useCallback((fileName: string) => {
    setSelectedFiles((prev) =>
      prev.filter((f) => f.name !== fileName)
    );
  }, []);

  const handleUrlChange = useCallback((urlValue: string) => {
    setUrl(urlValue);
  }, []);

  const handleUndo = useCallback(() => {
    console.log("Action undone");
  }, []);

  const onEdit = useCallback((row: User) => {
    console.log("Edit row:", row);
  }, []);

  const onDelete = useCallback((id: string) => {
    console.log("Delete row with id:", id);
  }, []);

  const handleDelete = useCallback((rows: User[]) => {
    console.log("Deleting rows:", rows);
    // Implement your delete logic here
  }, []);

  const handleSelectionChange = useCallback(
    (selectedRows: User[]) => {
      console.log("Selection changed:", selectedRows);
      // Update your UI based on selection
    },
    []
  );

  const memoizedUsers = useMemo(() => users, []);
  const memoizedColumns = useMemo(
    () => getColumns(onEdit, onDelete),
    [onDelete, onEdit]
  );

  const options = useMemo(
    () => [
      { value: "1", label: "Apple" },
      { value: "2", label: "Banana" },
      { value: "3", label: "Orange" },
      { value: "4", label: "Pineapple" },
    ],
    []
  );

  const renderOption = useCallback(
    (option: { value: string; label: string }) => (
      <div className="flex items-center p-2 hover:bg-indigo-50 rounded-md transition-colors">
        <span className="mr-2 text-indigo-600">🍎</span>
        <span className="font-medium text-gray-800">
          {option.label.toUpperCase()}
        </span>
      </div>
    ),
    []
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <ComponentWrapper componentName="URL Input">
          <UrlInput
            id="website"
            urlValue={url}
            requireProtocol
            disabled={false}
            label="Website URL"
            placeholder="www.example.com"
            handleUrlChange={handleUrlChange}
            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Toggle Switch">
          <ToggleSwitch
            size="lg"
            disabled={false}
            checked={isToggled}
            id="notifications-lg"
            label="Enable Notifications"
            onCheckedChange={setIsToggle}
            className="flex items-center space-x-3"
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Searchable Dropdown">
          <SearchableDropdown
            options={options}
            onChange={console.log}
            label="Multi select state"
            placeholder="Select your favorite fruits"
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Confirmation Modal">
          <Modal
            cancelLabel="Cancel"
            title="Confirm Action"
            confirmLabel="Proceed"
            onCancel={() => console.log("Cancelled")}
            onConfirm={() => console.log("Confirmed")}
            description="Are you sure you want to proceed? This cannot be undone."
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Toggle Switch">
          <ToggleSwitch
            size="lg"
            checked={true}
            disabled={true}
            id="notifications-lg"
            label="Disabled state"
            onCheckedChange={setIsToggle}
            className="flex items-center space-x-3"
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Searchable Dropdown">
          <SearchableDropdown
            options={options}
            onChange={console.log}
            renderOption={renderOption}
            placeholder="Custom render option"
            label="Multi select with custom render"
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Toast Notifications">
          <ToastComponents
            withAction
            info={info}
            error={error}
            success={success}
            handleUndo={handleUndo}
            label="Toasts with Actions"
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="File Upload">
          <FileUpload
            maxSizeMB={2}
            multiple
            disabled={false}
            onFilesSelected={handleFilesSelected}
            handleFilesRemove={handleFilesRemove}
            accept={["image/png", ".pdf", ".jpg", ".jpeg"]}
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Password">
          <form
            noValidate
            className="p-2 space-y-4"
            onSubmit={handlePasswordSubmit}
          >
            <div>
              <PasswordInput
                required
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                disabled={isPasswordLoading}
                placeholder="Enter your password"
                passwordValue={formData.password}
                error={emailPasswordErrors.password}
                handlePasswordChange={handleEmailPasswordChange}
              />
            </div>
            <Button
              type="submit"
              title="Submit Password"
              disabled={isPasswordLoading}
              variant={"destructive"}
              // className="w-full bg-indigo-600 text-white rounded-md px-4 py-3 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:bg-indigo-300 transition-colors duration-300"
            >
              {isPasswordLoading
                ? "Submitting..."
                : "Submit Password"}
            </Button>
          </form>
        </ComponentWrapper>

        <ComponentWrapper componentName="Email">
          <form
            noValidate
            className="p-2 space-y-4"
            onSubmit={handleEmailSubmit}
          >
            <div>
              <EmailInput
                required
                name="email"
                label="Email Address"
                disabled={isEmailLoading}
                emailValue={formData.email}
                placeholder="your@email.com"
                error={emailPasswordErrors.email}
                onChange={handleEmailPasswordChange}
              />
            </div>
            <Button
              type="submit"
              title="Submit Email"
              disabled={isEmailLoading}
              // className="w-full bg-indigo-600 text-white rounded-md px-4 py-3 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:bg-indigo-300 transition-colors duration-300"
            >
              {isEmailLoading ? "Submitting" : "Submit Email"}
            </Button>
          </form>
        </ComponentWrapper>

        <ComponentWrapper componentName="Toast Notifications">
          <ToastComponents
            info={info}
            error={error}
            label="Toasts"
            success={success}
            handleUndo={handleUndo}
          />
        </ComponentWrapper>

        <ComponentWrapper componentName="Searchable Dropdown">
          <SearchableDropdown
            isSingleSelect
            options={options}
            onChange={console.log}
            label="Single select state"
            placeholder="Select your favorite fruits"
          />
        </ComponentWrapper>
      </div>
      <div className="mt-8">
        {/* The 'isMounted' flag is used solely for testing since randomly generated user data can lead to discrepancies between server and client rendered values, which may result in errors */}
        <ComponentWrapper componentName="Data Table">
          <>
            {isMounted && (
              <DataTable
                data={memoizedUsers}
                columns={memoizedColumns}
                onBulkDelete={handleDelete}
                onSelectionChange={handleSelectionChange}
              />
            )}
          </>
        </ComponentWrapper>
      </div>
    </>
  );
};

export default ReusableComponentWrapper;
