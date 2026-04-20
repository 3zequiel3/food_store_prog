import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientLayout } from "./pages/client/ClientLayout";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { CategoriasPage } from "./pages/admin/CategoriasPage";
import { ProductosPage } from "./pages/admin/ProductosPage";
import { ProductoDetallePage } from "./pages/admin/ProductoDetallePage";
import { IngredientesPage } from "./pages/admin/IngredientesPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="categorias" replace />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="productos/:id" element={<ProductoDetallePage />} />
          <Route path="ingredientes" element={<IngredientesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
