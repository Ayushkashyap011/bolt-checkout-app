import React, { useEffect, useState } from 'react';
import { Database, ShoppingBag, ShieldCheck, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { apiService } from '../services/apiClient';
import type { Order } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await apiService.getAllOrders();
      setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Database className="w-6 h-6 text-bolt-400" />
              <span>Recorded Checkout Orders</span>
            </h1>
            <Badge variant="bolt">{orders.length} Records</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Live database table records stored in PostgreSQL (<code className="text-bolt-300">checkout_orders</code>).
          </p>
        </div>

        <Button onClick={fetchOrders} variant="outline" size="sm" isLoading={isLoading}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Refresh DB</span>
        </Button>
      </div>

      {orders.length === 0 && !isLoading ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Orders Submitted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Place an order on the 1-Click Checkout page to see it recorded live in this database table!
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#121936] text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order Reference</th>
                  <th className="py-3.5 px-4">Customer Email</th>
                  <th className="py-3.5 px-4">Shopper Type</th>
                  <th className="py-3.5 px-4">Shipping Address</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-bolt-300">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-100">
                      {order.email}
                      <p className="text-[10px] text-slate-400">{order.phone_number}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {order.is_guest ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <UserX className="w-3 h-3" /> Guest Checkout
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3" /> 1-Click Verified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {order.shipping_address}, {order.city}, {order.state} {order.zip_code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      ${order.total_amount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
