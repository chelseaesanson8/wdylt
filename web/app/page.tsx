import { StreakDemo } from "@/components/streak-demo";
import { ThemeToggle } from "@/components/theme-toggle";
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

// Sample entries to show the idea, not real users. Three people "nearby"
// one entry about patience: one from code, two from elsewhere.
const sampleEntries = [
  {
    handle: "@jnwlr",
    no: "iv",
    text: "Wrote the failing test before touching the fix. Slower to start, but the bug stayed fixed.",
    note: "also learning to slow down first",
  },
  {
    handle: "@maren.runs",
    no: "iii",
    text: "Kept my long run at an easy pace for once and finished the last mile faster than the first.",
    note: "also finding speed in going slow",
  },
  {
    handle: "@ana.paints",
    no: "ii",
    text: "Finished a watercolour course. Waiting for each layer to dry is the whole technique.",
    note: "also learning to wait",
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
        <div className="masthead__end">
          <span className="mono dim">no. 001</span>
          <ThemeToggle />
        </div>
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

        <section className="streak" aria-labelledby="streak-title">
          <div className="streak__copy">
            <p className="section-label mono">keep the thread</p>
            <h2 id="streak-title" className="streak__title">
              One page a day adds up.
            </h2>
            <p className="streak__body">
              Every day you write, another page fills in. Your streak keeps count, a quiet reason to come back
              tomorrow.
            </p>
          </div>
          <StreakDemo />
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
