import { useState, useEffect } from "react";
import "./OrderHistory.css";

const OrderHistory = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderHistory();
  }, []);

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

  const calculateOrderTotal = (items) => {
    return items
      .reduce((total, item) => total + item.album.price * item.quantity, 0)
      .toFixed(2);
  };

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="order-history">
      <div className="order-history-container">
        <div className="order-history-header">
          <button className="back-button" onClick={onBack}>
            <svg className="back-icon" viewBox="0 0 24 24" fill="none">
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
          <h1 className="order-history-title">Order History</h1>
          <p className="order-history-subtitle">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchOrderHistory} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>When you place your first order, it will appear here.</p>
            <button onClick={onBack} className="start-shopping-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">{formatDate(order.order_date)}</p>
                  </div>
                  <div className="order-summary">
                    <div className="order-total">
                      ${calculateOrderTotal(order.items)}
                    </div>
                    <div className="order-items-count">
                      {getTotalItems(order.items)} items
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.album._id} className="order-item">
                      <div className="item-details">
                        <h4 className="item-title">{item.album.title}</h4>
                        <p className="item-artist">
                          by {item.album.artist?.name || "Unknown Artist"}
                        </p>
                      </div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                      <div className="item-price">
                        ${(item.album.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-status">
                  <span className="status-badge completed">Completed</span>
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
