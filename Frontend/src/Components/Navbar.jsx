import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthState, useLogout } from "../Hook/useAuth";
import { useCartState } from "../Hook/useCart";

const Navbar = () => {
  const { user, isAuthenticated, isSeller, loading } = useAuthState();
  const { logout } = useLogout();
  const { totalProducts } = useCartState();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b border-lavender-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-lavender-700">Snitch</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-lavender-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-lavender-700">
              Snitch
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-lavender-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-lavender-600 font-medium transition-colors">
              Products
            </Link>
            {isAuthenticated && isSeller && (
              <Link to="/add-product" className="text-gray-700 hover:text-lavender-600 font-medium transition-colors">
                Add Product
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-lavender-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalProducts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lavender-600 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalProducts > 99 ? "99+" : totalProducts}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-lavender-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                    <span className="text-lavender-700 font-medium text-sm">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium hidden sm:block">{user?.name}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      {isSeller && <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-lavender-100 text-lavender-700 rounded-full">Seller</span>}
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-lavender-50">Profile</Link>
                    {isSeller && <Link to="/add-product" className="block px-4 py-2 text-sm text-gray-700 hover:bg-lavender-50">Add Product</Link>}
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-lavender-50">My Orders</Link>
                    <div className="border-t border-gray-100"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-lavender-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-lavender-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 bg-lavender-600 text-black font-medium rounded-lg hover:bg-lavender-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-lavender-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="px-2 py-2 text-gray-700 hover:text-lavender-600 font-medium">Home</Link>
              <Link to="/products" className="px-2 py-2 text-gray-700 hover:text-lavender-600 font-medium">Products</Link>
              {isAuthenticated && isSeller && (
                <Link to="/add-product" className="px-2 py-2 text-gray-700 hover:text-lavender-600 font-medium">Add Product</Link>
              )}
              {isAuthenticated && (
                <>
                  <Link to="/cart" className="px-2 py-2 text-gray-700 hover:text-lavender-600 font-medium">Cart ({totalProducts})</Link>
                  <Link to="/profile" className="px-2 py-2 text-gray-700 hover:text-lavender-600 font-medium">Profile</Link>
                  <button onClick={handleLogout} className="px-2 py-2 text-left text-red-600 hover:text-red-700 font-medium">Logout</button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="px-2 py-2 text-gray-700 hover:text-lavender-600 font-medium">Sign In</Link>
                  <Link to="/register" className="px-2 py-2 text-center bg-lavender-600 text-black font-medium rounded-lg">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;