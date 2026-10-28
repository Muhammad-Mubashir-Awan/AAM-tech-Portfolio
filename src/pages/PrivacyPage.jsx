import { company } from '../data.js'
import PageHead from '../components/PageHead.jsx'
import { openCookieSettings } from '../components/Analytics.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

// Change this date whenever the text below is edited
const UPDATED = '28 October 2026'

const ext = { target: '_blank', rel: 'noopener noreferrer' }

function Section({ title, children }) {
  return (
    <section className="border-t border-border pt-8 not-first:mt-8 first:border-0 first:pt-0">
      <h2 className="mb-3 text-[1.3rem]">{title}</h2>
      {children}
    </section>
  )
}

// Linked from the footer and the cookie notice only, not the top menu
export default function PrivacyPage() {
  usePageTitle('Privacy policy')
  const email = <a href={`mailto:${company.email}`}>{company.email}</a>

  return (
    <>
      <PageHead
        eyebrow="Legal"
        title={<>Privacy <span className="text-gradient">policy</span></>}
        intro={`How we handle the information you share with us. Last updated ${UPDATED}.`}
      />

      <div className="wrap max-w-3xl pt-6 pb-18 md:pb-25">
        <article className="rounded-xl border border-pine-800/10 bg-card/90 p-6 shadow-[0_10px_30px_rgba(11,43,38,0.08)] md:p-10 [&_a]:font-medium [&_a]:text-pine-600 [&_a]:underline [&_a]:underline-offset-2 [&_li]:mb-2 [&_p]:text-foreground/85 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-foreground/85 [&_ul]:marker:text-pine-500">
          <Section title="Who we are">
            <p>
              {company.name} (“we”, “us”) is a software and web development company working
              remotely from Pakistan. This policy explains what information this website collects,
              why we collect it, and the choices you have. Questions? Email us at {email}.
            </p>
          </Section>

          <Section title="Information you send us">
            <ul>
              <li>
                <strong>Project form and free website audit:</strong> your name and email address,
                plus anything else you choose to tell us, such as your company, phone or WhatsApp
                number, budget, timeline, project details or website address.
              </li>
              <li>
                These forms are delivered by Formspree, a form service that emails your message to
                us. See <a href="https://formspree.io/legal/privacy-policy" {...ext}>Formspree's privacy policy</a>.
              </li>
              <li>
                <strong>WhatsApp:</strong> if you message us on WhatsApp, the conversation is
                handled by WhatsApp under its own privacy policy.
              </li>
              {company.calLink && (
                <li>
                  <strong>Booking a call:</strong> if you book a call through our booking page, the
                  details you enter are handled by Cal.com.
                </li>
              )}
            </ul>
          </Section>

          <Section title="Analytics and cookies">
            <ul>
              <li>
                Only if you click <strong>Accept</strong> on the cookie notice, we use Google
                Analytics to understand how visitors use the site: which pages are viewed, for how
                long, the type of device and browser, approximate location (such as the city) and
                how you found us. It uses cookies such as <code>_ga</code>.
              </li>
              <li>If you click <strong>Decline</strong>, Google Analytics does not run.</li>
              <li>
                You can change your choice at any time with{' '}
                <button type="button" onClick={openCookieSettings} className="cursor-pointer border-0 bg-transparent p-0 font-medium text-pine-600 underline underline-offset-2">
                  Cookie settings
                </button>{' '}
                at the bottom of every page.
              </li>
              <li>
                Learn more in <a href="https://policies.google.com/privacy" {...ext}>Google's privacy policy</a> and{' '}
                <a href="https://policies.google.com/technologies/partner-sites" {...ext}>how Google uses information from sites that use its services</a>.
              </li>
            </ul>
          </Section>

          <Section title="Saved in your browser">
            <p>
              The site remembers your cookie choice, and how many messages you've sent today (we
              allow two a day to stop spam). Both are saved only in your own browser and are never
              sent to us. Clearing your browser data removes them.
            </p>
          </Section>

          <Section title="How we use your information">
            <ul>
              <li>To reply to your enquiry, prepare a quote, send the audit you asked for and deliver your project.</li>
              <li>To improve this website, using the analytics described above.</li>
              <li>We never sell your information, use it for advertising, or add you to a mailing list without asking.</li>
            </ul>
          </Section>

          <Section title="How long we keep it">
            <p>
              We keep your messages only as long as we need them to respond to you and to work
              with you, and you can ask us to delete them at any time. Google Analytics data is
              deleted automatically after the retention period set in our Analytics account.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              You can ask us to show you, correct or delete the information we hold about you.
              Just email {email} and we'll take care of it.
            </p>
          </Section>

          <Section title="Children">
            <p>This website isn't aimed at children, and we don't knowingly collect information from anyone under 13.</p>
          </Section>

          <Section title="Changes to this policy">
            <p className="mb-0">
              If we change how we handle information, we'll update this page and the date at the top.
            </p>
          </Section>
        </article>
      </div>
    </>
  )
}
