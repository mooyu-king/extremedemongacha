import { domain, gameUrl, labRules, tiers, practiceCards, referenceCards, referenceEntries, probabilityInPacks } from './data.mjs';
import { matchCards } from './search.mjs';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const percentages = p => p === 0 ? '0%' : p === 1 ? '100%' : p > 0.9999995 ? '>99.99995%' : (p * 100).toPrecision(5) + '%';
const games = new Map(practiceCards.map(card => [card.id, card]));
const analytics = name => window.plausible?.(name);
const element = (name, value, className) => {
  const node = document.createElement(name);
  if (value) node.textContent = value;
  if (className) node.className = className;
  return node;
};

function openSheet(id, caller) {
  const sheet = document.getElementById(id);
  if (!sheet.open) {
    sheet.returnFocus = caller ?? document.activeElement;
    sheet.showModal();
  }
  return sheet;
}

for (const sheet of $$('dialog')) {
  $('[data-close]', sheet).addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', event => {
    if (event.target === sheet) sheet.close();
  });
  sheet.addEventListener('close', () => {
    if (sheet.returnFocus?.isConnected) sheet.returnFocus.focus({ preventScroll: true });
  });
}

const quickTopics = {
  play: [['Start the arcade', 'Follow the in-game starter prompts.'], ['Open a booster', 'Reveal the cards and check rarity and finish.'], ['Check your collection', 'Look for new discoveries and foil variants.']],
  odds: [['Read one slot first', 'Card odds describe a single slot. Pack odds combine all slots.'], ['Choose a finish', 'Foil, normal, and either finish answer different questions.'], ['Check the game mode', 'Arcade, original reference, and Lab Practice use separate odds.']],
  cards: [['Know which collection is open', 'Arcade and Lab cards are stored in their respective modes.'], ['Track a new card', 'Use the missing or foil filters on the Lab Cards page.'], ['Look up a card', 'Open its details for the pack source, odds, finish, and score.']],
};

function setQuickTopic(topic, root) {
  for (const button of $$('[data-topic]', root)) button.setAttribute('aria-pressed', String(button.dataset.topic === topic));
  const list = element('ol', '', 'steps');
  for (const [i, [title, body]] of quickTopics[topic].entries()) {
    const item = element('li');
    const explanation = element('div');
    explanation.append(element('strong', title), element('p', body));
    item.append(element('span', String(i + 1)), explanation);
    list.append(item);
  }
  const content = $('[data-quick-content]', root);
  content.replaceChildren(list);
  if (topic === 'cards') {
    const field = element('label', 'Original reference lookup', 'quick-lookup');
    const choices = element('select');
    const result = element('p');
    result.setAttribute('aria-live', 'polite');
    choices.append(...referenceCards.map((card, index) => new Option(card[1], index)));
    function showReference() {
      const [, name, tier, score, chance] = referenceCards[choices.value];
      result.textContent = name + ' · ' + tier + ' · ' + score.toLocaleString('en-US') +
        ' base points · ' + percentages(probabilityInPacks(chance, 5, 1)) + ' per pack, either finish.';
    }
    field.append(choices);
    choices.addEventListener('change', showReference);
    content.append(field, result);
    showReference();
  }
}

for (const button of $$('[data-topic]')) button.addEventListener('click', () => setQuickTopic(button.dataset.topic, button.closest('.quick-rail')));
$('[data-quick]')?.addEventListener('click', event => {
  const sheet = openSheet('quick-dialog', event.currentTarget);
  const body = $('[data-sheet-body]', sheet);
  const rail = $('.quick-rail');
  const tabs = $('.quick-tabs', rail).cloneNode(true);
  const details = element('div');
  details.dataset.quickContent = '';
  const link = rail.lastElementChild.cloneNode(true);
  body.replaceChildren(tabs, details, link);
  const selected = $('[aria-pressed="true"]', tabs)?.dataset.topic ?? 'play';
  for (const button of $$('[data-topic]', tabs)) button.addEventListener('click', () => setQuickTopic(button.dataset.topic, body));
  setQuickTopic(selected, body);
});

const stage = $('[data-stage]');
const launch = $('[data-launch]');
const gameStatus = $('[data-game-status]');
launch?.addEventListener('click', () => {
  if ($('iframe', stage)) return;
  const frame = element('iframe');
  frame.title = 'GDGacha Arcade';
  frame.allowFullscreen = true;
  frame.allow = 'fullscreen; autoplay';
  frame.src = gameUrl;
  const gameOrigin = new URL(gameUrl).origin;
  window.addEventListener('message', ({ origin, source, data }) => {
    if (origin !== gameOrigin || source !== frame.contentWindow || data?.type !== 'edg-height') return;
    if (!Number.isFinite(data.height) || data.height <= 0) return;
    // GDGacha ignores height changes of up to 4px. Leave room for those changes and rounding.
    stage.style.setProperty('--arcade-height', Math.ceil(data.height) + 8 + 'px');
    stage.classList.add('game-stage-fitted');
  });
  gameStatus.textContent = 'Loading the Arcade…';
  const timer = setTimeout(() => {
    gameStatus.textContent = 'Still loading? Open the Arcade in a new tab if the frame stays blank.';
  }, 9000);
  frame.addEventListener('load', () => {
    clearTimeout(timer);
    gameStatus.textContent = 'Use the controls in the Arcade. If blank, open it in a new tab.';
  }, { once: true });
  stage.append(frame);
  $('[data-cover]').hidden = true;
  frame.focus();
});

const fullScreen = $('[data-fullscreen]');
fullScreen?.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await stage.requestFullscreen();
  } catch {
    gameStatus.textContent = 'Fullscreen is unavailable here. Use the open-in-new-tab button to continue.';
  }
});
document.addEventListener('fullscreenchange', () => {
  if (!fullScreen) return;
  const active = document.fullscreenElement === stage;
  fullScreen.setAttribute('aria-pressed', String(active));
  fullScreen.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
  fullScreen.title = active ? 'Exit fullscreen' : 'Enter fullscreen';
});

for (const button of $$('[data-load-video]')) button.addEventListener('click', () => {
  const parent = button.closest('[data-video]');
  const frame = element('iframe');
  frame.title = button.closest('.video-card').querySelector('h3').textContent;
  frame.src = 'https://www.youtube-nocookie.com/embed/' + parent.dataset.video;
  frame.allow = 'fullscreen; encrypted-media; picture-in-picture';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  parent.replaceChildren(frame);
  frame.focus();
});

function calculatorState(form) {
  const { mode, card, chance, slots, foil } = form.elements;
  const custom = mode.value === 'custom';
  $('[data-card-option]', form).hidden = custom;
  for (const field of $$('[data-custom-option]', form)) field.hidden = !custom;
  chance.required = custom;
  slots.required = custom;
  foil.required = custom;
  if (custom) return;
  const catalog = mode.value === 'lab' ? practiceCards : referenceCards;
  card.replaceChildren(...catalog.map((item, index) => new Option(item.name ?? item[1], index)));
}

const form = $('[data-calculator]');
form?.elements.mode.addEventListener('change', () => {
  calculatorState(form);
  $('[data-odds-output]', form).textContent = '';
});
form?.addEventListener('submit', event => {
  event.preventDefault();
  const { mode, card, chance, slots, foil, finish, packs } = form.elements;
  const isLab = mode.value === 'lab';
  const custom = mode.value === 'custom';
  const pick = isLab ? practiceCards[card.value] : referenceCards[card.value];
  const name = custom ? 'Custom target' : (pick.name ?? pick[1]);
  const raw = custom ? chance.valueAsNumber / 100 : (pick.probability ?? pick[4]);
  const perPack = custom ? slots.valueAsNumber : (isLab ? labRules.slots : 5);
  const foilRate = custom ? foil.valueAsNumber / 100 : (isLab ? labRules.foil : 0.10);
  const chancePerSlot = raw * (finish.value === 'foil' ? foilRate : finish.value === 'normal' ? 1 - foilRate : 1);
  const total = packs.valueAsNumber;
  const output = $('[data-odds-output]', form);
  output.textContent = name + ' · ' + finish.options[finish.selectedIndex].text
    + ' · per slot ' + percentages(chancePerSlot)
    + ' · per pack ' + percentages(probabilityInPacks(chancePerSlot, perPack, 1))
    + ' · at least one in ' + total.toLocaleString('en-US') + ' pack' + (total === 1 ? '' : 's')
    + ': ' + percentages(probabilityInPacks(chancePerSlot, perPack, total));
});

function emptySave() {
  return { version: 1, cards: {}, latest: [], favorites: [] };
}

function connect() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('demon-pack-lab', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Storage upgrade blocked'));
  });
}

let save = emptySave();
let database;
let saveRevision = 0;
const collection = $('[data-collection-status]');
const gameStatusSave = $('[data-save-status]');

function fetchSave() {
  return new Promise((resolve, reject) => {
    const request = database.transaction('state').objectStore('state').get('collection');
    request.onsuccess = () => {
      try { resolve(request.result ? parseBackup(request.result) : emptySave()); }
      catch (error) { reject(error); }
    };
    request.onerror = () => reject(request.error);
  });
}

function commit(change) {
  if (!database) {
    save = change(save);
    return Promise.resolve(save);
  }
  return new Promise((resolve, reject) => {
    const tx = database.transaction('state', 'readwrite');
    const store = tx.objectStore('state');
    const read = store.get('collection');
    let next;
    read.onsuccess = () => {
      try {
        next = change(read.result ? parseBackup(read.result) : emptySave());
        store.put(next, 'collection');
      } catch {
        tx.abort();
      }
    };
    tx.oncomplete = () => resolve(next);
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}

function copies(id) {
  return save.cards[id] ?? { normal: 0, foil: 0 };
}

function showSuggestions(root, matches, refresh) {
  const input = $('[data-search]', root);
  const suggestions = $('[data-suggestions]', root);
  const query = input.value.trim();
  const exact = matches.length === 1 && matches[0].name.toLowerCase() === query.toLowerCase();
  suggestions.hidden = !query || !matches.length || exact;
  suggestions.replaceChildren();
  if (suggestions.hidden) return;
  for (const card of matches.slice(0, 6)) {
    const button = element('button', card.name, 'button');
    button.type = 'button';
    button.addEventListener('click', () => {
      input.value = card.name;
      refresh();
      suggestions.hidden = true;
      input.focus();
    });
    suggestions.append(button);
  }
}

for (const input of $$('[data-search]')) input.addEventListener('keydown', event => {
  const suggestions = $('[data-suggestions]', input.parentElement);
  if (suggestions.hidden) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    $('button', suggestions)?.focus();
  } else if (event.key === 'Escape') suggestions.hidden = true;
});

const referenceCatalog = $('[data-reference-catalog]');
if (referenceCatalog) {
  const input = $('[data-search]', referenceCatalog);
  function filterReference() {
    const matches = matchCards(referenceEntries, input.value);
    const shown = new Set(matches.map(card => card.id));
    for (const row of $$('[data-reference-card]', referenceCatalog)) row.hidden = !shown.has(row.dataset.referenceCard);
    $('[data-filter-status]', referenceCatalog).textContent = shown.size ? 'Showing ' + shown.size + ' reference ' + (shown.size === 1 ? 'card.' : 'cards.') : 'No close match. Try part of a name or a rank.';
    showSuggestions(referenceCatalog, matches, filterReference);
  }
  input.addEventListener('input', filterReference);
}

function renderCollectionLink() {
  const count = $('[data-favorite-count]');
  count.textContent = save.favorites.length;
  count.hidden = false;
  $('[data-collection-link]').setAttribute('aria-label', 'My Collection, ' + save.favorites.length + ' favorites');
}

function showFilters() {
  const root = $('[data-practice-catalog]');
  const search = $('[data-search]', root).value;
  const theme = $('[data-filter="theme"]').value;
  const tier = $('[data-filter="tier"]').value;
  const ownership = $('[data-filter="ownership"]').value;
  const favorites = new Set(save.favorites);
  const eligible = practiceCards.filter(card => {
    const count = copies(card.id);
    const owned = count.normal + count.foil > 0;
    const stateMatch = ownership === 'owned' ? owned : ownership === 'missing' ? !owned :
      ownership === 'foil' ? count.foil > 0 : ownership === 'unfoiled' ? count.foil === 0 :
        ownership === 'favorites' ? favorites.has(card.id) : true;
    return (!theme || card.theme === theme) && (!tier || card.tier === tier) && stateMatch;
  });
  const matches = matchCards(eligible, search);
  const shown = new Set(matches.map(card => card.id));
  for (const item of $$('.card-item[data-id]')) {
    const count = copies(item.dataset.id);
    const owned = count.normal + count.foil > 0;
    item.hidden = !shown.has(item.dataset.id);
    $('[data-card-owned]', item).textContent = owned ? count.normal + ' normal · ' + count.foil + ' foil' : 'Missing';
    const button = $('[data-favorite]', item);
    const favorite = favorites.has(item.dataset.id);
    button.setAttribute('aria-pressed', String(favorite));
    $('[data-favorite-label]', button).textContent = favorite ? 'Saved' : 'Save';
  }
  const empty = ownership === 'favorites' && !favorites.size ? 'No favorites yet. Clear the filters and save a card with its heart button.' : 'No close matches. Try part of a name or fewer filters.';
  $('[data-filter-status]').textContent = shown.size ? 'Showing ' + shown.size + (shown.size === 1 ? ' card.' : ' cards.') : empty;
  showSuggestions(root, matches, showFilters);
}

function renderCollection() {
  const theme = $('[data-filter="theme"]').value;
  const catalog = theme ? practiceCards.filter(c => c.theme === theme) : practiceCards;
  const distinct = catalog.filter(card => copies(card.id).normal + copies(card.id).foil > 0).length;
  const foils = catalog.filter(card => copies(card.id).foil > 0).length;
  const score = catalog.reduce((sum, card) => sum + (copies(card.id).foil ? card.score * 2 : copies(card.id).normal ? card.score : 0), 0);
  collection.textContent = (theme ? theme + ' · ' : '') + distinct + ' / ' + catalog.length + ' collected · ' + foils + ' foil · ' + score + ' points · ' + save.favorites.length + ' favorites';
  renderCollectionLink();
  showFilters();
}

function pickIndex(random, total) {
  return Math.floor(random / 4294967296 * total);
}

function drawPack() {
  const random = crypto.getRandomValues(new Uint32Array(labRules.slots * 3));
  return Array.from({ length: labRules.slots }, (_, n) => {
    let roll = pickIndex(random[n * 3], 100);
    const tier = tiers.find(item => (roll -= item.weight) < 0);
    const pool = practiceCards.filter(card => card.tier === tier.name);
    const card = pool[pickIndex(random[n * 3 + 1], pool.length)];
    const foil = random[n * 3 + 2] / 4294967296 < labRules.foil;
    return { id: card.id, finish: foil ? 'foil' : 'normal' };
  });
}

function showPack(pack, revealed = false) {
  const region = $('[data-practice-results]');
  region.hidden = pack.length === 0;
  region.replaceChildren();
  if (!pack.length) return;
  const controls = pack.map((pull, index) => {
    const tile = element('button', '', 'result-tile');
    tile.type = 'button';
    const card = games.get(pull.id);
    let open = revealed;
    function refresh() {
      tile.replaceChildren(
        element('strong', open ? card.name : 'Reveal card ' + (index + 1)),
        element('small', open ? card.tier + ' · ' + (pull.finish === 'foil' ? 'Foil' : 'Normal') +
          (pull.discovery ? ' · ' + pull.discovery : '') : 'Lab Practice'),
      );
    }
    tile.addEventListener('click', () => {
      if (open) openCard(card.id, tile);
      else { open = true; refresh(); if (controls.every(c => c.isOpen())) reveal.hidden = true; }
    });
    refresh();
    region.append(tile);
    return { isOpen: () => open, reveal() { open = true; refresh(); } };
  });
  const reveal = element('button', 'Reveal All', 'button');
  reveal.type = 'button';
  reveal.hidden = revealed;
  reveal.addEventListener('click', () => {
    for (const control of controls) control.reveal();
    reveal.hidden = true;
    region.firstElementChild.focus();
  });
  region.append(reveal);
}

function openCard(id, caller) {
  const card = games.get(id) ?? referenceEntries.find(entry => entry.id === id);
  if (!card) return false;
  const reference = Boolean(card.verificationId);
  const slots = reference ? 5 : labRules.slots;
  const foilRate = reference ? 0.1 : labRules.foil;
  const sheet = openSheet('card-dialog', caller);
  $('#card-dialog-heading').textContent = card.name;
  const body = $('[data-sheet-body]', sheet);
  const count = copies(card.id);
  const pairs = [
    ['Normal score', card.score.toLocaleString('en-US')], ['Foil score', (card.score * (reference ? 3 : 2)).toLocaleString('en-US')],
    reference ? ['Verified by', card.verifier] : ['You own', count.normal + ' normal · ' + count.foil + ' foil'],
    ['Per pack, any', percentages(probabilityInPacks(card.probability, slots, 1))],
    ['In 10 packs, any', percentages(probabilityInPacks(card.probability, slots, 10))],
    ['In 100 packs, any', percentages(probabilityInPacks(card.probability, slots, 100))],
    ['In 10 packs, normal', percentages(probabilityInPacks(card.probability * (1 - foilRate), slots, 10))],
    ['In 10 packs, foil', percentages(probabilityInPacks(card.probability * foilRate, slots, 10))],
  ];
  const stats = element('dl', '', 'detail-stats');
  for (const [term, value] of pairs) {
    const line = element('div');
    line.append(element('dt', term), element('dd', String(value)));
    stats.append(line);
  }
  const art = element('img', '', 'sheet-card-cover');
  art.src = card.cover;
  art.alt = card.name + ' cover illustration';
  art.width = 600;
  art.height = 320;
  const preview = element('a', '', 'card-preview-link');
  preview.href = card.path;
  preview.setAttribute('aria-label', 'Open ' + card.name + ' card page and video');
  const summary = reference ? 'Rank #' + card.rank + ' · ' + card.tier + ' · Original reference v4' : card.theme + ' · ' + card.tier + ' · Lab Practice Pack';
  preview.append(art, element('span', 'Open Card Page & Video', 'button primary'), element('p', summary), stats);
  if (card.tip) preview.append(element('p', card.tip));
  body.replaceChildren(preview);
  sheet.scrollTop = 0;
  return true;
}

for (const link of $$('[data-card-preview]')) link.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (openCard(link.dataset.cardPreview, link)) event.preventDefault();
});

const detailOdds = $('[data-detail-odds]');
if (detailOdds) {
  const reference = referenceEntries.find(card => card.path === detailOdds.dataset.cardPath);
  const card = reference ?? practiceCards.find(item => item.path === detailOdds.dataset.cardPath);
  detailOdds.addEventListener('submit', event => {
    event.preventDefault();
    const { packs, finish } = detailOdds.elements;
    const foil = reference ? 0.10 : labRules.foil;
    const slots = reference ? 5 : labRules.slots;
    const perDraw = card.probability * (finish.value === 'foil' ? foil : finish.value === 'normal' ? 1 - foil : 1);
    const count = packs.valueAsNumber;
    const finishName = finish.options[finish.selectedIndex].text;
    $('[data-odds-output]', detailOdds).textContent = finishName + ' · ' + count.toLocaleString('en-US') +
      (count === 1 ? ' pack: ' : ' packs: ') + percentages(probabilityInPacks(perDraw, slots, count));
  });
}

const cardFeedback = $('[data-card-feedback]');
$('[data-share-card]')?.addEventListener('click', async () => {
  const url = new URL($('link[rel="canonical"]').href).href;
  try {
    await navigator.clipboard.writeText(url);
    cardFeedback.textContent = 'Card link copied.';
  } catch {
    const link = element('input');
    link.readOnly = true;
    link.value = url;
    link.setAttribute('aria-label', 'Card link to copy');
    cardFeedback.replaceChildren(link);
    link.select();
  }
});

function parseBackup(value) {
  if (value?.version !== 1 || !value.cards || typeof value.cards !== 'object' || Array.isArray(value.cards))
    throw new Error('Invalid Lab backup');
  const cards = Object.entries(value.cards);
  if (cards.length > practiceCards.length) throw new Error('Too many records');
  const clean = emptySave();
  if (value.favorites !== undefined) {
    if (!Array.isArray(value.favorites) || value.favorites.length > practiceCards.length || !value.favorites.every(id => games.has(id)))
      throw new Error('Invalid favorites');
    clean.favorites = [...new Set(value.favorites)];
  }
  for (const [id, info] of cards) {
    if (!games.has(id) || !info || !['normal', 'foil'].every(key => Number.isSafeInteger(info[key]) && info[key] >= 0 && info[key] < 1000000000))
      throw new Error('Invalid card record');
    clean.cards[id] = { normal: info.normal, foil: info.foil };
  }
  if (value.latest !== undefined) {
    if (!Array.isArray(value.latest) || ![0, labRules.slots].includes(value.latest.length) ||
      !value.latest.every(item => games.has(item?.id) && ['normal', 'foil'].includes(item.finish)))
      throw new Error('Invalid saved pack');
    clean.latest = value.latest.map(({ id, finish, discovery }) => ({
      id, finish, discovery: ['New card', 'New finish', 'Duplicate'].includes(discovery) ? discovery : undefined,
    }));
  }
  return clean;
}

async function restoreView() {
  try {
    database = await connect();
    save = await fetchSave();
  } catch {
    database = undefined;
    gameStatusSave.textContent = 'Storage is unavailable. Practice cards stay on this page until you leave. Export a backup to keep them.';
  }
  renderCollection();
  showPack(save.latest, true);
  const target = new URLSearchParams(location.search).get('card');
  if (target && games.has(target)) {
    const link = $('[data-id="' + target + '"] .card-actions a');
    openCard(target, link);
  }
  if (target && !games.has(target)) gameStatusSave.textContent = 'That card was not found. Browse the catalog below.';
}

async function toggleFavorite(button, initialized, refresh, feedback) {
  if (button.disabled) return;
  button.disabled = true;
  await initialized;
  saveRevision++;
  const id = button.dataset.favorite;
  try {
    save = await commit(current => ({ ...current, favorites: current.favorites.includes(id) ?
      current.favorites.filter(value => value !== id) : [...current.favorites, id] }));
    refresh();
    if (button.closest('[data-id]')?.hidden) $('[data-filter="ownership"]').focus();
    if (!database) feedback.textContent = 'Favorites are temporary on this page.';
  } catch {
    feedback.textContent = 'Could not update favorites. Try again.';
  } finally {
    button.disabled = false;
  }
}

if (collection) {
  const opener = $('[data-practice]');
  if (new URLSearchParams(location.search).get('view') === 'favorites') $('[data-filter="ownership"]').value = 'favorites';
  opener.disabled = true;
  const initialized = restoreView().finally(() => { opener.disabled = false; });
  opener.addEventListener('click', async () => {
    if (opener.disabled) return;
    opener.disabled = true;
    saveRevision++;
    const pulls = drawPack();
    try {
      save = await commit(current => {
        const cards = { ...current.cards };
        const latest = pulls.map(({ id, finish }) => {
          const record = { normal: 0, foil: 0, ...cards[id] };
          const discovery = record.normal + record.foil === 0 ? 'New card' : record[finish] === 0 ? 'New finish' : 'Duplicate';
          record[finish]++;
          cards[id] = record;
          return { id, finish, discovery };
        });
        return { ...current, cards, latest };
      });
      renderCollection();
      showPack(save.latest);
      gameStatusSave.textContent = database ? 'Pack ready. Pick a card to reveal it.' : 'Pack ready in temporary storage. Export if you want to keep it.';
    } catch {
      gameStatusSave.textContent = 'The pack was not saved. Your previous collection is intact. Try opening again.';
    } finally {
      opener.disabled = false;
    }
  });

  $('[data-search]').addEventListener('input', showFilters);
  for (const filter of $$('[data-filter]')) filter.addEventListener('change', renderCollection);
  $('[data-reset-filters]').addEventListener('click', () => {
    $('[data-search]').value = '';
    for (const field of $$('[data-filter]')) field.value = '';
    renderCollection();
  });
  for (const button of $$('[data-favorite]')) button.addEventListener('click', () =>
    toggleFavorite(button, initialized, renderCollection, gameStatusSave));
  $('[data-backup]').addEventListener('click', async () => {
    await initialized;
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = element('a');
    link.href = url;
    link.download = 'demon-pack-lab-save.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const input = $('[data-import-file]');
  $('[data-import]').addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      if (file.size > 1000000) throw new Error('File too large');
      const next = parseBackup(JSON.parse(await file.text()));
      if (!window.confirm('Replace your Lab collection with the backup (' + Object.keys(next.cards).length + ' card entries and ' + next.favorites.length + ' favorites)?')) return;
      saveRevision++;
      save = await commit(() => next);
      renderCollection();
      showPack(save.latest, true);
      gameStatusSave.textContent = database ? 'Collection restored.' : 'Collection restored for this page only. Download a backup before leaving.';
    } catch {
      gameStatusSave.textContent = 'The backup could not be restored. Your previous collection is intact.';
    } finally {
      input.value = '';
    }
  });
  window.addEventListener('focus', async () => {
    if (!database || opener.disabled) return;
    const revision = saveRevision;
    try {
      const current = await fetchSave();
      if (revision !== saveRevision) return;
      save = current;
      renderCollection();
    } catch {
      gameStatusSave.textContent = 'Could not refresh this browser’s stored collection.';
    }
  });
} else {
  const detail = $('[data-practice-detail]');
  const favorite = detail ? $('[data-favorite]', detail) : null;
  function renderDetailCollection() {
    renderCollectionLink();
    if (!detail) return;
    const id = detail.dataset.practiceDetail;
    const owned = copies(id);
    const saved = save.favorites.includes(id);
    $('[data-detail-owned]', detail).textContent = `You own ${owned.normal} normal · ${owned.foil} foil`;
    favorite.setAttribute('aria-pressed', String(saved));
    $('[data-favorite-label]', favorite).textContent = saved ? 'Saved' : 'Save';
  }
  async function readCollectionLink() {
    try {
      database ??= await connect();
      const revision = saveRevision;
      const current = await fetchSave();
      if (revision !== saveRevision) return;
      save = current;
      renderDetailCollection();
    } catch { /* The collection page remains reachable when storage is blocked. */ }
  }
  const initialized = readCollectionLink();
  favorite?.addEventListener('click', () => toggleFavorite(favorite, initialized, renderDetailCollection, cardFeedback));
  window.addEventListener('focus', readCollectionLink);
}

let installEvent;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installEvent = event;
  analytics('PWA Install Available');
});
window.addEventListener('appinstalled', () => analytics('PWA Installed'));
$('[data-install]').addEventListener('click', event => {
  analytics('PWA Install Click');
  const sheet = openSheet('install-dialog', event.currentTarget);
  const body = $('[data-sheet-body]', sheet);
  const instructions = element('p', 'Use your browser’s Install or Add to Home Screen option. On iPhone or iPad, open the Share menu and choose Add to Home Screen. The Arcade and videos need a connection.');
  const copy = element('button', 'Copy site link', 'button');
  copy.type = 'button';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(domain + '/');
      copy.textContent = 'Link copied';
      analytics('PWA Link Copied');
    } catch {
      const field = element('input');
      field.value = domain + '/';
      field.readOnly = true;
      field.setAttribute('aria-label', 'Site link to copy');
      body.append(field);
      field.select();
    }
  });
  body.replaceChildren(instructions, copy);
  if (installEvent) {
    const install = element('button', 'Install to this device', 'button primary');
    install.type = 'button';
    install.addEventListener('click', async () => {
      const prompt = installEvent;
      installEvent = undefined;
      install.disabled = true;
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        install.textContent = choice.outcome === 'accepted' ? 'Installation accepted' : 'Installation dismissed';
        analytics('PWA Install Result');
      } catch {
        install.textContent = 'Use browser install options';
      }
    });
    body.prepend(install);
  } else analytics('PWA Install Help');
});

if ('serviceWorker' in navigator) window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js').catch(() => analytics('PWA Service Worker Error'));
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    analytics('PWA Page View');
    try {
      if (!sessionStorage.getItem('demon-pack-pwa-session')) {
        sessionStorage.setItem('demon-pack-pwa-session', '1');
        analytics('PWA Session');
      }
    } catch { /* Optional measurement does not change app behavior. */ }
  }
});
