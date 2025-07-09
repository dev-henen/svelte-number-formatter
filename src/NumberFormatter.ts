import { writable, get, derived } from "svelte/store";
import type { Subscriber, Unsubscriber, Readable } from "svelte/store";

type FormatOptions = {
  locale?: string;
  useGrouping?: boolean;
  decimals?: number;
  currency?: string;
  style?: "decimal" | "currency" | "percent";
  allowNegative?: boolean;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  strict?: boolean; // If true, invalid input will be rejected
};

type ValidationResult = {
  isValid: boolean;
  error?: string;
  warning?: string;
};

export class NumberFormatter {
  private _formatted = writable("");
  private _raw = writable("");
  private _validation = writable<ValidationResult>({ isValid: true });
  private _isEditing = writable(false);

  private options: Required<FormatOptions> = {
    locale: this.getDefaultLocale(),
    useGrouping: true,
    decimals: 0,
    currency: "USD",
    style: "decimal",
    allowNegative: true,
    allowDecimal: true,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    prefix: "",
    suffix: "",
    placeholder: "",
    strict: false,
  };

  // Derived stores for convenience
  public readonly validation: Readable<ValidationResult>;
  public readonly isEditing: Readable<boolean>;
  public readonly numericValue: Readable<number>;

  constructor(initial?: string | number, opts?: FormatOptions) {
    this.validation = this._validation;
    this.isEditing = this._isEditing;
    this.numericValue = derived(this._raw, ($raw) => {
      const num = parseFloat($raw);
      return isNaN(num) ? 0 : num;
    });

    if (opts) this.setOptions(opts);
    if (initial !== undefined) this.handler = initial.toString();
  }

  private getDefaultLocale(): string {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      return navigator.languages?.[0] || navigator.language || "en-US";
    }
    return "en-US";
  }

  get handler(): string {
    return get(this._formatted);
  }

  set handler(newVal: string) {
    this._isEditing.set(true);
    
    const cleaned = this.cleanInput(newVal);
    const validation = this.validateInput(cleaned);
    
    this._validation.set(validation);
    
    if (validation.isValid || !this.options.strict) {
      this._raw.set(cleaned);
      const formatted = this.formatNumber(cleaned);
      this._formatted.set(formatted);
    }
    
    setTimeout(() => this._isEditing.set(false), 100);
  }

  get raw(): string {
    return get(this._raw);
  }

  get formatted(): string {
    return get(this._formatted);
  }

  get value(): number {
    return get(this.numericValue);
  }

  private cleanInput(input: string): string {
    if (!input) return "";
    
    // Remove prefix/suffix if present
    let cleaned = input;
    if (this.options.prefix) {
      cleaned = cleaned.replace(new RegExp(`^${this.escapeRegex(this.options.prefix)}`), "");
    }
    if (this.options.suffix) {
      cleaned = cleaned.replace(new RegExp(`${this.escapeRegex(this.options.suffix)}$`), "");
    }
    
    // Allow only digits, decimal point, and minus sign
    let allowedChars = "\\d";
    if (this.options.allowDecimal) allowedChars += ".";
    if (this.options.allowNegative) allowedChars += "-";
    
    const regex = new RegExp(`[^${allowedChars}]`, "g");
    cleaned = cleaned.replace(regex, "");
    
    // Ensure minus sign is only at the beginning
    if (this.options.allowNegative) {
      const minusCount = (cleaned.match(/-/g) || []).length;
      if (minusCount > 1) {
        cleaned = cleaned.replace(/-/g, "");
        if (input.startsWith("-")) cleaned = "-" + cleaned;
      } else if (cleaned.includes("-") && !cleaned.startsWith("-")) {
        cleaned = cleaned.replace("-", "");
      }
    }
    
    // Handle multiple decimal points
    if (this.options.allowDecimal) {
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }
    }
    
    return cleaned;
  }

  private validateInput(value: string): ValidationResult {
    if (!value) return { isValid: true };
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return { isValid: false, error: "Invalid number format" };
    }
    
    if (num < this.options.min) {
      return { 
        isValid: false, 
        error: `Value must be at least ${this.options.min}` 
      };
    }
    
    if (num > this.options.max) {
      return { 
        isValid: false, 
        error: `Value must be at most ${this.options.max}` 
      };
    }
    
    // Check decimal places
    if (this.options.decimals === 0 && value.includes(".")) {
      const decimalPart = value.split(".")[1];
      if (decimalPart && decimalPart.length > 0) {
        return { 
          isValid: true, 
          warning: "Decimal places will be rounded" 
        };
      }
    }
    
    return { isValid: true };
  }

  private formatNumber(value: string): string {
    if (!value) return this.options.placeholder;
    
    const num = parseFloat(value);
    if (isNaN(num)) return this.options.placeholder;

    const { locale, useGrouping, decimals, currency, style } = this.options;

    const formatOpts: Intl.NumberFormatOptions = {
      useGrouping,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      style: style === "percent" ? "percent" : style,
    };

    if (style === "currency") {
      formatOpts.currency = currency;
    }

    try {
      let formatted = new Intl.NumberFormat(locale, formatOpts).format(
        style === "percent" ? num / 100 : num
      );
      
      // Add custom prefix/suffix
      if (this.options.prefix) formatted = this.options.prefix + formatted;
      if (this.options.suffix) formatted = formatted + this.options.suffix;
      
      return formatted;
    } catch (error) {
      console.warn("NumberFormatter: Formatting error", error);
      return value;
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  setOptions(newOpts: Partial<FormatOptions>): void {
    this.options = { ...this.options, ...newOpts };

    // Revalidate and reformat current value
    const raw = get(this._raw);
    const validation = this.validateInput(raw);
    this._validation.set(validation);
    
    if (validation.isValid || !this.options.strict) {
      const formatted = this.formatNumber(raw);
      this._formatted.set(formatted);
    }
  }

  reset(): void {
    this._raw.set("");
    this._formatted.set("");
    this._validation.set({ isValid: true });
    this._isEditing.set(false);
  }

  setValue(value: string | number): void {
    const str = typeof value === "string" ? value : value.toString();
    this.handler = str;
  }

  format(value: string | number): string {
    const str = typeof value === "string" 
      ? this.cleanInput(value)
      : value.toString();
    return this.formatNumber(str);
  }

  // Enhanced subscription that includes validation state
  subscribe(run: Subscriber<{
    raw: string;
    formatted: string;
    value: number;
    validation: ValidationResult;
    isEditing: boolean;
  }>): Unsubscriber {
    const unsubscribers: Unsubscriber[] = [];

    const notify = () => {
      run({
        raw: get(this._raw),
        formatted: get(this._formatted),
        value: get(this.numericValue),
        validation: get(this._validation),
        isEditing: get(this._isEditing),
      });
    };

    unsubscribers.push(this._raw.subscribe(notify));
    unsubscribers.push(this._formatted.subscribe(notify));
    unsubscribers.push(this._validation.subscribe(notify));
    unsubscribers.push(this._isEditing.subscribe(notify));

    // Initial notification
    notify();

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  // Convenience method for simple formatted value subscription
  subscribeFormatted(run: Subscriber<string>): Unsubscriber {
    return this._formatted.subscribe(run);
  }

  // Convenience method for raw value subscription
  subscribeRaw(run: Subscriber<string>): Unsubscriber {
    return this._raw.subscribe(run);
  }

  // Convenience method for numeric value subscription
  subscribeValue(run: Subscriber<number>): Unsubscriber {
    return this.numericValue.subscribe(run);
  }

  // Method to increment/decrement value
  increment(step: number = 1): void {
    const current = get(this.numericValue);
    const newValue = current + step;
    this.setValue(newValue);
  }

  decrement(step: number = 1): void {
    this.increment(-step);
  }

  // Method to check if current value is valid
  isValid(): boolean {
    return get(this._validation).isValid;
  }

  // Method to get current validation state
  getValidation(): ValidationResult {
    return get(this._validation);
  }

  // Method to focus/blur simulation for form integration
  focus(): void {
    this._isEditing.set(true);
  }

  blur(): void {
    this._isEditing.set(false);
  }

  // Static utility methods
  static formatValue(
    value: string | number,
    options: FormatOptions = {}
  ): string {
    const formatter = new NumberFormatter(value, options);
    return formatter.formatted;
  }

  static parseValue(formattedValue: string): number {
    const cleaned = formattedValue.replace(/[^\d.-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
}
