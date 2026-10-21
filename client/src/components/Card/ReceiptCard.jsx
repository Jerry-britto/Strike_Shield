import { formatINR } from "../../utils/format.js";

export default function ReceiptCard({
  paymentId,
  orderDetails = [],
  discountApplied,
  deliveryCost,
  finalAmount,
}) {
  const list = Array.isArray(orderDetails) ? orderDetails : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
      <div className="bg-navy-900 p-6 text-white">
        <h2 className="font-display text-2xl tracking-wide">Payment Receipt</h2>
        <p className="mt-1 text-sm text-navy-300">
          Reference: <span className="font-mono">{paymentId || "—"}</span>
        </p>
      </div>

      <div className="p-6">
        <h3 className="mb-3 text-lg font-bold text-navy-900">Order Details</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-navy-50 text-left text-sm uppercase tracking-wider text-navy-500">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {list.map((item, i) => (
              <tr key={item?.productData?.id || i}>
                <td className="p-3 font-medium text-navy-900">
                  {item?.productData?.name || "Product"}
                </td>
                <td className="p-3 text-navy-600">
                  {formatINR(item?.productData?.price)}
                </td>
                <td className="p-3 text-center text-navy-600">
                  {item?.quantity ?? 0}
                </td>
                <td className="p-3 text-right font-semibold text-navy-900">
                  {formatINR((item?.productData?.price || 0) * (item?.quantity || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 space-y-2 border-t border-navy-100 pt-4 text-navy-700">
          <div className="flex justify-between">
            <span>GST Applied (3%)</span>
            <span>Included</span>
          </div>
          {discountApplied ? (
            <div className="flex justify-between text-green-600">
              <span>Bulk Discount</span>
              <span>10% off</span>
            </div>
          ) : null}
          {deliveryCost ? (
            <div className="flex justify-between">
              <span>Delivery Cost</span>
              <span>{formatINR(deliveryCost)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-navy-900">
            <span className="text-lg font-bold">Final Amount</span>
            <span className="text-2xl font-extrabold">
              {formatINR(finalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 p-4 text-center">
        <p className="text-sm font-semibold text-brand-800">
          Thank you for shopping with StrikeShield!
        </p>
      </div>
    </div>
  );
}
