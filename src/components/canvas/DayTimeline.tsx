"use client";

import React, { useState } from "react";
import { DayEvent } from "@/lib/contracts/day";
import { EventBlock } from "./EventBlock";
import { EventEditor } from "./EventEditor";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

export interface DayTimelineProps {
  events: DayEvent[];
  onAddEvent: (event: DayEvent) => void;
  onUpdateEvent: (id: string, updates: Partial<DayEvent>) => void;
  onDeleteEvent: (id: string) => void;
  className?: string;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  className = "",
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DayEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = [...events]
    .filter((e) =>
      searchQuery
        ? e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <div className={`day-timeline ${className}`}>
      {/* Timeline Controls Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          marginBottom: "var(--space-4)",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Day Timeline
          </h3>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--muted)",
            }}
          >
            {events.length} activities scheduled
          </span>
        </div>

        <Button
          id="add-activity-btn"
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(true)}
          style={{ minHeight: "44px", minWidth: "130px" }}
        >
          + Add Activity
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ marginBottom: "var(--space-4)" }}>
        <input
          id="activity-search-input"
          type="search"
          placeholder="Filter activities by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Filter activities"
          style={{
            width: "100%",
            minHeight: "44px",
            padding: "0 var(--space-3)",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-sm)",
            color: "var(--ink)",
            fontSize: "0.875rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Modal Dialog for Adding */}
      <Dialog
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="Add Scheduled Activity"
      >
        <EventEditor
          initialEvent={null}
          onSave={(newEvent) => {
            onAddEvent(newEvent);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      </Dialog>

      {/* Modal Dialog for Editing */}
      <Dialog
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Activity"
      >
        {editingEvent && (
          <EventEditor
            initialEvent={editingEvent}
            onSave={(updated) => {
              onUpdateEvent(updated.id, updated);
              setEditingEvent(null);
            }}
            onCancel={() => setEditingEvent(null)}
          />
        )}
      </Dialog>

      {/* List of Events */}
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {filteredEvents.map((ev) => (
          <EventBlock
            key={ev.id}
            event={ev}
            onEdit={(e) => setEditingEvent(e)}
            onDelete={onDeleteEvent}
          />
        ))}

        {filteredEvents.length === 0 && (
          <div
            style={{
              padding: "var(--space-6)",
              textAlign: "center",
              backgroundColor: "var(--surface)",
              border: "1px dashed var(--hairline-strong)",
              borderRadius: "var(--radius-sm)",
              color: "var(--muted)",
            }}
          >
            {searchQuery
              ? `No activities match "${searchQuery}".`
              : "No activities scheduled for this day yet. Click \"+ Add Activity\" to map your day."}
          </div>
        )}
      </div>
    </div>
  );
};