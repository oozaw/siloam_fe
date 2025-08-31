"use client";

import { DeleteIcon, EditIcon, EyeIcon, SearchIcon } from "@/components/icons";
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

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "PRICE", uid: "price" },
    { name: "STOCK", uid: "stock" },
    { name: "ACTIONS", uid: "actions" },
  ];

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
                <Link
                  className="text-lg cursor-pointer text-default-400 active:opacity-50"
                  href={`products/${product.id}`}
                >
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
