export function SectionHeader({ title }) {
  return (
    <div className="catalog-header">
      <h2>{title}</h2>
      <a href="#movies">
        See All <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
