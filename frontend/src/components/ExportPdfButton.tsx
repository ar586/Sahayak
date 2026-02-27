"use client";

import { Download } from "lucide-react";

export default function ExportPdfButton() {
    return (
        <button
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 px-5 py-2.5 bg-academic-gold/10 text-academic-gold border border-academic-gold/30 hover:bg-academic-gold/20 rounded shadow-sm text-xs font-bold uppercase tracking-widest transition-colors font-sans"
        >
            <Download size={16} />
            Export as PDF
        </button>
    );
}
