"use client";

import { SearchIcon } from "@/components/icons";
import { useAuth } from "@/context/auth.context";
import { useProductActions, useProducts } from "@/hooks/useProduct";
import {
  CreateProductFormValues,
  CreateProductSchema,
  IconSvgProps,
  Product,
  UpdateProductFormValues,
  UpdateProductSchema,
} from "@/types";
import { Button } from "@heroui/button";
import { Chip, ChipProps } from "@heroui/chip";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/use-disclosure";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import React, { useCallback } from "react";
import { Form } from "@heroui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Link } from "@heroui/link";

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "PRICE", uid: "price" },
  { name: "STOCK", uid: "stock" },
  { name: "ACTIONS", uid: "actions" },
];

export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

export const EyeIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const DeleteIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};
const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type User = (typeof users)[0];

export default function Home() {
  const { user } = useAuth();
  const { products, loading, error, pagination, setParams, params, refetch } =
    useProducts();
  const { createProduct, creating, error: errorCreating } = useProductActions();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { handleSubmit, register } = useForm<CreateProductFormValues>({
    resolver: zodResolver(CreateProductSchema),
  });

  const [searchValue, setSearchValue] = React.useState("");

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const debounce = useCallback(
    <T extends (...args: any[]) => any>(fn: T, delay = 500) => {
      let timeoutId: NodeJS.Timeout | null = null;

      return (...args: Parameters<T>) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          fn(...args);
          timeoutId = null;
        }, delay);
      };
    },
    [],
  );

  const renderCell = React.useCallback(
    (product: Product, columnKey: React.Key) => {
      const cellValue = product[columnKey as keyof Product] as string | number;

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{cellValue}</span>
              <span className="text-sm text-default-400">
                {product.description}
              </span>
            </div>
          );
        case "price":
          return (
            <div className="flex flex-col">
              <span className="text-sm">Rp{cellValue}</span>
            </div>
          );
        case "stock":
          return (
            <div className="flex flex-col">
              <span className="text-sm">{cellValue}</span>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-3">
              <Tooltip content="Details">
                <Link className="text-lg cursor-pointer text-default-400 active:opacity-50" href={`products/${product.id}`}>
                  <EyeIcon />
                </Link>
              </Tooltip>
              <Tooltip content="Edit user">
                <span className="text-lg cursor-pointer text-primary active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg cursor-pointer text-danger active:opacity-50">
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  const handleCreateProduct = async (data: CreateProductFormValues) => {
    try {
      await createProduct(data);

      onClose();
      addToast({
        title: "Success",
        description: "Product created successfully",
        color: "success",
      });
      refetch();
    } catch (err) {
      console.error("Failed to create product:", err);
      addToast({
        title: "Error",
        description: errorCreating || "Failed to create product",
        color: "danger",
      });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="justify-center inline-block w-full text-start">
        <span className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
          Welcome back, {user?.name || "User"}!
        </span>
        <div className="mt-4 text-lg text-default-500">
          This is where you can manage you products.
        </div>
      </div>

      {/* Search Row */}
      <div className="flex flex-row items-center justify-between w-full mt-8">
        <Input
          className="w-full max-w-xs"
          placeholder="Search products..."
          radius="sm"
          startContent={<SearchIcon className="w-4 h-4 text-gray-500" />}
          value={searchValue}
          variant="bordered"
          onValueChange={(value: string) => {
            setSearchValue(value);
            debounce(() => {
              setParams({ ...params, search: value, page: 1 });
            })();
          }}
        />

        <div className="flex items-center space-x-2">
          <Button
            className="ml-4"
            color="primary"
            radius="sm"
            variant="solid"
            onPress={onOpen}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full mt-2">
        <Table aria-label="Products Table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={products || []}
            loadingContent={<Spinner label="Loading..." variant="dots" />}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span className="w-full">
            Showing {products?.length || 0} of {pagination?.totalItems} items
          </span>

          {products?.length > 0 && (
            <div className="flex items-center justify-end w-full">
              <Pagination
                showControls
                classNames={{
                  item: "cursor-pointer",
                  prev: "cursor-pointer",
                  next: "cursor-pointer",
                }}
                initialPage={1}
                isDisabled={loading}
                radius="sm"
                total={pagination?.totalPages || 1}
                onChange={(page) => {
                  handlePageChange(page);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Drawer */}
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Create New Product
              </DrawerHeader>
              <DrawerBody>
                <div className="flex flex-col gap-4">
                  <Form
                    className="flex flex-col w-full gap-4"
                    id="create-product-form"
                    validationBehavior="aria"
                    onSubmit={handleSubmit(handleCreateProduct)}
                  >
                    <Input
                      {...register("name")}
                      isRequired
                      label="Name"
                      labelPlacement="outside"
                      placeholder="Product Name"
                      radius="sm"
                      variant="bordered"
                    />
                    <Input
                      {...register("description")}
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Product Description"
                      radius="sm"
                      variant="bordered"
                    />
                    <Input
                      {...register("price", { valueAsNumber: true })}
                      isRequired
                      label="Price"
                      labelPlacement="outside"
                      placeholder="Product Price"
                      radius="sm"
                      type="number"
                      variant="bordered"
                    />
                    <Input
                      {...register("initialStock", { valueAsNumber: true })}
                      isRequired
                      label="Stock"
                      labelPlacement="outside"
                      placeholder="Product Stock"
                      radius="sm"
                      type="number"
                      variant="bordered"
                    />
                  </Form>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  isDisabled={creating}
                  color="danger"
                  variant="light"
                  radius="sm"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  isLoading={creating}
                  isDisabled={creating}
                  color="primary"
                  form="create-product-form"
                  type="submit"
                  radius="sm"
                >
                  Save
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </section>
  );
}
