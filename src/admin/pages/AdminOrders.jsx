import { useEffect, useMemo, useState } from "react";
import adminApi from "../services/adminApi";
import {
  Card, Badge, Button, Input, Select, Spinner,
  Table, Thead, Th, Tbody, Tr, Td,
  PageHeader, EmptyState, Modal, Label, toast,
} from "../components/ui";

const statusVariant = {
  pending: "warning",
  processing: "purple",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
  paid: "success",
  failed: "danger",
};

function SkeletonRows({ rows = 8 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <Tr key={i}>
      {[...Array(8)].map((_, j) => (
        <Td key={j}><div className="h-3 bg-gray-100 rounded animate-pulse" /></Td>
      ))}
    </Tr>
  ));
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      if (status !== "all") params.set("status", status);
      const res = await adminApi.get(`/admin/orders?${params.toString()}`);
      setOrders(res.data?.data || []);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrder = async (id) => {
    try {
      setDetailsLoading(true);
      setModalOpen(true);
      const res = await adminApi.get(`/admin/orders/${id}`);
      setSelectedOrder(res.data.order);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Failed to load order details");
      setModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOrderFieldChange = (field, value) => {
    setSelectedOrder((prev) => ({ ...prev, [field]: value }));
  };

  const saveOrderUpdates = async () => {
    if (!selectedOrder) return;
    try {
      setSaving(true);
      const res = await adminApi.put(`/admin/orders/${selectedOrder.id}`, {
        order_status: selectedOrder.order_status,
        payment_status: selectedOrder.payment_status,
        tracking_number: selectedOrder.tracking_number || "",
      });
      setSelectedOrder(res.data.order);
      await fetchOrders();
      toast.success("Order updated successfully");
      setModalOpen(false);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const totalOrders = useMemo(() => orders.length, [orders]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <Card className="p-5">
        <PageHeader
          title="Orders"
          subtitle={`${totalOrders} orders found`}
        />
        <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <Input
              type="text"
              placeholder="Search order, customer, phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button type="submit">Search</Button>
        </form>
      </Card>

      {/* Table */}
      <Card className="p-5">
        {loading ? (
          <Table>
            <Thead>
              <Th>Order</Th><Th>Customer</Th><Th>Phone</Th>
              <Th>Order Status</Th><Th>Payment</Th>
              <Th>Total</Th><Th>Date</Th><Th />
            </Thead>
            <Tbody><SkeletonRows /></Tbody>
          </Table>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              </svg>
            }
            title="No orders found"
            description="No orders match your current filter."
          />
        ) : (
          <Table>
            <Thead>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Phone</Th>
              <Th>Order Status</Th>
              <Th>Payment</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th />
            </Thead>
            <Tbody>
              {orders.map((item) => (
                <Tr key={item.id}>
                  <Td>
                    <span className="text-xs font-bold text-gray-900 font-mono">#{item.order_number}</span>
                  </Td>
                  <Td className="text-xs font-medium text-gray-700">
                    {item.address?.full_name || item.user?.name || "—"}
                  </Td>
                  <Td className="text-xs text-gray-500">{item.address?.phone || "—"}</Td>
                  <Td>
                    <Badge variant={statusVariant[item.order_status] || "gray"}>
                      {item.order_status}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 capitalize">{item.payment_method}</p>
                      <Badge variant={statusVariant[item.payment_status] || "gray"}>
                        {item.payment_status}
                      </Badge>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs font-bold text-emerald-600">
                      TZS {Number(item.total).toLocaleString()}
                    </span>
                  </Td>
                  <Td className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Td>
                  <Td>
                    <Button variant="outline" size="sm" onClick={() => openOrder(item.id)}>
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      {/* Order Detail Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedOrder(null); }}
        title={selectedOrder ? `Order #${selectedOrder.order_number}` : "Loading order..."}
        size="xl"
      >
        {detailsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : selectedOrder ? (
          <div className="space-y-6">
            {/* Customer info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 ring-1 ring-gray-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                {(selectedOrder.address?.full_name || selectedOrder.user?.name || "?")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedOrder.address?.full_name || selectedOrder.user?.name}
                </p>
                <p className="text-xs text-gray-400">{selectedOrder.address?.phone}</p>
              </div>
            </div>

            {/* Status controls */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Order Status</Label>
                <Select
                  value={selectedOrder.order_status}
                  onChange={(e) => handleOrderFieldChange("order_status", e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select
                  value={selectedOrder.payment_status}
                  onChange={(e) => handleOrderFieldChange("payment_status", e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </Select>
              </div>
              <div>
                <Label>Tracking Number</Label>
                <Input
                  type="text"
                  value={selectedOrder.tracking_number || ""}
                  onChange={(e) => handleOrderFieldChange("tracking_number", e.target.value)}
                  placeholder="Enter tracking #"
                />
              </div>
            </div>

            {/* Address + Summary */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 ring-1 ring-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Delivery Address</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800">{selectedOrder.address?.full_name}</p>
                  <p>{selectedOrder.address?.phone}</p>
                  <p>{selectedOrder.address?.street_address}</p>
                  <p>{selectedOrder.address?.city}, {selectedOrder.address?.region}</p>
                  {selectedOrder.address?.notes && (
                    <p className="text-xs text-gray-400 italic">Note: {selectedOrder.address.notes}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 ring-1 ring-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Payment Summary</p>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="capitalize font-medium text-gray-800">{selectedOrder.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>TZS {Number(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>TZS {Number(selectedOrder.delivery_fee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900">
                    <span>Total</span>
                    <span>TZS {Number(selectedOrder.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Ordered Items</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 ring-1 ring-gray-100">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.product?.thumbnail || item.product_image_url || item.product_image}
                        alt={item.product?.name || item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.product?.name || item.product_name}
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 shrink-0">
                      TZS {Number(item.subtotal).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setSelectedOrder(null); }}>
                Cancel
              </Button>
              <Button onClick={saveOrderUpdates} disabled={saving}>
                {saving && <Spinner size="sm" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default AdminOrders;
