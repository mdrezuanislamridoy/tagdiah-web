import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

export function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <QuickViewProvider>
          <Routes>
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
    </BrowserRouter>);

}