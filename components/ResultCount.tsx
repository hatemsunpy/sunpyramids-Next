export function ResultCount({ from, to, total }: { from: number; to: number; total: number }) {
  return (
    <p className="text-sm text-[#6b7280]">
      From <span className="font-medium text-[#1d1f1f]">{from}</span> To{" "}
      <span className="font-medium text-[#1d1f1f]">{to}</span> out of{" "}
      <span className="font-medium text-[#1d1f1f]">{total}</span> result
    </p>
  );
}
