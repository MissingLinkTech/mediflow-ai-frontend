"use client";

import { Crown, Mail, ShieldOff, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { getInitials } from "@/lib/utils";
import { useAdminUsers } from "../hooks/use-admin-users";
import "../styles/admin.scss";

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function AdminUsersView() {
  const [page, setPage] = useState(1);
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, error, isError } = useAdminUsers({ page, limit: 25 });

  if (!currentUser) {
    return (
      <div className="admin-users">
        <Skeleton className="admin-users__header" />
      </div>
    );
  }

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="admin-users">
      <header className="admin-users__header">
        <span className="admin-users__kicker">ADMINISTRATION</span>
        <h1>
          <UsersIcon size={26} aria-hidden="true" /> Member directory
        </h1>
        <p>Every MediFlow account, newest first.</p>
      </header>

      {!isAdmin ? (
        <Alert tone="info">
          <ShieldOff size={14} aria-hidden="true" /> Member directory is restricted to
          administrators.
        </Alert>
      ) : isError ? (
        <Alert>{error instanceof Error ? error.message : "Unable to load users."}</Alert>
      ) : isLoading || !data ? (
        <div className="admin-users__skeleton">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="admin-users__row" />
          ))}
        </div>
      ) : (
        <>
          <div className="admin-users__meta">
            <span>
              Showing {(data.meta.page - 1) * data.meta.limit + 1}–
              {Math.min(data.meta.page * data.meta.limit, data.meta.totalItems)} of{" "}
              {data.meta.totalItems}
            </span>
          </div>
          <div className="admin-users__list">
            {data.items.map((member) => (
              <article key={member.id} className="admin-users__card">
                <div className="admin-users__avatar">{getInitials(member.name, member.email)}</div>
                <div className="admin-users__info">
                  <div className="admin-users__line">
                    <h2>{member.name?.trim() || member.email.split("@")[0]}</h2>
                    <span className={`admin-users__role admin-users__role--${member.role}`}>
                      {member.role === "admin" ? (
                        <>
                          <Crown size={12} aria-hidden="true" /> Admin
                        </>
                      ) : (
                        "Member"
                      )}
                    </span>
                  </div>
                  <p className="admin-users__email">
                    <Mail size={13} aria-hidden="true" /> {member.email}
                  </p>
                  <p className="admin-users__meta-line">
                    Joined {formatDate(member.createdAt)} • Last updated{" "}
                    {formatDate(member.updatedAt)}
                  </p>
                </div>
                <span
                  className={`admin-users__status ${
                    member.isActive ? "admin-users__status--active" : "admin-users__status--off"
                  }`}
                >
                  <i />
                  {member.isActive ? "Active" : "Suspended"}
                </span>
              </article>
            ))}
          </div>

          <div className="admin-users__pager">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!data.meta.hasPreviousPage}
            >
              Previous
            </button>
            <span>
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!data.meta.hasNextPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
