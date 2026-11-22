"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Beat, CartItem, LicenseId } from "@/types/store";

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (beatId: string, licenseId: LicenseId) => void;
  removeFromCart: (beatId: string, licenseId: LicenseId) => void;
  clearCart: () => void;
  activeBeat: Beat | null;
  isPlaying: boolean;
  playBeat: (beat: Beat) => void;
  togglePlayback: (beat: Beat) => void;
  pause: () => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeBeat, setActiveBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setCart(JSON.parse(localStorage.getItem("chefboyz-cart") ?? "[]") as CartItem[]); } catch { setCart([]); }
      setCartHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!cartHydrated) return;
    try { localStorage.setItem("chefboyz-cart", JSON.stringify(cart)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [cart, cartHydrated]);

  const pause = useCallback(() => { audioRef.current?.pause(); setIsPlaying(false); }, []);
  const playBeat = useCallback((beat: Beat) => {
    if (!beat.previewAudio) {
      audioRef.current?.pause();
      setActiveBeat(beat);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.pause();
    if (audio.src !== new URL(beat.previewAudio, window.location.href).href) audio.src = beat.previewAudio;
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.ondurationchange = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.onended = () => setIsPlaying(false);
    setActiveBeat(beat);
    setCurrentTime(audio.currentTime);
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, []);
  const togglePlayback = useCallback((beat: Beat) => {
    if (activeBeat?.id === beat.id && isPlaying) pause(); else playBeat(beat);
  }, [activeBeat, isPlaying, pause, playBeat]);
  const addToCart = useCallback((beatId: string, licenseId: LicenseId) => {
    setCart((items) => items.some((item) => item.beatId === beatId && item.licenseId === licenseId) ? items : [...items, { beatId, licenseId }]);
    setCartOpen(true);
  }, []);
  const removeFromCart = useCallback((beatId: string, licenseId: LicenseId) => setCart((items) => items.filter((item) => item.beatId !== beatId || item.licenseId !== licenseId)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const seek = useCallback((time: number) => { if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); } }, []);
  const value = useMemo(() => ({ cart, cartCount: cart.length, cartOpen, setCartOpen, addToCart, removeFromCart, clearCart, activeBeat, isPlaying, playBeat, togglePlayback, pause, currentTime, duration, seek }), [cart, cartOpen, addToCart, removeFromCart, clearCart, activeBeat, isPlaying, playBeat, togglePlayback, pause, currentTime, duration, seek]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
