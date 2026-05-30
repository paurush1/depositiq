import type { ReactNode } from "react";

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={joinClasses("mx-auto flex w-full max-w-[1440px] flex-col gap-10", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={joinClasses("space-y-5", className)}>{children}</section>;
}

export function MetricGrid({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "grid gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function WorkbenchGrid({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TableSection({
  title,
  description,
  actions,
  children,
  className
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={joinClasses(
        "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7",
        className
      )}
    >
      {title || description || actions ? (
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            {title ? <h2 className="text-xl font-semibold text-slate-950">{title}</h2> : null}
            {description ? (
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
