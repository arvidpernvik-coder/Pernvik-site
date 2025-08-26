import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const HERO_FALLBACK = "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'>
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
    </svg>`);
function getFocusableNodes(el) {
    const all = Array.from(el.querySelectorAll('a[href], area[href], button, textarea, input, select, [tabindex]'));
    return all.filter((n) => !n.hasAttribute('disabled') && n.getAttribute('tabindex') !== "-1");
}
function formatSEK(n) {
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
        if (!HERO_IMG_URL)
            return;
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
    const [popup, setPopup] = useState(null);
    const [showGame, setShowGame] = useState(false);
    const [rainActive, setRainActive] = useState(false);
    const [rainSeed, setRainSeed] = useState(0);
    const rainTimer = React.useRef(null);
    const triggerRain = React.useCallback(() => {
        if (rainTimer.current)
            window.clearTimeout(rainTimer.current);
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
            const nodes = getFocusableNodes(tmp);
            console.assert(nodes.length === 1, 'getFocusableNodes ska filtrera disabled');
        }
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100 relative pb-28 md:pb-32", children: [_jsx("header", { className: "sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 border-b border-white/10", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 py-4 flex items-center justify-between", children: [_jsxs("a", { href: "#top", className: "group inline-flex items-center gap-3", children: [_jsx("div", { className: "h-9 w-9 rounded-2xl bg-white text-zinc-900 grid place-items-center font-black", children: "PP" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.2em] text-zinc-400", children: "Pernvik Properties" }), _jsx("p", { className: "-mt-1 font-semibold", children: "Airbnb Co\u2011Hosting" })] })] }), _jsxs("nav", { className: "hidden md:flex items-center gap-6 text-sm", children: [_jsx("button", { className: "hover:text-white/90", onClick: () => setPopup('how'), children: "S\u00E5 funkar det" }), _jsx("button", { className: "hover:text-white/90", onClick: () => setPopup('calculator'), children: "Kalkylator" }), _jsx("button", { className: "hover:text-white/90", onClick: () => setPopup('results'), children: "Resultat" }), _jsx("button", { className: "hover:text-white/90", onClick: () => setPopup('contact'), children: "Kontakt" }), _jsx("button", { onClick: () => setShowGame(true), className: "rounded-2xl px-4 py-2 border border-white/20 hover:bg-white/10 transition", children: "Spela" })] }), _jsx("button", { type: "button", "aria-haspopup": "dialog", onClick: () => setPopup('call'), onMouseEnter: triggerRain, className: "rounded-2xl px-4 py-2 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] active:scale-[0.99] transition", children: "Ring mig" })] }) }), _jsx("section", { id: "top", className: "relative", children: _jsx("div", { className: "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen", children: _jsxs("div", { className: "relative h-[50vh] sm:h-[56vh] lg:h-[64vh]", children: [_jsx("div", { "aria-hidden": true, className: "absolute inset-0 -z-10 bg-cover bg-center", style: { backgroundImage: `url(${heroSrc})` } }), _jsx("div", { "aria-hidden": true, className: "absolute inset-0 -z-10 bg-black/40" }), _jsxs("div", { className: "grid lg:grid-cols-[1fr,1.25fr,1fr] items-center gap-4 lg:gap-6 h-full", children: [_jsx("div", { className: "hidden lg:block relative overflow-hidden bg-white/5 h-full w-full rounded-r-3xl" }), _jsxs("div", { className: "px-4 text-center lg:text-left", children: [_jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }), "Enkel uthyrning. Mer int\u00E4kter."] }), _jsxs("div", { className: "mt-5 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8", children: [_jsxs("h1", { className: "text-4xl sm:text-5xl font-extrabold leading-tight text-center lg:text-left", children: ["Co-hosting f\u00F6r \u00E4gare som vill ha", " ", _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400", children: "int\u00E4kter utan kr\u00E5ngel" })] }), _jsx("img", { src: "/hero-icon.jpg", alt: "Hero bild", className: "h-64 w-64 object-cover rounded-xl" })] }), _jsx("p", { className: "mt-5 text-lg text-zinc-200/90 max-w-2xl mx-auto lg:mx-0", children: "Vi sk\u00F6ter annonsering, priss\u00E4ttning, st\u00E4dning och g\u00E4stservice. Du beh\u00E5ller majoriteten av int\u00E4kterna." }), _jsxs("div", { className: "mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0", children: [_jsx("button", { onClick: () => setPopup('contact'), className: "rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] active:scale-[0.99] transition", children: "Ber\u00E4tta om ditt boende" }), _jsx("button", { onClick: () => setPopup('calculator'), className: "rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition", children: "Snabb kalkylator" }), _jsx("button", { onClick: () => setShowGame(true), className: "rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition", children: "Spela ett spel" })] }), _jsx("p", { className: "mt-4 text-xs text-zinc-300", children: "Stockholm \u2022 Sk\u00E4rg\u00E5rden \u2022 L\u00E4genheter \u2022 Villor" })] }), _jsx("div", { className: "hidden lg:block relative overflow-hidden bg-white/5 h-full w-full rounded-l-3xl" })] })] }) }) }), _jsx("section", { id: "how", className: "relative", children: _jsx("div", { className: "bg-blue-600", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 py-16", children: [_jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white text-center", children: "S\u00E5 hj\u00E4lper vi dig" }), _jsxs("div", { className: "mt-10 grid md:grid-cols-3 gap-6", children: [_jsx(InfoCard, { title: "Analys & strategi", onClick: () => setPopup('how'), children: "Vi kartl\u00E4gger din bostad, omr\u00E5de och s\u00E4songer. D\u00E4rifr\u00E5n s\u00E4tter vi priss\u00E4ttning och m\u00E5l f\u00F6r bel\u00E4ggning." }), _jsx(InfoCard, { title: "Annons & bilder", onClick: () => setPopup('results'), children: "Proffsfoton, text och g\u00E4stfl\u00F6de som konverterar. Vi optimerar rubrik, highlights och husregler." }), _jsx(InfoCard, { title: "G\u00E4stservice & drift", onClick: () => setPopup('contact'), children: "24/7 g\u00E4stkommunikation, st\u00E4d & nyckelhantering. Vi h\u00E5ller betygen h\u00F6ga och kalendern fylld." })] })] }) }) }), _jsx("section", { className: "relative", children: _jsx("img", { src: EXTRA_UNDER_HOW_IMG, alt: "Extra bild under S\u00E5 hj\u00E4lper vi dig", className: "w-full h-[30vh] sm:h-[32vh] lg:h-[34vh] object-cover" }) }), _jsx("section", { id: "calculator", className: "mx-auto max-w-7xl px-4 py-16 scroll-mt-28", children: _jsxs("div", { className: "grid lg:grid-cols-5 gap-8", children: [_jsxs("div", { className: "lg:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Int\u00E4ktskalkylator" }), _jsx("p", { className: "text-sm text-zinc-300", children: "R\u00E4kna snabbt ut din m\u00F6jliga utbetalning." }), _jsxs("div", { className: "mt-6 grid sm:grid-cols-2 gap-5", children: [_jsx(NumberField, { label: "Pris per natt (SEK)", value: nightly, setValue: setNightly, min: 500, max: 10000, step: 50 }), _jsx(NumberField, { label: "Bel\u00E4ggning (%)", value: occ, setValue: setOcc, min: 10, max: 100, step: 1 }), _jsx(NumberField, { label: "St\u00E4davgift (SEK/g\u00E5ng)", value: cleanFee, setValue: setCleanFee, min: 300, max: 2500, step: 50 }), _jsx(NumberField, { label: "Bokningar / m\u00E5nad", value: staysPerMonth, setValue: setStaysPerMonth, min: 1, max: 20, step: 1 }), _jsx(NumberField, { label: "F\u00F6rvaltningsavgift (%)", value: mgmtFee, setValue: setMgmtFee, min: 10, max: 25, step: 1 }), _jsxs("label", { className: "flex items-center gap-3 text-sm", children: [_jsx("input", { type: "checkbox", checked: includeCleaning, onChange: (e) => setIncludeCleaning(e.target.checked), className: "h-5 w-5 rounded-md border-white/20 bg-transparent" }), "Inkludera st\u00E4d i avgiften"] })] }), _jsxs("div", { className: "mt-6 grid sm:grid-cols-3 gap-4 text-sm", children: [_jsx(KPI, { label: "N\u00E4tter / m\u00E5nad", value: `${calc.nightsPerMonth}` }), _jsx(KPI, { label: "Int\u00E4kter / m\u00E5nad", value: formatSEK(calc.revenue) }), _jsx(KPI, { label: "Utbetalning / m\u00E5nad", value: formatSEK(calc.ownerPayout), highlight: true })] })] }), _jsxs("div", { className: "lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6", children: [_jsx("h3", { className: "font-semibold", children: "Varf\u00F6r v\u00E4lja oss" }), _jsxs("ul", { className: "mt-3 space-y-3 text-sm", children: [_jsx("li", { children: "\u2022 5\u2605 g\u00E4stbetyg i snitt" }), _jsx("li", { children: "\u2022 S\u00E4songsanpassad priss\u00E4ttning & kampanjer" }), _jsx("li", { children: "\u2022 Transparenta avgifter (15% eller 20% inkl. st\u00E4d)" }), _jsx("li", { children: "\u2022 Lokal expertis: sk\u00E4rg\u00E5rd, golf, events" })] })] })] }) }), _jsxs("section", { id: "results", className: "mx-auto max-w-7xl px-4 py-16 scroll-mt-28", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Exempel p\u00E5 resultat" }), _jsx("div", { className: "mt-6 grid md:grid-cols-3 gap-4", children: [
                            { title: "Lägenhet i stan", stat: "+18% RevPAR", text: "Bättre bilder + priskalender ökade vardagsbeläggningen utan att sänka helgpriser." },
                            { title: "Villa i skärgården", stat: "4.9★ betyg", text: "Smidigt incheckningsflöde + lokal guidebok gav nöjdare gäster." },
                            { title: "Radhus vid golfbana", stat: "+5 veckor bokade", text: "Kampanjer under tävlingar fyllde säsongsglapp." },
                        ].map((c, i) => (_jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-5 hover:-translate-y-0.5 transition", children: [_jsx("div", { className: "text-sm text-emerald-400 font-semibold", children: c.stat }), _jsx("h3", { className: "mt-1 font-semibold", children: c.title }), _jsx("p", { className: "mt-1 text-sm text-zinc-300", children: c.text })] }, i))) })] }), _jsxs("section", { id: "contact", className: "mx-auto max-w-7xl px-4 py-16 scroll-mt-28", children: [_jsx("div", { className: "w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-12", children: _jsxs("div", { className: "grid grid-cols-2 gap-0", children: [_jsx("img", { src: "/extra-top.jpg", alt: "Extra bild 1", className: "w-full h-64 object-cover" }), _jsx("img", { src: "/extra-under.jpg", alt: "Extra bild 2", className: "w-full h-64 object-cover" })] }) }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "L\u00E5s upp potentialen i din bostad" }), _jsx("p", { className: "mt-2 text-zinc-300 max-w-xl", children: "Ett kort samtal, en snabb titt p\u00E5 din bostad och en tydlig plan med f\u00F6rv\u00E4ntade siffror." }), _jsxs("div", { className: "mt-6 space-y-3 text-sm", children: [_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "Ring eller WhatsApp" }), _jsx("a", { className: "text-zinc-300 underline", href: "tel:+46723225188", onMouseEnter: triggerRain, children: "0723225188" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "E-post" }), _jsx("a", { className: "text-zinc-300 underline", href: "mailto:arvid@pernvikproperties.com", children: "arvid@pernvikproperties.com" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "Instagram" }), _jsx("a", { className: "text-zinc-300 underline", href: "https://www.instagram.com/pernvikprop/", target: "_blank", rel: "noreferrer", children: "@pernvikprop" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "LinkedIn" }), _jsx("a", { className: "text-zinc-300 underline", href: "https://www.linkedin.com/in/arvid-pernvik-b7702b261/", target: "_blank", rel: "noreferrer", children: "Arvidpernvik" })] })] })] }), _jsx("div", { children: _jsx(ContactForm, { onSuccess: () => setPopup('success'), onError: () => setPopup('error') }) })] })] }), _jsx("footer", { className: "border-t border-white/10", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("p", { className: "text-sm text-zinc-400", children: ["\u00A9 ", new Date().getFullYear(), " Pernvik Properties"] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-zinc-400 flex-wrap justify-center sm:justify-end", children: [_jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1", children: "Ren design" }), _jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1", children: "Lite annorlunda" }), _jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1", children: "\u00C4gar\u2011f\u00F6rst" })] })] }) }), popup === 'how' && (_jsx(Modal, { title: "S\u00E5 funkar det", onClose: () => setPopup(null), children: _jsx("div", { className: "grid md:grid-cols-3 gap-4", children: [
                        { t: "Snabb start", d: "Annons, prissättning och incheckning fixat på dagar." },
                        { t: "Proffsigt städ & linne", d: "Pålitligt team med hotellstandard och fotochecklistor." },
                        { t: "Intäktsoptimering", d: "Dynamisk prissättning och kampanjer maximerar beläggningen." },
                    ].map((c, i) => (_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("h4", { className: "font-semibold", children: c.t }), _jsx("p", { className: "mt-1 text-sm text-zinc-300", children: c.d })] }, i))) }) })), popup === 'calculator' && (_jsx(Modal, { title: "Int\u00E4ktskalkylator", onClose: () => setPopup(null), children: _jsxs("div", { className: "grid md:grid-cols-5 gap-6", children: [_jsx("div", { className: "md:col-span-3 space-y-5", children: _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsx(NumberField, { label: "Pris per natt (SEK)", value: nightly, setValue: setNightly, min: 500, max: 10000, step: 50 }), _jsx(NumberField, { label: "Bel\u00E4ggning (%)", value: occ, setValue: setOcc, min: 10, max: 100, step: 1 }), _jsx(NumberField, { label: "St\u00E4davgift (SEK/g\u00E5ng)", value: cleanFee, setValue: setCleanFee, min: 300, max: 2500, step: 50 }), _jsx(NumberField, { label: "Bokningar / m\u00E5nad", value: staysPerMonth, setValue: setStaysPerMonth, min: 1, max: 20, step: 1 }), _jsx(NumberField, { label: "F\u00F6rvaltningsavgift (%)", value: mgmtFee, setValue: setMgmtFee, min: 10, max: 25, step: 1 }), _jsxs("label", { className: "flex items-center gap-3 text-sm", children: [_jsx("input", { type: "checkbox", checked: includeCleaning, onChange: (e) => setIncludeCleaning(e.target.checked), className: "h-5 w-5 rounded-md border-white/20 bg-transparent" }), "Inkludera st\u00E4d i avgiften"] })] }) }), _jsxs("div", { className: "md:col-span-2 grid gap-3 text-sm", children: [_jsx(KPI, { label: "N\u00E4tter / m\u00E5nad", value: `${calc.nightsPerMonth}` }), _jsx(KPI, { label: "Int\u00E4kter / m\u00E5nad", value: formatSEK(calc.revenue) }), _jsx(KPI, { label: "Utbetalning / m\u00E5nad", value: formatSEK(calc.ownerPayout), highlight: true })] })] }) })), popup === 'results' && (_jsx(Modal, { title: "Resultat", onClose: () => setPopup(null), children: _jsx("div", { className: "grid md:grid-cols-3 gap-4", children: [
                        { title: "Lägenhet i stan", stat: "+18% RevPAR", text: "Bättre bilder + priskalender ökade vardagsbeläggningen utan att sänka helgpriser." },
                        { title: "Villa i skärgården", stat: "4.9★ betyg", text: "Smidigt incheckningsflöde + lokal guidebok gav nöjdare gäster." },
                        { title: "Radhus vid golfbana", stat: "+5 veckor bokade", text: "Kampanjer under tävlingar fyllde säsongsglapp." },
                    ].map((c, i) => (_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("div", { className: "text-sm text-emerald-400 font-semibold", children: c.stat }), _jsx("div", { className: "font-semibold", children: c.title }), _jsx("p", { className: "mt-1 text-sm text-zinc-300", children: c.text })] }, i))) }) })), popup === 'contact' && (_jsx(Modal, { title: "Kontakt", onClose: () => setPopup(null), children: _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "Ring eller WhatsApp" }), _jsx("a", { className: "text-zinc-300 underline", href: "tel:+46723225188", onMouseEnter: triggerRain, children: "0723225188" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "E\u2011post" }), _jsx("a", { className: "text-zinc-300 underline", href: "mailto:arvid@pernvikproperties.com", children: "arvid@pernvikproperties.com" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "Instagram" }), _jsx("a", { className: "text-zinc-300 underline", href: "https://www.instagram.com/pernvikprop/", target: "_blank", rel: "noreferrer", children: "@pernvikprop" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "font-semibold", children: "LinkedIn" }), _jsx("a", { className: "text-zinc-300 underline", href: "https://www.linkedin.com/in/arvid-pernvik-b7702b261/", target: "_blank", rel: "noreferrer", children: "Arvidpernvik" })] })] }), _jsx(ContactForm, { onSuccess: () => setPopup('success'), onError: () => setPopup('error') })] }) })), popup === 'call' && (_jsx(Modal, { title: "Boka ett samtal", onClose: () => setPopup(null), children: _jsxs("div", { className: "grid gap-4", children: [_jsx(CalendlyInline, { url: CALENDLY_URL, height: 660 }), !CALENDLY_URL && (_jsxs("div", { className: "text-xs text-amber-300", children: ["Tips: l\u00E4gg in din riktiga Calendly\u2011l\u00E4nk i ", _jsx("code", { children: "CALENDLY_URL" }), " i koden s\u00E5 visas bokningskalendern h\u00E4r."] })), _jsxs("div", { className: "flex flex-wrap gap-3 items-center pt-2", children: [_jsx("a", { href: "tel:+46723225188", onMouseEnter: triggerRain, className: "rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] transition", children: "Ring mig" }), _jsx("button", { onClick: () => setPopup('contact'), className: "rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition", children: "Fyll i formul\u00E4r" })] })] }) })), popup === 'success' && (_jsxs(Modal, { title: "Tack!", onClose: () => setPopup(null), children: [_jsx("p", { className: "text-sm text-zinc-300", children: "Ditt meddelande \u00E4r skickat. Vi h\u00F6r av oss inom kort." }), _jsx("div", { className: "mt-4", children: _jsx("button", { onClick: () => setPopup(null), className: "rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow", children: "St\u00E4ng" }) })] })), popup === 'error' && (_jsxs(Modal, { title: "Oj! N\u00E5got gick fel", onClose: () => setPopup(null), children: [_jsxs("p", { className: "text-sm text-zinc-300", children: ["Testa igen om en stund eller mejla oss direkt: ", _jsx("a", { className: "underline", href: "mailto:arvid@pernvikproperties.com", children: "arvid@pernvikproperties.com" })] }), _jsx("div", { className: "mt-4", children: _jsx("button", { onClick: () => setPopup('contact'), className: "rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition", children: "Tillbaka till formul\u00E4ret" }) })] })), showGame && (_jsx(GameModal, { onClose: () => setShowGame(false), openContact: () => setPopup('contact') })), _jsx(MoneyRain, { active: rainActive, seed: rainSeed }), _jsx("button", { type: "button", "aria-haspopup": "dialog", onClick: () => setPopup('call'), onMouseEnter: triggerRain, className: "fixed right-6 bottom-24 md:right-8 md:bottom-10 rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow-xl hover:scale-[1.03] active:scale-[0.98] transition z-50", children: "Ring mig" })] }));
}
// ===== UI =====
function InfoCard({ title, children, onClick }) {
    return (_jsxs("div", { className: "rounded-[28px] bg-white text-zinc-900 p-6 md:p-8 shadow-xl", children: [_jsx("div", { className: "h-10 w-10 rounded-xl border border-zinc-200 grid place-items-center mb-4", children: _jsxs("svg", { viewBox: "0 0 24 24", className: "h-6 w-6 text-zinc-700", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }), _jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }), _jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" })] }) }), _jsx("h3", { className: "text-xl font-semibold", children: title }), _jsx("p", { className: "mt-2 text-zinc-600", children: children }), _jsx("button", { onClick: onClick, className: "mt-4 text-blue-600 font-medium underline underline-offset-2", children: "L\u00E4s mer" })] }));
}
function KPI({ label, value, highlight = false }) {
    return (_jsxs("div", { className: `rounded-2xl border border-white/10 p-4 ${highlight ? 'bg-emerald-400/10' : 'bg-white/5'}`, children: [_jsx("div", { className: "text-xs text-zinc-400", children: label }), _jsx("div", { className: "mt-1 text-lg font-semibold", children: value })] }));
}
function NumberField({ label, value, setValue, min, max, step }) {
    return (_jsxs("label", { className: "block", children: [_jsx("div", { className: "text-sm text-zinc-300 mb-1", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "range", className: "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer", min: min, max: max, step: step, value: value, onChange: (e) => setValue(Number(e.target.value)) }), _jsx("input", { type: "number", className: "w-28 rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40 text-right", value: value, min: min, max: max, step: step, onChange: (e) => setValue(Number(e.target.value)) })] })] }));
}
function Modal({ title, children, onClose }) {
    const ref = React.useRef(null);
    const prev = React.useRef(null);
    const titleId = React.useMemo(() => 'm-' + Math.random().toString(36).slice(2, 8), []);
    React.useEffect(() => {
        prev.current = document.activeElement;
        const b = document.body, p = b.style.overflow;
        b.style.overflow = 'hidden';
        const focusFirst = () => {
            const el = ref.current;
            if (!el)
                return;
            const n = getFocusableNodes(el);
            (n[0] || el).focus({ preventScroll: true });
        };
        focusFirst();
        const key = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose?.();
            }
            if (e.key === 'Tab') {
                const el = ref.current;
                if (!el)
                    return;
                const n = getFocusableNodes(el);
                if (n.length === 0) {
                    e.preventDefault();
                    return;
                }
                const f = n[0], l = n[n.length - 1];
                if (e.shiftKey && document.activeElement === f) {
                    e.preventDefault();
                    l.focus();
                }
                else if (!e.shiftKey && document.activeElement === l) {
                    e.preventDefault();
                    f.focus();
                }
            }
        };
        document.addEventListener('keydown', key);
        return () => {
            document.removeEventListener('keydown', key);
            b.style.overflow = p;
            if (prev.current && prev.current.focus) {
                prev.current.focus({ preventScroll: true });
            }
        };
    }, [onClose]);
    const onBack = (e) => { if (e.target === e.currentTarget)
        onClose?.(); };
    return (_jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/70 p-4", role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, onMouseDown: onBack, children: _jsxs("div", { ref: ref, className: "relative w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-900 p-5 outline-none", tabIndex: -1, children: [_jsx("button", { onClick: onClose, "aria-label": "St\u00E4ng popup", className: "absolute right-3 top-3 rounded-xl border border-white/10 px-3 py-1 text-xs hover:bg-white/10", children: "St\u00E4ng" }), _jsx("h3", { id: titleId, className: "text-lg font-semibold mb-3 pr-16", children: title }), _jsx("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: children })] }) }));
}
function CalendlyInline({ url, height = 660 }) {
    if (!url) {
        return (_jsxs("div", { className: "text-sm text-zinc-300", children: ["L\u00E4gg in din ", _jsx("span", { className: "font-semibold", children: "Calendly\u2011l\u00E4nk" }), " i ", _jsx("code", { children: "CALENDLY_URL" }), " s\u00E5 visas bokningskalendern h\u00E4r."] }));
    }
    const src = React.useMemo(() => {
        try {
            const u = new URL(url);
            const h = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
            u.searchParams.set('hide_gdpr_banner', '1');
            u.searchParams.set('embed_domain', h);
            u.searchParams.set('embed_type', 'Inline');
            return u.toString();
        }
        catch {
            return url;
        }
    }, [url]);
    return _jsx("iframe", { title: "Boka tid", src: src, className: "w-full rounded-2xl border border-white/10", style: { height }, allowFullScreen: true });
}
function ContactForm({ onSuccess, onError }) {
    const [submitting, setSubmitting] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        try {
            setSubmitting(true);
            if (!data.get('_subject'))
                data.append('_subject', 'Nytt intresse — Pernvik Properties');
            if (!data.get('_template'))
                data.append('_template', 'table');
            if (!data.get('_captcha'))
                data.append('_captcha', 'false');
            const reply = data.get('email');
            if (reply && !data.get('_replyto'))
                data.append('_replyto', String(reply));
            const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
            if (!res.ok)
                throw new Error('Bad response');
            await res.json().catch(() => { });
            form.reset();
            onSuccess?.();
        }
        catch (err) {
            console.error(err);
            onError?.();
        }
        finally {
            setSubmitting(false);
        }
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "rounded-3xl border border-white/10 bg-white/5 p-6", children: [_jsx("h3", { className: "font-semibold", children: "Ber\u00E4tta om ditt boende" }), _jsxs("div", { className: "mt-4 grid sm:grid-cols-2 gap-4", children: [_jsx("input", { required: true, name: "name", placeholder: "Namn", className: "rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" }), _jsx("input", { required: true, name: "email", type: "email", placeholder: "E\u2011post", className: "rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" }), _jsx("input", { name: "phone", placeholder: "Telefon", className: "rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" }), _jsx("input", { name: "location", placeholder: "Plats", className: "rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" }), _jsxs("select", { name: "property_type", className: "rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40", children: [_jsx("option", { className: "bg-zinc-900", children: "L\u00E4genhet" }), _jsx("option", { className: "bg-zinc-900", children: "Villa" }), _jsx("option", { className: "bg-zinc-900", children: "Radhus" }), _jsx("option", { className: "bg-zinc-900", children: "Annat" })] }), _jsxs("select", { name: "term", className: "rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40", children: [_jsx("option", { className: "bg-zinc-900", children: "Korttid (Airbnb)" }), _jsx("option", { className: "bg-zinc-900", children: "Medell\u00E5ng tid" }), _jsx("option", { className: "bg-zinc-900", children: "Os\u00E4ker" })] }), _jsx("textarea", { name: "notes", placeholder: "Beskriv kort: antal rum, k\u00E4nsla, unika f\u00F6rdelar", className: "sm:col-span-2 min-h-[110px] rounded-xl bg-transparent border border-white/20 px-3 py-2 outline-none focus:border-white/40" })] }), _jsx("button", { disabled: submitting, className: "mt-4 w-full rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50", children: submitting ? 'Skickar…' : 'Skicka' }), _jsxs("p", { className: "mt-3 text-xs text-zinc-400", children: ["Meddelanden skickas till ", _jsx("span", { className: "font-semibold", children: "arvid@pernvikproperties.com" }), " via FormSubmit."] })] }));
}
function GameModal({ onClose, openContact }) {
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);
    const canvasRef = React.useRef(null);
    const reqRef = React.useRef();
    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let w = (canvas.width = 700), h = (canvas.height = 260);
        const groundY = h - 40;
        let player = { x: 60, y: groundY, vy: 0, size: 24, onGround: true };
        let gravity = 0.8;
        let obstacles = [];
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
        function collide(a, b) {
            return !(a.x + a.size / 2 < b.x || a.x - a.size / 2 > b.x + b.width || a.y < b.y || a.y - a.size > b.y + b.height);
        }
        function step(ts) {
            if (!lastTime)
                lastTime = ts;
            const dt = ts - lastTime;
            lastTime = ts;
            if (!running)
                return;
            survived += dt;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            ctx.fillRect(0, 0, w, h);
            player.vy += gravity;
            player.y += player.vy;
            if (player.y > groundY) {
                player.y = groundY;
                player.vy = 0;
                player.onGround = true;
            }
            obstacles.forEach((o) => (o.x -= speed));
            obstacles = obstacles.filter((o) => o.x + o.width > -20);
            if (ts - lastSpawn > spawnEvery) {
                spawnObstacle();
                lastSpawn = ts;
                if (spawnEvery > 700)
                    spawnEvery -= 20;
                if (speed < 9)
                    speed += 0.05;
            }
            for (let o of obstacles) {
                if (collide({ x: player.x, y: player.y, size: player.size }, o)) {
                    running = false;
                    setLost(true);
                    cancelAnimationFrame(reqRef.current);
                    return;
                }
            }
            drawGround();
            drawObstacles();
            drawPlayer();
            ctx.fillStyle = '#a1a1aa';
            ctx.font = '12px ui-sans-serif,system-ui';
            ctx.fillText('Överlev 15 s för att vinna', 12, 18);
            ctx.fillStyle = '#fff';
            ctx.fillText((survived / 1000).toFixed(1) + 's', w - 60, 18);
            if (survived >= 15000) {
                running = false;
                setWon(true);
                cancelAnimationFrame(reqRef.current);
                return;
            }
            reqRef.current = requestAnimationFrame(step);
        }
        function jump() { if (player.onGround) {
            player.vy = -12;
            player.onGround = false;
        } }
        const key = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
            if (e.code === 'Enter' && (lost || won)) {
                reset();
                reqRef.current = requestAnimationFrame(step);
            }
        };
        window.addEventListener('keydown', key);
        canvas.addEventListener('pointerdown', jump);
        reset();
        reqRef.current = requestAnimationFrame(step);
        return () => {
            window.removeEventListener('keydown', key);
            canvas.removeEventListener('pointerdown', jump);
            cancelAnimationFrame(reqRef.current);
        };
    }, [lost, won]);
    return (_jsxs(Modal, { title: "Minispel \u2014 Hoppa \u00F6ver hinder", onClose: onClose, children: [_jsxs("p", { className: "text-sm text-zinc-400", children: ["Tryck ", _jsx("span", { className: "font-semibold text-zinc-200", children: "Space" }), " f\u00F6r att hoppa. \u00D6verlev 15 sekunder f\u00F6r ett gratis int\u00E4ktssamtal."] }), _jsx("div", { className: "mt-3", children: _jsx("canvas", { ref: canvasRef, width: 700, height: 260, className: "w-full h-auto block" }) }), (won || lost) && (_jsx("div", { className: "mt-4 rounded-2xl border border-white/10 bg-white/5 p-4", children: won ? (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-emerald-400 font-semibold", children: "Snyggt!" }), _jsx("h4", { className: "mt-1 text-xl font-bold", children: "H\u00E4mta ditt gratis int\u00E4ktssamtal" }), _jsx("p", { className: "mt-1 text-sm text-zinc-300", children: "Klicka f\u00F6r att boka \u2014 vi g\u00E5r igenom din bostad och f\u00F6rv\u00E4ntade siffror." }), _jsxs("div", { className: "mt-4 flex items-center justify-center gap-3", children: [_jsx("button", { onClick: () => { openContact?.(); onClose?.(); }, className: "rounded-2xl px-5 py-3 bg-white text-zinc-900 font-semibold shadow hover:scale-[1.02] transition", children: "\u00D6ppna kontaktformul\u00E4r" }), _jsx("button", { onClick: onClose, className: "rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10 transition", children: "Senare" })] })] })) : (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-rose-400 font-semibold", children: "Game over" }), _jsxs("p", { className: "mt-1 text-sm text-zinc-300", children: ["Tryck ", _jsx("span", { className: "font-semibold text-zinc-200", children: "Enter" }), " f\u00F6r att f\u00F6rs\u00F6ka igen \u2014 eller \u00F6ppna kontakt \u00E4nd\u00E5."] }), _jsx("div", { className: "mt-3", children: _jsx("button", { onClick: () => { openContact?.(); onClose?.(); }, className: "rounded-2xl px-4 py-2 border border-white/15 hover:bg-white/10 text-sm", children: "\u00D6ppna kontakt" }) })] })) }))] }));
}
function MoneyRain({ active, seed }) {
    const [drops, setDrops] = React.useState([]);
    React.useEffect(() => {
        if (!active)
            return;
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
    if (!active)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-40 pointer-events-none overflow-hidden", children: [_jsx("style", { children: `@keyframes moneyFallY{from{transform:translate3d(0,-10vh,0) rotate(0)}to{transform:translate3d(0,105vh,0) rotate(360deg)}}@keyframes moneyFade{0%{opacity:1}90%{opacity:1}100%{opacity:0}}` }), drops.map((d) => (_jsx("span", { style: {
                    position: 'fixed',
                    left: d.left + 'vw',
                    top: '-10vh',
                    fontSize: d.size + 'px',
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))',
                    transform: `translateX(${d.drift}px) rotate(${d.rotate}deg)`,
                    animation: `moneyFallY ${d.dur}ms linear ${d.delay}ms forwards, moneyFade ${d.dur}ms linear ${d.delay}ms forwards`,
                }, children: d.char }, d.id)))] }));
}
