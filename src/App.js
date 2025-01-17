import "./App.css";
import AdminLayout from "./Layout/AdminLayout/AdminLayout";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  );
}

export default App;
