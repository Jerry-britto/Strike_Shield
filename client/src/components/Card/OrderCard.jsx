import { formatINR } from "../../utils/format.js";

export default function OrderCard({ items }) {
  const list = Array.isArray(items) ? items : [items];

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-navy-900 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              Qty
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {list.map((item) => (
            <tr key={item.id} className="transition hover:bg-navy-50">
              <td className="px-6 py-4">
                <span className="font-semibold text-navy-900">
                  {item.pname || "Product"}
                </span>
              </td>
              <td className="px-6 py-4 text-navy-600">×{item.quantity || 0}</td>
              <td className="px-6 py-4 text-right font-semibold text-navy-900">
                {formatINR((item.price || 0) * (item.quantity || 0))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
