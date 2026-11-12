/**
 * Sermon title parser (forgiving, IAPI Watch page).
 *
 * Expected pattern (not identical for every service):
 *   "Culto de Enseñanza | Domingo 01, de Noviembre del 2026 | IAPI"
 * Rules:
 * - Split on "|"
 * - First part = service type (Culto de Enseñanza, Oración, Exaltación, Santa Cena, Ayuno)
 * - Detect Spanish date in the second part
 * - Ignore a trailing "IAPI"
 * - If a title doesn't match, callers must show it as-is and never hide or break it.
 */
(function (global) {
  const SERVICE_TYPES = [
    "Culto de Enseñanza",
    "Culto de Oración",
    "Culto de Exaltación",
    "Santa Cena",
    "Ayuno"
  ];

  const MONTHS = {
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
    julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10,
    noviembre: 11, diciembre: 12
  };

  function normalizeSpace(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function detectServiceType(raw) {
    const s = normalizeSpace(raw);
    for (const type of SERVICE_TYPES) {
      if (s.toLowerCase().includes(type.toLowerCase())) return type;
    }
    // Forgiving: sometimes "Oración"/"Exaltación" may appear without "Culto de"
    if (/oraci[oó]n/i.test(s)) return "Culto de Oración";
    if (/exaltaci[oó]n/i.test(s)) return "Culto de Exaltación";
    if (/ense[ñn]anza/i.test(s)) return "Culto de Enseñanza";
    if (/santa cena/i.test(s)) return "Santa Cena";
    if (/ayuno/i.test(s)) return "Ayuno";
    return null;
  }

  function detectSpanishDate(raw) {
    const s = normalizeSpace(raw);
    // Examples: "Domingo 01, de Noviembre del 2026", "Miércoles 5 de Noviembre de 2026"
    const m = s.match(/(\d{1,2}).*?\bde\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)\b.*?\b(\d{4})\b/i);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const monthName = m[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const month = MONTHS[monthName];
    const year = parseInt(m[3], 10);
    if (!month || !year) return null;
    const label = `${String(day).padStart(2, "0")} ${m[2]} ${year}`;
    return { day, month, year, label, monthYear: `${year}-${String(month).padStart(2, "0")}` };
  }

  function monthYearLabel(monthYear) {
    const [y, m] = String(monthYear || "").split("-").map(Number);
    const names = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    if (!y || !m || !names[m - 1]) return monthYear || "";
    return `${names[m - 1]} ${y}`;
  }

  function parseSermonTitle(title) {
    const original = String(title || "");
    const parts = original.split("|").map(normalizeSpace).filter(Boolean);
    if (parts.length < 2) {
      return { original, parsed: false, serviceType: null, date: null, displayTitle: original };
    }
    // Ignore trailing "IAPI"
    const trimmedParts = parts.filter((p, idx) => !(idx === parts.length - 1 && /^iapi$/i.test(p)));
    const serviceType = detectServiceType(trimmedParts[0] || "");
    const datePart = trimmedParts[1] || trimmedParts[0] || "";
    const date = detectSpanishDate(datePart) || detectSpanishDate(trimmedParts.slice(1).join(" "));
    const parsed = Boolean(serviceType || date);
    if (!parsed) {
      return { original, parsed: false, serviceType: null, date: null, displayTitle: original };
    }
    return {
      original,
      parsed: true,
      serviceType: serviceType || null,
      date: date || null,
      displayTitle: original
    };
  }

  global.IAPISermonParser = { SERVICE_TYPES, parseSermonTitle, monthYearLabel };
})(window);
