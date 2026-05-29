import { getStoredCompareProducts, getStoredProductById } from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "payments",
    name: "Payments",
    description:
      "Target businesses where product leadership shapes merchant growth, ops, and platform resilience."
  },
  {
    slug: "lending",
    name: "Lending",
    description:
      "Focus on regulated lending environments that need pricing, risk, and servicing transformation."
  },
  {
    slug: "infrastructure",
    name: "Fintech Infrastructure",
    description:
      "Find API-first platforms where Head of Product leaders translate market signals into scalable products."
  }
];

const sampleProducts: Product[] = [
  {
    id: "harbour-payments",
    bankName: "HarbourPay",
    category: "payments",
    categoryName: "Payments",
    name: "Regional payments scale-up",
    summary:
      "Cross-border payments platform expanding across APAC and likely balancing growth, compliance, and product operating rigor.",
    rateLabel: "Role climate: Series D growth plus regional expansion",
    monthlyFeeLabel: "Access path: CPO, COO, GM Product",
    monthlyFeeValue: 4,
    hasIntroOffer: true,
    hasOffset: true,
    hasRewards: true,
    eligibility:
      "Best fit if you can tie product strategy to execution discipline, regulated delivery, and commercial outcomes.",
    features: [
      "Cross-functional scale challenge across product, operations, and go-to-market",
      "Likely need to sharpen product rituals as the org grows",
      "Clear story for improving prioritisation, roadmaps, and leadership leverage"
    ],
    reasons: [
      "You can position yourself as the operator who converts scale into repeatable product execution",
      "Payments businesses respond well to leaders who can balance risk, growth, and customer trust",
      "Head of Product outreach can land if it sounds commercial rather than purely craft-led"
    ],
    outreachAngles: [
      "Build a clearer product operating cadence between commercial, compliance, and engineering",
      "Improve portfolio prioritisation so expansion does not dilute core merchant value",
      "Raise product leadership leverage by coaching PMs and tightening decision quality"
    ],
    proofPoints: [
      "Led multi-team product portfolios with measurable commercial outcomes",
      "Improved roadmap discipline and alignment across GTM, risk, and delivery",
      "Can speak credibly about scaling product culture without slowing execution"
    ],
    searchSignals: [
      "Look for regional launch announcements, new market entries, or leadership hires",
      "Track product and strategy posts from the CPO, COO, and founders",
      "Use podcast interviews and funding coverage to infer current priorities"
    ],
    executiveTargets: [
      {
        name: "Ava Mercer",
        title: "Chief Product Officer",
        whyTheyMatter: "Primary owner of product leadership hiring and org design."
      },
      {
        name: "Liam Zhou",
        title: "Chief Operating Officer",
        whyTheyMatter: "Likely cares about scaling execution and cross-functional discipline."
      },
      {
        name: "Nina Rao",
        title: "Co-founder and CEO",
        whyTheyMatter: "Useful second-touch contact when you frame the role around growth and leadership leverage."
      }
    ],
    nextStep:
      "Lead with a short point of view on where product execution usually strains during regional payments expansion, then tie it to one operating change you would own in the first 90 days.",
    lastUpdated: "23 April 2026",
    score: 91
  },
  {
    id: "summit-lending",
    bankName: "Summit Credit",
    category: "lending",
    categoryName: "Lending",
    name: "Digital lending transformation target",
    summary:
      "Growth lender modernising acquisition, underwriting, and servicing while staying inside a tightly regulated environment.",
    rateLabel: "Role climate: Transformation mandate with executive visibility",
    monthlyFeeLabel: "Access path: CPO, CRO, CEO",
    monthlyFeeValue: 3,
    hasIntroOffer: true,
    hasOffset: true,
    hasRewards: false,
    eligibility:
      "Strong fit when your pitch combines customer experience, product economics, and disciplined execution under regulation.",
    features: [
      "Opportunity to reposition product as a driver of portfolio quality and customer retention",
      "Lending complexity gives you room to stand out with strategic and operational depth",
      "Exec outreach should emphasise measurable business tradeoffs, not generic innovation language"
    ],
    reasons: [
      "You can anchor the conversation in risk-aware product leadership",
      "Transformation roles often reward candidates who can unify fragmented product teams",
      "A sharp value proposition can differentiate you from candidates pitching only delivery experience"
    ],
    outreachAngles: [
      "Create a single product narrative across acquisition, underwriting, and servicing journeys",
      "Use better product instrumentation to improve conversion and credit quality together",
      "Reset roadmap governance so regulatory work and growth bets are managed intentionally"
    ],
    proofPoints: [
      "Experience balancing customer outcomes with operational or regulatory constraints",
      "History of aligning senior stakeholders around a more coherent portfolio strategy",
      "Ability to translate complex delivery work into commercial and risk language"
    ],
    searchSignals: [
      "Watch for announcements around automation, underwriting, or servicing transformation",
      "Check annual reports and leadership posts for efficiency or customer remediation themes",
      "Monitor product leadership attrition or role expansions on LinkedIn"
    ],
    executiveTargets: [
      {
        name: "Maya Collins",
        title: "Chief Product Officer",
        whyTheyMatter: "Natural first contact for a Head of Product conversation."
      },
      {
        name: "Oliver Grant",
        title: "Chief Risk Officer",
        whyTheyMatter: "Important influencer when the product remit touches underwriting and governance."
      },
      {
        name: "Priya Deshmukh",
        title: "Chief Executive Officer",
        whyTheyMatter: "Best approached with a concise operator narrative and clear business outcomes."
      }
    ],
    nextStep:
      "Frame yourself as the product leader who can improve speed and discipline at the same time, especially where lending journeys, operations, and risk intersect.",
    lastUpdated: "22 April 2026",
    score: 88
  },
  {
    id: "anchor-infra",
    bankName: "Anchor Ledger",
    category: "infrastructure",
    categoryName: "Fintech Infrastructure",
    name: "API platform with product maturity gap",
    summary:
      "Infrastructure fintech serving banks and fintech builders, likely needing stronger portfolio focus and more explicit product marketing alignment.",
    rateLabel: "Role climate: Platform scale plus enterprise stakeholder complexity",
    monthlyFeeLabel: "Access path: VP Product, CTO, founder",
    monthlyFeeValue: 6,
    hasIntroOffer: false,
    hasOffset: true,
    hasRewards: false,
    eligibility:
      "Best when you can speak to platform strategy, enterprise customer needs, and growing PM capability.",
    features: [
      "Good target if you want strategic scope without relying on mass-consumer brand hiring",
      "Technical product depth matters more than polished consumer storytelling",
      "Enterprise fintechs often value candidates who can simplify portfolio choices"
    ],
    reasons: [
      "You can present yourself as the bridge between platform depth and market-facing product clarity",
      "Product org maturity gaps are often visible and worth addressing directly in outreach",
      "A well-crafted note to the founder or CTO can work if you show commercial empathy"
    ],
    outreachAngles: [
      "Clarify platform segmentation so roadmap choices align with the highest-value customer cohorts",
      "Strengthen product discovery and commercial packaging around core APIs",
      "Coach PMs to operate at a higher strategic altitude with enterprise customers"
    ],
    proofPoints: [
      "Experience leading platform or B2B product strategy",
      "Track record of improving prioritisation in technically complex environments",
      "Comfort partnering closely with engineering and commercial leaders"
    ],
    searchSignals: [
      "Review API docs, changelogs, and release notes for product direction clues",
      "Watch founder interviews for signs of repositioning or vertical expansion",
      "Check hiring patterns for PM, solutions, and product marketing roles"
    ],
    executiveTargets: [
      {
        name: "Jonas Wright",
        title: "VP Product",
        whyTheyMatter: "Likely owner of capability gaps and portfolio pressure points."
      },
      {
        name: "Sofia Marin",
        title: "Chief Technology Officer",
        whyTheyMatter: "Important when the role requires strong technical credibility."
      },
      {
        name: "Ethan Park",
        title: "Founder and CEO",
        whyTheyMatter: "Relevant if the business is still founder-led and product strategy is centralised."
      }
    ],
    nextStep:
      "Open with a platform-specific observation, then show how you would increase product focus without undermining engineering momentum.",
    lastUpdated: "21 April 2026",
    score: 82
  },
  {
    id: "river-banking-app",
    bankName: "River Money",
    category: "payments",
    categoryName: "Payments",
    name: "Consumer wallet and everyday money app",
    summary:
      "High-visibility consumer fintech with strong brand reach, fast feedback loops, and a likely need for clearer product portfolio ownership.",
    rateLabel: "Role climate: Consumer scale with visible retention pressure",
    monthlyFeeLabel: "Access path: CPO, VP Growth Product, founder",
    monthlyFeeValue: 7,
    hasIntroOffer: false,
    hasOffset: false,
    hasRewards: true,
    eligibility:
      "Best fit if your value proposition includes growth, lifecycle, and strong customer-experience leadership.",
    features: [
      "Good option when you want brand recognition and consumer scale on your side",
      "Product pitch should connect user value to retention, revenue, and experimentation quality",
      "Need to sound practical, not abstract, because consumer teams hear a lot of generic product language"
    ],
    reasons: [
      "You can differentiate with a more executive, business-first Head of Product narrative",
      "The company is likely receptive to leaders who can unify growth and core product teams",
      "This target rewards sharp messaging about focus, team leverage, and customer value"
    ],
    outreachAngles: [
      "Tighten portfolio ownership between acquisition, engagement, and monetisation",
      "Improve experimentation quality so growth does not fragment the product experience",
      "Raise the operating cadence for roadmap decisions and outcome tracking"
    ],
    proofPoints: [
      "Consumer product growth leadership with measurable user or revenue outcomes",
      "Ability to manage tradeoffs between short-term experimentation and longer-term product quality",
      "Experience coaching PMs across lifecycle, core, and platform surfaces"
    ],
    searchSignals: [
      "Track app-store releases and launch announcements for priority themes",
      "Follow growth and product leaders on LinkedIn for hiring or org clues",
      "Review public interviews for retention, trust, or monetisation challenges"
    ],
    executiveTargets: [
      {
        name: "Chloe Bennett",
        title: "Chief Product Officer",
        whyTheyMatter: "Strong first contact for a scaled consumer Head of Product role."
      },
      {
        name: "Marcus Hall",
        title: "VP Growth Product",
        whyTheyMatter: "Useful for calibration and internal referral paths."
      },
      {
        name: "Ella Tan",
        title: "Founder and CEO",
        whyTheyMatter: "Best as a later escalation if your message is tightly commercial."
      }
    ],
    nextStep:
      "Use a concise consumer-growth story, then show how you would create more focus across acquisition, engagement, and monetisation teams.",
    lastUpdated: "20 April 2026",
    score: 79
  },
  {
    id: "coast-wealth",
    bankName: "CoastWealth",
    category: "infrastructure",
    categoryName: "Fintech Infrastructure",
    name: "Wealth and advice platform consolidator",
    summary:
      "B2B wealth platform integrating multiple products and likely dealing with portfolio sprawl, partner complexity, and uneven product maturity.",
    rateLabel: "Role climate: Consolidation and operating-model reset",
    monthlyFeeLabel: "Access path: GM Product, COO, founder",
    monthlyFeeValue: 5,
    hasIntroOffer: true,
    hasOffset: true,
    hasRewards: false,
    eligibility:
      "Works well if you can position yourself as the leader who creates clarity after acquisitions or platform expansion.",
    features: [
      "Strong fit for product leaders comfortable with messy portfolios and stakeholder complexity",
      "A consolidation story gives you a concrete wedge for outreach",
      "The right note should focus on simplification, prioritisation, and customer-value clarity"
    ],
    reasons: [
      "You can pitch strategic simplification rather than feature shipping",
      "Executive buyers in this space often value calm, integrative operators",
      "Your outreach can stand out by offering a practical lens on portfolio coherence"
    ],
    outreachAngles: [
      "Simplify overlapping products into a clearer portfolio strategy",
      "Create stronger product governance after integration or acquisition activity",
      "Align product, delivery, and commercial teams around the most valuable customer segments"
    ],
    proofPoints: [
      "Experience driving product clarity in complex multi-stakeholder environments",
      "Track record of improving decision quality and portfolio focus",
      "Comfort leading through ambiguity while building stronger PM capability"
    ],
    searchSignals: [
      "Watch for acquisition news, integration updates, and partner announcements",
      "Review leadership bios for recent role changes or span-of-control shifts",
      "Check hiring posts for signs of a broader product org redesign"
    ],
    executiveTargets: [
      {
        name: "Grace Liu",
        title: "General Manager, Product",
        whyTheyMatter: "Likely closest to the pain around portfolio clarity and team structure."
      },
      {
        name: "Ben Walsh",
        title: "Chief Operating Officer",
        whyTheyMatter: "Important if the role is meant to improve execution consistency across teams."
      },
      {
        name: "Zara Khan",
        title: "Founder and Executive Chair",
        whyTheyMatter: "Helpful when the business narrative still comes from the founder level."
      }
    ],
    nextStep:
      "Reach out with a portfolio simplification point of view and one clear example of how you have reduced product sprawl or improved decision quality before.",
    lastUpdated: "19 April 2026",
    score: 84
  }
];

export const ingestionSources = [
  {
    name: "LinkedIn leadership and hiring signals",
    type: "People research",
    status: "LIVE"
  },
  {
    name: "Funding, expansion, and launch announcements",
    type: "Company signals",
    status: "LIVE"
  },
  {
    name: "Founder, CPO, and COO long-form interviews",
    type: "Value proposition research",
    status: "REVIEW"
  }
];

export const sourceChecks = [
  {
    title: "HarbourPay expanded into a new APAC market",
    note: "Refresh the outreach angle around operating cadence and regional execution.",
    when: "Today"
  },
  {
    title: "Summit Credit posted a product leadership vacancy",
    note: "Move this target up if the role scope matches Head of Product remit.",
    when: "3h ago"
  },
  {
    title: "Anchor Ledger released new API capabilities",
    note: "Update the technical-platform value proposition before outreach.",
    when: "Yesterday"
  }
];

export function getProducts(category?: string) {
  if (!category) {
    return sampleProducts;
  }

  return sampleProducts.filter((product) => product.category === category);
}

export async function getCompareProducts(category?: string) {
  try {
    const storedProducts = await getStoredCompareProducts(category);

    if (storedProducts.length > 0) {
      return storedProducts;
    }
  } catch {
    return getProducts(category);
  }

  return getProducts(category);
}

export function getFeaturedProducts() {
  return sampleProducts.slice(0, 3);
}

export async function findProductById(productId: string) {
  try {
    const storedProduct = await getStoredProductById(productId);

    if (storedProduct) {
      return storedProduct;
    }
  } catch {
    return sampleProducts.find((product) => product.id === productId);
  }

  return sampleProducts.find((product) => product.id === productId);
}
