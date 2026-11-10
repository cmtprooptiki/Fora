import { mediaUrl } from './strapi';

/**
 * ============================================================================
 *  Markdown → HTML για τα πεδία «Rich text (Markdown)» του Strapi
 * ----------------------------------------------------------------------------
 *  Υποστηρίζει ό,τι βάζουν τα κουμπιά του επεξεργαστή του Strapi:
 *    # / ## / ### Επικεφαλίδες        **Έντονα**      _Πλάγια_
 *    <u>Υπογράμμιση</u>               ~~Διαγραφή~~    `κώδικας` / ```μπλοκ```
 *    - Κουκκίδες   1. Αρίθμηση        > Παράθεση      [Σύνδεσμος](url)
 *    ![Εικόνα](url)                   ---  (διαχωριστική γραμμή)
 *
 *  Συμβατό με τα παλιά άρθρα (απλό κείμενο): κάθε αλλαγή γραμμής μένει
 *  αλλαγή γραμμής, οπότε η εμφάνισή τους δεν αλλάζει. Επιτρέπει και λίγο
 *  «χαλαρή» γραφή: «##Τίτλος» χωρίς κενό και «**λέξη **» με κενό πριν το
 *  κλείσιμο (συμβαίνει όταν το διπλό κλικ πιάνει και το κενό).
 *  Το απλό «#λέξη» μένει κείμενο (hashtag).
 * ============================================================================
 */

const BLOCK_HTML =
  /^<\/?(p|div|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|figure|figcaption|img|iframe|blockquote|pre|hr|section|video|audio)\b/i;
const UL = /^(\s*)[-*+]\s+(.*)$/;
const OL = /^(\s*)(\d{1,9})[.)]\s+(.*)$/;
const HR = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const FENCE = /^\s*(```|~~~)/;
const QUOTE = /^\s{0,3}>/;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Ασφαλής διεύθυνση συνδέσμου: όχι javascript: κ.λπ. */
function safeUrl(url) {
  const u = String(url || '').trim();
  if (u.startsWith('/uploads/')) return mediaUrl(u);
  if (/^www\./i.test(u)) return `https://${u}`;
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return '#';
  return u;
}

function heading(line) {
  const m = line.match(/^\s{0,3}(#{1,6})(\s*)(.*)$/);
  if (!m) return null;
  // «#λέξη» = hashtag, όχι επικεφαλίδα. Από «##» και πάνω δεχόμαστε και χωρίς κενό.
  if (!m[2] && m[1].length < 2) return null;
  const text = m[3].replace(/\s+#+\s*$/, '').trim();
  if (!text) return null;
  // Ο τίτλος του άρθρου είναι ήδη <h1>, οπότε το «#» γίνεται <h2>.
  return { level: Math.max(2, m[1].length), text };
}

function startsBlock(line) {
  return (
    heading(line) ||
    HR.test(line) ||
    FENCE.test(line) ||
    QUOTE.test(line) ||
    UL.test(line) ||
    OL.test(line) ||
    BLOCK_HTML.test(line.trim())
  );
}

const indentOf = (l) => l.match(/^\s*/)[0].replace(/\t/g, '    ').length;

/* ------------------------------ Inline ---------------------------------- */

// Τυλίγει το κείμενο στην ετικέτα, αφήνοντας τα κενά της αρχής/του τέλους
// ΕΞΩ από αυτήν (π.χ. «**λέξη **» → «<strong>λέξη</strong> »).
function wrap(tag) {
  return (m, before, inner) => {
    const core = inner.trim();
    if (!core) return m;
    const lead = inner.match(/^\s*/)[0];
    const trail = inner.match(/\s*$/)[0];
    return `${before}${lead}<${tag}>${core}</${tag}>${trail}`;
  };
}

function emphasis(s) {
  return s
    .replace(/()\*\*((?:[^*\n]|\*(?!\*))+?)\*\*/g, wrap('strong'))
    .replace(/(^|[^\p{L}\p{N}_])__((?:[^_\n]|_(?!_))+?)__(?![\p{L}\p{N}_])/gu, wrap('strong'))
    .replace(/()~~([^~\n]+?)~~/g, wrap('del'))
    .replace(/(^|[^*\\\p{L}\p{N}])\*(?=[^\s*])([^*\n]+?)\*(?![*\p{L}\p{N}])/gu, wrap('em'))
    .replace(/(^|[^\p{L}\p{N}_])_(?=[^\s_])([^_\n]+?)_(?![\p{L}\p{N}_])/gu, wrap('em'));
}

function inline(text) {
  const store = [];
  const keep = (html) => `\u0000${store.push(html) - 1}\u0000`;
  let s = String(text);

  // \* \_ κ.λπ. → ο χαρακτήρας ως έχει
  s = s.replace(/\\([\\`*_{}\[\]()#+\-.!~>|])/g, (_, c) => keep(escapeHtml(c)));
  // `κώδικας`
  s = s.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (_, __, code) =>
    keep(`<code>${escapeHtml(code.trim())}</code>`)
  );
  // Έτοιμες ετικέτες HTML (π.χ. <u> του Strapi) μένουν ανέγγιχτες
  s = s.replace(/<!--[\s\S]*?-->|<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*)?\/?>/g, (m) => keep(m));
  // ![εικόνα](url "τίτλος")
  s = s.replace(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"([^"]*)")?\s*\)/g,
    (_, alt, src, title) =>
      keep(
        `<img src="${escapeHtml(safeUrl(src))}" alt="${escapeHtml(alt)}"` +
          `${title ? ` title="${escapeHtml(title)}"` : ''} loading="lazy" />`
      )
  );
  // [κείμενο](url "τίτλος")
  s = s.replace(
    /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+"([^"]*)")?\s*\)/g,
    (_, label, href, title) => {
      const url = safeUrl(href);
      const ext = /^https?:/i.test(url) && !url.includes('healthcare-management.gr');
      return keep(
        `<a href="${escapeHtml(url)}"` +
          `${title ? ` title="${escapeHtml(title)}"` : ''}` +
          `${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${emphasis(label)}</a>`
      );
    }
  );
  // Σκέτες διευθύνσεις https://… γίνονται σύνδεσμοι
  s = s.replace(/\bhttps?:\/\/[^\s<\u0000]*[^\s<\u0000.,;:!?)\]»"'’]/g, (url) =>
    keep(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`)
  );

  s = emphasis(s);

  // Επαναφορά (επαναληπτικά, γιατί ένας σύνδεσμος μπορεί να περιέχει κώδικα)
  for (let n = 0; n < 5 && s.includes('\u0000'); n++) {
    s = s.replace(/\u0000(\d+)\u0000/g, (_, k) => store[Number(k)]);
  }
  return s;
}

/* ------------------------------ Blocks ---------------------------------- */

function renderList(lines, start) {
  let i = start;
  const first = lines[i];
  const ordered = !UL.test(first);
  const RE = ordered ? OL : UL;
  const base = indentOf(first);
  const startNum = ordered ? Number(first.match(OL)[2]) : 1;
  const items = [];

  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) {
      // Κενή γραμμή: η λίστα συνεχίζει μόνο αν ακολουθεί στοιχείο της ή εσοχή
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (j < lines.length && ((RE.test(lines[j]) && indentOf(lines[j]) < base + 2) || indentOf(lines[j]) >= base + 2)) {
        if (items.length) items[items.length - 1].children.push('');
        i = j;
        continue;
      }
      break;
    }
    const ind = indentOf(l);
    if (ind < base + 2 && RE.test(l)) {
      const m = l.match(RE);
      items.push({ text: ordered ? m[3] : m[2], children: [] });
      i++;
      continue;
    }
    if (ind >= base + 2 && items.length) {
      items[items.length - 1].children.push(l.slice(Math.min(ind, base + 2)));
      i++;
      continue;
    }
    break;
  }

  const tag = ordered ? 'ol' : 'ul';
  const startAttr = ordered && startNum !== 1 ? ` start="${startNum}"` : '';
  const html = items
    .map((it) => {
      const kids = it.children.some((c) => c.trim()) ? renderBlocks(it.children) : '';
      return `<li>${inline(it.text.trim())}${kids}</li>`;
    })
    .join('');
  return { html: `<${tag}${startAttr}>${html}</${tag}>`, next: i };
}

function renderBlocks(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    // ```μπλοκ κώδικα```
    const fence = line.match(FENCE);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }

    const h = heading(line);
    if (h) {
      out.push(`<h${h.level}>${inline(h.text)}</h${h.level}>`);
      i++;
      continue;
    }

    if (HR.test(line)) {
      out.push('<hr />');
      i++;
      continue;
    }

    if (QUOTE.test(line)) {
      const buf = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        buf.push(lines[i].replace(/^\s{0,3}>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${renderBlocks(buf)}</blockquote>`);
      continue;
    }

    if (UL.test(line) || OL.test(line)) {
      const { html, next } = renderList(lines, i);
      out.push(html);
      i = next;
      continue;
    }

    // Έτοιμο HTML (π.χ. επικολλημένο) μένει ως έχει μέχρι την κενή γραμμή
    if (BLOCK_HTML.test(line.trim())) {
      const buf = [];
      while (i < lines.length && lines[i].trim()) buf.push(lines[i++]);
      out.push(buf.join('\n'));
      continue;
    }

    // Παράγραφος: κάθε αλλαγή γραμμής μένει αλλαγή γραμμής
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${buf.map((l) => inline(l.trim())).join('<br />')}</p>`);
  }
  return out.join('\n');
}

/** Μετατρέπει κείμενο Markdown του Strapi σε HTML. */
export function markdownToHtml(md) {
  if (!md) return '';
  return renderBlocks(String(md).replace(/\r\n?/g, '\n').split('\n'));
}
