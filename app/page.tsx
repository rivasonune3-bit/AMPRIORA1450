import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-600 selection:text-white antialiased">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-600 text-white font-extrabold text-xs">
              A
            </span>
            <span className="font-extrabold tracking-tight">AMPRIORA</span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              How It Works
            </a>
            <a href="#profile-engine" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Profile Engine
            </a>
            <a href="#dream-company" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Dream Company Track
            </a>
            <a href="#about" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              About
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 hidden sm:block"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 shadow-xs"
            >
              Build My Career Path →
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column Copy */}
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
                YOUR CAREER, YOUR PATH
              </span>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                Your Dream Career.<br />
                <span className="text-sky-600">One Intelligent Path.</span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-lg">
                Build a clear path from your current skills to the career you want. Dynamic, personalized, and updated directly by your profile.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-sky-700 shadow-xs"
                >
                  Build My Career Path →
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                >
                  Log in
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs font-medium text-slate-500">
                <span>✓ Free to get started</span>
                <span>✓ Built for ambitious students</span>
                <span>✓ Takes 2 minutes</span>
              </div>
            </div>

            {/* Right Column Authentic Image & Product Preview */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* Main Authentic Student Image */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                    alt="Student planning career journey"
                    className="h-[420px] w-full object-cover"
                  />
                </div>

                {/* Overlaid Single Clean Product Preview Card */}
                <div className="absolute -bottom-6 -left-4 right-4 sm:left-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xl md:-bottom-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 font-bold text-sm">
                        🎯
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500">Target Track</div>
                        <div className="text-sm font-bold text-slate-900">Microsoft — AI Engineer</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-500">Readiness</div>
                      <div className="text-lg font-extrabold text-sky-600">68%</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>Current Focus: <strong className="text-slate-900">Machine Learning & PyTorch</strong></span>
                    <span className="text-sky-600 font-semibold">Next Step →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATEMENT + LINEAR FLOW */}
      <section id="how-it-works" className="py-24 md:py-32 bg-slate-50/60 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xl md:text-2xl font-semibold text-slate-500">
              Knowing what you want is only the beginning.
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              AMPRIORA helps you understand what comes next.
            </h2>
          </div>

          {/* Clean Step Flow Visual */}
          <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">01. Target</div>
                <h3 className="text-lg font-bold text-slate-900">Dream Company</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Select your dream target company and role hiring bar.
                </p>
              </div>

              <div className="relative md:border-l md:border-slate-100 md:pl-8">
                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">02. Analysis</div>
                <h3 className="text-lg font-bold text-slate-900">Skill Gap</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Automatically compare your current skills to target requirements.
                </p>
              </div>

              <div className="relative md:border-l md:border-slate-100 md:pl-8">
                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">03. Execution</div>
                <h3 className="text-lg font-bold text-slate-900">Roadmap</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Follow a structured milestone path to build missing qualifications.
                </p>
              </div>

              <div className="relative md:border-l md:border-slate-100 md:pl-8">
                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">04. Today</div>
                <h3 className="text-lg font-bold text-slate-900">Next Action</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Execute your single highest-impact task to move closer every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROFILE AS THE CORE ENGINE */}
      <section id="profile-engine" className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column Product Screenshot Representation */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                      P
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Student Profile</h4>
                      <p className="text-xs text-slate-500">Single Source of Truth</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    Live Synced
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="font-semibold text-slate-500 block mb-1">Career Goal</span>
                    <span className="font-bold text-slate-900 text-sm">AI Engineer</span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="font-semibold text-slate-500 block mb-1">Target Company</span>
                    <span className="font-bold text-slate-900 text-sm">Microsoft</span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="font-semibold text-slate-500 block mb-1.5">Verified Skills</span>
                    <div className="flex flex-wrap gap-1.5 font-medium text-slate-700">
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Python</span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">SQL</span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Git</span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Data Structures</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Copy */}
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
                DYNAMIC CAREER ENGINE
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Your profile changes everything.
              </h2>

              <p className="mt-5 text-base text-slate-600 leading-relaxed">
                AMPRIORA uses your profile as the single source of truth for your entire career experience. When you update your skills or target role, your recommendations adapt instantly.
              </p>

              <div className="mt-8 space-y-3.5">
                {[
                  'Career Readiness Score updates dynamically',
                  'Skill Gap recalculates missing prerequisites',
                  'Step-by-Step Roadmap adapts to your growth',
                  'Opportunities automatically match your exact profile'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 font-bold text-xs">
                      ✓
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DREAM COMPANY TRACK */}
      <section id="dream-company" className="py-24 md:py-32 bg-slate-50/60 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
              TARGET BENCHMARKING
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Start with where you want to go.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Select top companies to benchmark your current profile directly against their specific hiring standards.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: 'Google', role: 'Software Engineer' },
              { name: 'Microsoft', role: 'AI Engineer' },
              { name: 'Amazon', role: 'SDE / Cloud' },
              { name: 'NVIDIA', role: 'CUDA / ML Architect' },
              { name: 'Adobe', role: 'Full Stack Engineer' }
            ].map((company) => (
              <div
                key={company.name}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-xs"
              >
                <div className="text-sm font-extrabold text-slate-900">{company.name}</div>
                <div className="mt-1 text-xs text-slate-500 font-medium">{company.role}</div>
                <div className="mt-4 text-xs font-semibold text-sky-600">View Hiring Track →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HUMAN-CENTERED STORY */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"
                  alt="Student collaborating and building career path"
                  className="h-[380px] w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                From career confusion to a clear next step.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Most students don't lack ambition — they lack direction. AMPRIORA turns overwhelming career advice into a personalized, step-by-step roadmap tailored specifically to your goal and current skills.
              </p>
              <div className="mt-8">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-sky-700 shadow-xs"
                >
                  Start Your Path Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Your dream career has a destination. <br className="hidden sm:inline" />
            Build the path.
          </h2>

          <div className="mt-8 flex justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-sky-500 shadow-md"
            >
              Build My Career Path →
            </Link>
          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            Free to start · Takes under 2 minutes
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col justify-between gap-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white font-extrabold text-xs">
              A
            </span>
            <span className="font-extrabold text-slate-900 text-sm">AMPRIORA</span>
            <span className="text-slate-400">|</span>
            <span>Your Dream Career. One Intelligent Path.</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900">How It Works</a>
            <a href="#profile-engine" className="hover:text-slate-900">Profile Engine</a>
            <a href="#dream-company" className="hover:text-slate-900">Dream Company</a>
            <Link href="/auth/login" className="hover:text-slate-900">Log in</Link>
          </div>

          <p>© 2026 AMPRIORA. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}