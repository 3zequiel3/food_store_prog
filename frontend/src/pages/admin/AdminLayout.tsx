import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/layout/Sidebar";

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
