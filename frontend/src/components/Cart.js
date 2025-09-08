import { useState, useEffect } from "react";
import "./Cart.css";

const Cart = ({ onBack, onCheckout, onViewOrders }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      } else if (response.status === 404) {
        // Create cart if it doesn't exist
        await createCart();
      } else {
        setError("Failed to load cart");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const createCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (err) {
      setError("Failed to create cart");
    }
  };

  const updateQuantity = async (albumId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(albumId, 999);
      return;
    }

    try {
      const currentItem = cart.items.find((item) => item.album._id === albumId);
      const quantityDiff = newQuantity - currentItem.quantity;

      if (quantityDiff > 0) {
        await addToCart(albumId, quantityDiff);
      } else {
        await removeFromCart(albumId, Math.abs(quantityDiff));
      }
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const addToCart = async (albumId, quantity) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ albumId, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (err) {
      setError("Failed to add to cart");
    }
  };

  const removeFromCart = async (albumId, quantity) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ albumId, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (err) {
      setError("Failed to remove from cart");
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items
      .reduce((total, item) => {
        return total + item.album.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button onClick={onBack} className="back-button">
          <span className="back-button-icon">←</span>
          Back to Home
        </button>
        <h1 className="cart-title">Shopping Cart</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-content">
        {!cart || cart.items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some albums to get started!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.album._id} className="cart-item">
                  <div className="item-image">
                    <img
                      src="/placeholder.svg"
                      alt={item.album.title}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  <div className="item-details">
                    <h3 className="item-title">{item.album.title}</h3>
                    <p className="item-artist">
                      {item.album.artist?.name || "Unknown Artist"}
                    </p>
                    <p className="item-price">${item.album.price}</p>
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(item.album._id, item.quantity - 1)
                      }
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.album._id, item.quantity + 1)
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.album.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.album._id, 999)}
                    className="remove-btn"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>

              <div className="cart-actions">
                <button
                  onClick={onCheckout}
                  className="checkout-btn"
                  disabled={cart.items.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}

        {/* Previous Orders Button - always visible when logged in */}
        {onViewOrders && (
          <div className="order-history-section">
            <button onClick={onViewOrders} className="view-orders-btn">
              <svg className="orders-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14,2 14,8 20,8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="13"
                  x2="8"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="10,9 9,9 8,9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
