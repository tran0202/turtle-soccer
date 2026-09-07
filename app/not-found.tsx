import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="font-display text-5xl uppercase tracking-tight mb-2">
        Full time whistle
      </h1>
      <p className="text-ink/60 mb-8 max-w-md">
        Nothing on record at this address. It may have been moved, or never
        existed.
      </p>
      <Link
        href="/"
        className="text-turtle-green hover:text-turtle-blue transition-colors"
      >
        ← Back to organizations
      </Link>
    </div>
  );
}
