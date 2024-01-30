import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login'
import Registration from './components/Registration'
import Product from './components/product/Product'
import Products from './components/product/Products'
import Cart from './components/product/Cart'
import RoutesMainMenu from './components/RoutesMainMenu'

const RoutesApp = () => {
  return (
    <div>
      <RoutesMainMenu />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </Router>
    </div>
  );
};

export default RoutesApp;
