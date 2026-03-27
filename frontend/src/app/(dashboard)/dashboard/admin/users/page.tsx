// app/(dashboard)/dashboard/admin/users/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
    UsersIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAdminUsers, deleteAdminUser, updateAdminUserRole } from "@/lib/api";
import toast from "react-hot-toast";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await getAdminUsers();
            const data: User[] = res.data?.users ?? [];
            setUsers(data);
            setFiltered(data);
        } catch (err: any) {
            toast.error(err.message ?? "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        let result = users;
        if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [users, search, roleFilter]);

    const handleRoleToggle = async (user: User) => {
        const newRole = user.role === "admin" ? "user" : "admin";
        setActionLoading(`role-${user._id}`);
        try {
            await updateAdminUserRole(user._id, newRole);
            setUsers((prev) =>
                prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
            );
            toast.success(`${user.name} is now ${newRole}`);
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update role");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setActionLoading(`delete-${deleteTarget._id}`);
        try {
            await deleteAdminUser(deleteTarget._id);
            setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
            toast.success("User deleted");
            setDeleteTarget(null);
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete user");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20">
                    <UsersIcon className="h-6 w-6 text-[#FF6B6B]" />
                </div>
                <div>
                    <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2]">
                        Manage Users
                    </h1>
                    <p className="text-[#9aabb8] text-sm mt-0.5">
                        {loading ? "Loading…" : `${users.length} registered user${users.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aabb8]" />
                    <input
                        type="text"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#9aabb8]/50 text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {(["all", "user", "admin"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${roleFilter === r
                                    ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30"
                                    : "text-[#9aabb8] border-[#2a3a4a] hover:bg-white/5"
                                }`}
                        >
                            {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[#2a3a4a] bg-[#1B2838] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2a3a4a] bg-[#0D1B2A]/50">
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    User
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="text-right px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a3a4a]">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} className="px-5 py-4">
                                                <div className="h-4 bg-[#2a3a4a] rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-[#9aabb8] text-sm">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[#FF6B6B] text-xs font-mono font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-[#FFF5F2] font-medium">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#9aabb8] font-mono">
                                            {user.email}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full border font-mono ${user.role === "admin"
                                                        ? "text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/20"
                                                        : "text-[#9aabb8] bg-white/5 border-[#2a3a4a]"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#9aabb8] font-mono">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRoleToggle(user)}
                                                    disabled={actionLoading === `role-${user._id}`}
                                                    title={user.role === "admin" ? "Demote to user" : "Promote to admin"}
                                                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#9aabb8] hover:text-[#a78bfa] transition-colors disabled:opacity-40"
                                                >
                                                    {actionLoading === `role-${user._id}` ? (
                                                        <div className="h-4 w-4 rounded-full border-2 border-[#a78bfa]/30 border-t-[#a78bfa] animate-spin" />
                                                    ) : user.role === "admin" ? (
                                                        <ShieldExclamationIcon className="h-4 w-4" />
                                                    ) : (
                                                        <ShieldCheckIcon className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(user)}
                                                    disabled={!!actionLoading}
                                                    title="Delete user"
                                                    className="p-1.5 rounded-lg hover:bg-[#FF6B6B]/10 text-[#9aabb8] hover:text-[#FF6B6B] transition-colors disabled:opacity-40"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setDeleteTarget(null)}
                    />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#1B2838] border border-[#2a3a4a] p-6 shadow-2xl">
                        <button
                            onClick={() => setDeleteTarget(null)}
                            className="absolute top-4 right-4 p-1 rounded-lg text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                        <div className="mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center mb-3">
                                <TrashIcon className="h-5 w-5 text-[#FF6B6B]" />
                            </div>
                            <h3 className="font-heading font-bold text-[#FFF5F2] text-lg">
                                Delete User
                            </h3>
                            <p className="text-[#9aabb8] text-sm mt-1">
                                Are you sure you want to delete{" "}
                                <span className="text-[#FFF5F2] font-medium">{deleteTarget.name}</span>?{" "}
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-2.5 rounded-xl border border-[#2a3a4a] text-[#9aabb8] text-sm hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={actionLoading === `delete-${deleteTarget._id}`}
                                className="flex-1 py-2.5 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] text-sm font-bold hover:bg-[#FFA07A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {actionLoading === `delete-${deleteTarget._id}` ? (
                                    <div className="h-4 w-4 rounded-full border-2 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
                                ) : null}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
