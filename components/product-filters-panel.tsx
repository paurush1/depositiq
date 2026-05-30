import type { Category } from "@/lib/types";

type ProductFiltersPanelProps = {
  activeCategory: string;
  categories: Category[];
  feePreference: string;
  introRate: boolean;
  offset: boolean;
  rewards: boolean;
};

export function ProductFiltersPanel({
  activeCategory,
  categories,
  feePreference,
  introRate,
  offset,
  rewards
}: ProductFiltersPanelProps) {
  return (
    <aside className="filters-panel">
      <p className="eyebrow">Search criteria</p>
      <h2>Shape the target list</h2>
      <form className="filters-form" method="get" action="/compare">
        <label>
          Fintech segment
          <select name="category" defaultValue={activeCategory}>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Target style
          <select name="fee" defaultValue={feePreference}>
            <option value="low">Prioritise easier executive access</option>
            <option value="balanced">Balanced shortlist</option>
            <option value="premium">Prioritise bigger brands and scale</option>
          </select>
        </label>

        <label className="checkbox-row">
          <input type="checkbox" name="intro" value="true" defaultChecked={introRate} />
          <span>Prefer companies with an active transformation or reset underway</span>
        </label>

        <label className="checkbox-row">
          <input type="checkbox" name="offset" value="true" defaultChecked={offset} />
          <span>Prefer regulated or platform-heavy product complexity</span>
        </label>

        <label className="checkbox-row">
          <input type="checkbox" name="rewards" value="true" defaultChecked={rewards} />
          <span>Prefer consumer scale or strong market visibility</span>
        </label>

        <button type="submit" className="submit-button">
          Update targets
        </button>
      </form>
    </aside>
  );
}
