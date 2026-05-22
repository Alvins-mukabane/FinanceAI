import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  DollarSign,
  Edit2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { usePublicUser } from "@/context/PublicUserContext";
import { BUDGET_LIMIT_CATEGORIES, formatCurrencyDetailed } from "@/lib/finance";
import { cn } from "@/lib/utils";

export default function Budget() {
  const { bootstrap, saveBudgetLimit, deleteBudgetLimit, saving } = usePublicUser();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState(BUDGET_LIMIT_CATEGORIES[0]);
  const [newLimit, setNewLimit] = useState("");
  const [editLimit, setEditLimit] = useState("");
  const budgetSummary = useMemo(() => {
    const totalLimit = bootstrap.budget_limits.reduce((sum, budget) => sum + Number(budget.monthly_limit || 0), 0);
    const totalSpent = (bootstrap.budget_statuses ?? []).reduce((sum, budget) => sum + Number(budget.spent_this_month || 0), 0);
    const watchCount = (bootstrap.budget_statuses ?? []).filter((budget) => budget.status === "watch").length;
    const overCount = (bootstrap.budget_statuses ?? []).filter((budget) => budget.status === "over").length;

    return {
      totalLimit,
      totalSpent,
      watchCount,
      overCount,
    };
  }, [bootstrap.budget_limits, bootstrap.budget_statuses]);

  const usedCategories = bootstrap.budget_limits.map((budget) => budget.category);
  const availableCategories = BUDGET_LIMIT_CATEGORIES.filter(
    (category) => !usedCategories.includes(category),
  );

  const addBudget = async () => {
    if (!newLimit) return;

    try {
      await saveBudgetLimit({
        category: newCategory,
        monthly_limit: Number(newLimit || 0),
      });
      toast.success("Budget limit added");
      setAdding(false);
      setNewLimit("");
      setNewCategory(availableCategories[0] ?? BUDGET_LIMIT_CATEGORIES[0]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to add budget right now.",
      );
    }
  };

  const updateBudget = async (id: string) => {
    if (!editLimit) return;

    try {
      const existingBudget = bootstrap.budget_limits.find((budget) => budget.id === id);
      await saveBudgetLimit({
        id,
        category: existingBudget?.category,
        monthly_limit: Number(editLimit || 0),
      });
      toast.success("Budget updated");
      setEditingId(null);
      setEditLimit("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update budget right now.",
      );
    }
  };

  const removeBudget = async (id: string) => {
    try {
      await deleteBudgetLimit(id);
      toast.success("Budget removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove budget right now.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8">
      <div className="rounded-[1.9rem] border border-border/80 bg-card/95 p-5 shadow-[0_24px_70px_-42px_rgba(110,73,75,0.24)] md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Cashflow guardrails</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Budget Limits</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Set monthly limits per category using your real data, then watch where your current pace is calm,
              close to the line, or already over.
            </p>
          </div>
          {!adding && availableCategories.length > 0 && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add limit
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-border/70 bg-background/85 p-5 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Monthly limit</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{formatCurrencyDetailed(budgetSummary.totalLimit)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Combined limit across every tracked category.</p>
        </div>
        <div className="rounded-[1.5rem] border border-border/70 bg-background/85 p-5 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Spent this month</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{formatCurrencyDetailed(budgetSummary.totalSpent)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Current actual spend recorded against those categories.</p>
        </div>
        <div className="rounded-[1.5rem] border border-border/70 bg-background/85 p-5 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Watch zones</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">
            {budgetSummary.watchCount} near
            <span className="text-base font-medium text-muted-foreground"> / {budgetSummary.overCount} over</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">How many categories are currently close to or past their limit.</p>
        </div>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 rounded-[1.75rem] border border-border/80 bg-card/95 p-4 shadow-sm"
          >
            <select
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm"
            >
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monthly limit ($)"
              value={newLimit}
              onChange={(event) => setNewLimit(event.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addBudget}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setNewLimit("");
                }}
                className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {bootstrap.budget_limits.length === 0 ? (
        <div className="space-y-3 rounded-[1.9rem] border border-dashed border-border/80 bg-card/90 py-16 text-center shadow-sm">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No budget limits set yet</p>
          <p className="text-xs text-muted-foreground/70">
            Add a category budget to start tracking against real spending.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bootstrap.budget_limits.map((budget) => {
            const status =
              (bootstrap.budget_statuses ?? []).find((item) => item.category === budget.category) ??
              null;
            const spent = status?.spent_this_month ?? 0;
            const percentage = Math.min(status?.percent_used ?? 0, 100);
            const isOver = status?.status === "over";
            const isNear = status?.status === "watch";

            return (
              <motion.div
                key={budget.id}
                layout
                className={cn(
                  "rounded-xl border bg-card p-4",
                  isOver
                    ? "border-destructive/40"
                    : isNear
                      ? "border-yellow-500/40"
                      : "border-border",
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {budget.category}
                    </span>
                    {isOver && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                    {isNear && <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-1">
                    {editingId === budget.id ? (
                      <>
                        <input
                          type="number"
                          value={editLimit}
                          onChange={(event) => setEditLimit(event.target.value)}
                          className="w-20 rounded border border-border bg-secondary/50 px-2 py-1 text-xs"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => updateBudget(budget.id)}
                          className="p-1 text-primary"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 text-muted-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(budget.id);
                            setEditLimit(String(budget.monthly_limit));
                          }}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBudget(budget.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatCurrencyDetailed(spent)} spent</span>
                  <span>{formatCurrencyDetailed(budget.monthly_limit)} limit</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      isOver
                        ? "bg-destructive"
                        : isNear
                          ? "bg-yellow-500"
                          : "bg-primary",
                    )}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{Math.round(percentage)}% used</span>
                  <span>
                    {formatCurrencyDetailed(
                      status?.remaining_amount ?? Math.max(budget.monthly_limit - spent, 0),
                    )}{" "}
                    left
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {saving && (
        <p className="text-center text-xs text-muted-foreground">Saving changes...</p>
      )}
    </div>
  );
}
