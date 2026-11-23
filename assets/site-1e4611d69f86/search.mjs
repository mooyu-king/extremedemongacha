function normalize(value) {
  return value.normalize('NFKD').toLowerCase().replace(/\p{Mark}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function editDistance(left, right) {
  const grid = Array.from({ length: left.length + 1 }, (_, row) => [row]);
  grid[0] = Array.from({ length: right.length + 1 }, (_, column) => column);
  for (let row = 1; row <= left.length; row++) {
    for (let column = 1; column <= right.length; column++) {
      const replace = left[row - 1] === right[column - 1] ? 0 : 1;
      grid[row][column] = Math.min(grid[row - 1][column] + 1, grid[row][column - 1] + 1, grid[row - 1][column - 1] + replace);
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) {
        grid[row][column] = Math.min(grid[row][column], grid[row - 2][column - 2] + 1);
      }
    }
  }
  return grid[left.length][right.length];
}

export function matchCards(cards, input) {
  const query = normalize(input.slice(0, 80));
  if (!query) return cards;
  if (/^\d+$/.test(query)) return cards.filter(card => card.rank === Number(query));
  const compactQuery = query.replaceAll(' ', '');
  const queryWords = query.split(' ');
  const scored = cards.map(card => {
    const name = normalize(card.name);
    const compactName = name.replaceAll(' ', '');
    if (compactName === compactQuery) return [card, 0];
    if (compactName.startsWith(compactQuery)) return [card, 1];
    if (queryWords.every(word => name.includes(word)) || compactName.includes(compactQuery)) return [card, 2];
    if (compactQuery.length < 3) return [card, Infinity];
    const words = name.split(' ');
    const candidates = queryWords.length === 1 ? [compactName, ...words] : [compactName];
    const threshold = compactQuery.length >= 7 ? 2 : 1;
    const distance = Math.min(...candidates.map(candidate =>
      Math.abs(candidate.length - compactQuery.length) <= threshold ? editDistance(compactQuery, candidate) : Infinity));
    return [card, distance <= threshold ? 3 + distance : Infinity];
  });
  return scored.filter(([, score]) => Number.isFinite(score)).sort(([, a], [, b]) => a - b).map(([card]) => card);
}
