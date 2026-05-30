import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { findProductById } from "@/lib/data";

type LeadPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function LeadPage({ params }: LeadPageProps) {
  const { productId } = await params;
  const product = await findProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Outreach builder</p>
          <h1>{product.name}</h1>
          <p className="page-text">
            Turn your fit for {product.bankName} into a sharper note for the
            executive audience behind a Head of Product hire.
          </p>
        </div>
        <Link href={`/products/${product.id}`} className="secondary-link">
          Back to target
        </Link>
      </section>

      <section className="form-layout">
        <article className="detail-panel">
          <h2>What you are pitching</h2>
          <ul className="detail-list">
            <li>{product.summary}</li>
            <li>{product.rateLabel}</li>
            <li>{product.monthlyFeeLabel}</li>
            <li>{product.nextStep}</li>
          </ul>
        </article>

        <LeadCaptureForm product={product} />
      </section>
    </main>
  );
}
