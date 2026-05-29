import Link from "next/link";
import type { Product, RankedProduct } from "@/lib/types";

type ProductCardProps = {
  product: Product | RankedProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const rankedProduct =
    "matchSummary" in product && "scoreBreakdown" in product ? product : null;

  return (
    <article className="product-card">
      <div className="product-topline">
        <span className="bank-badge">{product.bankName}</span>
        <span className="category-badge">{product.categoryName}</span>
      </div>

      <h3>{product.name}</h3>
      <p>{product.summary}</p>

      <div className="product-meta">
        <dl className="metric">
          <dt>Role climate</dt>
          <dd>{product.rateLabel}</dd>
        </dl>
        <dl className="metric">
          <dt>Access path</dt>
          <dd>{product.monthlyFeeLabel}</dd>
        </dl>
      </div>

      <ul className="reason-list">
        {product.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      {rankedProduct ? <p className="match-summary">{rankedProduct.matchSummary}</p> : null}

      {rankedProduct ? (
        <div className="score-breakdown">
          {rankedProduct.scoreBreakdown.slice(1, 4).map((item) => (
            <span
              key={item.label}
              className={`score-chip ${item.impact >= 0 ? "positive" : "negative"}`}
            >
              {item.label}: {item.impact > 0 ? "+" : ""}
              {item.impact}
            </span>
          ))}
        </div>
      ) : null}

      <div className="score-line">
        <span className="score-pill">Score {product.score}</span>
        <Link href={`/products/${product.id}`} className="secondary-link">
          View target
        </Link>
      </div>
    </article>
  );
}
