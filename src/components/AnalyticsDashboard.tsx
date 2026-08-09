import { type MouseEvent, useMemo, useState } from "react";
import { Activity, ArrowLeft, ArrowUpRight, Building2, Download, MessageSquare, MousePointerClick, Users } from "lucide-react";
import "../analytics.css";

type RangeKey = "7d" | "30d" | "90d";

const rangeData = {
  "7d": {
    label: "Last 7 days",
    visitors: "1,284",
    visitorsChange: "+12.4%",
    sessions: "1,716",
    sessionsChange: "+9.8%",
    enquiries: "38",
    enquiriesChange: "+18.7%",
    conversion: "2.96%",
    conversionChange: "+0.16",
    chart: [116, 142, 128, 174, 168, 206, 238],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    funnel: [1284, 756, 143, 38],
  },
  "30d": {
    label: "Last 30 days",
    visitors: "5,842",
    visitorsChange: "+8.2%",
    sessions: "7,436",
    sessionsChange: "+6.5%",
    enquiries: "164",
    enquiriesChange: "+14.1%",
    conversion: "2.81%",
    conversionChange: "+0.11",
    chart: [344, 382, 371, 425, 446, 432, 488, 514, 497, 563, 548, 632],
    labels: ["Jul 11", "Jul 14", "Jul 17", "Jul 20", "Jul 23", "Jul 26", "Jul 29", "Aug 1", "Aug 3", "Aug 5", "Aug 7", "Aug 9"],
    funnel: [5842, 3516, 624, 164],
  },
  "90d": {
    label: "Last 90 days",
    visitors: "15,920",
    visitorsChange: "+21.6%",
    sessions: "20,384",
    sessionsChange: "+18.9%",
    enquiries: "421",
    enquiriesChange: "+27.3%",
    conversion: "2.64%",
    conversionChange: "+0.21",
    chart: [1180, 1290, 1255, 1372, 1450, 1418, 1580, 1652, 1718, 1690, 1844, 2030],
    labels: ["May 12", "May 20", "May 28", "Jun 5", "Jun 13", "Jun 21", "Jun 29", "Jul 7", "Jul 15", "Jul 23", "Jul 31", "Aug 9"],
    funnel: [15920, 9244, 1708, 421],
  },
} satisfies Record<RangeKey, {
  label: string;
  visitors: string;
  visitorsChange: string;
  sessions: string;
  sessionsChange: string;
  enquiries: string;
  enquiriesChange: string;
  conversion: string;
  conversionChange: string;
  chart: number[];
  labels: string[];
  funnel: number[];
}>;

const sources = [
  ["Google Search", "42%", "2,454"],
  ["Instagram", "24%", "1,402"],
  ["Direct", "18%", "1,052"],
  ["Referrals", "10%", "584"],
  ["LinkedIn", "6%", "350"],
];

const interests = [
  ["New residence", 46],
  ["Commercial build", 27],
  ["Renovation", 18],
  ["Other", 9],
] as const;

const enquiries = [
  ["AR", "Ananya Rao", "New residence", "Jubilee Hills", "Today, 10:42", "Qualified"],
  ["VK", "Vikram K", "Commercial build", "Gachibowli", "Today, 09:18", "New"],
  ["SP", "Sana Parveen", "Renovation", "Banjara Hills", "Yesterday, 17:06", "Contacted"],
  ["RM", "Rohan Mehta", "New residence", "Kokapet", "Yesterday, 12:31", "New"],
  ["KN", "Kavya Nair", "Commercial build", "Financial District", "Aug 7, 15:22", "Qualified"],
];

function MeridianAnalyticsLogo() {
  return (
    <a className="analytics-logo" href="#top" aria-label="Return to Meridian Build website">
      <span>M</span><div><strong>MERIDIAN</strong><small>ANALYTICS</small></div>
    </a>
  );
}

function TrendChart({ values, labels }: { values: number[]; labels: string[] }) {
  const chart = useMemo(() => {
    const min = Math.min(...values) * .82;
    const max = Math.max(...values) * 1.08;
    const points = values.map((value, index) => {
      const x = 34 + index * (632 / (values.length - 1));
      const y = 210 - ((value - min) / (max - min)) * 164;
      return { x, y, value, label: labels[index] };
    });
    return {
      points,
      line: points.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "),
      area: `M 34 220 L ${points.map(({ x, y }) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} L 666 220 Z`,
    };
  }, [labels, values]);

  return (
    <div className="analytics-chart-wrap">
      <svg className="analytics-chart" viewBox="0 0 700 250" role="img" aria-label="Website visitors trend">
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0645b5" stopOpacity=".22" />
            <stop offset="100%" stopColor="#0645b5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[46, 87, 128, 169, 210].map((y) => <line key={y} x1="34" x2="666" y1={y} y2={y} className="chart-grid" />)}
        <path d={chart.area} fill="url(#trend-fill)" />
        <polyline points={chart.line} className="chart-line" />
        {chart.points.map((point) => (
          <circle key={point.label} cx={point.x} cy={point.y} r="4.5" className="chart-point">
            <title>{point.label}: {point.value.toLocaleString()} visitors</title>
          </circle>
        ))}
      </svg>
      <div className="chart-labels">
        {labels.map((label, index) => (index === 0 || index === labels.length - 1 || index === Math.floor(labels.length / 2)) ? <span key={label}>{label}</span> : null)}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const data = rangeData[range];
  const funnelLabels = ["Website visitors", "Engaged sessions", "Chatbot opened", "Enquiries"];

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#/analytics/${sectionId.replace("analytics-", "")}`);
  };

  const exportCsv = () => {
    const rows = [["Name", "Interest", "Location", "Received", "Status"], ...enquiries.map((row) => row.slice(1))];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "meridian-enquiries-demo.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="analytics-shell">
      <aside className="analytics-sidebar">
        <MeridianAnalyticsLogo />
        <nav aria-label="Analytics navigation">
          <a className="active" href="#/analytics/overview" onClick={(event) => scrollToSection(event, "analytics-overview")}><Activity size={16} /> Overview</a>
          <a href="#/analytics/acquisition" onClick={(event) => scrollToSection(event, "analytics-acquisition")}><MousePointerClick size={16} /> Acquisition</a>
          <a href="#/analytics/enquiries" onClick={(event) => scrollToSection(event, "analytics-enquiries")}><MessageSquare size={16} /> Enquiries</a>
          <a href="#/analytics/projects" onClick={(event) => scrollToSection(event, "analytics-projects")}><Building2 size={16} /> Project interest</a>
        </nav>
        <div className="analytics-sidebar-foot"><span>DEMO WORKSPACE</span><p>Mock data only<br />Updated Aug 9, 2026</p><a href="#top"><ArrowLeft size={14} /> Public website</a></div>
      </aside>

      <main className="analytics-main" id="analytics-overview">
        <header className="analytics-topbar">
          <div><p>WEBSITE ANALYTICS</p><h1>Performance overview</h1></div>
          <div className="analytics-controls">
            <div className="range-control" role="group" aria-label="Analytics date range">
              {(Object.keys(rangeData) as RangeKey[]).map((key) => <button className={range === key ? "active" : ""} onClick={() => setRange(key)} key={key}>{key.toUpperCase()}</button>)}
            </div>
            <button className="export-button" onClick={exportCsv}><Download size={15} /> Export</button>
          </div>
        </header>

        <section className="analytics-status"><span><i /> SITE HEALTHY</span><p>{data.label} · Demo data · Asia/Kolkata</p></section>

        <section className="metric-row" aria-label="Key performance indicators">
          {[
            [Users, "Unique visitors", data.visitors, data.visitorsChange],
            [MousePointerClick, "Sessions", data.sessions, data.sessionsChange],
            [MessageSquare, "Enquiries", data.enquiries, data.enquiriesChange],
            [Activity, "Conversion rate", data.conversion, data.conversionChange],
          ].map(([Icon, label, value, change]) => (
            <article className="metric" key={String(label)}>
              <div><Icon size={17} /><span>{String(label)}</span></div>
              <strong>{String(value)}</strong>
              <p><b>{String(change)}</b> vs previous period</p>
            </article>
          ))}
        </section>

        <section className="analytics-grid primary-grid" id="analytics-acquisition">
          <article className="analytics-panel trend-panel">
            <div className="panel-heading"><div><p>TRAFFIC TREND</p><h2>Website visitors</h2></div><span>Daily unique visitors</span></div>
            <TrendChart values={data.chart} labels={data.labels} />
          </article>

          <article className="analytics-panel sources-panel">
            <div className="panel-heading"><div><p>ACQUISITION</p><h2>Traffic sources</h2></div><ArrowUpRight size={18} /></div>
            <div className="source-list">
              {sources.map(([source, percent, total]) => <div key={source}><span>{source}</span><div><b>{percent}</b><small>{total}</small></div></div>)}
            </div>
          </article>
        </section>

        <section className="analytics-grid secondary-grid">
          <article className="analytics-panel funnel-panel">
            <div className="panel-heading"><div><p>CONVERSION</p><h2>Enquiry funnel</h2></div><span>{data.conversion} overall</span></div>
            <div className="funnel">
              {data.funnel.map((value, index) => (
                <div className="funnel-row" key={funnelLabels[index]}>
                  <div><span>{funnelLabels[index]}</span><b>{value.toLocaleString()}</b></div>
                  <div className="funnel-track"><i style={{ width: `${Math.max(12, (value / data.funnel[0]) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="analytics-panel interest-panel" id="analytics-projects">
            <div className="panel-heading"><div><p>DEMAND</p><h2>Project interest</h2></div><span>By enquiry type</span></div>
            <div className="interest-list">
              {interests.map(([label, value]) => <div key={label}><div><span>{label}</span><b>{value}%</b></div><div className="interest-track"><i style={{ width: `${value}%` }} /></div></div>)}
            </div>
          </article>
        </section>

        <section className="analytics-panel enquiries-panel" id="analytics-enquiries">
          <div className="panel-heading"><div><p>ENQUIRY LOG</p><h2>Recent enquiries</h2></div><span>5 most recent · Demo records</span></div>
          <div className="analytics-table-wrap">
            <table>
              <thead><tr><th>Contact</th><th>Project interest</th><th>Location</th><th>Received</th><th>Status</th></tr></thead>
              <tbody>
                {enquiries.map(([initials, name, interest, location, received, status]) => (
                  <tr key={name}>
                    <td><span className="contact-cell"><i>{initials}</i>{name}</span></td><td>{interest}</td><td>{location}</td><td>{received}</td><td><span className={`status status-${status.toLowerCase()}`}>{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="analytics-footer"><span>MERIDIAN ANALYTICS · DEMONSTRATION</span><p>Figures are fictional and not connected to production tracking.</p></footer>
      </main>
    </div>
  );
}
