import type { PrintSettings, PrintTemplate } from "../../types/print";

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  template: "worksheet",
  font_size: "medium",
  spacing: "normal",
  columns: 1,
  show_answers: false,
  header: { name: true, date: true, period: false },
  paper: "letter",
};

// A template is a preset: it overrides a few fields and leaves the rest alone
const TEMPLATE_OVERRIDES: Record<PrintTemplate, Partial<PrintSettings>> = {
  worksheet: {
    show_answers: false,
    header: { name: true, date: true, period: false },
  },
  answer_key: {
    show_answers: true,
    header: { name: false, date: false, period: false },
  },
};

export function applyTemplate(
  template: PrintTemplate,
  current: PrintSettings = DEFAULT_PRINT_SETTINGS): PrintSettings {
  return { ...current, template, ...TEMPLATE_OVERRIDES[template] };
}

// Settings travel in the URL as base64url JSON, do Phase 4's PLaywright call can hand the exact same settings to this page.
export function decodePrintSettings(raw: string | null): PrintSettings {
  if (!raw) return DEFAULT_PRINT_SETTINGS;
  try {
    const json = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as Partial<PrintSettings>;
    return {
      ...DEFAULT_PRINT_SETTINGS,
      ...parsed,
      header: { ...DEFAULT_PRINT_SETTINGS.header, ...parsed.header },
    };
  } catch {
    return DEFAULT_PRINT_SETTINGS;    //bad param, fall back, never crash the page
  }
}

export function encodePrintSettings(settings: PrintSettings): string {
  return btoa(JSON.stringify(settings)).replace(/\+/g, "-").replace(/\//g, "_");
}