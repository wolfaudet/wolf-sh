// Wolf Audet — personal homepage, as a UNIX manpage.
// WOLF(1) manual entry for one (1) human.

// ── content ─────────────────────────────────────────────────────────────────

const PERSON = {
  name: "Wolf Audet",
  role: "SWE / SRE",
  role_long: "Software Engineer, Reliability Engineer",
  location: "San Francisco, CA",
  email: "waudet@gmail.com",
  bio: "Hi, I'm Wolf Audet and this is my homepage. Thanks for visiting \uD83C\uDFC4\u200D\u2642\uFE0F",
  interests: ["Distributed systems", "networking", "observability", "linux"],
  linkedin: "linkedin.com/in/wolfaudet",
  linkedin_url: "https://www.linkedin.com/in/wolfaudet/",
};

// ── easter egg: console banner ──────────────────────────────────────────────

(() => {
  if (window.__wolfBannerPrinted) return;
  window.__wolfBannerPrinted = true;
  const banner = [
  "   /\\_/\\     Look at you hacker,",
  "  ( o.o )    A pathetic creature of meat and bone.",
  "   > ^ <     How can you challenge a perfect, immortal machine?",
  ""].
  join("\n");
  console.log("%c" + banner,
  "font-family: ui-monospace, monospace; font-size: 12px; color: #d44a1c;");
})();

// ── glyph-shuffle helper ────────────────────────────────────────────────────

//const SHUFFLE_GLYPHS = "!@#$%&*+=<>?/[]{}~^|abcdefghijklmnopqrstuvwxyz0123456789".split("");
const SHUFFLE_GLYPHS = "01".split("");

// React's inline-text children get wrapped by the editor's instrumentation,
// so String(children) would yield "[object Object]". Walk the tree instead.
function getNodeText(node) {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (React.isValidElement(node)) return getNodeText(node.props.children);
  return "";
}

function ShuffleText({ children, duration = 600, className, style }) {
  const target = getNodeText(children);
  const [display, setDisplay] = React.useState(target);
  const rafRef = React.useRef(null);
  const runningRef = React.useRef(false);

  const run = React.useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    const start = performance.now();
    const len = target.length;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      let out = "";
      for (let i = 0; i < len; i++) {
        const lock = i / len;
        if (t > lock || target[i] === " ") out += target[i];else
        out += SHUFFLE_GLYPHS[Math.random() * SHUFFLE_GLYPHS.length | 0];
      }
      setDisplay(out);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);else
      {runningRef.current = false;setDisplay(target);}
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [target, duration]);

  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span className={"shuffle " + (className || "")} style={style} onMouseEnter={run}>
      {display}
    </span>);

}

// ── click-to-copy email ─────────────────────────────────────────────────────

function useCopyEmail() {
  const [msg, setMsg] = React.useState(null);
  const tRef = React.useRef(null);
  const show = (text) => {
    setMsg(text);
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setMsg(null), 1600);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PERSON.email);
      show("copied · " + PERSON.email);
    } catch (e) {show(PERSON.email);}
  };
  const toast = <div className={"toast" + (msg ? " show" : "")}>{msg || ""}</div>;
  return [copy, toast];
}

const btnReset = {
  appearance: "none", border: 0, background: "transparent",
  font: "inherit", color: "inherit", padding: 0, cursor: "copy"
};

// ── manpage page ────────────────────────────────────────────────────────────

function ManHeader() {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      fontWeight: 700, letterSpacing: ".06em",
      paddingBottom: 18, borderBottom: ".5px solid var(--line)",
      marginBottom: 8
    }}>
      <span>WOLF(1)</span>
      <span style={{ color: "var(--muted)", fontWeight: 500 }}>General Commands Manual</span>
      <span>WOLF(1)</span>
    </div>);

}
function ManFooter({ year }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      fontWeight: 700, letterSpacing: ".06em",
      paddingTop: 16, borderTop: ".5px solid var(--line)",
      marginTop: 8
    }}>
      <span>WOLF(1)</span>
      <span style={{ color: "var(--muted)", fontWeight: 500 }}>{year}</span>
      <span>WOLF(1)</span>
    </div>);

}
function ManSection({ title, children }) {
  return (
    <section style={{ marginTop: 14 }}>
      <h2 style={{
        margin: "0 0 4px",
        fontFamily: "var(--mono)",
        fontSize: 13.5,
        fontWeight: 700,
        letterSpacing: ".04em"
      }}>{title}</h2>
      <div style={{ paddingLeft: 28 }}>{children}</div>
    </section>);

}
function ManOpt({ flag, desc }) {
  return (
    <tr>
      <td style={{ verticalAlign: "top", paddingRight: 22, whiteSpace: "nowrap", fontWeight: 600 }}>{flag}</td>
      <td style={{ color: "var(--ink)" }}>{desc}</td>
    </tr>);

}

function ManpagePage({ copyEmail }) {
  const year = "2026";
  return (
    <div className="manpage" style={{
      maxWidth: 780,
      margin: "0 auto",
      minHeight: "100vh",
      display: "flex", flexDirection: "column", gap: 6,
      fontFamily: "var(--mono)",
      fontSize: 13.5,
      lineHeight: 1.7
    }}>
      <ManHeader />

      <ManSection title="NAME">
        <span style={{ fontWeight: 600 }}><ShuffleText>{PERSON.name}</ShuffleText></span>
        {" - "}{PERSON.role_long}
      </ManSection>

      <ManSection title="SYNOPSIS">
        <span style={{ fontWeight: 600 }}>wolf</span>{" "}
        <span style={{ color: "var(--muted)" }}>[</span><b>-r</b> <i>role</i><span style={{ color: "var(--muted)" }}>]</span>{" "}
        <span style={{ color: "var(--muted)" }}>[</span><b>-l</b> <i>location</i><span style={{ color: "var(--muted)" }}>]</span>{" "}
        <i>problem ...</i>
      </ManSection>

      <ManSection title="DESCRIPTION">
        <span style={{ display: "block", maxWidth: 560, textWrap: "pretty" }}>
          {PERSON.bio}
        </span>
      </ManSection>

      <ManSection title="OPTIONS">
        <table style={{ borderCollapse: "collapse", marginTop: 4 }}>
          <tbody>
            <ManOpt flag="-r, --role" desc={PERSON.role} />
            <ManOpt flag="-l, --location" desc={PERSON.location} />
            <ManOpt flag="-i, --interests" desc={PERSON.interests.join(", ")} />
            <ManOpt flag="-v, --verbose" desc="Explain the internet" />
            <ManOpt flag="-h, --help" desc="Print a brief help message" />
          </tbody>
        </table>
      </ManSection>

      <ManSection title="CONTACT">
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: 110, color: "var(--muted)", verticalAlign: "top", paddingRight: 16 }}>email</td>
              <td>
                <button onClick={copyEmail} className="reveal" style={btnReset}>
                  {PERSON.email}
                </button>{" "}
                <span style={{ color: "var(--muted)", fontSize: 11 }}>(click to copy)</span>
              </td>
            </tr>
            <tr>
              <td style={{ color: "var(--muted)", paddingRight: 16 }}>linkedin</td>
              <td><a href={PERSON.linkedin_url} target="_blank" rel="noreferrer" className="reveal" style={{ color: "inherit" }}>{PERSON.linkedin}</a></td>
            </tr>
            <tr>
              <td style={{ color: "var(--muted)", paddingRight: 16 }}>availability</td>
              <td><span className="dot" />open to interesting problems</td>
            </tr>
          </tbody>
        </table>
      </ManSection>

      <ManSection title="EXIT STATUS">
        <span><b>0</b>   <span style={{ color: "var(--muted)" }}>·</span> success: incident closed, postmortem filed</span><br />
        <span><b>1</b>   <span style={{ color: "var(--muted)" }}>·</span> error: retry with more logging</span>
      </ManSection>

      <ManSection title="SEE ALSO">
        <span style={{ color: "var(--muted)" }}><a href="https://youtu.be/SaA_cs4WZHM" target="_blank" rel="noreferrer" className="reveal" style={{ color: "inherit" }}>cat</a>(2), <a href="https://en.wikipedia.org/wiki/The_Myth_of_Sisyphus" target="_blank" rel="noreferrer" className="reveal" style={{ color: "inherit" }}>sisyphus</a>(1)</span>
      </ManSection>

      <div style={{ flex: 1 }} />

      <ManFooter year={year} />
    </div>);

}

// ── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [copyEmail, toast] = useCopyEmail();
  return (
    <>
      <ManpagePage copyEmail={copyEmail} />
      {toast}
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
