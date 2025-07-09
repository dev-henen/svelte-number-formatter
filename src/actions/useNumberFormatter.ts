import type { Action } from 'svelte/action';
import { NumberFormatter } from '../NumberFormatter';

type FormatOptions = {
	locale?: string;
	useGrouping?: boolean;
	decimals?: number;
	currency?: string;
	style?: 'decimal' | 'currency';
};

type NumberFormatterActionParams = {
	options?: FormatOptions;
	onChange?: (raw: string, formatted: string) => void;
};

export const numberFormatter: Action<HTMLInputElement, NumberFormatterActionParams> = (
	node,
	params
) => {
	// ⚠️ Don't pass options here to prevent premature formatting
	const formatter = new NumberFormatter();

	const updateValue = (val: string) => {
		formatter.handler = val;
		node.value = formatter.formatted;

		if (params?.onChange) {
			params.onChange(formatter.raw, formatter.formatted);
		}
	};

	// Initial formatting (only if needed)
	if (node.value) updateValue(node.value);

	const handleInput = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		updateValue(val);
	};

	// Optional formatting on blur using options
	const handleBlur = () => {
		if (params?.options) {
			formatter.setOptions(params.options);
			node.value = formatter.formatted;
			if (params?.onChange) {
				params.onChange(formatter.raw, formatter.formatted);
			}
		}
	};

	node.addEventListener('input', handleInput);
	node.addEventListener('blur', handleBlur);

	return {
		update(newParams: NumberFormatterActionParams) {
			params = newParams;
			// defer options formatting until blur
		},
		destroy() {
			node.removeEventListener('input', handleInput);
			node.removeEventListener('blur', handleBlur);
		}
	};
};
