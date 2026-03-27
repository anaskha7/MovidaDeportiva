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
  const Tag = as;

  return <Tag className={className}>{count}</Tag>;
}
