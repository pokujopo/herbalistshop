import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../services/adminApi";
import {
  Card, Badge, Button, Input, Select, Spinner,
  Table, Thead, Th, Tbody, Tr, Td,
  PageHeader, EmptyState, Modal, toast,
} from "../components/ui";

function SkeletonRows({ rows = 7 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <Tr key={i}>
      <Td><div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse" /></Td>
      <Td>
        <div className="space-y-2">
          <div className="h-3.5 bg-gray-100 rounded w-36 animate-pulse" />
          <div className="h-2.5 bg-gray-100 rounded w-20 animate-pulse" />
        </div>
      </Td>
      {[...Array(5)].map((_, j) => (
        <Td key={j}><div className="h-3 bg-gray-100 rounded w-full animate-pulse" /></Td>
      ))}
    </Tr>
  ));
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/products");
      setProducts(res.data?.data || []);
    } catch (error) {
      console.log("Products error:", error.response?.data || error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = useMemo(() => {
    let items = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.slug?.toLowerCase().includes(q) ||
          item.sku?.toLowerCase().includes(q)
      );
    }
    if (filter === "featured") items = items.filter((item) => item.is_featured);
    if (filter === "best") items = items.filter((item) => item.is_best_seller);
    if (filter === "new") items = items.filter((item) => item.is_new);
    if (filter === "inactive") items = items.filter((item) => !item.is_active);
    return items;
  }, [products, query, filter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminApi.delete(`/products/${deleteTarget.id}`);
      setProducts((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header card */}
      <Card className="p-5">
        <PageHeader
          title="Products"
          subtitle={`${filteredProducts.length} of ${products.length} products`}
          action={
            <Link to="/admin/products/create">
              <Button>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </Button>
            </Link>
          }
        />

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <Input
              type="text"
              placeholder="Search name, slug, SKU..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-44">
            <option value="all">All Products</option>
            <option value="featured">Featured</option>
            <option value="best">Best Seller</option>
            <option value="new">New</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </Card>

      {/* Table card */}
      <Card className="p-5">
        {loading ? (
          <Table>
            <Thead>
              <Th /><Th>Product</Th><Th>Category</Th><Th>Price</Th>
              <Th>Stock</Th><Th>Flags</Th><Th>Status</Th><Th>Actions</Th>
            </Thead>
            <Tbody><SkeletonRows /></Tbody>
          </Table>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 17m8 4V10" />
              </svg>
            }
            title="No products found"
            description="Try adjusting your search or filter, or add a new product."
          />
        ) : (
          <Table>
            <Thead>
              <Th className="w-14" />
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Flags</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Thead>
            <Tbody>
              {filteredProducts.map((item) => (
                <Tr key={item.id}>
                  <Td>
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 ring-1 ring-gray-100">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </Td>
                  <Td>
                    <p className="font-semibold text-gray-900 text-xs">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{item.slug}</p>
                  </Td>
                  <Td className="text-xs text-gray-500">{item.category?.name || "—"}</Td>
                  <Td>
                    <span className="text-xs font-bold text-emerald-600 block">
                      TZS {Number(item.discount_price || item.price).toLocaleString()}
                    </span>
                    {item.discount_price && (
                      <span className="text-[10px] text-gray-400 line-through">
                        TZS {Number(item.price).toLocaleString()}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span className={`text-xs font-semibold ${item.stock <= 5 ? "text-red-600" : "text-gray-700"}`}>
                      {item.stock}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {item.is_featured && <Badge variant="purple">Featured</Badge>}
                      {item.is_best_seller && <Badge variant="success">Best</Badge>}
                      {item.is_new && <Badge variant="info">New</Badge>}
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={item.is_active ? "success" : "danger"}>
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <Link to={`/admin/products/create?edit=${item.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Link to={`/admin/products/create?gallery=${item.id}`}>
                        <Button variant="ghost" size="sm">Gallery</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">"{deleteTarget?.name}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" /> : null}
            {deleting ? "Deleting..." : "Delete Product"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminProducts;
