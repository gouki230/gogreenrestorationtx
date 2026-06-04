import { readFileSync, writeFileSync, existsSync } from 'fs';
import { PATHS } from './config.mjs';

const DEFAULT_STATE = {
  version: 1,
  lastRun: null,
  currentWeek: 0,
  currentServiceIndex: 0,
  generated: {},
};

export function loadState() {
  if (!existsSync(PATHS.generationState)) return { ...DEFAULT_STATE };
  return JSON.parse(readFileSync(PATHS.generationState, 'utf-8'));
}

export function saveState(state) {
  state.lastRun = new Date().toISOString();
  writeFileSync(PATHS.generationState, JSON.stringify(state, null, 2));
}

export function makeKey(citySlug, serviceSlug, angleIndex) {
  return `${citySlug}-${serviceSlug}-${angleIndex}`;
}

export function isGenerated(state, citySlug, serviceSlug, angleIndex) {
  return !!state.generated[makeKey(citySlug, serviceSlug, angleIndex)];
}

export function markGenerated(state, citySlug, serviceSlug, angleIndex, articleSlug) {
  state.generated[makeKey(citySlug, serviceSlug, angleIndex)] = {
    slug: articleSlug,
    date: new Date().toISOString().split('T')[0],
  };
}

export function getUsedAngles(state, citySlug, serviceSlug) {
  const used = [];
  for (let i = 0; i < 10; i++) {
    if (isGenerated(state, citySlug, serviceSlug, i)) {
      used.push(i);
    }
  }
  return used;
}

export function getAvailableAngles(state, citySlug, serviceSlug) {
  const used = getUsedAngles(state, citySlug, serviceSlug);
  const available = [];
  for (let i = 0; i < 10; i++) {
    if (!used.includes(i)) available.push(i);
  }
  return available;
}

export function pickRandomAngles(state, citySlug, serviceSlug, count) {
  const available = getAvailableAngles(state, citySlug, serviceSlug);
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
