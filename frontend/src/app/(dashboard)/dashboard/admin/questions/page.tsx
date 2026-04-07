// app/(dashboard)/dashboard/admin/questions/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
    QuestionMarkCircleIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    TagIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
    getQuestions,
    adminCreateQuestion,
    adminUpdateQuestion,
    adminDeleteQuestion,
} from "@/lib/api";
import toast from "react-hot-toast";

interface Question {
    _id: string;
    title: string;
    description?: string;
    category: string;
    difficulty: string;
    answer?: string;
    tags: string[];
    createdAt: string;
}

interface QuestionForm {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    answer: string;
    tags: string;
}

const CATEGORIES = ["Technical", "Behavioral", "HR", "System Design", "DSA"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const difficultyStyle: Record<string, string> = {
    Easy: "text-[#6EE7B7] bg-[#6EE7B7]/10 border-[#6EE7B7]/20",
    Medium: "text-[#FFA07A] bg-[#FFA07A]/10 border-[#FFA07A]/20",
    Hard: "text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/20",
};

const categoryStyle: Record<string, string> = {
    Technical: "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/20",
    Behavioral: "text-[#6EE7B7] bg-[#6EE7B7]/10 border-[#6EE7B7]/20",
    HR: "text-[#FFA07A] bg-[#FFA07A]/10 border-[#FFA07A]/20",
    "System Design": "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/20",
    DSA: "text-[#f472b6] bg-[#f472b6]/10 border-[#f472b6]/20",
};

const emptyForm: QuestionForm = {
    title: "",
    description: "",
    category: "Technical",
    difficulty: "Medium",
    answer: "",
    tags: "",
};

const ITEMS_PER_PAGE = 10;

// Get serial number with padding (01, 02, 03...)
const getSerialNumber = (index: number) => {
    return String(index + 1).padStart(2, '0');
};

export default function AdminQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filtered, setFiltered] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [diffFilter, setDiffFilter] = useState("all");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = ITEMS_PER_PAGE;

    // Modal state
    const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
    const [selected, setSelected] = useState<Question | null>(null);
    const [form, setForm] = useState<QuestionForm>(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await getQuestions({ limit: 500 });
            const data: Question[] = res.data?.questions ?? [];
            setQuestions(data);
            setFiltered(data);
        } catch (err: any) {
            toast.error("Failed to load questions");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    // Apply filters
    useEffect(() => {
        let result = questions;
        if (catFilter !== "all") result = result.filter((q) => q.category === catFilter);
        if (diffFilter !== "all") result = result.filter((q) => q.difficulty === diffFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((item) => item.title.toLowerCase().includes(q));
        }
        setFiltered(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [questions, search, catFilter, diffFilter]);

    const openCreate = () => {
        setForm(emptyForm);
        setSelected(null);
        setModal("create");
    };

    const openEdit = (q: Question) => {
        setSelected(q);
        setForm({
            title: q.title,
            description: q.description ?? "",
            category: q.category,
            difficulty: q.difficulty,
            answer: q.answer ?? "",
            tags: q.tags?.join(", ") ?? "",
        });
        setModal("edit");
    };

    const openDelete = (q: Question) => {
        setSelected(q);
        setModal("delete");
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
        setForm(emptyForm);
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }
        setSubmitting(true);
        const payload = {
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            category: form.category,
            difficulty: form.difficulty,
            answer: form.answer.trim() || undefined,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        };
        try {
            if (modal === "create") {
                const res = await adminCreateQuestion(payload);
                const newQ: Question = res.data?.question;
                setQuestions((prev) => [newQ, ...prev]);
                toast.success("Question created");
            } else if (modal === "edit" && selected) {
                const res = await adminUpdateQuestion(selected._id, payload);
                const updated: Question = res.data?.question;
                setQuestions((prev) =>
                    prev.map((q) => (q._id === selected._id ? updated : q))
                );
                toast.success("Question updated");
            }
            closeModal();
        } catch (err: any) {
            toast.error(err.message ?? "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setSubmitting(true);
        try {
            await adminDeleteQuestion(selected._id);
            setQuestions((prev) => prev.filter((q) => q._id !== selected._id));
            toast.success("Question deleted");
            closeModal();
        } catch (err: any) {
            toast.error(err.message ?? "Failed to delete");
        } finally {
            setSubmitting(false);
        }
    };

    const updateForm = (field: keyof QuestionForm, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    // Pagination calculations
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentQuestions = filtered.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#6EE7B7]/10 border border-[#6EE7B7]/20">
                        <QuestionMarkCircleIcon className="h-6 w-6 text-[#6EE7B7]" />
                    </div>
                    <div>
                        <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2]">
                            Manage Questions
                        </h1>
                        <p className="text-[#9aabb8] text-sm mt-0.5">
                            {loading ? "Loading…" : `${filtered.length} question${filtered.length !== 1 ? "s" : ""} found`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-colors"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Question
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aabb8]" />
                    <input
                        type="text"
                        placeholder="Search by title…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#9aabb8]/50 text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                    />
                </div>
                <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-sm text-[#9aabb8] focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <select
                    value={diffFilter}
                    onChange={(e) => setDiffFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-sm text-[#9aabb8] focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                >
                    <option value="all">All Difficulties</option>
                    {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[#2a3a4a] bg-[#1B2838] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2a3a4a] bg-[#0D1B2A]/50">
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    #
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider">
                                    Difficulty
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-mono font-semibold text-[#9aabb8] uppercase tracking-wider hidden md:table-cell">
                                    Tags
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
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-5 py-4">
                                                <div className="h-4 bg-[#2a3a4a] rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : currentQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-14 text-center">
                                        <QuestionMarkCircleIcon className="h-10 w-10 text-[#2a3a4a] mx-auto mb-3" />
                                        <p className="text-[#9aabb8] text-sm">No questions found</p>
                                        <button
                                            onClick={openCreate}
                                            className="mt-3 text-[#FF6B6B] text-sm hover:underline"
                                        >
                                            + Add your first question
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                currentQuestions.map((q, index) => (
                                    <tr key={q._id} className="hover:bg-white/[0.02] transition-colors">
                                        {/* Serial Number - 01, 02, 03... */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-[#6EE7B7] font-mono font-bold">
                                                {getSerialNumber(startIndex + index)}
                                            </span>
                                        </td>
                                        {/* Title */}
                                        <td className="px-5 py-4 max-w-xs">
                                            <p className="text-sm text-[#FFF5F2] font-medium truncate">
                                                {q.title}
                                            </p>
                                            {q.description && (
                                                <p className="text-xs text-[#9aabb8] truncate mt-0.5">
                                                    {q.description}
                                                </p>
                                            )}
                                        </td>
                                        {/* Category */}
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${categoryStyle[q.category] ?? "text-[#9aabb8] bg-white/5 border-[#2a3a4a]"}`}>
                                                {q.category}
                                            </span>
                                        </td>
                                        {/* Difficulty */}
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${difficultyStyle[q.difficulty] ?? ""}`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        {/* Tags */}
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {q.tags?.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-white/5 text-[#9aabb8] border border-[#2a3a4a]"
                                                    >
                                                        <TagIcon className="h-2.5 w-2.5" />
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(q.tags?.length ?? 0) > 3 && (
                                                    <span className="text-xs text-[#9aabb8]">
                                                        +{q.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(q)}
                                                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#9aabb8] hover:text-[#6EE7B7] transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDelete(q)}
                                                    className="p-1.5 rounded-lg hover:bg-[#FF6B6B]/10 text-[#9aabb8] hover:text-[#FF6B6B] transition-colors"
                                                    title="Delete"
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

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                    <div className="text-sm text-[#9aabb8]">
                        Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} questions
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                                            currentPage === pageNum
                                                ? "bg-[#FF6B6B] text-[#0D1B2A]"
                                                : "border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Create / Edit Modal */}
            {(modal === "create" || modal === "edit") && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <div className="relative z-10 w-full max-w-lg rounded-2xl bg-[#1B2838] border border-[#2a3a4a] shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a3a4a]">
                            <h2 className="font-heading font-bold text-[#FFF5F2]">
                                {modal === "create" ? "Add New Question" : "Edit Question"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-lg text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-mono font-semibold text-[#9aabb8] mb-1.5 uppercase tracking-wider">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => updateForm("title", e.target.value)}
                                    placeholder="e.g. Explain the event loop in JavaScript"
                                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#9aabb8]/40 text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-mono font-semibold text-[#9aabb8] mb-1.5 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => updateForm("description", e.target.value)}
                                    placeholder="More context about this question…"
                                    rows={3}
                                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#9aabb8]/40 text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors resize-none"
                                />
                            </div>

                            {/* Category + Difficulty */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono font-semibold text-[#9aabb8] mb-1.5 uppercase tracking-wider">
                                        Category *
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => updateForm("category", e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono font-semibold text-[#9aabb8] mb-1.5 uppercase tracking-wider">
                                        Difficulty *
                                    </label>
                                    <select
                                        value={form.difficulty}
                                        onChange={(e) => updateForm("difficulty", e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                                    >
                                        {DIFFICULTIES.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Answer */}
                            <div>
                                <label className="block text-xs font-mono font-semibold text-[#9aabb8] mb-1.5 uppercase tracking-wider">
                                    Model Answer
                                </label>
                                <textarea
                                    value={form.answer}
                                    onChange={(e) => updateForm("answer", e.target.value)}
                                    placeholder="Ideal answer or key points…"
                                    rows={4}
                                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#9aabb8]/40 text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors resize-none"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-mono font-semibold text-[#9aabb8] mb-1.5 uppercase tracking-wider">
                                    Tags{" "}
                                    <span className="normal-case font-normal text-[#9aabb8]/60">
                                        (comma-separated)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={form.tags}
                                    onChange={(e) => updateForm("tags", e.target.value)}
                                    placeholder="e.g. javascript, async, promises"
                                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#9aabb8]/40 text-sm focus:outline-none focus:border-[#FF6B6B]/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-[#2a3a4a] flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 rounded-xl border border-[#2a3a4a] text-[#9aabb8] text-sm hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] text-sm font-bold hover:bg-[#FFA07A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {submitting && (
                                    <div className="h-4 w-4 rounded-full border-2 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
                                )}
                                {modal === "create" ? "Create Question" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {modal === "delete" && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#1B2838] border border-[#2a3a4a] p-6 shadow-2xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-1 rounded-lg text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                        <div className="mb-5">
                            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center mb-3">
                                <TrashIcon className="h-5 w-5 text-[#FF6B6B]" />
                            </div>
                            <h3 className="font-heading font-bold text-[#FFF5F2] text-lg">
                                Delete Question
                            </h3>
                            <p className="text-[#9aabb8] text-sm mt-1">
                                Are you sure you want to delete{" "}
                                <span className="text-[#FFF5F2] font-medium">
                                    &quot;{selected.title}&quot;
                                </span>
                                ? This cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 rounded-xl border border-[#2a3a4a] text-[#9aabb8] text-sm hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] text-sm font-bold hover:bg-[#FFA07A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {submitting && (
                                    <div className="h-4 w-4 rounded-full border-2 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}