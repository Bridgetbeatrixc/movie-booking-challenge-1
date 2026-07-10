import { asset } from "../../utils/assets.js";

export function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="border-t border-slate-800 py-7 text-center text-xs text-slate-500">
        Copyright 2026 Beatrix Movie - React booking demo
      </footer>
    );
  }

  return (
    <footer id="footer" className="border-t border-slate-800 bg-[#010816] px-6 py-10 text-center">
      <img src={asset("beatrix-logo.png")} alt="Beatrix Movie" className="mx-auto h-9" />
      <p className="mt-5 text-sm text-slate-400">About / FAQ / Contact</p>
      <p className="mt-4 text-xs text-slate-500">Copyright 2026 Beatrix Movie. All rights reserved.</p>
    </footer>
  );
}
