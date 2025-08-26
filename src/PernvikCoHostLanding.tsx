import React, { useMemo, useState } from "react";

// Full sida med hero‑bakgrund, popups, kalkylator, kontakt (e‑postskick), Calendly, minispel och 💸‑regn.
// Fix: rättat felaktiga escape‑tecken, stängda kommentarer, och korrekt JSX‑struktur.

// ===== KONFIG =====
const CALENDLY_URL = ""; // ex: "https://calendly.com/ditt-handle/15min"
const FORM_ENDPOINT = "https://formsubmit.co/ajax/arvid@pernvikproperties.com"; // e‑postskick

// Publika bildvägar (lägg filerna i /public)
const HERO_IMG_URL = "/hero-pernvik.png"; // din hero‑bild
const EXTRA_UNDER_HOW_IMG = "/hero-extra-under-how.png"; // extra bild under "Så hjälper vi dig"

// Fallback‑gradient om bilden saknas
const HERO_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0a0a0a'/>
          <stop offset='100%' stop-color='#1a1a1a'/>
        </linearGradient>
        <pattern id='d' width='40' height='40' patternUnits='userSpaceOnUse'>
          <circle cx='2' cy='2' r='2' fill='rgba(255,255,255,0.08)'/>
        </pattern>
      </defs>
      <rect width='1200' height='600' fill='url(#g)'/>
      <rect width='1200' height='600' fill='url(#d)'/>
    </svg>`
  );

function getFocusableNodes(el: HTMLElement) {
  const all = Array.from(
    el.querySelectorAll<HTMLElement>(
      'a[href], area[href], button, textarea, input, select, [tabindex]'
    )
  );
  return all.filter(
    (n) => !n.hasAttribute('disabled') && n.getAttribute('tabindex') !== "-1"
  );
}
function formatSEK(n: number) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export default function PernvikCoHostLanding() {
  // --- Hero‑bild preload & fallback ---
  const [heroSrc, setHeroSrc] = useState(HERO_FALLBACK);
  React.useEffect(() => {
    if (!HERO_IMG_URL) return;
    const img = new Image();
    img.onload = () => setHeroSrc(HERO_IMG_URL);
    img.onerror = () => setHeroSrc(HERO_FALLBACK);
    img.src = HERO_IMG_URL;
  }, []);

  const [nightly, setNightly] = useState(2200);
  const [occ, setOcc] = useState(72);
  const [cleanFee, setCleanFee] = useState(900);
  const [staysPerMonth, setStaysPerMonth] = useState(6);
  const [mgmtFee, setMgmtFee] = useState(15);
  const [includeCleaning, setIncludeCleaning] = useState(false);

  const [popup, setPopup] = useState<
    null | 'how' | 'calculator' | 'results' | 'contact' | 'call' | 'success' | 'error'
  >(null);
  const [showGame, setShowGame] = useState(false);

  const [rainActive, setRainActive] = useState(false);
  const [rainSeed, setRainSeed] = useState(0);
  const rainTimer = React.useRef<number | null>(null);
  const triggerRain = React.useCallback(() => {
    if (rainTimer.current) window.clearTimeout(rainTimer.current);
    setRainSeed((s) => s + 1);
    setRainActive(true);
    rainTimer.current = window.setTimeout(() => setRainActive(false), 2400);
  }, []);

  const calc = useMemo(() => {
    const nightsPerMonth = Math.round((occ / 100) * 30);
    const revenue = nightly * nightsPerMonth;
    const fee = (mgmtFee / 100) * revenue;
    const cleaningCost = includeCleaning ? cleanFee * staysPerMonth : 0;
    const ownerPayout = revenue - fee - cleaningCost;
    return {
      nightsPerMonth,
      revenue,
      fee,
      cleaningCost,
      ownerPayout,
      weeklyRevenue: revenue / 4.345,
    };
  }, [nightly, occ, cleanFee, staysPerMonth, mgmtFee, includeCleaning]);

  // Dev‑testfall (körs inte i produktion)
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.assert(formatSEK(1000).includes('SEK'), 'formatSEK ska returnera SEK');
    const tmp = document?.createElement?.('div');
    if (tmp) {
      tmp.innerHTML = `<button disabled></button><button></button>`;
      const nodes = getFocusableNodes(tmp as HTMLElement);
      console.assert(nodes.length === 1, 'getFocusableNodes ska filtrera disabled');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100 relative pb-28 md:pb-32">
      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <a href="#top" className="group inline-flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white text-zinc-900 grid place-items-center font-black">PP</div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Pernvik Properties</p>
              <p className="-mt-1 font-semibold">Airbnb Co‑Hosting</p>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button className="hover:text-white/90" onClick={() => setPopup('how')}>Så funkar det</button>
            <button className="hover:text-white/90" onClick={() => setPopup('calculator')}>Kalkylator</button>
            <button className="hover:text-white/90" onClick={() => setPopup('results')}>Resultat</button>
            <button className="hover:text-white/90" onClick={() => setPopup('contact')}>Kontakt</button>
            <button onClick={() => setShowGame(true)} className="rounded-2xl px-4 py-2 border border-white/20 hover:bg-white/10 transition">Spela</button>
          </nav>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setPopup('call')}
            onMouseEnter={triggerRain}
            className="rounded-2xl px-4 py-2 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] active:scale-[0.99] transition"
          >
            Ring mig
          </button>
        </div>
      </header>

   {/* HERO */}
<section id="top" className="relative">
  <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
    <div className="relative h-[50vh] sm:h-[56vh] lg:h-[64vh]">
      {/* Bakgrundsbild */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroSrc})` }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/40" />

      <div className="grid lg:grid-cols-[1fr,1.25fr,1fr] items-center gap-4 lg:gap-6 h-full">
        {/* Vänster dekorpanel */}
        <div className="hidden lg:block relative overflow-hidden bg-white/5 h-full w-full rounded-r-3xl" />

        {/* Mitten: Text */}
        <div className="px-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Enkel uthyrning. Mer intäkter.
          </div>

        {/* Rubrik + bild bredvid varandra */}
<div className="mt-5 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8">
  <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-center lg:text-left">
    Co-hosting för ägare som vill ha{" "}
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
      intäkter utan krångel
    </span>
  </h1>
  <img
    src="/hero-icon.jpg"
    alt="Hero bild"
    className="h-64 w-64 object-cover rounded-xl"
  />
</div>



          <p className="mt-5 text-lg text-zinc-200/90 max-w-2xl mx-auto lg:mx-0">
            Vi sköter annonsering, prissättning, städning och gästservice. Du behåller majoriteten av intäkterna.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
            <button
              onClick={() => setPopup('contact')}
              className="rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] active:scale-[0.99] transition"
            >
              Berätta om ditt boende
            </button>
            <button
              onClick={() => setPopup('calculator')}
              className="rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition"
            >
              Snabb kalkylator
            </button>
            <button
              onClick={() => setShowGame(true)}
              className="rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition"
            >
              Spela ett spel
            </button>
          </div>

          <p className="mt-4 text-xs text-zinc-300">
            Stockholm • Skärgården • Lägenheter • Villor
          </p>
        </div>

        {/* Höger dekorpanel */}
        <div className="hidden lg:block relative overflow-hidden bg-white/5 h-full w-full rounded-l-3xl" />
      </div>
    </div>
  </div>
</section>




      {/* HOW */}
      <section id="how" className="relative">
        <div className="bg-blue-600">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">Så hjälper vi dig</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <InfoCard title="Analys & strategi" onClick={() => setPopup('how')}>Vi kartlägger din bostad, område och säsonger. Därifrån sätter vi prissättning och mål för beläggning.</InfoCard>
              <InfoCard title="Annons & bilder" onClick={() => setPopup('results')}>Proffsfoton, text och gästflöde som konverterar. Vi optimerar rubrik, highlights och husregler.</InfoCard>
              <InfoCard title="Gästservice & drift" onClick={() => setPopup('contact')}>24/7 gästkommunikation, städ & nyckelhantering. Vi håller betygen höga och kalendern fylld.</InfoCard>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE FULL WIDTH UNDER HOW (smal höjd, full bredd) */}
      <section className="relative">
        <img src={EXTRA_UNDER_HOW_IMG} alt="Extra bild under Så hjälper vi dig" className="w-full h-[30vh] sm:h-[32vh] lg:h-[34vh] object-cover" />
      </section>

      {/* CALC */}
      <section id="calculator" className="mx-auto max-w-7xl px-4 py-16 scroll-mt-28">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Intäktskalkylator</h2>
            <p className="text-sm text-zinc-300">Räkna snabbt ut din möjliga utbetalning.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-5">
              <NumberField label="Pris per natt (SEK)" value={nightly} setValue={setNightly} min={500} max={10000} step={50} />
              <NumberField label="Beläggning (%)" value={occ} setValue={setOcc} min={10} max={100} step={1} />
              <NumberField label="Städavgift (SEK/gång)" value={cleanFee} setValue={setCleanFee} min={300} max={2500} step={50} />
              <NumberField label="Bokningar / månad" value={staysPerMonth} setValue={setStaysPerMonth} min={1} max={20} step={1} />
              <NumberField label="Förvaltningsavgift (%)" value={mgmtFee} setValue={setMgmtFee} min={10} max={25} step={1} />
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={includeCleaning} onChange={(e) => setIncludeCleaning(e.target.checked)} className="h-5 w-5 rounded-md border-white/20 bg-transparent" />
                Inkludera städ i avgiften
              </label>
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
              <KPI label="Nätter / månad" value={`${calc.nightsPerMonth}`} />
              <KPI label="Intäkter / månad" value={formatSEK(calc.revenue)} />
              <KPI label="Utbetalning / månad" value={formatSEK(calc.ownerPayout)} highlight />
            </div>
          </div>
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold">Varför välja oss</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li>• 5★ gästbetyg i snitt</li>
              <li>• Säsongsanpassad prissättning & kampanjer</li>
              <li>• Transparenta avgifter (15% eller 20% inkl. städ)</li>
              <li>• Lokal expertis: skärgård, golf, events</li>
            </ul>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="mx-auto max-w-7xl px-4 py-16 scroll-mt-28">
        <h2 className="text-2xl font-bold">Exempel på resultat</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { title: "Lägenhet i stan", stat: "+18% RevPAR", text: "Bättre bilder + priskalender ökade vardagsbeläggningen utan att sänka helgpriser." },
            { title: "Villa i skärgården", stat: "4.9★ betyg", text: "Smidigt incheckningsflöde + lokal guidebok gav nöjdare gäster." },
            { title: "Radhus vid golfbana", stat: "+5 veckor bokade", text: "Kampanjer under tävlingar fyllde säsongsglapp." },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:-translate-y-0.5 transition">
              <div className="text-sm text-emerald-400 font-semibold">{c.stat}</div>
              <h3 className="mt-1 font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-zinc-300">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

     {/* CONTACT SECTION */}
<section id="contact" className="mx-auto max-w-7xl px-4 py-16 scroll-mt-28">

  {/* TVÅ BILDER HELA BREDDEN OVANFÖR */}
  <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-12">
    <div className="grid grid-cols-2 gap-0">
      <img
        src="/extra-top.jpg"
        alt="Extra bild 1"
        className="w-full h-64 object-cover"
      />
      <img
        src="/extra-under.jpg"
        alt="Extra bild 2"
        className="w-full h-64 object-cover"
      />
    </div>
  </div>

  {/* TEXT (vänster) + FORMULÄR (höger) */}
  <div className="grid lg:grid-cols-2 gap-8 items-start">
    {/* Vänster kolumn */}
    <div>
      <h2 className="text-2xl font-bold">Lås upp potentialen i din bostad</h2>
      <p className="mt-2 text-zinc-300 max-w-xl">
        Ett kort samtal, en snabb titt på din bostad och en tydlig plan med förväntade siffror.
      </p>

      <div className="mt-6 space-y-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Ring eller WhatsApp</p>
          <a
            className="text-zinc-300 underline"
            href="tel:+46723225188"
            onMouseEnter={triggerRain}
          >
            0723225188
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">E-post</p>
          <a
            className="text-zinc-300 underline"
            href="mailto:arvid@pernvikproperties.com"
          >
            arvid@pernvikproperties.com
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Instagram</p>
          <a
            className="text-zinc-300 underline"
            href="https://www.instagram.com/pernvikprop/"
            target="_blank"
            rel="noreferrer"
          >
            @pernvikprop
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">LinkedIn</p>
          <a
            className="text-zinc-300 underline"
            href="https://www.linkedin.com/in/arvid-pernvik-b7702b261/"
            target="_blank"
            rel="noreferrer"
          >
            Arvidpernvik
          </a>
        </div>
      </div>
    </div>

    {/* Höger kolumn */}
    <div>
      <ContactForm
        onSuccess={() => setPopup('success')}
        onError={() => setPopup('error')}
      />
    </div>
  </div>
</section>


      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} Pernvik Properties</p>
          <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap justify-center sm:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">Ren design</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">Lite annorlunda</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">Ägar‑först</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {popup === 'how' && (
        <Modal title="Så funkar det" onClose={() => setPopup(null)}>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: "Snabb start", d: "Annons, prissättning och incheckning fixat på dagar." },
              { t: "Proffsigt städ & linne", d: "Pålitligt team med hotellstandard och fotochecklistor." },
              { t: "Intäktsoptimering", d: "Dynamisk prissättning och kampanjer maximerar beläggningen." },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold">{c.t}</h4>
                <p className="mt-1 text-sm text-zinc-300">{c.d}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {popup === 'calculator' && (
        <Modal title="Intäktskalkylator" onClose={() => setPopup(null)}>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberField label="Pris per natt (SEK)" value={nightly} setValue={setNightly} min={500} max={10000} step={50} />
                <NumberField label="Beläggning (%)" value={occ} setValue={setOcc} min={10} max={100} step={1} />
                <NumberField label="Städavgift (SEK/gång)" value={cleanFee} setValue={setCleanFee} min={300} max={2500} step={50} />
                <NumberField label="Bokningar / månad" value={staysPerMonth} setValue={setStaysPerMonth} min={1} max={20} step={1} />
                <NumberField label="Förvaltningsavgift (%)" value={mgmtFee} setValue={setMgmtFee} min={10} max={25} step={1} />
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={includeCleaning} onChange={(e) => setIncludeCleaning(e.target.checked)} className="h-5 w-5 rounded-md border-white/20 bg-transparent" />
                  Inkludera städ i avgiften
                </label>
              </div>
            </div>
            <div className="md:col-span-2 grid gap-3 text-sm">
              <KPI label="Nätter / månad" value={`${calc.nightsPerMonth}`} />
              <KPI label="Intäkter / månad" value={formatSEK(calc.revenue)} />
              <KPI label="Utbetalning / månad" value={formatSEK(calc.ownerPayout)} highlight />
            </div>
          </div>
        </Modal>
      )}
      {popup === 'results' && (
        <Modal title="Resultat" onClose={() => setPopup(null)}>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Lägenhet i stan", stat: "+18% RevPAR", text: "Bättre bilder + priskalender ökade vardagsbeläggningen utan att sänka helgpriser." },
              { title: "Villa i skärgården", stat: "4.9★ betyg", text: "Smidigt incheckningsflöde + lokal guidebok gav nöjdare gäster." },
              { title: "Radhus vid golfbana", stat: "+5 veckor bokade", text: "Kampanjer under tävlingar fyllde säsongsglapp." },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-emerald-400 font-semibold">{c.stat}</div>
                <div className="font-semibold">{c.title}</div>
                <p className="mt-1 text-sm text-zinc-300">{c.text}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {popup === 'contact' && (
        <Modal title="Kontakt" onClose={() => setPopup(null)}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">Ring eller WhatsApp</p>
                <a className="text-zinc-300 underline" href="tel:+46723225188" onMouseEnter={triggerRain}>0723225188</a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">E‑post</p>
                <a className="text-zinc-300 underline" href="mailto:arvid@pernvikproperties.com">arvid@pernvikproperties.com</a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">Instagram</p>
                <a className="text-zinc-300 underline" href="https://www.instagram.com/pernvikprop/" target="_blank" rel="noreferrer">@pernvikprop</a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">LinkedIn</p>
                <a className="text-zinc-300 underline" href="https://www.linkedin.com/in/arvid-pernvik-b7702b261/" target="_blank" rel="noreferrer">Arvidpernvik</a>
              </div>
            </div>
            <ContactForm onSuccess={() => setPopup('success')} onError={() => setPopup('error')} />
          </div>
        </Modal>
      )}
      {popup === 'call' && (
        <Modal title="Boka ett samtal" onClose={() => setPopup(null)}>
          <div className="grid gap-4">
            <CalendlyInline url={CALENDLY_URL} height={660} />
            {!CALENDLY_URL && (
              <div className="text-xs text-amber-300">
                Tips: lägg in din riktiga Calendly‑länk i <code>CALENDLY_URL</code> i koden så visas bokningskalendern här.
              </div>
            )}
            <div className="flex flex-wrap gap-3 items-center pt-2">
              <a href="tel:+46723225188" onMouseEnter={triggerRain} className="rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] transition">Ring mig</a>
              <button onClick={() => setPopup('contact')} className="rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition">Fyll i formulär</button>
            </div>
          </div>
        </Modal>
      )}
      {popup === 'success' && (
        <Modal title="Tack!" onClose={() => setPopup(null)}>
          <p className="text-sm text-zinc-300">Ditt meddelande är skickat. Vi hör av oss inom kort.</p>
          <div className="mt-4">
            <button onClick={() => setPopup(null)} className="rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow">Stäng</button>
          </div>
        </Modal>
      )}
      {popup === 'error' && (
        <Modal title="Oj! Något gick fel" onClose={() => setPopup(null)}>
          <p className="text-sm text-zinc-300">
            Testa igen om en stund eller mejla oss direkt: <a className="underline" href="mailto:arvid@pernvikproperties.com">arvid@pernvikproperties.com</a>
          </p>
          <div className="mt-4">
            <button onClick={() => setPopup('contact')} className="rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition">Tillbaka till formuläret</button>
          </div>
        </Modal>
      )}

      {/* GAME */}
      {showGame && (
        <GameModal onClose={() => setShowGame(false)} openContact={() => setPopup('contact')} />
      )}

      {/* 💸 OVERLAY */}
      <MoneyRain active={rainActive} seed={rainSeed} />

      {/* FLOAT BTN */}
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setPopup('call')}
        onMouseEnter={triggerRain}
        className="fixed right-6 bottom-24 md:right-8 md:bottom-10 rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow-xl hover:scale-[1.03] active:scale-[0.98] transition z-50"
      >
        Ring mig
      </button>
    </div>
  );
}

// ===== UI =====
function InfoCard({ title, children, onClick }: { title: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div className="rounded-[28px] bg-white text-zinc-900 p-6 md:p-8 shadow-xl">
      <div className="h-10 w-10 rounded-xl border border-zinc-200 grid place-items-center mb-4">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-zinc-600">{children}</p>
      <button onClick={onClick} className="mt-4 text-blue-600 font-medium underline underline-offset-2">Läs mer</button>
    </div>
  );
}

function KPI({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/10 p-4 ${highlight ? 'bg-emerald-400/10' : 'bg-white/5'}`}>
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function NumberField({ label, value, setValue, min, max, step }: { label: string; value: number; setValue: (n: number) => void; min: number; max: number; step: number }) {
  return (
    <label className="block">
      <div className="text-sm text-zinc-300 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <input
          type="number"
          className="w-28 rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40 text-right"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    </label>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose?: () => void }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const prev = React.useRef<Element | null>(null);
  const titleId = React.useMemo(() => 'm-' + Math.random().toString(36).slice(2, 8), []);

  React.useEffect(() => {
    prev.current = document.activeElement;
    const b = document.body, p = b.style.overflow;
    b.style.overflow = 'hidden';
    const focusFirst = () => {
      const el = ref.current; if (!el) return; const n = getFocusableNodes(el); (n[0] || el).focus({ preventScroll: true } as any);
    };
    focusFirst();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose?.(); }
      if (e.key === 'Tab') {
        const el = ref.current; if (!el) return; const n = getFocusableNodes(el);
        if (n.length === 0) { e.preventDefault(); return; }
        const f = n[0], l = n[n.length - 1];
        if ((e as any).shiftKey && document.activeElement === f) { e.preventDefault(); (l as any).focus(); }
        else if (!(e as any).shiftKey && document.activeElement === l) { e.preventDefault(); (f as any).focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('keydown', key);
      b.style.overflow = p;
      if (prev.current && (prev.current as any).focus) {
        (prev.current as any).focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  const onBack = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose?.(); };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={onBack}>
      <div ref={ref} className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-900 p-5 outline-none" tabIndex={-1}>
        <button onClick={onClose} aria-label="Stäng popup" className="absolute right-3 top-3 rounded-xl border border-white/10 px-3 py-1 text-xs hover:bg-white/10">Stäng</button>
        <h3 id={titleId} className="text-lg font-semibold mb-3 pr-16">{title}</h3>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">{children}</div>
      </div>
    </div>
  );
}

function CalendlyInline({ url, height = 660 }: { url?: string; height?: number }) {
  if (!url) {
    return (
      <div className="text-sm text-zinc-300">
        Lägg in din <span className="font-semibold">Calendly‑länk</span> i <code>CALENDLY_URL</code> så visas bokningskalendern här.
      </div>
    );
  }
  const src = React.useMemo(() => {
    try {
      const u = new URL(url);
      const h = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      u.searchParams.set('hide_gdpr_banner', '1');
      u.searchParams.set('embed_domain', h);
      u.searchParams.set('embed_type', 'Inline');
      return u.toString();
    } catch {
      return url;
    }
  }, [url]);
  return <iframe title="Boka tid" src={src} className="w-full rounded-2xl border border-white/10" style={{ height }} allowFullScreen />;
}

function ContactForm({ onSuccess, onError }: { onSuccess?: () => void; onError?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      setSubmitting(true);
      if (!data.get('_subject')) data.append('_subject', 'Nytt intresse — Pernvik Properties');
      if (!data.get('_template')) data.append('_template', 'table');
      if (!data.get('_captcha')) data.append('_captcha', 'false');
      const reply = data.get('email');
      if (reply && !data.get('_replyto')) data.append('_replyto', String(reply));
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Bad response');
      await res.json().catch(() => {});
      form.reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      onError?.();
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="font-semibold">Berätta om ditt boende</h3>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <input required name="name" placeholder="Namn" className="rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" />
        <input required name="email" type="email" placeholder="E‑post" className="rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" />
        <input name="phone" placeholder="Telefon" className="rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" />
        <input name="location" placeholder="Plats" className="rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" />
        <select name="property_type" className="rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40">
          <option className="bg-zinc-900">Lägenhet</option>
          <option className="bg-zinc-900">Villa</option>
          <option className="bg-zinc-900">Radhus</option>
          <option className="bg-zinc-900">Annat</option>
        </select>
        <select name="term" className="rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40">
          <option className="bg-zinc-900">Korttid (Airbnb)</option>
          <option className="bg-zinc-900">Medellång tid</option>
          <option className="bg-zinc-900">Osäker</option>
        </select>
        <textarea name="notes" placeholder="Beskriv kort: antal rum, känsla, unika fördelar" className="sm:col-span-2 min-h-[110px] rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" />
      </div>
      <button disabled={submitting} className="mt-4 w-full rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50">
        {submitting ? 'Skickar…' : 'Skicka'}
      </button>
      <p className="mt-3 text-xs text-zinc-400">Meddelanden skickas till <span className="font-semibold">arvid@pernvikproperties.com</span> via FormSubmit.</p>
    </form>
  );
}

function GameModal({ onClose, openContact }: { onClose?: () => void; openContact?: () => void }) {
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const reqRef = React.useRef<number>(0);

  React.useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = 700), h = (canvas.height = 260);
    const groundY = h - 40;
    let player = { x: 60, y: groundY, vy: 0, size: 24, onGround: true };
    let gravity = 0.8;
    let obstacles: Array<{ x: number; y: number; width: number; height: number }> = [];
    let speed = 5;
    let lastSpawn = 0;
    let spawnEvery = 1200;
    let lastTime = 0;
    let survived = 0;
    let running = true;

    function reset() {
      player = { x: 60, y: groundY, vy: 0, size: 24, onGround: true };
      obstacles = [];
      speed = 5;
      lastSpawn = 0;
      survived = 0;
      lastTime = 0;
      running = true;
      setLost(false);
      setWon(false);
    }
    function spawnObstacle() {
      const height = 20 + Math.random() * 40;
      obstacles.push({ x: w + 10, y: groundY - height, width: 18 + Math.random() * 18, height });
    }
    function drawPlayer() {
      const s = player.size;
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x - s / 2, player.y - s, s, s);
      ctx.fillRect(player.x - 8, player.y - 4, 6, 4);
      ctx.fillRect(player.x + 2, player.y - 4, 6, 4);
    }
    function drawGround() {
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.moveTo(0, groundY + 0.5);
      ctx.lineTo(w, groundY + 0.5);
      ctx.stroke();
    }
    function drawObstacles() {
      ctx.fillStyle = '#e4e4e7';
      obstacles.forEach((o) => { ctx.fillRect(o.x, o.y, o.width, o.height); });
    }
    function collide(a: any, b: any) {
      return !(a.x + a.size / 2 < b.x || a.x - a.size / 2 > b.x + b.width || a.y < b.y || a.y - a.size > b.y + b.height);
    }
    function step(ts: number) {
      if (!lastTime) lastTime = ts;
      const dt = ts - lastTime; lastTime = ts;
      if (!running) return;
      survived += dt;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(0, 0, w, h);
      player.vy += gravity; player.y += player.vy;
      if (player.y > groundY) { player.y = groundY; player.vy = 0; player.onGround = true; }
      obstacles.forEach((o) => (o.x -= speed));
      obstacles = obstacles.filter((o) => o.x + o.width > -20);
      if (ts - lastSpawn > spawnEvery) { spawnObstacle(); lastSpawn = ts; if (spawnEvery > 700) spawnEvery -= 20; if (speed < 9) speed += 0.05; }
      for (let o of obstacles) {
        if (collide({ x: player.x, y: player.y, size: player.size }, o)) { running = false; setLost(true); cancelAnimationFrame(reqRef.current!); return; }
      }
      drawGround(); drawObstacles(); drawPlayer();
      ctx.fillStyle = '#a1a1aa'; ctx.font = '12px ui-sans-serif,system-ui'; ctx.fillText('Överlev 15 s för att vinna', 12, 18);
      ctx.fillStyle = '#fff'; ctx.fillText((survived / 1000).toFixed(1) + 's', w - 60, 18);
      if (survived >= 15000) { running = false; setWon(true); cancelAnimationFrame(reqRef.current!); return; }
      reqRef.current = requestAnimationFrame(step);
    }
    function jump() { if (player.onGround) { player.vy = -12; player.onGround = false; } }
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
      if (e.code === 'Enter' && (lost || won)) { reset(); reqRef.current = requestAnimationFrame(step); }
    };
    window.addEventListener('keydown', key);
    canvas.addEventListener('pointerdown', jump);
    reset();
    reqRef.current = requestAnimationFrame(step);
    return () => {
      window.removeEventListener('keydown', key);
      canvas.removeEventListener('pointerdown', jump);
      cancelAnimationFrame(reqRef.current!);
    };
  }, [lost, won]);

  return (
    <Modal title="Minispel — Hoppa över hinder" onClose={onClose}>
      <p className="text-sm text-zinc-400">
        Tryck <span className="font-semibold text-zinc-200">Space</span> för att hoppa. Överlev 15 sekunder för ett gratis intäktssamtal.
      </p>
      <div className="mt-3"><canvas ref={canvasRef} width={700} height={260} className="w-full h-auto block" /></div>
      {(won || lost) && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          {won ? (
            <div className="text-center">
              <div className="text-emerald-400 font-semibold">Snyggt!</div>
              <h4 className="mt-1 text-xl font-bold">Hämta ditt gratis intäktssamtal</h4>
              <p className="mt-1 text-sm text-zinc-300">Klicka för att boka — vi går igenom din bostad och förväntade siffror.</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button onClick={() => { openContact?.(); onClose?.(); }} className="rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] transition">Öppna kontaktformulär</button>
                <button onClick={onClose} className="rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition">Senare</button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-rose-400 font-semibold">Game over</div>
              <p className="mt-1 text-sm text-zinc-300">Tryck <span className="font-semibold text-zinc-200">Enter</span> för att försöka igen — eller öppna kontakt ändå.</p>
              <div className="mt-3">
                <button onClick={() => { openContact?.(); onClose?.(); }} className="rounded-2xl px-4 py-2 border border-white/15 hover:bg-white/10 text-sm">Öppna kontakt</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function MoneyRain({ active, seed }: { active: boolean; seed: number }) {
  const [drops, setDrops] = React.useState<Array<any>>([]);
  React.useEffect(() => {
    if (!active) return;
    const count = 24 + Math.floor(Math.random() * 16);
    const chars = ['💸', '💰', '🪙'];
    const arr = Array.from({ length: count }).map((_, i) => ({
      id: seed + '-' + i,
      left: Math.random() * 100,
      delay: Math.floor(Math.random() * 400),
      dur: 1800 + Math.floor(Math.random() * 800),
      size: 16 + Math.floor(Math.random() * 14),
      char: chars[Math.random() < 0.7 ? 0 : Math.random() < 0.5 ? 1 : 2],
      drift: (Math.random() * 2 - 1) * 30,
      rotate: (Math.random() * 2 - 1) * 30,
    }));
    setDrops(arr);
  }, [active, seed]);
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      <style>{`@keyframes moneyFallY{from{transform:translate3d(0,-10vh,0) rotate(0)}to{transform:translate3d(0,105vh,0) rotate(360deg)}}@keyframes moneyFade{0%{opacity:1}90%{opacity:1}100%{opacity:0}}`}</style>
      {drops.map((d) => (
        <span
          key={d.id}
          style={{
            position: 'fixed',
            left: d.left + 'vw',
            top: '-10vh',
            fontSize: d.size + 'px',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))',
            transform: `translateX(${d.drift}px) rotate(${d.rotate}deg)`,
            animation: `moneyFallY ${d.dur}ms linear ${d.delay}ms forwards, moneyFade ${d.dur}ms linear ${d.delay}ms forwards`,
          }}
        >
          {d.char}
        </span>
      ))}
    </div>
  );
}
