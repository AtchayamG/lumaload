"use client";

import React, { useState } from "react";
import { DayEvent } from "@/lib/contracts/day";
import { EventBlock } from "./EventBlock";
import { EventEditor } from "./EventEditor";
import { Button } from "@/components/ui/Button";

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

  const sortedEvents = [...events].sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <div className={`day-timeline ${className}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
            {sortedEvents.length} activities scheduled
          </span>
        </div>

        {!isAdding && !editingEvent && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
            style={{ minHeight: "44px" }}
          >
            + Add Activity
          </Button>
        )}
      </div>

      {/* Editor when Adding */}
      {isAdding && (
        <EventEditor
          initialEvent={null}
          onSave={(newEvent) => {
            onAddEvent(newEvent);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {/* Editor when Editing */}
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

      {/* List of Events */}
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {sortedEvents.map((ev) => (
          <EventBlock
            key={ev.id}
            event={ev}
            onEdit={(e) => setEditingEvent(e)}
            onDelete={onDeleteEvent}
          />
        ))}

        {sortedEvents.length === 0 && (
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
            No events scheduled for this day yet. Click &quot;+ Add Activity&quot; or pick a demo profile.
          </div>
        )}
      </div>
    </div>
  );
};