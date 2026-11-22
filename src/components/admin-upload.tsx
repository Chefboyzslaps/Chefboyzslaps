"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { FileAudio2, LockKeyhole, LogOut, UploadCloud, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { adminUids, firebaseAuth, firebaseConfigured, firebaseDb, firebaseStorage } from "@/lib/firebase";

const MAX_SIZE = 200 * 1024 * 1024;
const audioTypes: Record<string, string> = { mp3: "audio/mpeg", wav: "audio/wav", aiff: "audio/aiff", aif: "audio/aiff", m4a: "audio/mp4", aac: "audio/aac", flac: "audio/flac", ogg: "audio/ogg" };
type UploadItem = { file: File; title: string; status: string };

export function AdminUpload() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const isAdmin = Boolean(user && adminUids.includes(user.uid));

  useEffect(() => { document.body.dataset.adminPage = "true"; return () => { delete document.body.dataset.adminPage; }; }, []);

  function addFiles(files: FileList | File[]) {
    const next = Array.from(files);
    const errors = next.filter((f) => !(f.type.startsWith("audio/") || /\.(mp3|wav|aiff?|m4a|aac|flac|ogg)$/i.test(f.name)) || f.size > MAX_SIZE);
    if (errors.length) setNotice(`${errors.length} file${errors.length === 1 ? " was" : "s were"} skipped. Choose audio files under 200 MB each.`);
    setItems((current) => [...current, ...next.filter((f) => (f.type.startsWith("audio/") || /\.(mp3|wav|aiff?|m4a|aac|flac|ogg)$/i.test(f.name)) && f.size <= MAX_SIZE).map((file) => ({ file, title: file.name.replace(/\.[^.]+$/, ""), status: "Ready" }))]);
  }

  function updateTitle(index: number, title: string) { setItems((current) => current.map((item, i) => i === index ? { ...item, title } : item)); }
  function remove(index: number) { setItems((current) => current.filter((_, i) => i !== index)); }

  async function upload() {
    if (!user || !firebaseDb || !firebaseStorage) return;
    setBusy(true); setNotice("");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.status.includes("Uploaded")) continue;
      setItems((current) => current.map((row, n) => n === i ? { ...row, status: "Uploading…" } : row));
      let uploadedPath: string | null = null;
      try {
        const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
        const path = `songs/${user.uid}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        uploadedPath = path;
        const fileRef = ref(firebaseStorage, path);
        const extension = item.file.name.split(".").pop()?.toLowerCase() ?? "";
        const contentType = item.file.type.startsWith("audio/") ? item.file.type : audioTypes[extension] ?? "audio/mpeg";
        await uploadBytes(fileRef, item.file, { contentType });
        await addDoc(collection(firebaseDb, "songs"), { title: (item.title.trim() || item.file.name).slice(0, 160), originalName: item.file.name.slice(0, 220), storagePath: path, size: item.file.size, contentType, uploadedBy: user.uid, createdAt: serverTimestamp(), published: false });
        setItems((current) => current.map((row, n) => n === i ? { ...row, status: "Uploaded · draft" } : row));
      } catch (err) {
        if (uploadedPath && firebaseStorage) {
          try { await deleteObject(ref(firebaseStorage, uploadedPath)); } catch { /* The upload may have failed before creating an object. */ }
        }
        setItems((current) => current.map((row, n) => n === i ? { ...row, status: "Upload failed" } : row));
        setNotice(`Could not upload “${item.title}”: ${(err as Error).message}`);
      }
    }
    setBusy(false);
  }

  if (loading) return <div className="page-wrap inner-page admin-page"><p className="auth-note">Checking access…</p></div>;
  if (!firebaseConfigured) return <div className="page-wrap inner-page admin-page"><LockKeyhole className="admin-icon" /><span className="eyebrow">PRIVATE WORKSPACE · NOT CONFIGURED</span><h1>Admin access<br /><em>isn’t ready.</em></h1><p>Connect the Firebase web app and set the admin UID in your environment to enable this private page.</p><Link className="text-link" href="/sign-in">Go to sign in ↗</Link></div>;
  if (!user) return <div className="page-wrap inner-page admin-page"><LockKeyhole className="admin-icon" /><span className="eyebrow">PRIVATE WORKSPACE</span><h1>Admin access<br /><em>is required.</em></h1><p>Sign in with your Firebase account to continue.</p><Link className="button button-primary" href="/sign-in?next=%2Fadmin">Sign in to continue ↗</Link></div>;
  if (!isAdmin) return <div className="page-wrap inner-page admin-page"><LockKeyhole className="admin-icon" /><span className="eyebrow">ACCESS DENIED</span><h1>This page is<br /><em>for the admin.</em></h1><p>This Firebase account is not on the admin allowlist.</p><button className="text-link" onClick={() => firebaseAuth && signOut(firebaseAuth)}>Sign out ↗</button></div>;

  return <div className="page-wrap inner-page upload-page">
    <div className="upload-heading"><div><span className="eyebrow">PRIVATE WORKSPACE · ADMIN</span><h1>Drop the<br /><em>next record.</em></h1><p>Upload audio straight to your private Firebase library. New uploads start as drafts.</p></div><button className="text-link" onClick={() => firebaseAuth && signOut(firebaseAuth)}><LogOut size={15} /> Sign out</button></div>
    <div className={`drop-zone ${dragging ? "is-dragging" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}>
      <UploadCloud size={28} /><b>Drop audio files here</b><span>MP3, WAV, AIFF, M4A, FLAC or OGG · up to 200 MB each</span>
      <button className="button button-outline" onClick={() => input.current?.click()}>Choose files</button><input ref={input} type="file" accept="audio/*,.aiff,.aif" multiple hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
    </div>
    {notice && <p className="form-feedback" role="status">{notice}</p>}
    {items.length > 0 && <section className="upload-list"><div className="upload-list-heading"><h2>Ready to upload <small>{items.length.toString().padStart(2, "0")}</small></h2><button className="text-link" disabled={busy} onClick={() => setItems([])}>Clear list</button></div>
      {items.map((item, index) => <div className="upload-file" key={`${item.file.name}-${item.file.lastModified}-${index}`}><FileAudio2 size={19} /><label><span>Song title</span><input maxLength={160} value={item.title} disabled={busy || item.status.includes("Uploaded")} onChange={(e) => updateTitle(index, e.target.value)} /></label><small>{(item.file.size / (1024 * 1024)).toFixed(1)} MB · {item.status}</small><button aria-label={`Remove ${item.file.name}`} disabled={busy} onClick={() => remove(index)}><X size={17} /></button></div>)}
      <button className="button button-primary" disabled={busy || items.every((item) => item.status.includes("Uploaded"))} onClick={upload}>{busy ? "Uploading…" : "Upload songs"} <UploadCloud size={16} /></button>
    </section>}
  </div>;
}
