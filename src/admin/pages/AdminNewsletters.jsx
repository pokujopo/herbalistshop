import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

function AdminNewsletters() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await adminApi.get("/admin/newsletters");
      setItems(res.data.data?.data || []);
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-xl font-bold mb-5">Newsletter Subscribers</h2>
      {items.length === 0 ? <p className="text-gray-500">Hakuna subscribers.</p> : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border rounded-xl p-4">
              <p className="font-medium text-gray-800">{item.email}</p>
              <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminNewsletters;
