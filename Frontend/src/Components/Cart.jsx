import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useCartState, useIncreaseQuantity, useDecreaseQuantity, useRemoveFromCart, useFetchCart } from "../Hook/useCart";
import { useAuthState } from "../Hook/useAuth";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthState();
  const { cart, loading, error, totalProducts, totalPrice, fetchCart } = useCartState();
  const { increaseQuantity, loading: incLoading } = useIncreaseQuantity();
  const { decreaseQuantity, loading: decLoading } = useDecreaseQuantity();
  const { removeFromCart, loading: remLoading } = useRemoveFromCart();
  const { fetchCart: doFetchCart } = useFetchCart();

  useEffect(() => {
    if (isAuthenticated) {
      doFetchCart();
    }
  }, [isAuthenticated, doFetchCart]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-lavender-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-lavender-200 border-t-lavender-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-lavender-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <svg className="mx-auto h-16 w-16 text-lavender-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-lavender-600 text-white font-medium rounded-lg hover:bg-lavender-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleIncrease = async (productId, size) => {
    await increaseQuantity(cart, productId, size);
  };

  const handleDecrease = async (productId, size) => {
    await decreaseQuantity(cart, productId, size);
  };

  const handleRemove = async (productId, size) => {
    if (window.confirm("Remove this item from your cart?")) {
      await removeFromCart(productId, size);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lavender-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-lavender-200 border-t-lavender-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-lavender-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <svg className="mx-auto h-16 w-16 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Error Loading Cart</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={doFetchCart} className="px-6 py-3 bg-lavender-600 text-white font-medium rounded-lg hover:bg-lavender-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const cartItems = cart?.products || [];
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-lavender-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          {totalProducts > 0 && (
            <span className="text-lavender-600 font-medium">{totalProducts} item{totalProducts !== 1 ? "s" : ""}</span>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-lavender-100">
            <svg className="mx-auto h-24 w-24 text-lavender-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any products yet.</p>
            <Link to="/products" className="inline-block px-8 py-3 bg-lavender-600 text-white font-medium rounded-lg hover:bg-lavender-700 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-lavender-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-lavender-50 border-b border-lavender-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cartItems.map((item) => {
                        const product = item.product;
                        const price = product?.price?.[0]?.amount || 0;
                        const currency = product?.price?.[0]?.currency || "INR";
                        const itemTotal = price * item.quantity;
                        const imageUrl = product?.images?.[0] || "https://via.placeholder.com/100";
                        
                        return (
                          <tr key={`${product._id}-${item.size}`} className="hover:bg-lavender-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={imageUrl}
                                  alt={product?.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="ml-4">
                                  <h3 className="text-sm font-medium text-gray-900">{product?.title}</h3>
                                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                                  <p className="text-sm text-gray-500">{product?.price?.[0]?.currency === "INR" ? "₹" : "$"}{price}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {formatPrice(price, currency)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden" style={{ width: "120px" }}>
                                <button
                                  onClick={() => handleDecrease(product._id, item.size)}
                                  disabled={decLoading || incLoading}
                                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition-colors disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="px-4 py-1.5 text-center font-medium text-gray-900 border-x border-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncrease(product._id, item.size)}
                                  disabled={decLoading || incLoading}
                                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition-colors disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(itemTotal, currency)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => handleRemove(product._id, item.size)}
                                disabled={remLoading}
                                className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors disabled:opacity-50"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Continue Shopping */}
                <div className="px-6 py-4 border-t border-lavender-100">
                  <Link to="/products" className="text-lavender-600 hover:text-lavender-700 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-lavender-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalProducts} items)</span>
                    <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-medium text-gray-900">{formatPrice(totalPrice * 0.18)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-lavender-700">{formatPrice(totalPrice * 1.18)}</span>
                  </div>
                </div>

                <button
                  className="w-full py-3 bg-lavender-600 text-white font-medium rounded-lg hover:bg-lavender-700 transition-colors"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Secure checkout powered by Snitch
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;