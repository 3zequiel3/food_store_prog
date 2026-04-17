import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin/categorias", label: "Categorías", icon: "📂" },
  { to: "/admin/productos", label: "Productos", icon: "🍔" },
  { to: "/admin/ingredientes", label: "Ingredientes", icon: "🧂" },
];

export function Sidebar() {
  return (
    <aside
      className="
        w-60 min-h-screen
        bg-[var(--color-card)]
        border-r border-[var(--color-border)]
        flex flex-col
      "
    >
      <div className="px-5 py-5 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-bold text-[var(--color-primary-700)] tracking-tight">
          🍽 Food Store
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] font-semibold">
          Panel Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] shadow-sm border border-[var(--color-border-accent)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-primary-50)]/50"
                }
              `
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-[var(--color-border)]">
        <NavLink
          to="/"
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary-600)] transition-colors"
        >
          ← Volver al sitio
        </NavLink>
      </div>
    </aside>
  );
}
