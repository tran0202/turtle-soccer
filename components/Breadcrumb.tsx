import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-ink/30">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-ink/50 hover:text-turtle-blue transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-ink/70">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
