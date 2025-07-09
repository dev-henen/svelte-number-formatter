import { writable, get } from "svelte/store";
import type { Subscriber, Unsubscriber } from "svelte/store";

type FormatOptions = {
  locale?: string;
  useGrouping?: boolean;
  decimals?: number;
  currency?: string;
  style?: "decimal" | "currency";
};

export class NumberFormatter {
  private _formatted = writable("");
  private _raw = writable("");

  private options: FormatOptions = {
    locale:
      typeof window !== "undefined" && typeof navigator !== "undefined"
        ? navigator.languages?.[0] || navigator.language
        : "en-US",
    useGrouping: true,
    decimals: 0,
    style: "decimal",
  };

  constructor(initial?: string, opts?: FormatOptions) {
    if (initial) this.handler = initial;
    if (opts) this.setOptions(opts);
  }

  get handler() {
    return get(this._formatted);
  }

  set handler(newVal: string) {
    const raw = newVal.replace(/[^\d.-]/g, "");
    this._raw.set(raw);

    const formatted = this.formatNumber(raw);
    this._formatted.set(formatted);
  }

  get raw() {
    return get(this._raw);
  }

  get formatted() {
    return get(this._formatted);
  }

  private formatNumber(value: string): string {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return "";

    const { locale, useGrouping, decimals, currency, style } = this.options;

    const formatOpts: Intl.NumberFormatOptions = {
      useGrouping,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      style: style || "decimal",
    };

    if (style === "currency" && currency) {
      formatOpts.currency = currency;
    }

    return new Intl.NumberFormat(locale, formatOpts).format(num);
  }

  setOptions(newOpts: Partial<FormatOptions>) {
    this.options = { ...this.options, ...newOpts };

    // Reapply formatting
    const raw = get(this._raw);
    const formatted = this.formatNumber(raw);
    this._formatted.set(formatted);
  }

  reset() {
    this._raw.set("");
    this._formatted.set("");
  }

  format(value: string | number): string {
    const str =
      typeof value === "string"
        ? value.replace(/[^\d.-]/g, "")
        : value.toString();
    return this.formatNumber(str);
  }
  subscribe(run: Subscriber<{ raw: string; formatted: string }>): Unsubscriber {
    const unsubscribeRaw = this._raw.subscribe((raw) => {
      run({ raw, formatted: get(this._formatted) });
    });

    const unsubscribeFormatted = this._formatted.subscribe((formatted) => {
      run({ raw: get(this._raw), formatted });
    });

    // Return an unsubscribe function
    return () => {
      unsubscribeRaw();
      unsubscribeFormatted();
    };
  }
}
