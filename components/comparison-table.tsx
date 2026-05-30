import Link from "next/link";
import type { RankedProduct } from "@/lib/types";

type ComparisonTableProps = {
  products: RankedProduct[];
};

export function ComparisonTable({ products }: ComparisonTableProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="detail-panel">
      <div className="results-header">
        <div>
          <p className="eyebrow">Side by side</p>
          <h2>Compare your shortlisted targets</h2>
        </div>
        <p className="page-text">
          Use this to decide which companies deserve a bespoke email, a warm
          intro ask, or a founder-level note.
        </p>
      </div>

      <div className="table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Target</th>
              {products.map((product) => (
                <th key={product.id}>
                  <div className="table-product-heading">
                    <strong>{product.name}</strong>
                    <span>{product.bankName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Score</th>
              {products.map((product) => (
                <td key={product.id}>{product.score}</td>
              ))}
            </tr>
            <tr>
              <th>Role climate</th>
              {products.map((product) => (
                <td key={product.id}>{product.rateLabel}</td>
              ))}
            </tr>
            <tr>
              <th>Access path</th>
              {products.map((product) => (
                <td key={product.id}>{product.monthlyFeeLabel}</td>
              ))}
            </tr>
            <tr>
              <th>Why now</th>
              {products.map((product) => (
                <td key={product.id}>{product.eligibility}</td>
              ))}
            </tr>
            <tr>
              <th>Best fit summary</th>
              {products.map((product) => (
                <td key={product.id}>{product.matchSummary}</td>
              ))}
            </tr>
            <tr>
              <th>Executive hooks</th>
              {products.map((product) => (
                <td key={product.id}>
                  <ul className="comparison-list">
                    {(product.outreachAngles ?? product.features).slice(0, 3).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <th>Why this score</th>
              {products.map((product) => (
                <td key={product.id}>
                  <ul className="comparison-list">
                    {product.scoreBreakdown.slice(0, 4).map((item) => (
                      <li key={item.label}>
                        {item.label} ({formatImpact(item.impact)})
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <th>Action</th>
              {products.map((product) => (
                <td key={product.id}>
                  <Link href={`/lead/${product.id}`} className="primary-link">
                    Draft outreach
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatImpact(impact: number) {
  if (impact > 0) {
    return `+${impact}`;
  }

  return `${impact}`;
}
