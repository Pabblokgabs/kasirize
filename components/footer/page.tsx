"use client";

import { DEMO_DATA_STORAGE_KEY, ROLE_STORAGE_KEY } from "@/constants/roles";
import { MapPin } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Footer() {
  const handleResetDemoData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(DEMO_DATA_STORAGE_KEY);
      toast.success("Local demo data deleted successfully.");
    }
  };
  return (
    <footer
      id="contact"
      className="bg-[#0f172a] text-[#94a3b8] py-14 text-xs border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-brand-deep flex items-center justify-center text-white font-bold text-xs">
                K
              </div>
              <span className="font-heading font-bold text-sm text-white">
                Kasirize
              </span>
            </div>
            <p className="text-white/80 max-w-xs leading-relaxed mb-4">
              Open the door to what you can do.
            </p>
            <div className="inline-flex items-center gap-1.5 text-white/60">
              <MapPin className="size-3.5 text-primary" />
              <span>South Africa</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 md:justify-around text-sm">
            <div className="space-y-2.5">
              <div>
                <Link
                  href="#about"
                  className="hover:text-white transition-colors"
                >
                  About Kasirize
                </Link>
              </div>
              <div>
                <Link
                  href="#why-choose-us"
                  className="hover:text-white transition-colors"
                >
                  Why Youth Choose Us
                </Link>
              </div>
              <div>
                <Link
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </div>
              <div>
                <Link
                  href="#trust"
                  className="hover:text-white transition-colors"
                >
                  Trust & Privacy
                </Link>
              </div>
            </div>

            <div className="space-y-2.5 sm:pl-6">
              <div>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link
                  href="/demo"
                  className="hover:text-white transition-colors"
                >
                  Demo Mode
                </Link>
              </div>
              <div>
                <button
                  onClick={handleResetDemoData}
                  className="text-red-400 hover:text-red-300 transition-colors text-left cursor-pointer"
                >
                  Delete local demo data
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/60 space-y-2">
            <div className="font-semibold text-white">
              Local Demo Mode Active
            </div>
            <p>
              Profiles and task applications run locally in your browser so you
              can test all 5 roles safely.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[11px]">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3 text-primary" />
            <span>South Africa</span>
          </div>
          <div>© 2026 Kasirize. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
