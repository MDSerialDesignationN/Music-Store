import { useState, useEffect } from "react";

/**
 * OrderHistory Component - Displays user's order history
 * 
 * Features:
 * - Fetches and displays all user orders with details
 * - Shows order dates, items, quantities, and totals
 * - Handles empty order history state
 * - Provides back navigation to main view
 * - Includes loading states and error handling
 * 
 * @param {function} onBack - Callback function to navigate back to main view
 */
const OrderHistory = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  /**
   * Fetches the user's order history from the backend
   * Handles different response scenarios including empty history
   */
  const fetchOrderHistory = async () => {
    try {
      const response = await fetch("/api/order/history", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else if (response.status === 404) {
        setOrders([]);
      } else {
        setError("Failed to load order history");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats order date for display
   * @param {string} dateString - ISO date string from database
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Calculates total price for an order
   * @param {Array} items - Array of order items with album and quantity
   * @returns {string} Formatted total price
   */
  const calculateOrderTotal = (items) => {
    return items
      .reduce((total, item) => total + item.album.price * item.quantity, 0)
      .toFixed(2);
  };

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="px-6 pb-8 min-h-screen max-md:px-4 max-md:pb-4" style={{background: 'linear-gradient(180deg, rgba(18, 18, 18, 0.6) 0%, #121212 100%)'}}>
      <div>
        <div className="py-8 flex flex-col gap-2">
          <button 
            className="bg-transparent border-none text-[#b3b3b3] text-sm font-semibold cursor-pointer flex items-center gap-2 py-2 px-0 transition-colors duration-200 self-start uppercase tracking-wider hover:text-white" 
            onClick={onBack}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Cart
          </button>
          <h1 className="text-white text-5xl font-black m-0 tracking-tight leading-none max-md:text-4xl max-sm:text-3xl">Order History</h1>
          <p className="text-[#b3b3b3] text-base font-normal mt-2 mb-0">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="w-[60px] h-[60px] border-[3px] border-[#333] border-t-[#1db954] rounded-full animate-spin"></div>
            <p className="text-[#b3b3b3] text-lg font-normal animate-pulse">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 p-12 text-center">
            <p className="text-[#ff6b6b] text-lg m-0">{error}</p>
            <button 
              onClick={fetchOrderHistory} 
              className="bg-transparent border-2 border-[#1db954] text-[#1db954] py-3 px-6 rounded-[25px] cursor-pointer transition-all duration-300 font-semibold hover:bg-[#1db954] hover:text-black"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-white text-2xl font-bold m-0 mb-2">No orders yet</h2>
            <p className="text-[#b3b3b3] text-base m-0 mb-8">When you place your first order, it will appear here.</p>
            <button 
              onClick={onBack} 
              className="bg-[#1db954] text-black border-none py-3 px-8 rounded-[25px] text-base font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide hover:bg-[#1ed760] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(29,185,84,0.3)]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#181818] rounded-xl p-6 border-[1px] border-[#282828] transition-all duration-300 hover:bg-[#1f1f1f] hover:border-[#404040]">
                <div className="flex justify-between items-start mb-4 pb-4 border-b-[1px] border-[#282828] max-md:flex-col max-md:gap-4 max-md:items-start">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-xl font-bold m-0">Order #{order.id}</h3>
                    <p className="text-[#b3b3b3] text-sm m-0">{formatDate(order.order_date)}</p>
                  </div>
                  <div className="text-right flex flex-col gap-1 max-md:text-left">
                    <div className="text-[#1db954] text-2xl font-bold">
                      ${calculateOrderTotal(order.items)}
                    </div>
                    <div className="text-[#b3b3b3] text-sm">
                      {getTotalItems(order.items)} items
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.album.id} className="flex justify-between items-center py-3 px-3 bg-[#121212] rounded-lg border-[1px] border-[#282828] max-md:flex-col max-md:items-start max-md:gap-2">
                      <div className="flex-1">
                        <h4 className="text-white text-base font-semibold m-0 mb-1">{item.album.title}</h4>
                        <p className="text-[#b3b3b3] text-sm m-0">
                          by {item.album.artist?.name || "Unknown Artist"}
                        </p>
                      </div>
                      <div className="text-[#b3b3b3] text-sm mx-4 min-w-[60px] text-center max-md:text-left max-md:min-w-auto">Qty: {item.quantity}</div>
                      <div className="text-white text-base font-semibold min-w-[80px] text-right max-md:text-left max-md:min-w-auto">
                        ${(item.album.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <span className="py-2 px-4 rounded-[20px] text-sm font-semibold uppercase tracking-wide bg-[rgba(29,185,84,0.2)] text-[#1db954] border-[1px] border-[#1db954]">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
