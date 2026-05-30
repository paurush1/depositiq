import Link from "next/link";
import { notFound } from "next/navigation";
import { findProductById } from "@/lib/data";

type ProductDetailPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { productId } = await params;
  const product = await findProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">{product.bankName}</p>
          <h1>{product.name}</h1>
          <p className="page-text">{product.summary}</p>
        </div>
        <Link href="/compare" className="secondary-link">
          Back to shortlist
        </Link>
      </section>

      <section className="detail-grid">
        <article className="detail-panel">
          <h2>Why this company belongs on your list</h2>
          <ul className="detail-list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>

        <article className="detail-panel">
          <h2>Target facts</h2>
          <dl className="facts-list">
            <div>
              <dt>Segment</dt>
              <dd>{product.categoryName}</dd>
            </div>
            <div>
              <dt>Role climate</dt>
              <dd>{product.rateLabel}</dd>
            </div>
            <div>
              <dt>Access path</dt>
              <dd>{product.monthlyFeeLabel}</dd>
            </div>
            <div>
              <dt>Why now</dt>
              <dd>{product.eligibility}</dd>
            </div>
            <div>
              <dt>Signal freshness</dt>
              <dd>{product.lastUpdated}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-panel">
          <h2>Executive targets</h2>
          <ul className="detail-list">
            {(product.executiveTargets ?? []).map((executive) => (
              <li key={`${executive.name}-${executive.title}`}>
                <strong>
                  {executive.name}, {executive.title}
                </strong>
                : {executive.whyTheyMatter}
              </li>
            ))}
          </ul>
        </article>

        <article className="detail-panel">
          <h2>Value proposition angles</h2>
          <ul className="detail-list">
            {(product.outreachAngles ?? product.reasons).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </article>

        <article className="detail-panel">
          <h2>Proof points to bring</h2>
          <ul className="detail-list">
            {(product.proofPoints ?? product.reasons).map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="detail-panel">
          <h2>Research checklist</h2>
          <ul className="detail-list">
            {(product.searchSignals ?? []).map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </article>

        <article className="detail-panel emphasis-panel">
          <h2>Recommended next move</h2>
          <p>{product.nextStep}</p>
          <Link href={`/lead/${product.id}`} className="primary-link">
            Draft outreach
          </Link>
        </article>
      </section>
    </main>
  );
}
