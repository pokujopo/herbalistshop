import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import {
  Card, Badge, Button, Input, Select, Spinner,
  Table, Thead, Th, Tbody, Tr, Td,
  PageHeader, EmptyState, Modal, Label, toast,
} from "../components/ui";

const roleVariant = { admin: "purple", user: "gray" };
const statusVariant = { true: "success", false: "danger" };

function AvatarCircle({ name, size = "md" }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const colors = [
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-full ${color} flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

function SkeletonRows({ rows = 8 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <Tr key={i}>
      <Td>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-28 animate-pulse" />
            <div className="h-2.5 bg-gray-100 rounded w-36 animate-pulse" />
          </div>
        </div>
      </Td>
      {[...Array(4)].map((_, j) => (
        <Td key={j}><div className="h-3 bg-gray-100 rounded animate-pulse" /></Td>
      ))}
    </Tr>
  ));
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (role !== "all") params.set("role", role);
      if (status !== "all") params.set("status", status);
      const res = await adminApi.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openUser = async (id) => {
    try {
      setModalOpen(true);
      const res = await adminApi.get(`/admin/users/${id}`);
      setSelectedUser(res.data.user);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load user");
      setModalOpen(false);
    }
  };

  const saveUser = async () => {
    try {
      setSaving(true);
      const res = await adminApi.put(`/admin/users/${selectedUser.id}`, {
        role: selectedUser.role,
        is_active: selectedUser.is_active,
      });
      setSelectedUser(res.data.user);
      fetchUsers();
      toast.success("User updated successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <PageHeader title="Customers" subtitle={`${users.length} users total`} />
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <Input placeholder="Search name or email..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <Select value={role} onChange={(e) => setRole(e.target.value)} className="sm:w-36">
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Blocked</option>
          </Select>
          <Button onClick={fetchUsers}>Search</Button>
        </div>
      </Card>

      <Card className="p-5">
        {loading ? (
          <Table>
            <Thead>
              <Th>User</Th><Th>Orders</Th><Th>Role</Th><Th>Status</Th><Th />
            </Thead>
            <Tbody><SkeletonRows /></Tbody>
          </Table>
        ) : users.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8z" />
              </svg>
            }
            title="No users found"
            description="No customers match your current filter."
          />
        ) : (
          <Table>
            <Thead>
              <Th>User</Th>
              <Th>Orders</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th />
            </Thead>
            <Tbody>
              {users.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <AvatarCircle name={u.name} size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{u.name}</p>
                        <p className="text-[10px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                      {u.orders_count}
                    </span>
                  </Td>
                  <Td>
                    <Badge variant={roleVariant[u.role] || "gray"}>{u.role}</Badge>
                  </Td>
                  <Td>
                    <Badge variant={u.is_active ? "success" : "danger"}>
                      {u.is_active ? "Active" : "Blocked"}
                    </Badge>
                  </Td>
                  <Td>
                    <Button variant="outline" size="sm" onClick={() => openUser(u.id)}>
                      Manage
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      {/* User Detail Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedUser(null); }}
        title={selectedUser ? `Manage ${selectedUser.name}` : "Loading..."}
        size="lg"
      >
        {!selectedUser ? (
          <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        ) : (
          <div className="space-y-6">
            {/* Profile header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl ring-1 ring-gray-100">
              <AvatarCircle name={selectedUser.name} />
              <div>
                <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Joined {new Date(selectedUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Edit fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
              <div>
                <Label>Account Status</Label>
                <Select
                  value={selectedUser.is_active ? "active" : "inactive"}
                  onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.value === "active" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Blocked</option>
                </Select>
              </div>
            </div>

            {/* Orders */}
            <div>
              <Label>Order History ({selectedUser.orders?.length || 0})</Label>
              {!selectedUser.orders?.length ? (
                <p className="text-sm text-gray-400 py-3">No orders placed yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedUser.orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 ring-1 ring-gray-100">
                      <span className="text-xs font-mono font-semibold text-gray-700">#{o.order_number}</span>
                      <Badge variant={statusVariant[o.order_status] || "gray"}>{o.order_status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setModalOpen(false); setSelectedUser(null); }}>
                Cancel
              </Button>
              <Button onClick={saveUser} disabled={saving}>
                {saving && <Spinner size="sm" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminUsers;
