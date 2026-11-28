import { MastheadEdge } from "@/components/masthead-edge";
import { StackDemo } from "@/components/stack-demo";
import { ThemeToggle } from "@/components/theme-toggle";
import { TypedHero } from "@/components/typed-hero";
import { WaitlistForm } from "@/components/waitlist-form";
import { Wordmark } from "@/components/wordmark";

const steps = [
  {
    no: "1",
    title: "Write one page",
    body: "A few sentences on what you learned today. Once you stamp it, it stays as written.",
  },
  {
    no: "2",
    title: "We read between the lines",
    body: "Each day we look for entries that sit close to yours, whatever words they used.",
  },
  {
    no: "3",
    title: "Meet kindred learners",
    body: "See who was nearby today and what they found. Strangers, briefly on the same page.",
  },
];

// Sample entries to show the idea, not real users. Three people "nearby"
// one entry about patience: one from code, two from elsewhere.
const sampleEntries = [
  {
    handle: "@jnwlr",
    no: "1",
    text: "Wrote the failing test before touching the fix. Slower to start, but the bug stayed fixed.",
    note: "also learning to slow down first",
  },
  {
    handle: "@maren.runs",
    no: "2",
    text: "Kept my long run at an easy pace for once and finished the last mile faster than the first.",
    note: "also finding speed in going slow",
  },
  {
    handle: "@ana.paints",
    no: "3",
    text: "Finished a watercolour course. Waiting for each layer to dry is the whole technique.",
    note: "also learning to wait",
  },
];

// The "w." seal stamps; decorative, so they carry no alt text.
function Seal({ variant }: { variant: "square-cream" | "circle" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- small static PNG
    <img className="seal" src={`/brand/seal-${variant}.png`} alt="" width={468} height={468} />
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#join">
        Skip to the waitlist
      </a>

      <header className="masthead">
        <MastheadEdge />
        <div className="wrap">
          <Wordmark />
          <div className="masthead__end">
            <span className="label">One page a day</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <span className="hero__bar" aria-hidden="true" />
            <div className="hero__inner">
              <p className="hero__eyebrow label">A daily learning journal</p>
              <TypedHero id="hero-title" />
              <p className="hero__lede">
                Write it down before you forget why it mattered. Stamp the page, and each day we&rsquo;ll show
                you the people who were learning something close to it.
              </p>
            </div>
          </div>
          <Seal variant="square-cream" />
        </section>
        <div className="vbar" aria-hidden="true" />

        <section className="join" aria-label="Join the waitlist">
          <div className="wrap">
            <WaitlistForm id="join" />
          </div>
        </section>

        <section className="sec steps" aria-labelledby="steps-title">
          <div className="wrap">
            <div className="sec__head">
              <p className="sec__label label">How it works</p>
              <h2 id="steps-title" className="sec__title">
                Write. Stamp. Meet.
              </h2>
            </div>
            <ol className="steps__list">
              {steps.map((step) => (
                <li key={step.no} className="step">
                  <span className="step__no" aria-hidden="true">
                    {step.no}
                  </span>
                  <div>
                    <h3 className="step__title">{step.title}</h3>
                    <p className="step__body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec streak" aria-labelledby="streak-title">
          <div className="wrap">
            <div className="sec__head">
              <p className="sec__label label">Keep the thread</p>
              <h2 id="streak-title" className="sec__title">
                One page a day adds up.
              </h2>
              <p className="sec__body">
                Every page you stamp adds a book to your stack. Keep going and it grows. Miss a day and it stays a
                blank book.
              </p>
            </div>
            <StackDemo />
          </div>
        </section>

        <section className="kindred" aria-labelledby="kindred-title">
          <div className="wrap">
            <div className="sec__head">
              <p className="sec__label label">Page 214 stamped</p>
              <h2 id="kindred-title" className="sec__title">
                Three people were nearby today
              </h2>
            </div>
            <ul className="kindred__list" aria-label="Sample entries">
              {sampleEntries.map((entry) => (
                <li key={entry.handle} className="ticket">
                  <div className="ticket__head">
                    <span>{entry.handle}</span>
                    <span className="ticket__no" aria-hidden="true">
                      {entry.no}
                    </span>
                  </div>
                  <p className="ticket__text">{entry.text}</p>
                  <p className="ticket__note">
                    <i aria-hidden="true" />
                    {entry.note}
                  </p>
                </li>
              ))}
            </ul>
            <p className="kindred__foot label">Sample entries</p>
          </div>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <div className="wrap">
            <h2 id="closing-title" className="closing__title">
              Start the habit with us.
            </h2>
            <p className="closing__body">
              Coming to iPhone first. Join the waitlist and we&rsquo;ll send one email when the first pages open.
            </p>
            <a className="text-link pressable" href="#join">
              <i aria-hidden="true" />
              Save your place
            </a>
          </div>
          <Seal variant="circle" />
          <div className="stairs" aria-hidden="true">
            <span style={{ width: "7.5rem" }} />
            <span style={{ width: "5.5rem" }} />
            <span style={{ width: "3.5rem" }} />
          </div>
        </section>
      </main>

      <footer className="colophon">
        <div className="wrap">
          <Wordmark size="sm" />
          <span className="label">&copy; 2026 WDYLT</span>
        </div>
      </footer>
    </>
  );
}
