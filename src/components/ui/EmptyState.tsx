"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden>{icon}</div>
      <div>
        <p style={{ fontWeight: 600, fontSize: "16px", marginBottom: "var(--space-2)" }}>{title}</p>
        {description && (
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
