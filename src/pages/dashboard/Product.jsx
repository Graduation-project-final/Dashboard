import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";

export function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(!open);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/products");
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "amber";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "blue-gray";
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      setApprovingId(productId);
      const response = await fetch(
        `http://localhost:4000/api/products/${productId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        // Update the product status in the local state
        setProducts(
          products.map((product) =>
            product.id === productId
              ? { ...product, status: "approved" }
              : product,
          ),
        );

        // Also update the selected product if it's the one being approved
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct({ ...selectedProduct, status: "approved" });
        }
      } else {
        console.error("Failed to approve product");
      }
    } catch (error) {
      console.error("Error approving product:", error);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Products Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Product",
                    "Title",
                    "Category",
                    "Status",
                    "Created At",
                    "Actions",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, key) => {
                  const className = `py-3 px-5 ${
                    key === products.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={product.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={`http://localhost:4000/${product.mainImage}`}
                            alt={product.title}
                            size="sm"
                            variant="rounded"
                          />
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {product.title}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {product.category}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={getStatusColor(product.status)}
                          value={product.status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex gap-2">
                          <Button
                            variant="text"
                            color="blue-gray"
                            className="text-xs font-semibold"
                            onClick={() => handleOpen(product)}
                          >
                            View
                          </Button>
                          {product.status === "pending" && (
                            <Button
                              variant="gradient"
                              color="green"
                              className="text-xs font-semibold"
                              onClick={() => handleApproveProduct(product.id)}
                              disabled={approvingId === product.id}
                            >
                              {approvingId === product.id ? (
                                <Spinner className="h-4 w-4" />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Product Details Modal */}
      <Dialog open={open} handler={handleOpen} size="lg">
        {selectedProduct && (
          <>
            <DialogHeader>{selectedProduct.title}</DialogHeader>
            <DialogBody divider className="max-h-[70vh] overflow-y-auto">
              <div className="mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Description
                </Typography>
                <Typography>{selectedProduct.description}</Typography>
              </div>

              <div className="mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Main Image
                </Typography>
                <img
                  src={`http://localhost:4000/${selectedProduct.mainImage}`}
                  alt="Main"
                  className="h-48 w-full object-contain"
                />
              </div>

              <div className="mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Sub Images
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.subImages.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:4000/${image}`}
                      alt={`Sub ${index + 1}`}
                      className="h-24 w-24 object-contain"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Category
                  </Typography>
                  <Typography>{selectedProduct.category}</Typography>
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Status
                  </Typography>
                  <Chip
                    variant="gradient"
                    color={getStatusColor(selectedProduct.status)}
                    value={selectedProduct.status}
                    className="py-0.5 px-2 text-[11px] font-medium w-fit"
                  />
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Created At
                  </Typography>
                  <Typography>
                    {new Date(selectedProduct.createdAt).toLocaleString()}
                  </Typography>
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Updated At
                  </Typography>
                  <Typography>
                    {new Date(selectedProduct.updatedAt).toLocaleString()}
                  </Typography>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              {selectedProduct.status === "pending" && (
                <Button
                  variant="gradient"
                  color="green"
                  onClick={() => handleApproveProduct(selectedProduct.id)}
                  disabled={approvingId === selectedProduct.id}
                  className="mr-2"
                >
                  {approvingId === selectedProduct.id ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    "Approve"
                  )}
                </Button>
              )}
              <Button
                variant="text"
                color="red"
                onClick={() => handleOpen(null)}
                className="mr-1"
              >
                <span>Close</span>
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default ProductsTable;
