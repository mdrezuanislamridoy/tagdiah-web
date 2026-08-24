import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import { QuickViewProvider } from './components/QuickViewProvider';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Wishlist } from './pages/Wishlist';
import { Account } from './pages/Account';
import { OrderDetails } from './pages/OrderDetails';
import { SearchResults } from './pages/SearchResults';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { ShippingReturns } from './pages/ShippingReturns';
import { Auth } from './pages/Auth';
import { AdminLogin } from './pages/AdminLogin';

/* Admin imports */
import { AdminGuard } from './components/auth/AdminGuard';
import { ToastProvider } from './admin/components/ui/Toast';
import { AdminLayout } from './admin/components/layout/AdminLayout';
import { Dashboard } from './admin/pages/Dashboard';
import { Products } from './admin/pages/Products';
import { ProductForm } from './admin/pages/ProductForm';
import { Categories } from './admin/pages/Categories';
import { Orders } from './admin/pages/Orders';
import { OrderDetail } from './admin/pages/OrderDetail';
import { Customers } from './admin/pages/Customers';
import { CustomerDetail } from './admin/pages/CustomerDetail';
import { UserManagement } from './admin/pages/UserManagement';
import { Reviews } from './admin/pages/Reviews';
import { Coupons } from './admin/pages/Coupons';
import { Banners } from './admin/pages/Banners';
import { Inventory } from './admin/pages/Inventory';
import { Analytics } from './admin/pages/Analytics';
import { Settings } from './admin/pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <QuickViewProvider>
            <Routes>
              {/* Standalone auth pages — no header/footer */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Portal */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <ToastProvider>
                      <AdminLayout />
                    </ToastProvider>
                  </AdminGuard>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductForm mode="create" />} />
                <Route path="products/:id/edit" element={<ProductForm mode="edit" />} />
                <Route path="categories" element={<Categories />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="user-management" element={<Navigate to="/admin/users" replace />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="banners" element={<Banners />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              {/* Storefront Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmed" element={<OrderConfirmation />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/account" element={<Account />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping-returns" element={<ShippingReturns />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </QuickViewProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}