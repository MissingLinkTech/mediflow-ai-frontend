"use client";
import Link from "next/link";
import { Bell, LoaderCircle, LogOut, Menu, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Brand } from "@/components/shared/brand";
import { NavIcon } from "@/components/shared/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { navigationForRole } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth/components/auth-provider";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUiStore } from "@/store/ui-store";

function initials(name: string | null, email: string) {
  return (name?.trim() || email)
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
function ShellSkeleton() {
  return (
    <main className="shell-loading" aria-label="Restoring your session">
      <div className="shell-loading__side">
        <Skeleton className="skeleton--logo" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="skeleton--nav" />
        ))}
      </div>
      <div className="shell-loading__main">
        <Skeleton className="skeleton--title" />
        <div className="skeleton-grid">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </main>
  );
}

function Sidebar({ userName, role }: { userName: string; role: "user" | "admin" }) {
  const pathname = usePathname();
  const open = useUiStore((state) => state.mobileNavigationOpen);
  const setOpen = useUiStore((state) => state.setMobileNavigationOpen);
  return (
    <>
      <button
        className={`nav-backdrop ${open ? "is-open" : ""}`}
        aria-label="Close navigation"
        onClick={() => setOpen(false)}
      />
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar__brand">
          <Brand />
        </div>
        <nav className="sidebar__nav" aria-label="Application navigation">
          <p>WORKSPACE</p>
          {navigationForRole(role).map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={pathname === item.href ? "is-active" : ""}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ) : (
              <button key={item.label} disabled title="Coming in a future release">
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
                <small>Soon</small>
              </button>
            ),
          )}
        </nav>
        <div className="sidebar__help">
          <span>
            <Sparkles size={16} />
          </span>
          <b>MediFlow guide</b>
          <p>AI features are being prepared with care.</p>
        </div>
        <p className="sidebar__foot">Signed in as {userName}</p>
      </aside>
    </>
  );
}
function AppHeader({ name, email }: { name: string | null; email: string }) {
  const router = useRouter();
  const logout = useLogout();
  const setOpen = useUiStore((state) => state.setMobileNavigationOpen);
  return (
    <header className="app-header">
      <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open navigation">
        <Menu size={19} />
      </button>
      <div>
        <p>Good to see you{name ? `, ${name.split(" ")[0]}` : ""}</p>
        <small>Your health workspace</small>
      </div>
      <div className="app-header__right">
        <ThemeToggle />
        <button className="icon-button" aria-label="Notifications" disabled>
          <Bell size={16} />
        </button>
        <div className="user-menu">
          <span className="avatar">{initials(name, email)}</span>
          <div>
            <b>{name || "MediFlow member"}</b>
            <small>{email}</small>
          </div>
          <button
            onClick={() =>
              logout.mutate(undefined, { onSettled: () => router.replace(ROUTES.login) })
            }
            disabled={logout.isPending}
          >
            {logout.isPending ? (
              <LoaderCircle className="animate-spin" size={14} />
            ) : (
              <>
                <LogOut size={13} /> Sign out
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  useEffect(() => {
    if (status === "unauthenticated")
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.app)}`);
  }, [router, status]);
  if (status !== "authenticated" || !user) return <ShellSkeleton />;
  const displayName = user.settings.displayName || user.name || user.email;
  return (
    <div className="app-shell">
      <Sidebar userName={displayName} role={user.role} />
      <div className="app-shell__body">
        <AppHeader name={user.settings.displayName || user.name} email={user.email} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
