import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { config } from "../../config";
import { localAnswer } from "./fallback";
import "./Agent.css";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  { q: "What does Hassan build?", hue: "blue" },
  { q: "Tell me about Noodle", hue: "orange" },
  { q: "What's his tech stack?", hue: "green" },
  { q: "Where has he worked?", hue: "pink" },
  { q: "Is he open to work?", hue: "cyan" },
  { q: "How do I contact him?", hue: "yellow" },
];

// ---------- tiny markdown: paragraphs, "- " bullets, **bold**, bare URLs ----------

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.,]$/, "");
      return (
        <a key={i} href={url} target="_blank" rel="noreferrer">
          {url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
        </a>
      );
    }
    return part;
  });
}

function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={blocks.length}>
        {list.map((l, i) => (
          <li key={i}>{inline(l)}</li>
        ))}
      </ul>
    );
    list = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (/^[-*•]\s+/.test(line)) list.push(line.replace(/^[-*•]\s+/, ""));
    else {
      flush();
      if (line) blocks.push(<p key={blocks.length}>{inline(line)}</p>);
    }
  }
  flush();
  return <>{blocks}</>;
}

// ---------- talking to /api/ask, with the local answers as a safety net ----------

async function ask(history: Msg[], onText: (t: string) => void, signal: AbortSignal) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
      signal,
    });
    const type = res.headers.get("content-type") || "";
    if (res.ok && res.body && type.startsWith("text/plain")) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        onText(text);
      }
      if (text.trim()) return;
    }
  } catch (err) {
    if (signal.aborted) return;
  }
  // Fallback: type the local answer out so it feels the same.
  const answer = localAnswer(history[history.length - 1].content);
  for (let i = 0; i <= answer.length; i += 3) {
    if (signal.aborted) return;
    onText(answer.slice(0, i));
    await new Promise((r) => setTimeout(r, 8));
  }
  onText(answer);
}

// ---------- icons ----------

const ArrowUp = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Close = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const Sparkle = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5c.5 4.6 2.9 7 9.5 9.5-6.6 2.5-9 4.9-9.5 9.5-.5-4.6-2.9-7-9.5-9.5 6.6-2.5 9-4.9 9.5-9.5z" fill="currentColor" />
  </svg>
);

const Avatar = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <span className={`agent-avatar agent-avatar--${size}`} aria-hidden="true">
    <img src={config.about.photo} alt="" />
  </span>
);

// ---------- component ----------

const Agent = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  // A closed panel stays in the DOM for the animation; keep it out of tab order.
  useEffect(() => {
    panel.current?.toggleAttribute("inert", !open);
  }, [open]);

  // Esc closes; focus the field on open.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => field.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep the newest message in view while it streams.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => () => abort.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      const history: Msg[] = [...messages, { role: "user", content: q }];
      setMessages(history);
      setInput("");
      setBusy(true);
      abort.current = new AbortController();
      let started = false;
      await ask(
        history,
        (t) => {
          if (!started) {
            started = true;
            setMessages((m) => [...m, { role: "assistant", content: t }]);
          } else {
            setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: t }]);
          }
        },
        abort.current.signal
      );
      setBusy(false);
    },
    [busy, messages]
  );

  const reset = () => {
    abort.current?.abort();
    setMessages([]);
    setBusy(false);
    field.current?.focus();
  };

  const waiting = busy && messages[messages.length - 1]?.role === "user";

  return (
    <>
      <button
        type="button"
        className={`agent-launcher${open ? " is-hidden" : ""}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-cursor-label="Ask"
      >
        <Avatar size="sm" />
        <span className="agent-launcher__text">
          Ask about <b>Hassan</b>
        </span>
        <span className="agent-launcher__spark">
          <Sparkle />
        </span>
      </button>

      <div
        className={`agent-panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label="Ask about Hassan"
        aria-hidden={!open}
        ref={panel}
      >
        <header className="agent-head">
          <Avatar />
          <div className="agent-head__id">
            <strong>Hassan's agent</strong>
            <span>
              <i className="agent-dot" /> Knows his whole portfolio
            </span>
          </div>
          {messages.length > 0 && (
            <button type="button" className="agent-head__btn agent-head__btn--text" onClick={reset}>
              New chat
            </button>
          )}
          <button type="button" className="agent-head__btn" onClick={() => setOpen(false)} aria-label="Close">
            <Close />
          </button>
        </header>

        <div className="agent-body" ref={scroller} data-lenis-prevent>
          {messages.length === 0 ? (
            <div className="agent-intro">
              <span className="agent-intro__spark">
                <Sparkle />
              </span>
              <h2 className="agent-intro__title">
                Ask me anything about <span className="text-gradient agent-grad">Hassan</span>.
              </h2>
              <p className="agent-intro__sub">
                His projects, experience, stack or how to reach him. I answer from his portfolio.
              </p>
              <ul className="agent-chips">
                {SUGGESTIONS.map((s) => (
                  <li key={s.q}>
                    <button type="button" className={`agent-chip agent-chip--${s.hue}`} onClick={() => send(s.q)}>
                      {s.q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="agent-thread" aria-live="polite">
              {messages.map((m, i) => (
                <li key={i} className={`agent-msg agent-msg--${m.role}`}>
                  {m.role === "assistant" ? <Markdown text={m.content} /> : m.content}
                </li>
              ))}
              {waiting && (
                <li className="agent-msg agent-msg--assistant agent-typing" aria-label="Thinking">
                  <span />
                  <span />
                  <span />
                </li>
              )}
            </ol>
          )}
        </div>

        <form
          className="agent-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="agent-field">
            <textarea
              ref={field}
              rows={1}
              value={input}
              maxLength={800}
              placeholder="Ask about Hassan…"
              aria-label="Your question"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button type="submit" className="agent-send" disabled={!input.trim() || busy} aria-label="Send">
              <ArrowUp />
            </button>
          </div>
          <p className="agent-note">AI can make mistakes. Check anything important with Hassan.</p>
        </form>
      </div>
    </>
  );
};

export default Agent;
