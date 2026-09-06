import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { renderWeaponPng, type WeaponCard } from "./weapon-export";

export default function WeaponExport({ card }: { card: WeaponCard }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  const generate = async () => {
    setBusy(true); setError("");
    try {
      const blob = await renderWeaponPng(card);
      setUrl(URL.createObjectURL(blob));
      setName(card.name);
      dialog.current?.showModal();
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Could not export this weapon."); }
    finally { setBusy(false); }
  };
  return <>
    <button type="button" className="wb-export" disabled={busy} onClick={generate}><Download size={17} />{busy ? "Preparing card…" : "Export weapon PNG"}</button>
    {error && <p role="alert">{error}</p>}
    <dialog ref={dialog} className="wb-export-dialog" aria-label="Weapon card preview">
      <div className="wb-export-toolbar"><strong>{name}</strong><a href={url} download={`${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "weapon"}.png`}>Download PNG</a><button type="button" onClick={() => dialog.current?.close()}>Close</button></div>
      <p>Full-resolution parchment card. Includes rules from every unlocked tier, even collapsed sections.</p>
      {url && <img src={url} alt={`Exported magic item card for ${name}`} />}
    </dialog>
  </>;
}
