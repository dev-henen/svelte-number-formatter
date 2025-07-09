# 🔢 svelte-number-formatter

A lightweight, reactive number formatter utility for **Svelte + TypeScript** with advanced validation and formatting capabilities.

Supports:

* Live number formatting for inputs (`12,345.67`, `$1,000.00`, `15.25%`, etc.)
* Extraction of clean raw values (`12345.67`)
* Currency, locale, decimal, and percentage formatting
* Real-time input validation with error/warning messages
* Min/max value constraints and custom prefix/suffix
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
<p>Numeric Value: {formatter.value}</p>
```

or, using a local value:

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';

	const formatter = new NumberFormatter();

	let value = formatter.formatted;

	$: formatter.handler = value;
	$: validation = formatter.getValidation();
</script>

<input 
	bind:value={value} 
	class:error={!formatter.isValid()}
/>

<p>Raw: {formatter.raw}</p>
<p>Formatted: {formatter.formatted}</p>

{#if !validation.isValid}
	<p class="error">{validation.error}</p>
{/if}
```

---

## 🔧 API

### `constructor(initial?: string | number, options?: FormatOptions)`

Create a new formatter with an optional initial value and formatting options.

### Properties

| Property    | Type     | Description                                        |
| ----------- | -------- | -------------------------------------------------- |
| `handler`   | `string` | Input setter that auto-updates `raw` + `formatted` |
| `raw`       | `string` | The numeric value stripped of symbols              |
| `formatted` | `string` | The value formatted for display (`12,345.67`)      |
| `value`     | `number` | The current numeric value                          |
| `validation`| `Readable<ValidationResult>` | Reactive validation state |
| `isEditing` | `Readable<boolean>` | Whether formatter is being edited |
| `numericValue` | `Readable<number>` | Derived numeric value store |

> 🔁 Setting `.handler = "12345"` will automatically update `.raw`, `.formatted`, and validation state.

---

## ⚙️ `setOptions(options: Partial<FormatOptions>)`

Update locale, decimals, grouping, currency format, validation rules, and more.

```ts
formatter.setOptions({
	style: 'currency',
	currency: 'USD',
	decimals: 2,
	min: 0,
	max: 10000,
	prefix: '$',
	allowNegative: false
});
```

### FormatOptions

```ts
{
	locale?: string;               // e.g., "en-US"
	useGrouping?: boolean;         // commas (true by default)
	decimals?: number;             // decimal places (default 0)
	currency?: string;             // e.g., "USD"
	style?: 'decimal' | 'currency' | 'percent'; // default: 'decimal'
	allowNegative?: boolean;       // allow negative numbers (default: true)
	allowDecimal?: boolean;        // allow decimal points (default: true)
	min?: number;                  // minimum value constraint
	max?: number;                  // maximum value constraint
	prefix?: string;               // custom prefix text
	suffix?: string;               // custom suffix text
	placeholder?: string;          // placeholder when empty
	strict?: boolean;              // reject invalid input entirely (default: false)
}
```

---

## 🎯 Core Methods

### `reset()`

Clear both raw and formatted values and reset validation state.

```ts
formatter.reset();
```

### `format(value: string | number): string`

Format a raw number programmatically:

```ts
formatter.format("123456.789"); // → "123,456.79" or "$123,456.79"
```

### `setValue(value: string | number)`

Programmatically set a value with validation:

```ts
formatter.setValue(1234.56);
console.log(formatter.formatted); // "1,234.56"
```

---

## ✅ Validation Methods

### `isValid(): boolean`

Check if the current value passes validation:

```ts
if (formatter.isValid()) {
	console.log("Value is valid!");
}
```

### `getValidation(): ValidationResult`

Get detailed validation information:

```ts
const validation = formatter.getValidation();
if (!validation.isValid) {
	console.error(validation.error);
}
if (validation.warning) {
	console.warn(validation.warning);
}
```

---

## 🎮 Value Manipulation

### `increment(step?: number)` / `decrement(step?: number)`

Modify values programmatically:

```ts
formatter.increment();    // +1
formatter.increment(5);   // +5
formatter.decrement();    // -1
formatter.decrement(10);  // -10
```

---

## 🔗 Form Integration

### `focus()` / `blur()`

Simulate focus states for form integration:

```ts
formatter.focus();  // Sets isEditing to true
formatter.blur();   // Sets isEditing to false
```

---

## 📡 Enhanced Subscriptions

### `subscribe(run)`

Subscribe to all state changes:

```ts
const formatter = new NumberFormatter("12345");

const unsubscribe = formatter.subscribe(({ raw, formatted, value, validation, isEditing }) => {
	console.log("Raw:", raw);
	console.log("Formatted:", formatted);
	console.log("Numeric:", value);
	console.log("Valid:", validation.isValid);
	console.log("Editing:", isEditing);
});
```

### Convenience Subscriptions

```ts
// Subscribe to formatted value only
formatter.subscribeFormatted(formatted => console.log(formatted));

// Subscribe to raw value only
formatter.subscribeRaw(raw => console.log(raw));

// Subscribe to numeric value only
formatter.subscribeValue(value => console.log(value));
```

---

## 🧮 Static Utilities

### `NumberFormatter.formatValue(value, options)`

One-off formatting without creating an instance:

```ts
const formatted = NumberFormatter.formatValue(1234.56, {
	style: 'currency',
	currency: 'EUR',
	decimals: 2
});
console.log(formatted); // "€1,234.56"
```

### `NumberFormatter.parseValue(formattedValue)`

Parse a formatted string back to a number:

```ts
const number = NumberFormatter.parseValue("$1,234.56");
console.log(number); // 1234.56
```

---

## 💡 Advanced Examples

### Currency Input with Validation

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';

	const priceFormatter = new NumberFormatter("", {
		style: 'currency',
		currency: 'USD',
		decimals: 2,
		min: 0,
		max: 999999.99,
		placeholder: "$0.00"
	});

	let price = "";
	$: priceFormatter.handler = price;
</script>

<input 
	bind:value={price}
	placeholder={priceFormatter.options.placeholder}
	class:error={!priceFormatter.isValid()}
/>

{#if !priceFormatter.isValid()}
	<div class="error">{priceFormatter.getValidation().error}</div>
{/if}
```

### Percentage Input

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';

	const percentFormatter = new NumberFormatter("", {
		style: 'percent',
		decimals: 2,
		min: 0,
		max: 100
	});
</script>

<input bind:value={percentFormatter.handler} />
<p>Formatted: {percentFormatter.formatted}</p>
```

### Quantity Stepper

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';

	const quantityFormatter = new NumberFormatter("1", {
		style: 'decimal',
		decimals: 0,
		min: 1,
		max: 100,
		allowDecimal: false
	});
</script>

<button on:click={() => quantityFormatter.decrement()}>-</button>
<input bind:value={quantityFormatter.handler} />
<button on:click={() => quantityFormatter.increment()}>+</button>
```

---

## 📥 `use:numberFormatter` Svelte Action

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
			decimals: 2,
			min: 0,
			max: 10000
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

## 🌐 Internationalization

Locale is automatically detected from the browser (`navigator.language`), or defaults to `"en-US"` in SSR/Node environments:

```ts
// German locale with Euro currency
const formatter = new NumberFormatter("1234.56", {
	locale: 'de-DE',
	style: 'currency',
	currency: 'EUR'
});
console.log(formatter.formatted); // "1.234,56 €"

// French locale with custom formatting
const formatter2 = new NumberFormatter("1234.56", {
	locale: 'fr-FR',
	useGrouping: true,
	decimals: 2
});
console.log(formatter2.formatted); // "1 234,56"
```

---

## 🛡️ Validation Features

The formatter includes comprehensive validation:

- **Type validation**: Ensures input is numeric
- **Range validation**: Respects min/max constraints
- **Format validation**: Validates decimal places, negative numbers
- **Real-time feedback**: Immediate error/warning messages
- **Strict mode**: Optionally reject invalid input entirely

```ts
const formatter = new NumberFormatter("", {
	min: 0,
	max: 100,
	decimals: 2,
	strict: true
});

formatter.handler = "150"; // Will be rejected in strict mode
console.log(formatter.getValidation().error); // "Value must be at most 100"
```

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

* Custom validation rules
* Async validation support
* Advanced formatting patterns
* Integration with popular form libraries
