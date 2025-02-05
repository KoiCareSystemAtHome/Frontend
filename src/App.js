import "./App.css";
import AdminLayout from "./Layout/AdminLayout/AdminLayout";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/register";
import ShopLayout from "./Layout/ShopLayout/ShopLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/shop/*" element={<ShopLayout />} />
    </Routes>
  );
}

export default App;
