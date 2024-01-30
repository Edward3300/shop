import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Product from './product/Product'
import Products from './product/Products'
import Cart from './product/Cart'
import Profile from './profile/Profile'
import MainMenu from './MainMenu'

const RoutesMainMenu = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/products" element={<div><MainMenu /><Products /></div>} />
        <Route path="/product/:id" element={<div><MainMenu /><Product /></div>} />
        <Route path="/cart" element={<div><MainMenu /><Cart /></div>} />
        <Route path="/profile" element={<div><MainMenu /><Profile /></div>} />
        {/* <Route path="/profile/edit" element={<EditProfile />} /> */}
      </Routes>
    </Router>
  );
};

export default RoutesMainMenu;
