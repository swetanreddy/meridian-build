import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageSquare, RotateCcw, X } from "lucide-react";

type Stage = "project" | "timeline" | "contact" | "complete";
type Message = { id: number; role: "assistant" | "visitor"; text: string };

const projectReplies = ["A new home", "Commercial space", "Renovation", "Something else"];
const timelineReplies = ["Within 3 months", "3–6 months", "6–12 months", "Just exploring"];

const firstMessage: Message = {
  id: 1,
  role: "assistant",
  text: "Hello — I’m Meridian’s enquiry assistant. What are you planning in Hyderabad?",
};

export default function EnquiryChat() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("project");
  const [messages, setMessages] = useState<Message[]>([firstMessage]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const messageId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const addMessage = (role: Message["role"], text: string) => {
    messageId.current += 1;
    setMessages((current) => [...current, { id: messageId.current, role, text }]);
  };

  const replyAfterDelay = (text: string, nextStage: Stage) => {
    setTyping(true);
    window.setTimeout(() => {
      addMessage("assistant", text);
      setStage(nextStage);
      setTyping(false);
    }, 650);
  };

  const handleAnswer = (answer: string) => {
    if (!answer.trim() || typing) return;
    addMessage("visitor", answer.trim());
    setDraft("");

    if (stage === "project") {
      replyAfterDelay("Thanks. When would you ideally like construction to begin?", "timeline");
      return;
    }

    if (stage === "timeline") {
      replyAfterDelay("Good to know. Share an email or phone number and our projects team can follow up.", "contact");
      return;
    }

    if (stage === "contact") {
      replyAfterDelay("Enquiry noted. This is a website demo, so nothing was sent — but the real hand-off is ready to connect to your CRM or inbox.", "complete");
    }
  };

  const submitDraft = (event: FormEvent) => {
    event.preventDefault();
    handleAnswer(draft);
  };

  const reset = () => {
    messageId.current = 1;
    setMessages([firstMessage]);
    setStage("project");
    setDraft("");
    setTyping(false);
  };

  const replies = stage === "project" ? projectReplies : stage === "timeline" ? timelineReplies : [];

  return (
    <div className="enquiry-chat">
      <AnimatePresence>
        {open && (
          <motion.section
            className="chat-panel"
            aria-label="Meridian enquiry assistant"
            initial={{ opacity: 0, y: 22, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: .98 }}
            transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="chat-header">
              <div className="chat-mark">M</div>
              <div><strong>MERIDIAN ASSIST</strong><span><i /> ENQUIRY DESK · DEMO</span></div>
              <button onClick={() => setOpen(false)} aria-label="Close enquiry assistant"><X size={19} /></button>
            </header>

            <div className="chat-messages" ref={scrollRef} aria-live="polite">
              <p className="chat-date">TODAY</p>
              {messages.map((message) => (
                <motion.div
                  className={`chat-message ${message.role}`}
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.text}
                </motion.div>
              ))}
              {typing && <div className="chat-typing" aria-label="Assistant is typing"><span /><span /><span /></div>}
            </div>

            <div className="chat-actions">
              {replies.length > 0 && !typing && (
                <div className="quick-replies" aria-label="Suggested replies">
                  {replies.map((reply) => <button key={reply} onClick={() => handleAnswer(reply)}>{reply}<span>↗</span></button>)}
                </div>
              )}

              {stage === "complete" ? (
                <button className="chat-reset" onClick={reset}><RotateCcw size={15} /> Start another enquiry</button>
              ) : (
                <form className="chat-input" onSubmit={submitDraft}>
                  <label htmlFor="enquiry-message">Your reply</label>
                  <input
                    id="enquiry-message"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={stage === "contact" ? "Email or phone number" : "Type a message"}
                    autoComplete={stage === "contact" ? "email" : "off"}
                  />
                  <button type="submit" disabled={!draft.trim() || typing} aria-label="Send message"><ArrowUp size={17} /></button>
                </form>
              )}
            </div>

            <p className="chat-disclaimer">Scripted demo · No information is submitted</p>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        className={`chat-launcher ${open ? "is-open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close enquiry assistant" : "Open enquiry assistant"}
        aria-expanded={open}
        whileTap={{ scale: .96 }}
      >
        {open ? <X size={21} /> : <><MessageSquare size={19} /><span>START AN ENQUIRY</span></>}
      </motion.button>
    </div>
  );
}
