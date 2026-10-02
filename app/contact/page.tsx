export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#d6ff00]">
          TRIBUTE TO MESSI
        </p>

        <h1 className="text-4xl font-black tracking-tight md:text-6xl">
          Contact Us
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
          Have a question, correction, copyright concern, takedown request,
          or feedback? You can contact the TributeToMessi.online team using
          the information below.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-xl font-bold">General Contact</h2>

            <p className="mt-3 leading-7 text-white/60">
              For general questions, website feedback, corrections,
              collaboration inquiries, or other matters related to the
              website, please contact us by email.
            </p>

            <a
              href="mailto:voxelchoices@gmail.com"
              className="mt-5 inline-block font-semibold text-[#d6ff00] transition hover:opacity-80"
            >
              voxelchoices@gmail.com
            </a>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-xl font-bold">Copyright & Takedown</h2>

            <p className="mt-3 leading-7 text-white/60">
              If you believe material on this website infringes your copyright
              or other rights, please email us with the relevant details,
              including the material in question and the page where it appears.
            </p>

            <a
              href="mailto:voxelchoices@gmail.com?subject=Copyright%20or%20Takedown%20Request"
              className="mt-5 inline-block font-semibold text-[#d6ff00] transition hover:opacity-80"
            >
              Send a Copyright Request
            </a>
          </section>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <h2 className="text-xl font-bold">Instagram</h2>

          <p className="mt-3 leading-7 text-white/60">
            Follow our football content and updates on Instagram.
          </p>

          <a
            href="https://www.instagram.com/courtoflegend/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block font-semibold text-[#d6ff00] transition hover:opacity-80"
          >
            @courtoflegend →
          </a>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <h2 className="text-xl font-bold">What to Include in a Request</h2>

          <ul className="mt-4 space-y-3 text-white/60">
            <li>• Your name and contact information</li>
            <li>• A description of the material concerned</li>
            <li>• The page or location where the material appears</li>
            <li>• An explanation of your concern or request</li>
            <li>• Any supporting information that helps us review the request</li>
          </ul>
        </div>

        <p className="mt-10 border-t border-white/10 pt-8 text-sm text-white/40">
          We aim to review legitimate requests and respond as soon as
          reasonably possible.
        </p>
      </div>
    </main>
  );
}