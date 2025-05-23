import { StrictMode } from 'react'
import React, { createContext, useState } from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "./App.css"
import App from './App.jsx'
import CheckoutPage from './pages/Cart/CheckoutPage.jsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AccuracyCard from './pages/Uploads/AccuracyCard.jsx'
import UploadImagesComponent from './pages/Uploads/UploadImagesComponent.jsx'
import AuthModal from './pages/Auth/AuthModal.jsx'
import Home from './pages/HomePage.jsx'
import Navbar from './components/Navbars.jsx'
import Footer from './components/Footer.jsx'
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from "./context/WishlistContext.jsx";
import ProductPage from './pages/ProductPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx';
import PatentApplicationForm from "./components/PatentApplication.jsx";
import ThankYouPage from './pages/ThankYouPage.jsx';




import { ProductProvider } from './context/ProductContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProductProvider>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accuracycard" element={<AccuracyCard />} />
            <Route path="/cart" element={<CheckoutPage />} />
            <Route path="/accuracy" element={<UploadImagesComponent />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/apply-patent" element={<PatentApplicationForm />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
          <Footer />
        </CartProvider>
      </WishlistProvider>
      </ProductProvider>
    </BrowserRouter>
  </StrictMode>,
);

