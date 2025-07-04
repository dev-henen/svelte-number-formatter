# 🔢 svelte-number-formatter

A lightweight, reactive number formatter utility for **Svelte + TypeScript**.

Supports:

* Live number formatting for inputs (`12,345.67`, `$1,000.00`, etc.)
* Extraction of clean raw values (`12345.67`)
* Currency, locale, and decimal formatting
* Seamless integration with Svelte reactivity

---

## 📦 Installation

```bash
npm install svelte-number-formatter
```

📁 GitHub Repository: [github.com/dev-henen/svelte-number-formatter](https://github.com/dev-henen/svelte-number-formatter)

---

## 🚀 Getting Started

```ts
import { NumberFormatter } from 'svelte-number-formatter';

const formatter = new NumberFormatter();
```

---

## ✨ Basic Usage in a Svelte Component

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';

	const formatter = new NumberFormatter('', {
		style: 'decimal',
		decimals: 2
	});
</script>

<input bind:value={formatter.handler} />

<p>Raw: {formatter.raw}</p>
<p>Formatted: {formatter.formatted}</p>
```

or

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';

	const formatter = new NumberFormatter('', {
		style: 'decimal',
		decimals: 2
	});

	let value = formatter.formatted;

	// Sync user input into formatter
	$: formatter.handler = value;
</script>

<input bind:value={value} />

<p>Raw: {formatter.raw}</p>
<p>Formatted: {formatter.formatted}</p>
```

---

## 🔧 API

### `constructor(initial?: string, options?: FormatOptions)`

Create a new formatter with optional initial value and format options.

### Properties

| Property    | Type     | Description                                        |
| ----------- | -------- | -------------------------------------------------- |
| `handler`   | `string` | Input setter that auto-updates `raw` + `formatted` |
| `raw`       | `string` | The numeric value stripped of symbols              |
| `formatted` | `string` | The value formatted for display (`12,345.67`)      |

> 🔁 Setting `.handler = "12345"` will automatically set both `.raw` and `.formatted`.

---

## ⚙️ `setOptions(options: Partial<FormatOptions>)`

Update locale, decimals, grouping, or currency format.

```ts
formatter.setOptions({
	style: 'currency',
	currency: 'USD',
	decimals: 2
});
```

### FormatOptions

```ts
{
	locale?: string;           // e.g., "en-US"
	useGrouping?: boolean;     // commas (true by default)
	decimals?: number;         // number of decimal places (default 0)
	currency?: string;         // e.g., "USD"
	style?: 'decimal' | 'currency';  // default: 'decimal'
}
```

---

## 🧼 `reset()`

Clear both raw and formatted values.

```ts
formatter.reset();
```

---

## 🎯 `format(value: string | number): string`

Format a raw number programmatically:

```ts
formatter.format("123456.789"); // → "123,456.79" or "$123,456.79"
```

---

## ✅ Example Use Case

```ts
const formatter = new NumberFormatter('', {
	style: 'currency',
	currency: 'USD',
	decimals: 2
});

formatter.handler = '456789.123';

console.log(formatter.formatted); // "$456,789.12"
console.log(formatter.raw);       // "456789.123"
```

---

## 🧠 Notes

* Designed for use with `<input type="text" />`
* Avoid using `bind:value` directly with `.formatted`; use a local `value` and sync via `$:`
* Perfect for form fields, dashboards, admin panels, and finance apps

---

## 🔗 Links

* 📁 GitHub: [https://github.com/dev-henen/svelte-number-formatter](https://github.com/dev-henen/svelte-number-formatter)
* 📦 NPM (after publish): `https://www.npmjs.com/package/svelte-number-formatter`

---

## 📜 License

MIT © [dev-henen](https://github.com/dev-henen)

---

## 🙌 Coming Soon

* [ ] `use:numberFormatter` Svelte action
* [ ] Store-based interface (`formatter.subscribe()`)
* [ ] Auto-detection of locale from browser
