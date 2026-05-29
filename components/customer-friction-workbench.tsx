"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { InsightPanel } from "@/components/ui/insight-panel";
import { MetricCard } from "@/components/ui/metric-card";
import {
  ScenarioField,
  SelectInput,
  TextAreaInput
} from "@/components/ui/scenario-input";
import {
  baseFeedbackItems,
  classifyFeedback,
  type FeedbackItem
} from "@/lib/depositiq/prototype";

export function CustomerFrictionWorkbench() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(baseFeedbackItems);
  const [themeFilter, setThemeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [journeyFilter, setJourneyFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [draftFeedback, setDraftFeedback] = useState("");

  const filteredFeedback = feedbackItems.filter((item) => {
    if (themeFilter !== "All" && item.theme !== themeFilter) return false;
    if (severityFilter !== "All" && item.severity !== severityFilter) return false;
    if (channelFilter !== "All" && item.channel !== channelFilter) return false;
    if (journeyFilter !== "All" && item.journeyStage !== journeyFilter) return false;
    if (ownerFilter !== "All" && item.owner !== ownerFilter) return false;
    return true;
  });

  const themeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of filteredFeedback) {
      counts.set(item.theme, (counts.get(item.theme) ?? 0) + 1);
    }
    return Array.from(counts.entries());
  }, [filteredFeedback]);

  function addFeedback() {
    if (!draftFeedback.trim()) {
      return;
    }

    const classified = classifyFeedback(draftFeedback);
    setFeedbackItems((current) => [
      {
        id: `F-${current.length + 1}`,
        comment: draftFeedback.trim(),
        ...classified
      },
      ...current
    ]);
    setDraftFeedback("");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Feedback items"
          value={String(filteredFeedback.length)}
          hint="Filtered synthetic feedback items"
        />
        <MetricCard
          label="Severity-weighted score"
          value={String(filteredFeedback.reduce((sum, item) => sum + item.severityWeight, 0))}
        />
        <MetricCard label="Themes" value={String(themeCounts.length)} />
        <MetricCard
          label="Highest severity"
          value={filteredFeedback.some((item) => item.severity === "High") ? "High" : "Medium"}
        />
        <MetricCard label="Likely owners" value={String(new Set(filteredFeedback.map((item) => item.owner)).size)} />
      </section>

      <FilterBar>
        <SelectInput value={themeFilter} onChange={(event) => setThemeFilter(event.target.value)}>
          <option>All</option>
          {[...new Set(feedbackItems.map((item) => item.theme))].map((theme) => (
            <option key={theme}>{theme}</option>
          ))}
        </SelectInput>
        <SelectInput value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </SelectInput>
        <SelectInput value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)}>
          <option>All</option>
          <option>App review</option>
          <option>Call centre</option>
          <option>Complaint</option>
          <option>Survey</option>
        </SelectInput>
        <SelectInput value={journeyFilter} onChange={(event) => setJourneyFilter(event.target.value)}>
          <option>All</option>
          <option>Onboarding</option>
          <option>Everyday use</option>
          <option>Servicing</option>
          <option>Maturity</option>
        </SelectInput>
        <SelectInput value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
          <option>All</option>
          <option>Deposits</option>
          <option>Payments</option>
          <option>Operations</option>
          <option>Digital servicing</option>
        </SelectInput>
      </FilterBar>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          columns={[
            {
              key: "comment",
              label: "Feedback",
              render: (row: FeedbackItem) => (
                <div>
                  <p className="font-medium text-slate-900">{row.comment}</p>
                  <p className="text-slate-500">{row.recommendedAction}</p>
                </div>
              )
            },
            {
              key: "theme",
              label: "Theme",
              render: (row: FeedbackItem) => row.theme
            },
            {
              key: "severity",
              label: "Severity",
              render: (row: FeedbackItem) => (
                <Badge
                  tone={
                    row.severity === "High"
                      ? "danger"
                      : row.severity === "Medium"
                        ? "warning"
                        : "success"
                  }
                >
                  {row.severity}
                </Badge>
              )
            },
            {
              key: "journey",
              label: "Journey stage",
              render: (row: FeedbackItem) => row.journeyStage
            },
            {
              key: "owner",
              label: "Likely owner",
              render: (row: FeedbackItem) => row.owner
            },
            {
              key: "metric",
              label: "Metric to track",
              render: (row: FeedbackItem) => row.metricToTrack
            }
          ]}
          rows={filteredFeedback}
        />

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Theme cards</p>
            <div className="mt-5 grid gap-3">
              {themeCounts.map(([theme, count]) => (
                <div key={theme} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{theme}</p>
                    <Badge tone="info">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Add feedback</p>
            <ScenarioField label="Synthetic feedback comment">
              <TextAreaInput
                rows={5}
                value={draftFeedback}
                onChange={(event) => setDraftFeedback(event.target.value)}
                placeholder="Paste a synthetic feedback comment"
              />
            </ScenarioField>
            <div className="mt-4">
              <Button onClick={addFeedback}>Add feedback</Button>
            </div>
          </section>

          <InsightPanel title="Deterministic classification">
            Feedback is classified without external AI. Keywords such as PayID, dispute,
            rate, bonus, term deposit, maturity, wallet and notification map directly to
            fixed themes and default owners.
          </InsightPanel>
        </div>
      </section>
    </div>
  );
}
