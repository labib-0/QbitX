"use client";

import { X, MessageSquare, ExternalLink, Phone, UserCheck, ShieldCheck, Mail } from "lucide-react";
import Image from "next/image";

interface HelpDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDeskModal({ isOpen, onClose }: HelpDeskModalProps) {
  if (!isOpen) return null;

  const mentors = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead Senior Mentor — Full-Stack AI & Web",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      whatsapp: "https://wa.me/15550192834",
      facebook: "https://facebook.com/sarah.chen.qbitx",
      email: "sarah.chen@qbitx.com",
      availableTimes: "Mon - Fri: 4:00 PM - 8:00 PM",
    },
    {
      name: "Prof. Alex Rivera",
      role: "Senior Mentor — DSA & Systems Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      whatsapp: "https://wa.me/15550192835",
      facebook: "https://facebook.com/alex.rivera.qbitx",
      email: "alex.rivera@qbitx.com",
      availableTimes: "Tue - Sat: 2:00 PM - 6:00 PM",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-extrabold text-foreground font-heading flex items-center gap-2">
              <Phone className="h-5 w-5 text-sky-500" />
              <span>QbitX Help Desk & Direct Mentor Support</span>
            </h2>
            <p className="text-xs text-muted-foreground">Directly connect with senior mentors via WhatsApp, Facebook, or Mentor Inbox.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mentor Contact Cards */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {mentors.map((m, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 ring-2 ring-sky-500">
                    <Image src={m.avatar} alt={m.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5 font-heading">
                      <span>{m.name}</span>
                      <ShieldCheck className="h-4 w-4 text-sky-500" />
                    </h3>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{m.role}</p>
                    <span className="text-[10px] text-muted-foreground block">{m.availableTimes}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Opening mentor inbox for ${m.name}`)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 text-white px-3.5 py-2 text-xs font-bold hover:bg-sky-600 transition-colors shadow-sm shrink-0"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Mentor Inbox</span>
                </button>
              </div>

              {/* Direct Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                <a
                  href={m.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Direct WhatsApp
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a
                  href={m.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" /> Facebook ID Profile
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-muted-foreground pt-1">
          Need urgent live debugging? Join today&apos;s active <strong>Support Session</strong> on the right sidebar.
        </p>

      </div>
    </div>
  );
}
