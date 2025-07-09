# 🔢 svelte-number-formatter

A lightweight, reactive number formatter utility for **Svelte + TypeScript**.

Supports:

* Live number formatting for inputs (`12,345.67`, `$1,000.00`, etc.)
* Extraction of clean raw values (`12345.67`)
* Currency, locale, and decimal formatting
* Seamless integration with Svelte reactivity

---

## 📦 Installation

### From npm (public)

```bash
npm install svelte-number-formatter
```

### From GitHub Packages

```bash
npm install @dev-henen/svelte-number-formatter --registry=https://npm.pkg.github.com
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

	const formatter = new NumberFormatter();
</script>

<input bind:value={formatter.handler} />

<p>Raw: {formatter.raw}</p>
<p>Formatted: {formatter.formatted}</p>
```

or, using a local value:

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';

	const formatter = new NumberFormatter();

	let value = formatter.formatted;

	$: formatter.handler = value;
</script>

<input bind:value={value} />

<p>Raw: {formatter.raw}</p>
<p>Formatted: {formatter.formatted}</p>
```

---

## ⚠️ Important: Don't Pass Format Options When Binding `.handler`

When binding `formatter.handler` directly to an `<input>`:

```svelte
<input bind:value={formatter.handler} />
```

**❗ Do not pass formatting options to the constructor.**

Doing this:

```ts
// ⚠️ Don't do this when binding handler
const formatter = new NumberFormatter("1234.5", {
	style: 'currency',
	currency: 'USD',
	decimals: 2
});
```

...will cause the value to be **instantly formatted while typing**, which leads to a frustrating user experience (e.g., jumping cursors, blocked input).

### ✅ Instead, do this:

```ts
// ✅ No formatting options when using .handler
const formatter = new NumberFormatter("1234.5");
```

Or simply:

```ts
const formatter = new NumberFormatter();
```

You can still use `.format()` or `setOptions()` later for formatting output.

---

## 🔧 API

### `constructor(initial?: string, options?: FormatOptions)`

Create a new formatter with an optional initial value and formatting options (only when not binding `handler` to an input).

### Properties

| Property    | Type     | Description                                        |
| ----------- | -------- | -------------------------------------------------- |
| `handler`   | `string` | Input setter that auto-updates `raw` + `formatted` |
| `raw`       | `string` | The numeric value stripped of symbols              |
| `formatted` | `string` | The value formatted for display (`12,345.67`)      |

> 🔁 Setting `.handler = "12345"` will automatically update `.raw` and `.formatted`.

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
	locale?: string;               // e.g., "en-US"
	useGrouping?: boolean;         // commas (true by default)
	decimals?: number;             // decimal places (default 0)
	currency?: string;             // e.g., "USD"
	style?: 'decimal' | 'currency' // default: 'decimal'
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
const formatter = new NumberFormatter();

formatter.handler = '456789.123';

console.log(formatter.formatted); // "456,789.12"
console.log(formatter.raw);       // "456789.123"
```

To format as currency manually:

```ts
formatter.setOptions({
	style: 'currency',
	currency: 'USD',
	decimals: 2
});
```

---

## 🧠 Notes

* `handler` acts as a two-way reactive setter for `<input>` elements.
* Avoid formatting options when binding directly to input (`bind:value={formatter.handler}`).
* Ideal for form fields, dashboards, admin panels, and finance apps.

---

### 📥 `use:numberFormatter` Svelte Action

Easily format `<input>` values using a Svelte action. Live formatting occurs while typing, and formatting options (e.g., currency) are **applied only on blur** to avoid cursor issues.

#### ✅ Usage

```svelte
<script lang="ts">
	import { numberFormatter } from 'svelte-number-formatter';
	let raw = '';
</script>

<input
	use:numberFormatter={{
		options: {
			style: 'currency',
			currency: 'USD',
			decimals: 2
		},
		onChange: (rawVal, formattedVal) => {
			raw = rawVal;
		}
	}} />

<p>Raw value: {raw}</p>
```

#### 📌 Notes

* **Avoids passing options to constructor** — keeps typing smooth and uninterrupted.
* Formatting options are applied only when the input **blurs**.
* `onChange(raw, formatted)` is triggered on each update.
* Ideal for declarative usage in forms and custom inputs.

#### 🔧 Parameters

| Key        | Type                               | Description                          |
| ---------- | ---------------------------------- | ------------------------------------ |
| `options`  | `FormatOptions`                    | Formatting options (applied on blur) |
| `onChange` | `(raw: string, formatted: string)` | Callback on input change or blur     |

---

### `subscribe(run)`

Subscribe to changes in both `raw` and `formatted` values (Svelte store interface):

```ts
const formatter = new NumberFormatter("12345");

const unsubscribe = formatter.subscribe(({ raw, formatted }) => {
	console.log("Raw:", raw);        // → "12345"
	console.log("Formatted:", formatted); // → "12,345"
});
```

Use this in any reactive context, or bind to values via `$formatter.formatted`:

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';
	const formatter = new NumberFormatter("0");
</script>

<input bind:value={$formatter.formatted} />
```

> 🌐 `locale` is automatically detected from the browser (`navigator.language`), or defaults to `"en-US"` if running in SSR or Node environments.

---

## 🔗 Links

* 📁 GitHub: [https://github.com/dev-henen/svelte-number-formatter](https://github.com/dev-henen/svelte-number-formatter)
* 📦 NPM: [https://www.npmjs.com/package/svelte-number-formatter](https://www.npmjs.com/package/svelte-number-formatter)
* 📦 GitHub Package: [https://github.com/dev-henen/svelte-number-formatter/packages](https://github.com/dev-henen/svelte-number-formatter/packages)

---

## 📜 License

MIT © [dev-henen](https://github.com/dev-henen)

---

## 🙌 Coming Soon
