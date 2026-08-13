import Link from "next/link";

export function Pagination({
  page,
  lastPage,
  basePath,
  query,
}: {
  page: number;
  lastPage: number;
  basePath: string;
  query: URLSearchParams;
}) {
  const maxShown = 5;
  const half = Math.floor(maxShown / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(lastPage, start + maxShown - 1);
  if (end - start + 1 < maxShown && start > 1) {
    start = Math.max(1, end - maxShown + 1);
  }

  const pageUrl = (p: number) => {
    const next = new URLSearchParams(query);
    if (p === 1) {
      next.delete("page");
    } else {
      next.set("page", String(p));
    }
    const qs = next.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  const itemClass =
    "paginate-button inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eeeeee] bg-white text-sm font-medium text-[#1d1f1f] transition hover:border-[#163a96] hover:bg-[#163a96] hover:text-white";
  const activeClass =
    "paginate-button active-page inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#163a96] bg-[#163a96] text-sm font-medium text-white";

  return (
    <div className="pagination-bar flex items-center gap-1">
      {page > 1 && (
        <Link
          href={pageUrl(page - 1)}
          className="me-2 inline-flex items-center gap-2 rounded-full border border-[#eeeeee] bg-white px-4 py-2.5 text-sm font-medium text-[#1d1f1f] transition hover:border-[#1d1f1f] hover:bg-[#1d1f1f] hover:text-white"
        >
          ←
          Back
        </Link>
      )}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
        <Link
          key={p}
          href={pageUrl(p)}
          aria-current={p === page ? "page" : undefined}
          className={p === page ? activeClass : itemClass}
        >
          {p}
        </Link>
      ))}

      {page < lastPage && (
        <Link
          href={pageUrl(page + 1)}
          className="ms-2 inline-flex items-center gap-2 rounded-full border border-[#163a96] bg-[#163a96] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#143485]"
        >
          Next
          →
        </Link>
      )}
    </div>
  );
}
