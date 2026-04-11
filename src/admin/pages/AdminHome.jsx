import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import { Card, Badge, SkeletonTable } from "../components/ui";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const kpiConfig = [
  {
    key: "orders",
    label: "Total Orders",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: "text-blue-600",
    bg: "bg-blue-50",
    format: (v) => Number(v).toLocaleString(),
  },
  {
    key: "products",
    label: "Products",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 17m8 4V10" />
      </svg>
    ),
    color: "text-purple-600",
    bg: "bg-purple-50",
    format: (v) => Number(v).toLocaleString(),
  },
  {
    key: "customers",
    label: "Customers",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8z" />
      </svg>
    ),
    color: "text-amber-600",
    bg: "bg-amber-50",
    format: (v) => Number(v).toLocaleString(),
  },
  {
    key: "revenue",
    label: "Total Revenue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    format: (v) => `TZS ${Number(v).toLocaleString()}`,
  },
  {
    key: "today_orders",
    label: "Today's Orders",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    format: (v) => Number(v).toLocaleString(),
  },
  {
    key: "today_revenue",
    label: "Today's Revenue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    color: "text-rose-600",
    bg: "bg-rose-50",
    format: (v) => `TZS ${Number(v).toLocaleString()}`,
  },
];

const orderStatusVariant = {
  pending: "warning",
  processing: "purple",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16"];

function KpiCard({ cfg, value }) {
  return (
    <Card className="p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`p-2.5 rounded-xl ${cfg.bg} ${cfg.color} shrink-0`}>
        {cfg.icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{cfg.label}</p>
        <p className="text-xl font-bold text-gray-900 mt-1 truncate">{cfg.format(value)}</p>
      </div>
    </Card>
  );
}

function PeriodButton({ label, value, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      type="button"
    >
      {label}
    </button>
  );
}

function currencyFormat(value) {
  return `TZS ${Number(value || 0).toLocaleString()}`;
}

function AdminHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get("/admin/dashboard/analytics", {
          params: { period },
        });
        setData(res.data);
      } catch (error) {
        console.log(error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-100 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
          <SkeletonTable rows={4} cols={4} />
        </Card>
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-400 text-sm">Failed to load dashboard.</p>;
  }

  const {
    stats,
    recent_orders = [],
    low_stock_products = [],
    sales_trend = [],
    category_sales = [],
  } = data;

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiConfig.map((cfg) => (
          <KpiCard key={cfg.key} cfg={cfg} value={stats[cfg.key] ?? 0} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="p-5 xl:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Sales Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Mauzo kwa day, week, month au year
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <PeriodButton label="Daily" value="daily" active={period === "daily"} onClick={setPeriod} />
              <PeriodButton label="Weekly" value="weekly" active={period === "weekly"} onClick={setPeriod} />
              <PeriodButton label="Monthly" value="monthly" active={period === "monthly"} onClick={setPeriod} />
              <PeriodButton label="Yearly" value="yearly" active={period === "yearly"} onClick={setPeriod} />
            </div>
          </div>

          <div className="h-[320px]">
            {sales_trend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No sales data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sales_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => `${Number(value).toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => [currencyFormat(value), "Sales"]}
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900">Top Selling Categories</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Category zilizouza zaidi kwa asilimia na idadi
            </p>
          </div>

          <div className="h-[320px]">
            {category_sales.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No category sales data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={category_sales}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {category_sales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${Number(value).toLocaleString()} sold`,
                      props.payload.name,
                    ]}
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {category_sales.length > 0 && (
            <div className="mt-4 space-y-2">
              {category_sales.slice(0, 5).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-gray-700 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="text-gray-500 shrink-0">
                    {item.total} sold
                    {item.percentage ? ` • ${item.percentage}%` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-emerald-600 font-semibold hover:underline">
              View all →
            </a>
          </div>

          {recent_orders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No recent orders.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recent_orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">#{order.order_number}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {order.address?.full_name || order.user?.name || "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={orderStatusVariant[order.order_status] || "gray"}>
                      {order.order_status}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-600">
                      TZS {Number(order.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Low Stock */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Low Stock Alert</h2>
            <span className="text-xs bg-red-50 text-red-600 font-semibold px-2.5 py-1 rounded-full ring-1 ring-red-100">
              {low_stock_products.length} items
            </span>
          </div>

          {low_stock_products.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">All products well stocked. ✓</p>
            </div>
          ) : (
            <div className="space-y-2">
              {low_stock_products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-100">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.category?.name || "—"}</p>
                  </div>

                  <span className="text-xs font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-full ring-1 ring-red-100 shrink-0">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminHome;