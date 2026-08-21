import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NAMYWebsite from './NAMYWebsite';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NAMYWebsite />} />

      </Routes>
    </BrowserRouter>
  );
}