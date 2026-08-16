import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./page/HomePage";
import ShopPage from "./page/ShopPage";
import MahsulodlariPage from "./page/MahsulodlariPage";
import SavatPage from "./page/SavatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/mahsulodlari" element={<MahsulodlariPage />} />
        <Route path="/savat" element={<SavatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;