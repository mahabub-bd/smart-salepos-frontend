import { ArrowLeft, Barcode as BarcodeIcon, Edit, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import { Barcode, CustomQRCode } from "../../../components/qr-barcode";
import Button from "../../../components/ui/button/Button";
import ResponsiveImage from "../../../components/ui/images/ResponsiveImage";
import { useGetProductByIdQuery } from "../../../features/product/productApi";
import { useHasPermission } from "../../../hooks/useHasPermission";

interface Props {
  productId: string;
}

export default function ProductDetail({ productId }: Props) {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProductByIdQuery(productId);
  const product = data?.data;

  const canUpdate = useHasPermission("product.update");

  if (isLoading) return <Loading message="Loading Product..." />;

  if (isError || !product)
    return <p className="p-6 text-red-500">Failed to load product details.</p>;

  const handleEdit = () => {
    navigate(`/products/edit/${product.id}`);
  };

  const goBack = () => {
    navigate("/products");
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              product.status
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.status ? "Active" : "Inactive"}
          </span>

          {canUpdate && (
            <Button onClick={handleEdit} variant="primary" size="sm">
              <Edit size={16} />
              Edit
            </Button>
          )}
          <Button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            size="sm"
          >
            <ArrowLeft size={20} className="text-gray-200" />
            Back to list
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Images */}
        <div className="lg:col-span-1">
          <DetailCard title="Product Images">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-3">
                <ResponsiveImage
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.slice(1, 4).map((image, index) => (
                      <ResponsiveImage
                        key={image.id}
                        src={image.url}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No product images</p>
              </div>
            )}
          </DetailCard>
        </div>

        {/* Right Column - Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <DetailCard title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Product Name" value={product.name} />
              <Info label="SKU" value={product.sku} />
              <Info label="Barcode" value={product.barcode || "-"} />
              <Info label="Unit" value={product.unit?.name || "-"} />
              <Info
                label="Status"
                value={
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status ? "Active" : "Inactive"}
                  </span>
                }
              />
              <Info
                label="Created At"
                value={new Date(product.created_at).toLocaleDateString()}
              />
            </div>

            {product.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 uppercase mb-1">
                  Description
                </p>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}
          </DetailCard>

          {/* QR Code & Barcode */}
          <DetailCard title="QR Code & Barcode">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code Section */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <QrCode size={20} className="mr-2 text-blue-600" />
                  <h3 className="text-sm font-medium text-gray-700">QR Code</h3>
                </div>
                <div className="flex justify-center mb-3">
                  <CustomQRCode
                    value={product.sku}
                    size={150}
                    level="M"
                    includeMargin={true}
                    className="border border-gray-200 rounded-lg p-2 bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
              </div>

              {/* Barcode Section */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <BarcodeIcon size={20} className="mr-2 text-green-600" />
                  <h3 className="text-sm font-medium text-gray-700">Barcode</h3>
                </div>
                <div className="flex justify-center mb-3">
                  {product.barcode ? (
                    <Barcode
                      value={product.barcode}
                      width={2}
                      height={80}
                      displayValue={true}
                      fontSize={14}
                      className="border border-gray-200 rounded-lg p-2 bg-white"
                    />
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
                      <p className="text-gray-500 text-sm">
                        No barcode assigned
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {product.barcode || "Barcode not available"}
                </p>
              </div>
            </div>

            {/* Product Information for Codes */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2 font-medium">
                Product Information:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Product ID:</span>
                  <p className="font-mono text-gray-700">{product.id}</p>
                </div>
                <div>
                  <span className="text-gray-500">SKU:</span>
                  <p className="font-mono text-gray-700">{product.sku}</p>
                </div>
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p
                    className="font-mono text-gray-700 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <p className="font-mono text-gray-700">
                    ৳{Number(product.selling_price).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </DetailCard>

          {/* Pricing Information */}
          <DetailCard title="Pricing Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Info
                label="Purchase Price"
                value={`৳${Number(product.purchase_price).toLocaleString()}`}
              />
              <Info
                label="Selling Price"
                value={`৳${Number(product.selling_price).toLocaleString()}`}
              />
              <Info
                label="Discount Price"
                value={
                  product.discount_price
                    ? `৳${Number(product.discount_price).toLocaleString()}`
                    : "-"
                }
              />
            </div>
          </DetailCard>

          {/* Categories and Tags */}
          <DetailCard title="Categories & Tags">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Category" value={product.category?.name || "-"} />
              <Info
                label="Subcategory"
                value={product.subcategory?.name || "-"}
              />
              <Info label="Brand" value={product.brand?.name || "-"} />
              <Info
                label="Tags"
                value={
                  product.tags && product.tags.length > 0
                    ? product.tags.map((tag) => tag.name).join(", ")
                    : "-"
                }
              />
            </div>
          </DetailCard>

          {/* Stock Information */}
          <DetailCard title="Stock Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Metric
                label="Total Stock"
                value={product.total_stock}
                color="text-blue-600"
              />
              <Metric
                label="Available Stock"
                value={product.available_stock}
                color="text-green-600"
              />
              <Metric
                label="Total Sold"
                value={product.total_sold}
                color="text-gray-600"
              />
              <Metric
                label="Sold Percentage"
                value={`${
                  product.total_stock > 0
                    ? Math.round(
                        (product.total_sold / product.total_stock) * 100
                      )
                    : 0
                }%`}
                color="text-purple-600"
              />
            </div>
          </DetailCard>

          {/* Supplier Information */}
          {product.supplier && (
            <DetailCard title="Supplier Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Supplier Name" value={product.supplier.name} />
                <Info
                  label="Supplier Code"
                  value={product.supplier.supplier_code}
                />
                <Info
                  label="Contact Person"
                  value={product.supplier.contact_person || "-"}
                />
                <Info label="Phone" value={product.supplier.phone || "-"} />
                <Info label="Email" value={product.supplier.email || "-"} />
                <Info label="Address" value={product.supplier.address || "-"} />
              </div>
            </DetailCard>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------------- Reusable Components ---------------------- */

const DetailCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 dark:border-gray-800">
    <h2 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
      {title}
    </h2>
    {children}
  </div>
);

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
      {value}
    </p>
  </div>
);

const Metric = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg">
    <p className="text-xs text-gray-500 uppercase mb-1">{label}</p>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);
