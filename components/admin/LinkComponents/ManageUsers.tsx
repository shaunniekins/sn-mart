"use client";

import { useEffect, useState } from "react";

import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Pagination,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Link from "next/link";
import {
  deleteUser,
  editUser,
  fetchAllUsersData,
  insertNewUser,
} from "@/app/api/usersData";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";

type User = {
  id: string;
  email: string;
  password: string;
  created_at: string;
  role: string;
  last_name: string | null;
  first_name: string | null;
};
const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const roles: string[] = ["customer", "store-manager", "vendor"];
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // fetching
  const [searchValue, setSearchValue] = useState("");
  const entriesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  const fetchUsers = async () => {
    try {
      setLoadingState("loading");
      const response = await fetchAllUsersData(
        searchValue,
        entriesPerPage,
        currentPage,
        selectedRoles
      );
      if (response?.error) {
        console.error(response.error);
        setLoadingState("error");
      } else {
        setUsers(response.data as User[]);
        setNumOfEntries(response.count || 1);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchValue, entriesPerPage, currentPage, selectedRoles]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputUserEmail, setInputUserEmail] = useState("");
  const [inputUserFirstName, setInputUserFirstName] = useState("");
  const [inputUserLastName, setInputUserLastName] = useState("");
  const [inputUserRole, setInputUserRole] = useState("");
  const [inputUserPassword, setInputUserPassword] = useState("");
  const [isInputUserPasswordVisible, setIsInputUserPasswordVisible] =
    useState(true);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddOrEditUser = async () => {
    const userData = {
      email: inputUserEmail,
      first_name: inputUserFirstName,
      last_name: inputUserLastName,
      role: inputUserRole,
      password: inputUserPassword,
    };

    try {
      if (editingUser) {
        await editUser(editingUser.id, userData);
      } else {
        await insertNewUser(userData);
      }

      fetchUsers();

      handleRemoveInputValues();
      onClose();
    } catch (error) {
      console.error("An error occurred1111:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      handleRemoveInputValues();
    }
  }, [isOpen]);

  const handleRemoveInputValues = () => {
    setInputUserEmail("");
    setInputUserFirstName("");
    setInputUserLastName("");
    setInputUserRole("");
    setEditingUser(null);
  };

  const columns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "password", label: "Password" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            {editingUser ? "Edit User" : "Add New User"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 w-full gap-3">
              <div className="form-container">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  isRequired
                  placeholder="example@gmail.com"
                  value={inputUserEmail}
                  onChange={(e) => setInputUserEmail(e.target.value)}
                />
              </div>
              <div className="form-container">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <Input
                  type={isInputUserPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  isRequired
                  placeholder="*****"
                  value={inputUserPassword}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() =>
                        setIsInputUserPasswordVisible(
                          !isInputUserPasswordVisible
                        )
                      }>
                      {isInputUserPasswordVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => setInputUserPassword(e.target.value)}
                />
              </div>
              <div className="form-container">
                <label htmlFor="first_name" className="form-label">
                  First Name
                </label>
                <Input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="First name"
                  value={inputUserFirstName}
                  onChange={(e) => setInputUserFirstName(e.target.value)}
                />
              </div>
              <div className="form-container">
                <label htmlFor="last_name" className="form-label">
                  Last Name
                </label>
                <Input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Last name"
                  value={inputUserLastName}
                  onChange={(e) => setInputUserLastName(e.target.value)}
                />
              </div>
              <div className="form-container">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <Select
                  aria-label="Select Role"
                  id="role"
                  name="role"
                  placeholder="Select Role"
                  value={inputUserRole}
                  onChange={(e) => setInputUserRole(e.target.value)}>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleAddOrEditUser}
              disabled={
                !inputUserEmail ||
                !inputUserFirstName ||
                !inputUserLastName ||
                !inputUserRole
              }
              className={`bg-main-theme text-white ${
                !inputUserEmail ||
                !inputUserFirstName ||
                !inputUserLastName ||
                !inputUserRole
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-main-hover-theme"
              }`}>
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Breadcrumbs>
        <BreadcrumbItem className="section-link">
          <Link href="/authuser/protected">Dashboard</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Manage Users</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="section-title">Manage Users</h1>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold mb-2">Existing Users</h3>
          <div className="flex items-center gap-2">
            <Button
              radius="md"
              className="bg-main-theme hover:bg-main-hover-theme text-white"
              onPress={onOpen}>
              + Add
            </Button>
            <Input
              isClearable
              onClear={() => setSearchValue("")}
              radius="lg"
              classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focused=true]:bg-default-200/50",
                  "dark:group-data-[focused=true]:bg-default/60",
                  "!cursor-text",
                ],
              }}
              placeholder="Type to search..."
              value={searchValue}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchValue(e.target.value);
              }}
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
            <Select
              aria-label="Filter by role"
              placeholder="Filter by role"
              selectionMode="multiple"
              className="max-w-[10rem]"
              value={selectedRoles}
              onChange={(event) => {
                const roles = event.target.value.split(",");
                setSelectedRoles(roles);
              }}>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <Table
          aria-label="Product Catalog Table"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                  className="bg-"
                />
              </div>
            ) : null
          }>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-main-theme text-white text-center">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={users}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner color="secondary" />}
            loadingState={loadingState}>
            {(user) => (
              <TableRow key={user.id} className="text-center">
                {(columnKey) => {
                  if (columnKey === "actions") {
                    return (
                      <TableCell className="flex gap-2 justify-center">
                        <Button
                          isIconOnly
                          radius="sm"
                          onClick={() => {
                            setInputUserEmail(user.email);
                            setInputUserFirstName(user.first_name || "");
                            setInputUserLastName(user.last_name || "");
                            setInputUserRole(user.role);
                            setInputUserPassword(user.password);
                            setEditingUser(user);
                          }}
                          onPress={onOpen}
                          className="bg-edit-theme hover:bg-edit-hover-theme text-white">
                          <MdOutlineEdit />
                        </Button>
                        <Button
                          isIconOnly
                          radius="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this user?"
                              )
                            ) {
                              deleteUser(user.id)
                                .then(() => {
                                  fetchUsers();
                                })
                                .catch((error) => {
                                  console.error("Error deleting user:", error);
                                });
                            }
                          }}
                          className="bg-delete-theme hover:bg-delete-hover-theme text-white">
                          <MdDeleteOutline />
                        </Button>
                      </TableCell>
                    );
                  }
                  if (columnKey === "role") {
                    return (
                      <TableCell>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell>
                      {user[columnKey as keyof typeof user]}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ManageUsers;
