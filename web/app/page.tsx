import { Wordmark } from "@/components/wordmark";
import { TypedHero } from "@/components/typed-hero";
import { WaitlistForm } from "@/components/waitlist-form";

const steps = [
  {
    no: "i",
    title: "Write one page",
    body: "A few sentences on what you learned today. Once you set it down, it stays as written.",
  },
  {
    no: "ii",
    title: "We read between the lines",
    body: "Each day we look for entries that sit close to yours, whatever words they used.",
  },
  {
    no: "iii",
    title: "Meet kindred learners",
    body: "See who was nearby today and what they found. Strangers, briefly on the same page.",
  },
];

// Sample entries from the design, to show the idea. Not real users.
const sampleEntries = [
  {
    handle: "@jnwlr",
    no: "iv",
    text: "Turned a recursive markdown parser into a loop with an explicit stack. Depth limits stopped being a mystery.",
    note: "also thinking about unbounded depth",
  },
  {
    handle: "@sofiabuilds",
    no: "iii",
    text: "Tail-call optimisation is in the ES spec but only Safari shipped it. Ten years of assuming otherwise.",
    note: "also learning about recursion",
  },
  {
    handle: "@ravi.ln",
    no: "ii",
    text: "Traced a production stack overflow to a cycle in a graph I assumed was a tree. The assumption was the bug.",
    note: "also chasing a stack overflow",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#join">
        Skip to the waitlist
      </a>

      <header className="masthead">
        <span className="mono dim">a daily practice</span>
        <Wordmark />
        <span className="mono dim">no. 001</span>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="lamp" aria-hidden="true" />
          <p className="mono muted">One page a day</p>
          <TypedHero id="hero-title" />
          <p className="hero__lede">
            Write it down before you forget why it mattered. Each day we&rsquo;ll show you the people who
            were learning something close to it.
          </p>
          <div className="hero__form">
            <WaitlistForm id="join" />
          </div>
        </section>

        <section className="steps" aria-labelledby="steps-title">
          <h2 id="steps-title" className="section-label mono">
            how it works
          </h2>
          <ol className="steps__list">
            {steps.map((step) => (
              <li key={step.no} className="step">
                <span className="mono dim step__no" aria-hidden="true">
                  {step.no}
                </span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__body">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="kindred" aria-labelledby="kindred-title">
          <p className="mono muted center">page 214 filed</p>
          <h2 id="kindred-title" className="kindred__title">
            Three people were nearby today
          </h2>
          <ul className="kindred__list" aria-label="Sample entries">
            {sampleEntries.map((entry) => (
              <li key={entry.handle} className="entry">
                <div className="entry__meta mono">
                  <span className="muted">{entry.handle}</span>
                  <span className="dim" aria-hidden="true">
                    {entry.no}
                  </span>
                </div>
                <p className="entry__text">{entry.text}</p>
                <p className="entry__note">{entry.note}</p>
              </li>
            ))}
          </ul>
          <p className="mono dim center small">sample entries</p>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <h2 id="closing-title" className="closing__title">
            Start the habit with us.
          </h2>
          <p className="closing__body">
            Coming to iPhone first. Join the waitlist and we&rsquo;ll send one email when the first
            pages open.
          </p>
          <a className="text-link mono" href="#join">
            save your place
          </a>
        </section>
      </main>

      <footer className="colophon">
        <Wordmark />
        <span className="mono dim">&copy; {new Date().getFullYear()} What Did You Learn Today</span>
      </footer>
    </>
  );
}
