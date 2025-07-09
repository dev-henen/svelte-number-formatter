type FormatOptions = {
  locale?: string;
  useGrouping?: boolean;
  decimals?: number;
  currency?: string;
  style?: 'decimal' | 'currency';
};

export function formatNumber(
  value: string | number,
  options: FormatOptions = {}
): string {
  const raw =
    typeof value === 'string'
      ? value.replace(/[^\d.-]/g, '')
      : value.toString();

  const num = parseFloat(raw);
  if (isNaN(num)) return '';

  const {
    locale = typeof window !== 'undefined' && typeof navigator !== 'undefined'
      ? navigator.languages?.[0] || navigator.language
      : 'en-US',
    useGrouping = true,
    decimals = 0,
    style = 'decimal',
    currency,
  } = options;

  const formatOpts: Intl.NumberFormatOptions = {
    useGrouping,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    style,
  };

  if (style === 'currency' && currency) {
    formatOpts.currency = currency;
  }

  return new Intl.NumberFormat(locale, formatOpts).format(num);
}

export function parseNumber(input: string): string {
  return input.replace(/[^\d.-]/g, '');
}

