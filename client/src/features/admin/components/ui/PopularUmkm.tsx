export default function PopularUmkm({
  category,
  count,
  rank,
}: {
  category: string;
  count: number;
  rank: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold">
          #{rank}
        </div>

        <div>
          <h3 className="text-sm">{category}</h3>
          <p className="text-xs text-slate-500">
            Kategori UMKM
          </p>
        </div>
      </div>

      <span className="font-semibold text-sm">
        {count} UMKM
      </span>
    </div>
  );
}