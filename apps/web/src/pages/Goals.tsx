import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { usePublicUser } from "@/context/PublicUserContext";
import { GOAL_ICONS, formatCurrency } from "@/lib/finance";

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

type DraftGoal = {
  id?: string;
  name: string;
  target_amount: string;
  current_amount: string;
  deadline: string;
  icon: string;
};

const emptyDraft: DraftGoal = {
  name: "",
  target_amount: "",
  current_amount: "",
  deadline: "",
  icon: GOAL_ICONS[0],
};

export default function Goals() {
  const { bootstrap, saveGoal, deleteGoal, saving } = usePublicUser();
  const [showCreate, setShowCreate] = useState(false);
  const [draftGoal, setDraftGoal] = useState<DraftGoal>(emptyDraft);
  const goalSummary = useMemo(() => {
    const totalTarget = bootstrap.goals.reduce((sum, goal) => sum + Number(goal.target_amount || 0), 0);
    const totalSaved = bootstrap.goals.reduce((sum, goal) => sum + Number(goal.current_amount || 0), 0);
    const achieved = (bootstrap.goal_statuses ?? []).filter((goal) => goal.status === "achieved").length;
    const needsAttention = (bootstrap.goal_statuses ?? []).filter((goal) => goal.status === "off_track").length;

    return {
      totalTarget,
      totalSaved,
      achieved,
      needsAttention,
    };
  }, [bootstrap.goal_statuses, bootstrap.goals]);

  const openCreate = () => {
    setDraftGoal(emptyDraft);
    setShowCreate(true);
  };

  const openEdit = (goal: (typeof bootstrap.goals)[number]) => {
    setDraftGoal({
      id: goal.id,
      name: goal.name,
      target_amount: String(goal.target_amount),
      current_amount: String(goal.current_amount),
      deadline: goal.deadline,
      icon: goal.icon,
    });
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!draftGoal.name.trim() || !draftGoal.target_amount || !draftGoal.deadline) {
      toast.error("Add a name, target, and deadline for this goal.");
      return;
    }

    try {
      await saveGoal({
        id: draftGoal.id,
        name: draftGoal.name.trim(),
        target_amount: Number(draftGoal.target_amount || 0),
        current_amount: Number(draftGoal.current_amount || 0),
        deadline: draftGoal.deadline,
        icon: draftGoal.icon,
      });
      toast.success(draftGoal.id ? "Goal updated" : "Goal added");
      setDraftGoal(emptyDraft);
      setShowCreate(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save goal right now.",
      );
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      toast.success("Goal removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove goal right now.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-[980px] space-y-6 px-4 py-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[1.9rem] border border-border/80 bg-card/95 p-5 shadow-[0_24px_70px_-42px_rgba(110,73,75,0.24)] md:p-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Planning</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Goals</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Build goals around the progress you actually want to fund, then let eva keep the timeline, pace,
              and monthly pressure visible.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            New Goal
          </button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-border/70 bg-background/85 p-5 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Saved so far</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{formatCurrency(goalSummary.totalSaved)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Across every active goal in your workspace.</p>
        </div>
        <div className="rounded-[1.5rem] border border-border/70 bg-background/85 p-5 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Targeted capital</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{formatCurrency(goalSummary.totalTarget)}</p>
          <p className="mt-2 text-sm text-muted-foreground">The full amount your current goals are aiming to fund.</p>
        </div>
        <div className="rounded-[1.5rem] border border-border/70 bg-background/85 p-5 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Goal health</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">
            {goalSummary.achieved} funded
            <span className="text-base font-medium text-muted-foreground"> / {goalSummary.needsAttention} watch</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">A quick read on what is already secure and what needs attention.</p>
        </div>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-[1.75rem] border border-border/80 bg-card/95 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {draftGoal.id ? "Edit goal" : "Create new goal"}
            </h3>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={draftGoal.name}
              onChange={(event) =>
                setDraftGoal((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Goal name"
              className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <input
              value={draftGoal.target_amount}
              onChange={(event) =>
                setDraftGoal((current) => ({
                  ...current,
                  target_amount: event.target.value,
                }))
              }
              placeholder="Target amount ($)"
              type="number"
              className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <input
              value={draftGoal.current_amount}
              onChange={(event) =>
                setDraftGoal((current) => ({
                  ...current,
                  current_amount: event.target.value,
                }))
              }
              placeholder="Current saved ($)"
              type="number"
              className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <input
              value={draftGoal.deadline}
              onChange={(event) =>
                setDraftGoal((current) => ({
                  ...current,
                  deadline: event.target.value,
                }))
              }
              type="date"
              className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {GOAL_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setDraftGoal((current) => ({ ...current, icon }))}
                className={`rounded-xl border px-3 py-2 text-lg ${
                  draftGoal.icon === icon
                    ? "border-primary/30 bg-primary/8"
                    : "border-border bg-background"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            {saving ? "Saving..." : draftGoal.id ? "Save Changes" : "Create Goal"}
          </button>
        </motion.div>
      )}

      {bootstrap.goals.length === 0 ? (
        <div className="rounded-[1.9rem] border border-dashed border-border/80 bg-card/90 px-6 py-14 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">No goals yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first real goal and eva will start tracking funding progress instead of placeholders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(bootstrap.goal_statuses ?? []).map((goal, index) => {
            const progress = goal.progress_percent;
            const remaining = goal.remaining_amount;
            const monthlyContribution = goal.monthly_contribution_needed;

            return (
              <motion.div
                key={goal.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="space-y-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/15"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold">{goal.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(goal.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const sourceGoal = bootstrap.goals.find((item) => item.id === goal.id);
                        if (sourceGoal) {
                          openEdit(sourceGoal);
                        }
                      }}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      aria-label="Edit goal"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(goal.id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
                  <span>{formatCurrency(goal.current_amount)} saved</span>
                  <span>{formatCurrency(goal.target_amount)} target</span>
                </div>

                <Progress value={Math.max(0, Math.min(100, progress))} className="h-1.5 bg-secondary" />

                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary">{progress}% complete</span>
                  <span className="text-muted-foreground">
                    {goal.status !== "achieved"
                      ? `${formatCurrency(monthlyContribution)}/mo needed`
                      : "Goal funded"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {goal.status === "achieved"
                      ? "Achieved"
                      : goal.status === "on_track"
                        ? "On track"
                        : "Needs attention"}
                  </span>
                  <span>
                    {goal.days_remaining > 0
                      ? `${goal.days_remaining} day${goal.days_remaining === 1 ? "" : "s"} left`
                      : "Deadline reached"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
