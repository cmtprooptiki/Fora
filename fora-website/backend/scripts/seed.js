'use strict';

/**
 * ============================================================================
 *  FORA – Αυτόματη εισαγωγή περιεχομένου (seed)
 * ----------------------------------------------------------------------------
 *  Τι κάνει αυτό το πρόγραμμα:
 *    1. Κατεβάζει ΟΛΕΣ τις φωτογραφίες, τα λογότυπα και τα PDF από τον
 *       παλιό ιστότοπο και τα ανεβάζει μέσα στο Strapi (στη δική σας βάση).
 *    2. Δημιουργεί αυτόματα τις 4 διοργανώσεις (Forum 2022, 2023, 2024, 2025)
 *       με τα πραγματικά τους κείμενα, ομιλητές, θεματικές, χορηγούς κ.λπ.
 *    3. Συμπληρώνει τις γενικές ρυθμίσεις (λογότυπο, επικοινωνία, social).
 *
 *  Τρέξτε το ΜΙΑ φορά με:  npm run seed
 *  (Οδηγίες βήμα-βήμα υπάρχουν στο SETUP-GUIDE.md.)
 * ============================================================================
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const http = require('http');
const { content, siteSettings } = require('../data/content.js');

// --- Βοηθητικό: κατέβασμα ενός αρχείου από το διαδίκτυο σε προσωρινό φάκελο ---
function downloadToTemp(fileUrl, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Πολλές ανακατευθύνσεις'));
    let parsed;
    try {
      parsed = new URL(fileUrl);
    } catch (e) {
      return reject(e);
    }
    const client = parsed.protocol === 'http:' ? http : https;
    // Χρησιμοποιούμε το parsed.href ώστε ελληνικοί χαρακτήρες στη διεύθυνση
    // (π.χ. στα ονόματα PDF) να κωδικοποιούνται σωστά.
    const req = client.get(
      parsed.href,
      { headers: { 'User-Agent': 'Mozilla/5.0 (FORA-seed)' } },
      (res) => {
        // Ανακατεύθυνση
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          const next = new URL(res.headers.location, fileUrl).toString();
          return resolve(downloadToTemp(next, redirectCount + 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const rawName = decodeURIComponent(path.basename(parsed.pathname));
        const safeName = rawName.replace(/[^\p{L}\p{N}.\-_]/gu, '_') || 'file';
        const tmpPath = path.join(
          os.tmpdir(),
          `fora-${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`
        );
        const out = fs.createWriteStream(tmpPath);
        res.pipe(out);
        out.on('finish', () => out.close(() => resolve({ tmpPath, name: safeName })));
        out.on('error', reject);
      }
    );
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('Timeout')));
  });
}

function mimeFor(name) {
  const ext = path.extname(name).toLowerCase();
  return (
    {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    }[ext] || 'application/octet-stream'
  );
}

async function loadStrapi() {
  const factory = require('@strapi/strapi');
  // Καλύπτουμε τις διάφορες εκδόσεις του Strapi 5.
  if (typeof factory.compileStrapi === 'function' && typeof factory.createStrapi === 'function') {
    const ctx = await factory.compileStrapi();
    return factory.createStrapi(ctx).load();
  }
  if (typeof factory.createStrapi === 'function') {
    return factory.createStrapi().load();
  }
  if (typeof factory === 'function') {
    return factory().load();
  }
  if (factory.default) {
    return factory.default().load();
  }
  throw new Error('Δεν βρέθηκε τρόπος εκκίνησης του Strapi.');
}

async function main() {
  const app = await loadStrapi();
  app.log.level = 'error';

  const uploadCache = new Map(); // url -> fileId (ώστε να μην κατεβαίνει 2 φορές)
  let downloaded = 0;
  let failed = 0;

  async function uploadFromUrl(url) {
    if (!url) return null;
    if (uploadCache.has(url)) return uploadCache.get(url);
    try {
      const { tmpPath, name } = await downloadToTemp(url);
      const stat = fs.statSync(tmpPath);
      const mimetype = mimeFor(name);
      const uploadService = app.plugin('upload').service('upload');
      const uploaded = await uploadService.upload({
        data: {},
        files: {
          filepath: tmpPath,
          path: tmpPath,
          originalFilename: name,
          name,
          mimetype,
          type: mimetype,
          size: stat.size,
        },
      });
      const fileId = Array.isArray(uploaded) ? uploaded[0].id : uploaded.id;
      uploadCache.set(url, fileId);
      fs.unlink(tmpPath, () => {});
      downloaded++;
      if (downloaded % 15 === 0) {
        console.log(`   ...κατέβηκαν ${downloaded} αρχεία μέχρι τώρα`);
      }
      return fileId;
    } catch (err) {
      failed++;
      console.warn(`   ! Δεν κατέβηκε: ${url}  (${err.message})`);
      uploadCache.set(url, null);
      return null;
    }
  }

  async function uploadMany(urls) {
    const ids = [];
    for (const u of urls || []) {
      const id = await uploadFromUrl(u);
      if (id) ids.push(id);
    }
    return ids;
  }

  console.log('\n=== FORA seed ===');

  // --- 1) Γενικές ρυθμίσεις ---
  console.log('\n[1/2] Ρυθμίσεις ιστότοπου...');
  const logoId = await uploadFromUrl(siteSettings.logotypoUrl);
  const settingsData = {
    emailEpikoinonias: siteSettings.emailEpikoinonias,
    tilefonoEpikoinonias: siteSettings.tilefonoEpikoinonias,
    keimenoEpikoinonias: siteSettings.keimenoEpikoinonias,
    facebookUrl: siteSettings.facebookUrl,
    linkedinUrl: siteSettings.linkedinUrl,
    keimenoNewsletter: siteSettings.keimenoNewsletter,
    keimenoFooter: siteSettings.keimenoFooter,
    ...(logoId ? { logotypo: logoId } : {}),
  };
  const existingSettings = await app
    .documents('api::site-setting.site-setting')
    .findFirst();
  if (existingSettings) {
    await app.documents('api::site-setting.site-setting').update({
      documentId: existingSettings.documentId,
      data: settingsData,
    });
  } else {
    await app.documents('api::site-setting.site-setting').create({ data: settingsData });
  }
  console.log('   ✓ Ρυθμίσεις έτοιμες.');

  // --- 2) Διοργανώσεις (Forums) ---
  console.log('\n[2/2] Διοργανώσεις...');
  for (const f of content) {
    const existing = await app
      .documents('api::forum.forum')
      .findMany({ filters: { slug: f.slug } });
    if (existing && existing.length) {
      console.log(`   • ${f.slug}: υπάρχει ήδη — παραλείπεται.`);
      continue;
    }

    console.log(`   • Δημιουργία: ${f.arithmos}ο Forum ${f.etos} (${f.slug})`);

    const heroId = await uploadFromUrl(f.eikonaHeroUrl);
    const pdfId = await uploadFromUrl(f.atzentaPdfUrl);

    const omilites = [];
    for (const sp of f.omilites || []) {
      const photoId = sp.fotografiaUrl ? await uploadFromUrl(sp.fotografiaUrl) : null;
      omilites.push({
        onoma: sp.onoma,
        idiotita: sp.idiotita || null,
        viografiko: sp.viografiko || null,
        ...(photoId ? { fotografia: photoId } : {}),
      });
    }

    const synergates = [];
    for (const g of f.synergates || []) {
      const logotypa = [];
      for (const s of g.logotypa || []) {
        const lid = await uploadFromUrl(s.logotypoUrl);
        logotypa.push({
          onoma: s.onoma || null,
          istoselida: s.istoselida || null,
          ...(lid ? { logotypo: lid } : {}),
        });
      }
      synergates.push({ katigoria: g.katigoria, logotypa });
    }

    console.log(`     - φωτογραφίες: ${(f.fotografiesUrls || []).length}`);
    const fotoIds = await uploadMany(f.fotografiesUrls);

    await app.documents('api::forum.forum').create({
      data: {
        arithmos: f.arithmos,
        etos: f.etos,
        thema: f.thema,
        ypotitlos: f.ypotitlos || null,
        slug: f.slug,
        imerominia: f.imerominia || null,
        xoros: f.xoros || null,
        eisagogikoKeimeno: f.eisagogikoKeimeno || null,
        themaEmfanisis: f.themaEmfanisis || 'Κλασικό',
        grammatoseiraTitlon: f.grammatoseiraTitlon || 'Hagrid',
        xromaKyrioOverride: f.xromaKyrioOverride || null,
        xromaAksesouarOverride: f.xromaAksesouarOverride || null,
        trexonForum: !!f.trexonForum,
        syndesmoEggrafis: f.syndesmoEggrafis || null,
        ...(heroId ? { eikonaHero: heroId } : {}),
        ...(pdfId ? { atzentaPdf: pdfId } : {}),
        thematikesEnotites: f.thematikesEnotites || [],
        omilites,
        synergates,
        ...(fotoIds.length ? { fotografies: fotoIds } : {}),
        vinteo: (f.vinteo || []).map((v) => ({
          titlos: v.titlos || null,
          syndesmosYoutube: v.syndesmosYoutube,
        })),
        programma: f.programma || [],
      },
      status: 'published',
    });
    console.log(`     ✓ έτοιμο.`);
  }

  console.log(
    `\n=== Ολοκληρώθηκε. Κατέβηκαν ${downloaded} αρχεία` +
      (failed ? `, ${failed} απέτυχαν (δείτε παραπάνω).` : '.') +
      ' ===\n'
  );

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('\nΣΦΑΛΜΑ κατά την εισαγωγή:', err);
  process.exit(1);
});
