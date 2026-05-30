import Link from "next/link";
import type { RankedProduct } from "@/lib/types";

type ComparisonShortlistProps = {
  products: RankedProduct[];
};

export function ComparisonShortlist({ products }: ComparisonShortlistProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="detail-panel">
      <div className="results-header">
        <div>
          <p className="eyebrow">Shortlist</p>
          <h2>Highest-priority outreach targets</h2>
        </div>
        <p className="page-text">
          Start with the first three accounts, then open each target to review
          executives, value propositions, and draft outreach.
        </p>
      </div>

      <div className="shortlist-grid">
        {products.map((product, index) => (
          <article key={product.id} className="shortlist-card">
            <p className="eyebrow">Rank {index + 1}</p>
            <h3>{product.name}</h3>
            <p>{product.bankName}</p>
            <p className="shortlist-summary">{product.matchSummary}</p>
            <div className="shortlist-meta">
              <span>{product.rateLabel}</span>
              <span>{product.monthlyFeeLabel}</span>
            </div>
            <Link href={`/products/${product.id}`} className="secondary-link">
              Review target
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
