export function IngestionPreview() {
  return (
    <article className="detail-panel">
      <h2>Weekly workflow</h2>
      <div className="admin-list">
        <div className="admin-item">
          <div>
            <strong>Refresh targets</strong>
            <p>Review funding news, new role postings, and market expansion signals.</p>
          </div>
          <code>Monday</code>
        </div>
        <div className="admin-item">
          <div>
            <strong>Map executives</strong>
            <p>Capture CPO, COO, founder, and adjacent influencers for each account.</p>
          </div>
          <code>Tuesday</code>
        </div>
        <div className="admin-item">
          <div>
            <strong>Draft outreach</strong>
            <p>Update one sharp value proposition per company before sending notes.</p>
          </div>
          <code>Wednesday</code>
        </div>
      </div>
      <p className="note">
        Treat this app as your targeting workspace: shortlist first, then enrich
        each account with one live signal and one concrete proof point.
      </p>
    </article>
  );
}
