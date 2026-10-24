import Footer from "@/components/footer/page";
import NavBar from "@/components/nav-bar/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, MapPin } from "lucide-react";

export default function ContactUs() {
  return (
    <main>
      <NavBar />

      <section className="text-white bg-linear-to-br to-primary-950 from-primary-800 relative overflow-hidden py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <div className="max-w-3xl">
            <nav
              aria-label="breadcrumb"
              className="mb-4 flex items-center gap-2 text-sm text-white/75"
            >
              <a
                className="hover:underline"
                href="/preview/a93c44f3-e0d1-450c-952e-9c63f3305182/15026836"
                data-discover="true"
              >
                Home
              </a>
              <span aria-hidden="true">/</span>
              <span className="truncate">Contact</span>
            </nav>
            <h1 className="text-4xl leading-[1.08] md:text-6xl">
              Get in Touch with Kasirize
            </h1>
            <p className="mt-5 max-w-2xl text-lg md:text-xl text-white/85">
              Whether you want to create a profile, post a task, or offer
              mentorship, the Kasirize team is here to help.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="#contact"
                className="flash-btn inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary h-12 px-7 text-base bg-white text-brand-deep shadow-card hover:bg-white/90"
              >
                Send a Message
              </a>
              <a
                className="flash-btn inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary h-12 px-7 text-base border border-white/45 bg-transparent text-white hover:bg-white/10"
                href="/preview/a93c44f3-e0d1-450c-952e-9c63f3305182/15026836"
                data-discover="true"
              >
                Create My Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-16 md:py-24 text-white bg-linear-to-br from-primary to-primary"
      >
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div
                data-reveal=""
                className="mb-10 flex max-w-2xl flex-col gap-4 md:mb-14 is-in"
              >
                <span className="flash-bar flash-bar-invert" />
                <h2 className="text-3xl leading-tight md:text-[2.6rem]">
                  Send Us a Message
                </h2>
                <p className="text-lg leading-relaxed text-white/80">
                  Tell us what you need and we&apos;ll get back to you within
                  one business day.
                </p>
              </div>
              <p className="mt-5 text-sm text-white/75">
                This sends your details to the Kasirize team. Nothing you send
                is published, and any sign-in on this preview stays in your
                browser.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div
                className="flash-card rounded-card border border-border bg-card p-6 md:p-7 flash-card-solid text-foreground shadow-lift is-in"
                data-reveal=""
              >
                <form
                  id="contact-form"
                  data-readdy-form="true"
                  className="grid gap-5"
                >
                  <div className="grid gap-2">
                    <label
                      htmlFor="c-0"
                      className="text-sm font-semibold leading-none"
                    >
                      Full name
                    </label>
                    <Input
                      id="c-0"
                      placeholder="Your name"
                      required
                      className="h-12 w-full rounded-field border border-border bg-background px-3.5 text-base text-foreground placeholder:text-muted-foreground"
                      type="text"
                      name="f0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="c-1"
                      className="text-sm font-semibold leading-none"
                    >
                      Email address
                    </label>
                    <Input
                      id="c-1"
                      placeholder="you@example.com"
                      required
                      className="h-12 w-full rounded-field border border-border bg-background px-3.5 text-base text-foreground placeholder:text-muted-foreground"
                      type="email"
                      name="f1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="c-2"
                      className="text-sm font-semibold leading-none"
                    >
                      I am a
                    </label>
                    <select
                      id="c-2"
                      name="f2"
                      required
                      className="h-12 w-full rounded-field border border-border bg-background px-3.5 text-base text-foreground placeholder:text-muted-foreground"
                    >
                      <option value="" disabled selected>
                        Select your role
                      </option>
                      <option value="Youth">Youth</option>
                      <option value="Task Requester">Task Requester</option>
                      <option value="Employer">Employer</option>
                      <option value="Skill Mentor">Skill Mentor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="c-3"
                      className="text-sm font-semibold leading-none"
                    >
                      How can we help?
                    </label>
                    <Textarea
                      id="c-3"
                      name="message"
                      rows={3}
                      maxLength={500}
                      placeholder="Tell us a little about what you need"
                      className="w-full rounded-field bg-background px-3.5 text-base text-foreground placeholder:text-muted-foreground h-auto min-h-24 py-3"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="flash-btn inline-flex h-12 w-full items-center justify-center rounded-btn bg-primary text-base font-semibold text-primary-foreground shadow-card transition hover:brightness-110 disabled:opacity-60"
                  >
                    Send Message
                  </Button>
                  <p role="status" className="text-sm text-primary hidden"></p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div
                data-reveal=""
                className="mb-10 flex max-w-2xl flex-col gap-4 md:mb-14 is-in"
              >
                <span className="flash-bar" aria-hidden="true"></span>
                <h2 className="text-3xl leading-tight md:text-[2.6rem]">
                  Visit Us
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Our team is available by appointment.
                </p>
              </div>
              <address data-reveal="" className="not-italic is-in">
                <a
                  href="https://www.google.com/maps/search/?api=1&amp;query=South%20Africa&amp;hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-btn border border-border bg-card px-5 py-3 text-base font-semibold shadow-card hover:border-primary/50"
                >
                  <MapPin className="size-5 flex-none text-primary" />
                  South Africa
                </a>
              </address>
              <dl
                data-reveal=""
                className="mt-6 divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card is-in"
              >
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Clock className="size-4 text-primary" />
                    Monday
                  </dt>
                  <dd className="text-muted-foreground tabular-nums">
                    09:00 – 17:00
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Clock className="size-4 text-primary" />
                    Tuesday
                  </dt>
                  <dd className="text-muted-foreground tabular-nums">
                    09:00 – 17:00
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Clock className="size-4 text-primary" />
                    Wednesday
                  </dt>
                  <dd className="text-muted-foreground tabular-nums">
                    09:00 – 17:00
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Clock className="size-4 text-primary" />
                    Thursday
                  </dt>
                  <dd className="text-muted-foreground tabular-nums">
                    09:00 – 17:00
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Clock className="size-4 text-primary" />
                    Friday
                  </dt>
                  <dd className="text-muted-foreground tabular-nums">
                    09:00 – 16:00
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Clock className="size-4 text-primary" />
                    Saturday
                  </dt>
                  <dd className="text-muted-foreground tabular-nums">Closed</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Clock className="size-4 text-primary" />
                    Sunday
                  </dt>
                  <dd className="text-muted-foreground tabular-nums">Closed</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-muted-foreground">
                Please book before visiting so we can make sure the right person
                is available to help.
              </p>
            </div>
            <div
              data-reveal=""
              className="relative min-h-80 overflow-hidden rounded-card border border-border bg-muted shadow-lift lg:min-h-110 is-in"
            >
              <iframe
                title="South Africa"
                src="https://maps.google.com/maps?q=South%20Africa&amp;z=12&amp;hl=en&amp;output=embed"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
