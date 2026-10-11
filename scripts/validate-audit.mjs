import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

// A final review hash comes from its owner. Never derive a replacement here.
export const ledgerPaths = ['content/reaudit-1-2.json', 'content/reaudit-3-4.json', 'content/reaudit-5-6.json'];
export const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const text = v => typeof v === 'string' ? v.trim() : Array.isArray(v) ? v.filter(s => typeof s === 'string').join(' ').trim() : '';
const read = (root, p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const key = s => s?.file ? `${s.file}#${s.page}` : s?.url;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const hashFields = ['questionSha256', 'questionHash', 'reviewedQuestionSha256', 'finalQuestionSha256'];

export function readAuditState(root, expectedCount = 926) {
  const bank = read(root, 'public/data/bank.json'), raw = new Map(), errors = [], ledgerHashes = {};
  for (const p of ledgerPaths) {
    const d = read(root, p), items = Array.isArray(d) ? d : d.items ?? d.entries;
    ledgerHashes[p] = digest(d);
    if (!Array.isArray(items)) { errors.push(`Invalid raw ledger array: ${p}`); continue; }
    if (!Array.isArray(d) && d.status !== undefined && !['closed', 'complete'].includes(d.status)) errors.push(`Unfinished raw ledger: ${p}: ${d.status}`);
    for (const e of items) {
      if (!e?.id || raw.has(e.id)) errors.push(`Missing/duplicate raw ID: ${p}: ${e?.id}`);
      raw.set(e?.id, { item: e, path: p });
    }
  }
  const ids = new Set(bank.map(q => q.id));
  if (ids.size !== bank.length) errors.push('Duplicate IDs in bank.');
  if (bank.length !== expectedCount || raw.size !== expectedCount) errors.push(`Expected exact ${expectedCount} bank/raw coverage; got ${bank.length}/${raw.size}.`);
  for (const id of raw.keys()) if (!ids.has(id)) errors.push(`Extra raw review ID: ${id}`);
  const content = Array.from({ length: 6 }, (_, i) => read(root, `content/topic${i + 1}.json`)).flat();
  if (digest(content) !== digest(bank)) errors.push('Compiled bank differs from current topic JSON.');
  const cross = read(root, 'content/reaudit-cross-topic.json'), peer = read(root, 'content/reaudit-peer.json');
  if (cross.status !== 'complete' || !Array.isArray(cross.candidates) || cross.candidates.some(c => !['screened_distinct', 'closed_after_revision', 'closed_distinct'].includes(c.finalStatus))) errors.push('Cross-topic semantic review has unfinished/unknown states.');
  if (peer.status !== 'complete' || !Array.isArray(peer.items) || peer.items.some(e => !['peer_accepted', 'peer_accepted_after_revision'].includes(e.status))) errors.push('Peer review has unfinished/unknown states.');
  if (cross.finalBankSha256 !== digest(bank)) errors.push('Cross-topic final bank hash is stale.');
  const finalHashes = new Map(bank.map(q => [q.id, digest(q)]));
  for (const c of cross.candidates ?? []) for (const id of [c.a, c.b]) if (!finalHashes.has(id) || c.finalQuestionHashes?.[id] !== finalHashes.get(id)) errors.push(`Cross-topic final question hash is missing/stale: ${c.candidate}: ${id}`);
  // Peer hashes describe the record at its historical read; the raw owner hash and
  // final cross-topic hashes bind the final record. Preserve peer history verbatim.
  const crossLedgerSha256 = digest(cross), peerLedgerSha256 = digest(peer);
  const normalized = new Map();
  for (const q of bank) {
    const r = raw.get(q.id);
    if (!r) { errors.push(`No raw review: ${q.id}`); continue; }
    const { item: e, path: p } = r, states = [e.status, e.finalStatus].filter(s => s !== undefined);
    if (!states.length || states.some(s => s !== 'closed') || e.fullRecordRead !== true) errors.push(`Unfinished/full-read missing in raw: ${q.id}`);
    if (e.topic !== q.topic || (e.difficultyAfter ?? e.levelAfter) !== q.difficulty) errors.push(`Wrong raw topic/level: ${q.id}`);
    const hashes = hashFields.filter(f => e[f] !== undefined);
    if (!hashes.length) errors.push(`No owner-bound final Node hash: ${q.id}`);
    for (const f of hashes) if (!/^[a-f0-9]{64}$/.test(e[f]) || e[f] !== digest(q)) errors.push(`Stale raw final hash: ${q.id}: ${f}`);
    const cognitiveOperation = text(e.actualCognitiveOperation ?? e.cognitiveOperation);
    if (!cognitiveOperation) errors.push(`No raw cognitive operation: ${q.id}`);
    const verified = e.sourceVerified ?? e.sourcesVerified, sourceChecks = [];
    if (!Array.isArray(verified) || !verified.length) errors.push(`No raw source checks: ${q.id}`);
    if (!Array.isArray(q.sources) || !q.sources.length) errors.push(`No bank sources: ${q.id}`);
    for (const s of q.sources ?? []) {
      const v = Array.isArray(verified) ? verified.find(c => key(c) === key(s)) : undefined;
      const conditions = text(v?.condition ?? v?.applicability ?? v?.conditions);
      if (!key(s) || !v || v.verified !== true || !conditions) errors.push(`Unverified raw source conditions: ${q.id}: ${key(s)}`);
      sourceChecks.push({ file: s.file ?? null, page: s.page ?? null, url: s.url ?? null, year: s.year ?? null, verified: v?.verified === true, conditions, method: text(v?.verification ?? v?.method) });
    }
    let imageCheck = null;
    if (q.images?.length) {
      const im = e.imageCheck ?? e.imageCaseCheck, object = im && typeof im === 'object' && !Array.isArray(im);
      const finding = text(im?.finding ?? im?.findingChecked ?? im?.findings);
      const provenance = im?.provenance === true || text(im?.provenance).length >= 20;
      if (!object || im.clinicalVignette !== true || !(im.actualImage === true || im.actualLocalImage === true) || im.explicitTask !== true || !provenance || !finding || !text(q.clinicalVignette) || !text(q.task) || !text(q.caseProvenance)) errors.push(`Incomplete raw image audit: ${q.id}`);
      if (im?.status !== undefined && !['closed', 'reviewed', 'complete'].includes(im.status)) errors.push(`Unfinished raw image audit: ${q.id}: ${im.status}`);
      for (const f of ['visualChecked', 'sourcesAndCaptionsChecked', 'copyMatches']) if (im?.[f] !== undefined && im[f] !== true) errors.push(`Unverified raw image flag: ${q.id}: ${f}`);
      const reviewed = im?.assetPaths ?? im?.assets;
      const assetPaths = Array.isArray(reviewed) ? reviewed.map(a => typeof a === 'string' ? a : a.assetPath ?? a.asset).filter(Boolean).map(a => `images/${path.basename(a)}`).sort() : [];
      const assets = q.images.map(a => a.assetPath).sort();
      if (!same(assetPaths, assets) || im?.caseGroup !== q.caseGroup) errors.push(`Raw reviewed assets/group differ: ${q.id}`);
      for (const a of q.images) if (!/^images\/[\w.-]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(a.assetPath) || !fs.existsSync(path.join(root, 'public', a.assetPath))) errors.push(`Missing image asset: ${q.id}: ${a.assetPath}`);
      for (const a of Array.isArray(reviewed) ? reviewed : []) if (a && typeof a === 'object' && a.sha256) {
        const file = path.join(root, 'public/images', path.basename(a.assetPath ?? a.asset));
        if (!fs.existsSync(file) || crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') !== a.sha256 || a.copyMatches === false) errors.push(`Stale/unverified raw image bytes: ${q.id}`);
      }
      imageCheck = { clinicalVignette: true, actualImage: true, explicitTask: true, provenance: true, finding, assets, caseGroup: q.caseGroup };
    }
    normalized.set(q.id, { id: q.id, topic: q.topic, status: 'closed', fullRecordRead: true, cognitiveOperation, difficultyAfter: q.difficulty, questionSha256: hashes.length ? e[hashes[0]] : null, rawRecordSha256: digest(e), rawLedgerSha256: ledgerHashes[p], sourceLedger: p, sourceChecks, imageCheck });
  }
  return { bank, raw, normalized, ledgerHashes, crossLedgerSha256, peerLedgerSha256, errors };
}

export function validateConsolidated(root) {
  const { bank, normalized, crossLedgerSha256, peerLedgerSha256, errors } = readAuditState(root), audit = read(root, 'content/reaudit-index.json'), entries = new Map();
  if (audit.status !== 'complete') errors.push('Audit has unfinished work.');
  if (audit.bankSha256 !== digest(bank)) errors.push('Audit bank hash is stale.');
  if (audit.crossLedgerSha256 !== crossLedgerSha256 || audit.peerLedgerSha256 !== peerLedgerSha256) errors.push('Consolidated cross/peer ledger binding is stale.');
  if (!Array.isArray(audit.items)) errors.push('Index items must be an array.');
  for (const e of audit.items ?? []) {
    if (entries.has(e.id)) errors.push(`Duplicate index ID: ${e.id}`);
    entries.set(e.id, e);
    if (!ledgerPaths.includes(e.sourceLedger)) errors.push(`Unapproved sourceLedger path: ${e.id}`);
  }
  if (entries.size !== bank.length) errors.push('Index coverage differs from bank.');
  for (const id of entries.keys()) if (!normalized.has(id)) errors.push(`Extra index review: ${id}`);
  const fields = ['topic', 'status', 'fullRecordRead', 'cognitiveOperation', 'difficultyAfter', 'questionSha256', 'rawRecordSha256', 'rawLedgerSha256', 'sourceLedger', 'sourceChecks', 'imageCheck'];
  for (const [id, raw] of normalized) {
    const e = entries.get(id);
    if (!e) { errors.push(`No individual index audit: ${id}`); continue; }
    for (const f of fields) if (!same(e[f], raw[f])) errors.push(`Index differs from checked raw: ${id}: ${f}`);
  }
  return { records: bank.length, individualReviews: entries.size, imagingReviews: [...normalized.values()].filter(e => e.imageCheck).length, bankSha256: digest(bank), errors, note: 'Coverage, owner-bound final hashes and raw audit integrity only; no automatic clinical or psychometric grading.' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const report = validateConsolidated(process.argv[2] ?? process.cwd());
    console.log(JSON.stringify(report, null, 2));
    if (report.errors.length) process.exitCode = 1;
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
