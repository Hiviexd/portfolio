// Synthesized sound cues for 2048 (Web Audio, no asset files)

import { type TileValue } from "./types";

const MUTED_KEY = "game-2048-muted";
// Matches --game-2048-slide-duration so the sound lands with the merge pop
const SLIDE_DELAY = 0.1;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined" || !("AudioContext" in window)) return null;
    audioContext ??= new AudioContext();
    // Browsers start the context suspended until a user gesture; moves always come from one
    if (audioContext.state === "suspended") void audioContext.resume();
    return audioContext;
}

function playPop(ctx: AudioContext, frequency: number, startAt: number, volume: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency * 0.5, startAt);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, startAt + 0.025);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume * 1.5, startAt + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.07);

    osc.connect(gain).connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.08);
}

const COMBO_GAP = 0.05;
const MAX_COMBO_POPS = 4;

// 4 -> step 0, 8 -> step 1, ... each step is a whole tone up from A4
function frequencyFor(value: TileValue): number {
    const step = Math.log2(value) - 2;
    return 440 * Math.pow(2, (step * 2) / 12);
}

export function playMergeFeedback(mergedValues: TileValue[], isMilestone: boolean): void {
    if (mergedValues.length === 0 || isMuted()) return;

    // Not supported on iOS Safari
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        const pattern = mergedValues.slice(0, MAX_COMBO_POPS).flatMap(() => [10, COMBO_GAP * 1000 - 10]);
        setTimeout(() => navigator.vibrate(pattern), SLIDE_DELAY * 1000);
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    const pops = [...mergedValues].sort((a, b) => a - b).slice(-MAX_COMBO_POPS);
    const startAt = ctx.currentTime + SLIDE_DELAY;
    pops.forEach((value, i) => playPop(ctx, frequencyFor(value), startAt + i * COMBO_GAP, 0.08));

    // Milestone: extra note a fifth up
    if (isMilestone) {
        const top = pops[pops.length - 1];
        playPop(ctx, frequencyFor(top) * 1.5, startAt + pops.length * COMBO_GAP + 0.02, 0.06);
    }
}

// Jingles start with the overlay fade-in (.game-2048-overlay-delayed's 0.3s delay)
const OVERLAY_DELAY = 0.3;

const C4 = 261.63;
const EB4 = 311.13;
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;

function playNote(ctx: AudioContext, frequency: number, startAt: number, duration: number, volume: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, startAt);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    osc.connect(gain).connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
}

function playJingle(notes: Array<{ frequency: number; at: number; duration: number }>): void {
    if (isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const startAt = ctx.currentTime + OVERLAY_DELAY;
    for (const note of notes) {
        playNote(ctx, note.frequency, startAt + note.at, note.duration, 0.08);
    }
}

export function playWinJingle(): void {
    playJingle([
        { frequency: C5, at: 0, duration: 0.15 },
        { frequency: E5, at: 0.11, duration: 0.15 },
        { frequency: G5, at: 0.22, duration: 0.15 },
        { frequency: C6, at: 0.33, duration: 0.5 },
    ]);
}

export function playLoseJingle(): void {
    playJingle([
        { frequency: EB4, at: 0, duration: 0.3 },
        { frequency: C4, at: 0.28, duration: 0.6 },
    ]);
}

export function isMuted(): boolean {
    try {
        return localStorage.getItem(MUTED_KEY) === "true";
    } catch {
        return false;
    }
}

export function setMuted(muted: boolean): void {
    try {
        localStorage.setItem(MUTED_KEY, String(muted));
    } catch {
        // Ignore errors
    }
}
