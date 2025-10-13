/**
 * Cart Component
 * 
 * Displays and manages the user's shopping cart with full CRUD operations.
 * Handles cart item management, checkout process, and order navigation.
 * 
 * Features:
 * - Display cart items with album details and cover images
 * - Quantity adjustment (increase/decrease) for each item
 * - Remove items from cart functionality
 * - Cart total calculation and display
 * - Checkout process to convert cart to order
 * - Navigation to order history
 * - Empty cart state handling
 * - Real-time cart updates with backend synchronization
 * 
 * @param {Function} onBack - Handler to return to previous view
 * @param {Function} onCheckout - Handler for successful checkout
 * @param {Function} onViewOrders - Handler to navigate to order history
 */

import { useState, useEffect } from "react";
import placeholderImage from "../placeholder.svg";


const Cart = ({ onBack, onCheckout, onViewOrders }) => {
  // Cart state management
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * Fetches the user's cart from the backend
   * Creates a new cart if one doesn't exist
   */
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
        // Create cart if it doesn't exist (backward compatibility)
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
      const currentItem = cart.items.find((item) => item.album.id === albumId);
      if (!currentItem) {
        setError("Item not found in cart");
        return;
      }

      const quantityDiff = newQuantity - currentItem.quantity;

      if (quantityDiff > 0) {
        await addToCart(albumId, quantityDiff);
      } else if (quantityDiff < 0) {
        await removeFromCart(albumId, Math.abs(quantityDiff));
      }
      // If quantityDiff === 0, no change needed
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
        console.log("Add to cart response:", data);
        if (data.cart) {
          setCart(data.cart);
        } else {
          console.warn("No cart data in response, refetching...");
          await fetchCart();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
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
      <div className="bg-[#020204] text-[#c1c1c1] min-h-screen p-8">
        <div className="border-4 border-[#333] border-t-[#1db954] rounded-full w-[50px] h-[50px] animate-spin mx-auto my-8"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#020204] text-[#c1c1c1] min-h-screen p-8">
      <div className="flex items-center justify-start gap-8 mb-8 min-h-[60px]">
        <button 
          onClick={onBack} 
          className="bg-transparent border-2 border-[#1db954] text-[#1db954] py-3 px-6 rounded-full cursor-pointer transition-all duration-300 font-semibold uppercase tracking-[0.5px] flex items-center gap-2 whitespace-nowrap flex-shrink-0 h-12 hover:bg-[#1db954] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(29,185,84,0.3)]"
        >
          <span className="text-xl">←</span>
          Back to Home
        </button>
        <h1 className="text-4xl font-bold text-white m-0 leading-tight flex items-center">Shopping Cart</h1>
      </div>

      {error && <div className="bg-[#ff6b6b] text-white p-4 rounded-[10px] mb-4 text-center">{error}</div>}

      <div className="grid grid-cols-[1fr_300px] gap-8 max-w-[1200px] max-md:grid-cols-1">
        {!cart || cart.items.length === 0 ? (
          <div className="col-span-full text-center p-16 bg-[#1a1a1a] rounded-[15px] border-[1px] border-[#333]">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-white mb-2">Your cart is empty</h2>
            <p>Add some albums to get started!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <div key={item.album.id} className="bg-[#1a1a1a] border-[1px] border-[#333] rounded-[15px] p-6 grid grid-cols-[80px_1fr_auto_auto_auto] gap-4 items-center transition-all duration-300 hover:border-[#1db954] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] max-md:grid-cols-[60px_1fr_auto] max-md:gap-2">
                  <div className="w-20 h-20 rounded-[10px] overflow-hidden bg-[#333] max-md:w-[60px] max-md:h-[60px]">
                    <img
                      className="w-full h-full object-cover"
                      src={placeholderImage}
                      alt={item.album.title}
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold m-0">{item.album.title}</h3>
                    <p className="text-[#c1c1c1] m-0 text-sm">
                      {item.album.artist?.name || "Unknown Artist"}
                    </p>
                    <p className="text-[#1db954] font-bold m-0">${item.album.price}</p>
                  </div>

                  <div className="flex items-center gap-2 max-md:col-start-2 max-md:justify-start max-md:mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.album.id, item.quantity - 1)
                      }
                      className="bg-[#333] border-[1px] border-[#555] text-white w-[30px] h-[30px] rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-[#1db954] hover:border-[#1db954]"
                    >
                      -
                    </button>
                    <span className="text-white font-bold min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.album.id, item.quantity + 1)
                      }
                      className="bg-[#333] border-[1px] border-[#555] text-white w-[30px] h-[30px] rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-[#1db954] hover:border-[#1db954]"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-white font-bold text-lg max-md:col-start-2 max-md:justify-self-end max-md:mt-2">
                    ${(item.album.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.album.id, 999)}
                    className="bg-transparent border-[1px] border-[#ff6b6b] text-[#ff6b6b] w-10 h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-[#ff6b6b] hover:text-white max-md:row-start-1 max-md:col-start-3"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1a1a] border-[1px] border-[#333] rounded-[15px] p-6 h-fit sticky top-8">
              <div className="flex justify-between mb-4 pb-2">
                <span>Total Items:</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="flex justify-between border-t-[1px] border-[#333] pt-4 text-xl font-bold text-white">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-[#1db954] to-[#1ed760] border-none text-white py-4 px-4 rounded-full cursor-pointer font-bold text-lg uppercase tracking-[0.5px] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(29,185,84,0.3)] disabled:bg-[#555] disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-8 pt-8 border-t-[1px] border-[#333]">
            <button 
              onClick={onViewOrders} 
              className="w-full max-w-[400px] mx-auto bg-transparent border-2 border-[#b3b3b3] text-[#b3b3b3] py-3 px-4 rounded-full cursor-pointer font-semibold text-sm uppercase tracking-[0.5px] transition-all duration-300 flex items-center justify-center gap-2 hover:border-white hover:text-white hover:-translate-y-0.5"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
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
