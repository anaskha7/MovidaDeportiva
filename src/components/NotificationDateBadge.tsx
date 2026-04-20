type NotificationDateBadgeProps = {
  count: number;
  className?: string;
  as?: "span" | "strong";
};

export default function NotificationDateBadge({
  count,
  className,
  as = "span",
}: NotificationDateBadgeProps) {
  if (count <= 0) {
    return null;
  }

  const Tag = as;

  return <Tag className={className}>{count}</Tag>;
}
