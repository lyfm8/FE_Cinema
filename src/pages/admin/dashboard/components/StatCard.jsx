/** @param {{ label: string, value: string }} props */
function StatCard({ label, value }) {
  return (
    <article className="surface-card p-4">
      <p className="section-label mb-2">{label}</p>
      <p className="movie-title text-2xl">{value}</p>
    </article>
  );
}

export default StatCard;
