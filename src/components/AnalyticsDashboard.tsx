import { type CSSProperties, type MouseEvent, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, ArrowUpRight, Building2, Download, Info, MessageSquare, MonitorSmartphone, MousePointerClick, Users, type LucideIcon } from "lucide-react";
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
    enquiryChart: [4, 5, 3, 7, 6, 5, 8],
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
    enquiryChart: [12, 15, 17, 21, 18, 26, 25, 30],
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
    enquiryChart: [22, 27, 31, 29, 35, 38, 34, 41, 39, 44, 37, 44],
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
  enquiryChart: number[];
  funnel: number[];
}>;

const sources = [
  ["Google Search", 42, "#0645b5"],
  ["Instagram", 24, "#4f7fd5"],
  ["Direct", 18, "#7ca8f6"],
  ["Referrals", 10, "#a9c5f7"],
  ["LinkedIn", 6, "#d4e2fa"],
] as const;

const interests = [
  ["New residence", 46],
  ["Commercial build", 27],
  ["Renovation", 18],
  ["Other", 9],
] as const;

const locations = [
  ["Kokapet", 28],
  ["Gachibowli", 22],
  ["Jubilee Hills", 18],
  ["Narsingi", 14],
  ["Tellapur", 10],
  ["Other Hyderabad", 8],
] as const;

const devices = [
  ["Mobile", 68, "#0645b5"],
  ["Desktop", 27, "#7ca8f6"],
  ["Tablet", 5, "#d4e2fa"],
] as const;

const activityHeatmap = [
  [3, 5, 8, 10, 7, 4, 2],
  [6, 11, 17, 19, 15, 10, 8],
  [8, 16, 25, 31, 28, 21, 14],
  [5, 12, 20, 27, 24, 18, 11],
] as const;

const heatmapRows = ["08–11", "11–14", "14–17", "17–20"];
const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

type KpiDatum = {
  Icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  current: number;
  previous: number;
  currentLabel: string;
  previousLabel: string;
};

function KpiPie({ label, current, previous, currentLabel, previousLabel }: Pick<KpiDatum, "label" | "current" | "previous" | "currentLabel" | "previousLabel">) {
  const [active, setActive] = useState<"current" | "previous" | null>(null);
  const total = current + previous;
  const currentShare = (current / total) * 100;
  const previousShare = 100 - currentShare;

  return (
    <div className="kpi-pie">
      <svg viewBox="0 0 72 72" role="img" aria-label={`${label}: current period ${currentLabel}, previous period ${previousLabel}`}>
        <circle className="kpi-pie-base" cx="36" cy="36" r="27" />
        <motion.circle
          className="kpi-pie-segment kpi-pie-current"
          cx="36" cy="36" r="27" pathLength="100"
          initial={{ strokeDasharray: "0 100" }}
          animate={{ strokeDasharray: `${currentShare} ${100 - currentShare}` }}
          transition={{ duration: .5, ease: "easeOut" }}
          tabIndex={0} role="img" aria-label={`Current period: ${currentLabel}`}
          onMouseEnter={() => setActive("current")} onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("current")} onBlur={() => setActive(null)}
        />
        <motion.circle
          className="kpi-pie-segment kpi-pie-previous"
          cx="36" cy="36" r="27" pathLength="100"
          initial={{ strokeDasharray: "0 100", strokeDashoffset: -currentShare }}
          animate={{ strokeDasharray: `${previousShare} ${100 - previousShare}`, strokeDashoffset: -currentShare }}
          transition={{ duration: .5, ease: "easeOut", delay: .08 }}
          tabIndex={0} role="img" aria-label={`Previous period: ${previousLabel}`}
          onMouseEnter={() => setActive("previous")} onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("previous")} onBlur={() => setActive(null)}
        />
      </svg>
      <span className="kpi-pie-center">VS</span>
      {active !== null && (
        <div className="kpi-pie-tooltip" role="status">
          <span>{active === "current" ? "Current period" : "Previous period"}</span>
          <strong>{active === "current" ? currentLabel : previousLabel}</strong>
        </div>
      )}
    </div>
  );
}

function TrendChart({ values, labels }: { values: number[]; labels: string[] }) {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);
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
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0645b5" stopOpacity=".22" />
            <stop offset="100%" stopColor="#0645b5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[46, 87, 128, 169, 210].map((y) => <line key={y} x1="34" x2="666" y1={y} y2={y} className="chart-grid" />)}
        <path d={chart.area} fill={`url(#${gradientId})`} />
        <polyline points={chart.line} className="chart-line" />
        {chart.points.map((point, index) => (
          <g
            className="chart-hit-area"
            key={point.label}
            tabIndex={0}
            role="img"
            aria-label={`${point.label}: ${point.value.toLocaleString()} visitors`}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            <circle cx={point.x} cy={point.y} r="14" className="chart-point-hit" />
            <circle cx={point.x} cy={point.y} r="4.5" className="chart-point" />
          </g>
        ))}
      </svg>
      {active !== null && (
        <div
          className="chart-tooltip"
          style={{ left: `${(chart.points[active].x / 700) * 100}%`, top: `${(chart.points[active].y / 250) * 100}%` }}
          role="status"
        >
          <span>{chart.points[active].label}</span><strong>{chart.points[active].value.toLocaleString()} visitors</strong>
        </div>
      )}
      <div className="chart-labels">
        {labels.map((label, index) => (index === 0 || index === labels.length - 1 || index === Math.floor(labels.length / 2)) ? <span key={label}>{label}</span> : null)}
      </div>
    </div>
  );
}

function SourceDonut({ total }: { total: number }) {
  const [active, setActive] = useState<number | null>(null);
  let offset = 0;

  return (
    <div className="donut-layout">
      <div className="donut-visual">
        <svg viewBox="0 0 120 120" role="img" aria-label="Traffic source share">
          <circle className="donut-base" cx="60" cy="60" r="45" />
          {sources.map(([source, percent, color], index) => {
            const dashOffset = -offset;
            offset += percent;
            return (
              <circle
                key={source}
                className={`donut-segment ${active === index ? "active" : ""}`}
                cx="60" cy="60" r="45" pathLength="100"
                stroke={color} strokeDasharray={`${percent} ${100 - percent}`} strokeDashoffset={dashOffset}
                tabIndex={0}
                role="img"
                aria-label={`${source}: ${percent} percent, ${Math.round(total * percent / 100).toLocaleString()} visitors`}
                onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)} onBlur={() => setActive(null)}
              />
            );
          })}
        </svg>
        <div className="donut-center"><strong>{total.toLocaleString()}</strong><span>visitors</span></div>
        {active !== null && <div className="chart-tooltip donut-tooltip"><span>{sources[active][0]}</span><strong>{sources[active][1]}% · {Math.round(total * sources[active][1] / 100).toLocaleString()}</strong></div>}
      </div>
      <div className="donut-legend">
        {sources.map(([source, percent, color], index) => (
          <button key={source} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)}>
            <i style={{ background: color }} /><span>{source}</span><b>{percent}%</b>
          </button>
        ))}
      </div>
    </div>
  );
}

function EnquiryBars({ values, range }: { values: number[]; range: RangeKey }) {
  const max = Math.max(...values);
  const interval = range === "7d" ? "Day" : range === "30d" ? "Period" : "Week";

  return (
    <div className="bar-chart" role="group" aria-label="Enquiries over the selected period">
      {values.map((value, index) => (
        <button className="bar-column tooltip-anchor" key={`${range}-${index}`} aria-label={`${interval} ${index + 1}: ${value} enquiries`} data-tooltip={`${interval} ${index + 1} · ${value} enquiries`}>
          <motion.i initial={{ height: 0 }} animate={{ height: `${(value / max) * 100}%` }} transition={{ duration: .45, delay: index * .035 }} />
          <span>{index === 0 || index === values.length - 1 ? `${interval.slice(0, 1)}${index + 1}` : ""}</span>
        </button>
      ))}
    </div>
  );
}

function DeviceChart() {
  const [active, setActive] = useState<number | null>(null);
  let offset = 0;

  return (
    <div className="device-layout">
      <div className="device-donut">
        <svg viewBox="0 0 120 120" role="img" aria-label="Visitors by device type">
          <circle className="donut-base" cx="60" cy="60" r="42" />
          {devices.map(([label, percent, color], index) => {
            const dashOffset = -offset;
            offset += percent;
            return <circle key={label} className={`device-segment ${active === index ? "active" : ""}`} cx="60" cy="60" r="42" pathLength="100" stroke={color} strokeDasharray={`${percent} ${100 - percent}`} strokeDashoffset={dashOffset} tabIndex={0} role="img" aria-label={`${label}: ${percent} percent`} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} />;
          })}
        </svg>
        <MonitorSmartphone size={22} />
        {active !== null && <div className="chart-tooltip donut-tooltip"><span>{devices[active][0]}</span><strong>{devices[active][1]}% of visits</strong></div>}
      </div>
      <div className="device-legend">
        {devices.map(([label, percent, color], index) => <button key={label} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)}><span><i style={{ background: color }} />{label}</span><b>{percent}%</b></button>)}
      </div>
    </div>
  );
}

function ActivityHeatmap() {
  const max = Math.max(...activityHeatmap.flat());
  return (
    <div className="heatmap-wrap">
      <div className="heatmap-days">{heatmapDays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="heatmap-body">
        <div className="heatmap-times">{heatmapRows.map((row) => <span key={row}>{row}</span>)}</div>
        <div className="heatmap-grid">
          {activityHeatmap.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
            <button
              key={`${rowIndex}-${columnIndex}`}
              className="heat-cell tooltip-anchor"
              style={{ "--heat": `${.12 + (value / max) * .88}` } as CSSProperties}
              aria-label={`${heatmapDays[columnIndex]}, ${heatmapRows[rowIndex]}: ${value} chatbot interactions`}
              data-tooltip={`${heatmapDays[columnIndex]} ${heatmapRows[rowIndex]} · ${value} chats`}
            />
          )))}
        </div>
      </div>
      <div className="heatmap-scale"><span>Lower intent</span><i /><i /><i /><i /><span>Higher intent</span></div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const data = rangeData[range];
  const visitorTotal = Number(data.visitors.replaceAll(",", ""));
  const sessionTotal = Number(data.sessions.replaceAll(",", ""));
  const enquiryTotal = Number(data.enquiries.replaceAll(",", ""));
  const conversionTotal = Number(data.conversion.replace("%", ""));
  const countFormatter = (value: number) => Math.round(value).toLocaleString("en-US");
  const previousVisitors = visitorTotal / (1 + Number.parseFloat(data.visitorsChange) / 100);
  const previousSessions = sessionTotal / (1 + Number.parseFloat(data.sessionsChange) / 100);
  const previousEnquiries = enquiryTotal / (1 + Number.parseFloat(data.enquiriesChange) / 100);
  const previousConversion = conversionTotal - Number.parseFloat(data.conversionChange);
  const kpis: KpiDatum[] = [
    { Icon: Users, label: "Unique visitors", value: data.visitors, change: data.visitorsChange, current: visitorTotal, previous: previousVisitors, currentLabel: data.visitors, previousLabel: countFormatter(previousVisitors) },
    { Icon: MousePointerClick, label: "Sessions", value: data.sessions, change: data.sessionsChange, current: sessionTotal, previous: previousSessions, currentLabel: data.sessions, previousLabel: countFormatter(previousSessions) },
    { Icon: MessageSquare, label: "Enquiries", value: data.enquiries, change: data.enquiriesChange, current: enquiryTotal, previous: previousEnquiries, currentLabel: data.enquiries, previousLabel: countFormatter(previousEnquiries) },
    { Icon: Activity, label: "Conversion rate", value: data.conversion, change: data.conversionChange, current: conversionTotal, previous: previousConversion, currentLabel: data.conversion, previousLabel: `${previousConversion.toFixed(2)}%` },
  ];
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
          {kpis.map(({ Icon, label, value, change, ...pieData }) => (
            <article className="metric" key={label}>
              <div className="metric-label"><Icon size={17} /><span>{label}</span></div>
              <div className="metric-body">
                <strong>{value}</strong>
                <KpiPie label={label} {...pieData} />
              </div>
              <p><b>{change}</b> vs previous period</p>
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
            <SourceDonut total={visitorTotal} />
          </article>
        </section>

        <section className="analytics-grid secondary-grid">
          <article className="analytics-panel funnel-panel">
            <div className="panel-heading"><div><p>CONVERSION</p><h2>Enquiry funnel</h2></div><span>{data.conversion} overall</span></div>
            <div className="funnel">
              {data.funnel.map((value, index) => (
                <div className="funnel-row" key={funnelLabels[index]}>
                  <div><span>{funnelLabels[index]}</span><b>{value.toLocaleString()}</b></div>
                  <div className="funnel-track tooltip-anchor" tabIndex={0} data-tooltip={`${funnelLabels[index]} · ${value.toLocaleString()} · ${((value / data.funnel[0]) * 100).toFixed(1)}% of visitors`}><i style={{ width: `${Math.max(12, (value / data.funnel[0]) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="analytics-panel interest-panel" id="analytics-projects">
            <div className="panel-heading"><div><p>DEMAND</p><h2>Project interest</h2></div><span>By enquiry type</span></div>
            <div className="interest-list">
              {interests.map(([label, value]) => <div key={label}><div><span>{label}</span><b>{value}%</b></div><div className="interest-track tooltip-anchor" tabIndex={0} data-tooltip={`${label} · ${value}% of enquiries`}><i style={{ width: `${value}%` }} /></div></div>)}
            </div>
          </article>
        </section>

        <section className="analytics-grid insight-grid" aria-label="Audience and enquiry insights">
          <motion.article className="analytics-panel momentum-panel" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }}>
            <div className="panel-heading"><div><p>ENQUIRY MOMENTUM</p><h2>Enquiries by period</h2></div><span>{data.enquiries} total</span></div>
            <EnquiryBars values={data.enquiryChart} range={range} />
          </motion.article>

          <motion.article className="analytics-panel device-panel" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: .06 }}>
            <div className="panel-heading"><div><p>AUDIENCE</p><h2>Device mix</h2></div><Info size={16} aria-label="Share of total visits" /></div>
            <DeviceChart />
          </motion.article>
        </section>

        <section className="analytics-grid context-grid" aria-label="Location and chat activity insights">
          <motion.article className="analytics-panel location-panel" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }}>
            <div className="panel-heading"><div><p>HYDERABAD DEMAND</p><h2>Top micro-markets</h2></div><span>Share of enquiries</span></div>
            <div className="location-chart">
              {locations.map(([label, value], index) => (
                <div className="location-row" key={label}>
                  <span>{label}</span>
                  <div className="location-track tooltip-anchor" tabIndex={0} data-tooltip={`${label} · ${value}% of enquiries`}>
                    <motion.i initial={{ width: 0 }} whileInView={{ width: `${(value / locations[0][1]) * 100}%` }} viewport={{ once: true }} transition={{ duration: .55, delay: index * .055 }} />
                  </div>
                  <b>{value}%</b>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article className="analytics-panel heatmap-panel" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: .06 }}>
            <div className="panel-heading"><div><p>CHATBOT INTENT</p><h2>Activity by time</h2></div><span>Interactions · IST</span></div>
            <ActivityHeatmap />
          </motion.article>
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
