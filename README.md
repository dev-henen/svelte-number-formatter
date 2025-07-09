# 🔢 svelte-number-formatter

A powerful, reactive number formatter utility for **Svelte + TypeScript** with comprehensive validation, real-time formatting, and extensive customization options.

## ✨ Features

* **Live number formatting** for inputs (`12,345.67`, `$1,000.00`, `85%`, etc.)
* **Input validation** with custom error messages and warnings
* **Multiple formatting styles** (decimal, currency, percentage)
* **Locale-aware formatting** with automatic browser detection
* **Real-time reactive updates** with Svelte store integration
* **Comprehensive input cleaning** and sanitization
* **Min/max value validation** with custom ranges
* **Prefix/suffix support** for custom formatting
* **Strict mode** for rejecting invalid input
* **Increment/decrement utilities** for stepper controls
* **TypeScript support** with full type definitions

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
</script>

<input bind:value={value} />
<p>Raw: {formatter.raw}</p>
<p>Formatted: {formatter.formatted}</p>
```

---

## 🔧 Constructor

### `new NumberFormatter(initial?, options?)`

Create a new formatter with optional initial value and formatting options.

```ts
const formatter = new NumberFormatter("1234.56", {
	style: 'currency',
	currency: 'USD',
	decimals: 2,
	useGrouping: true
});
```

---

## 📊 Properties

| Property    | Type     | Description                                        |
| ----------- | -------- | -------------------------------------------------- |
| `handler`   | `string` | Input setter that auto-updates `raw` + `formatted` |
| `raw`       | `string` | The numeric value stripped of symbols              |
| `formatted` | `string` | The value formatted for display (`12,345.67`)      |
| `value`     | `number` | The parsed numeric value                           |

### Reactive Stores

| Store          | Type                    | Description                           |
| -------------- | ----------------------- | ------------------------------------- |
| `validation`   | `Readable<ValidationResult>` | Current validation state          |
| `isEditing`    | `Readable<boolean>`     | Whether input is currently being edited |
| `numericValue` | `Readable<number>`      | Parsed numeric value as store         |

> 🔁 Setting `.handler = "12345"` will automatically update `.raw`, `.formatted`, and `.value`.

---

## ⚙️ Configuration Options

### `setOptions(options: Partial<FormatOptions>)`

Update formatting options dynamically:

```ts
formatter.setOptions({
	style: 'currency',
	currency: 'EUR',
	decimals: 2,
	min: 0,
	max: 10000
});
```

### FormatOptions

```ts
type FormatOptions = {
	locale?: string;                           // e.g., "en-US", "de-DE"
	useGrouping?: boolean;                     // thousand separators (default: true)
	decimals?: number;                         // decimal places (default: 0)
	currency?: string;                         // e.g., "USD", "EUR"
	style?: "decimal" | "currency" | "percent"; // formatting style
	allowNegative?: boolean;                   // allow negative numbers (default: true)
	allowDecimal?: boolean;                    // allow decimal input (default: true)
	min?: number;                              // minimum value
	max?: number;                              // maximum value
	prefix?: string;                           // custom prefix
	suffix?: string;                           // custom suffix
	placeholder?: string;                      // placeholder for empty values
	strict?: boolean;                          // reject invalid input (default: false)
};
```

---

## 🎯 Methods

### Core Methods

#### `format(value: string | number): string`
Format a raw number programmatically:
```ts
formatter.format("123456.789"); // → "123,456.79" or "$123,456.79"
```

#### `setValue(value: string | number): void`
Set the value programmatically:
```ts
formatter.setValue(1234.56);
```

#### `reset(): void`
Clear all values and reset validation state:
```ts
formatter.reset();
```

### Validation Methods

#### `isValid(): boolean`
Check if current value is valid:
```ts
if (formatter.isValid()) {
	// proceed with valid value
}
```

#### `getValidation(): ValidationResult`
Get detailed validation information:
```ts
const validation = formatter.getValidation();
console.log(validation.isValid, validation.error, validation.warning);
```

### Utility Methods

#### `increment(step?: number): void`
Increment the current value:
```ts
formatter.increment(1);    // +1
formatter.increment(10);   // +10
```

#### `decrement(step?: number): void`
Decrement the current value:
```ts
formatter.decrement(1);    // -1
formatter.decrement(5);    // -5
```

#### `focus(): void` / `blur(): void`
Simulate focus/blur for form integration:
```ts
formatter.focus();  // sets isEditing to true
formatter.blur();   // sets isEditing to false
```

---

## 📡 Subscription Methods

### Enhanced Subscription

Subscribe to all formatter state changes:

```ts
const unsubscribe = formatter.subscribe(({ raw, formatted, value, validation, isEditing }) => {
	console.log("Raw:", raw);
	console.log("Formatted:", formatted);
	console.log("Value:", value);
	console.log("Valid:", validation.isValid);
	console.log("Editing:", isEditing);
});
```

### Convenience Subscriptions

#### `subscribeFormatted(run: Subscriber<string>): Unsubscriber`
```ts
const unsubscribe = formatter.subscribeFormatted(formatted => {
	console.log("Formatted:", formatted);
});
```

#### `subscribeRaw(run: Subscriber<string>): Unsubscriber`
```ts
const unsubscribe = formatter.subscribeRaw(raw => {
	console.log("Raw:", raw);
});
```

#### `subscribeValue(run: Subscriber<number>): Unsubscriber`
```ts
const unsubscribe = formatter.subscribeValue(value => {
	console.log("Value:", value);
});
```

---

## 🔍 Validation System

The formatter includes a comprehensive validation system:

### ValidationResult Type

```ts
type ValidationResult = {
	isValid: boolean;
	error?: string;     // Validation error message
	warning?: string;   // Warning message (non-blocking)
};
```

### Example with Validation

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';
	
	const formatter = new NumberFormatter("", {
		min: 0,
		max: 100,
		decimals: 2,
		strict: true
	});
	
	let validation = formatter.getValidation();
	$: validation = $formatter.validation;
</script>

<input bind:value={formatter.handler} />

{#if !validation.isValid}
	<p class="error">{validation.error}</p>
{/if}

{#if validation.warning}
	<p class="warning">{validation.warning}</p>
{/if}
```

---

## 🌍 Localization Examples

### Currency Formatting

```ts
// US Dollar
const usdFormatter = new NumberFormatter("1234.56", {
	style: 'currency',
	currency: 'USD',
	locale: 'en-US'
});
// → "$1,234.56"

// Euro
const eurFormatter = new NumberFormatter("1234.56", {
	style: 'currency',
	currency: 'EUR',
	locale: 'de-DE'
});
// → "1.234,56 €"
```

### Percentage Formatting

```ts
const percentFormatter = new NumberFormatter("0.85", {
	style: 'percent',
	decimals: 1
});
// → "85.0%"
```

### Custom Prefix/Suffix

```ts
const customFormatter = new NumberFormatter("42", {
	prefix: "Score: ",
	suffix: " pts",
	useGrouping: false
});
// → "Score: 42 pts"
```

---

## 🎛️ Advanced Usage Examples

### Stepper Input Component

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';
	
	const formatter = new NumberFormatter("0", {
		min: 0,
		max: 100,
		decimals: 0
	});
</script>

<div class="stepper">
	<button on:click={() => formatter.decrement()}>-</button>
	<input bind:value={formatter.handler} />
	<button on:click={() => formatter.increment()}>+</button>
</div>

<p>Value: {formatter.value}</p>
```

### Form Integration with Validation

```svelte
<script lang="ts">
	import { NumberFormatter } from 'svelte-number-formatter';
	
	const priceFormatter = new NumberFormatter("", {
		style: 'currency',
		currency: 'USD',
		decimals: 2,
		min: 0,
		max: 999999,
		strict: true
	});
	
	$: isValid = $priceFormatter.validation.isValid;
</script>

<form>
	<label>
		Price:
		<input 
			bind:value={priceFormatter.handler}
			class:invalid={!isValid}
		/>
	</label>
	
	{#if !isValid}
		<span class="error">{$priceFormatter.validation.error}</span>
	{/if}
	
	<button type="submit" disabled={!isValid}>
		Submit
	</button>
</form>
```

---

## 🔧 Static Utility Methods

### `NumberFormatter.formatValue(value, options?): string`

Format a value without creating a formatter instance:

```ts
const formatted = NumberFormatter.formatValue(1234.56, {
	style: 'currency',
	currency: 'USD'
});
// → "$1,234.56"
```

### `NumberFormatter.parseValue(formattedValue): number`

Parse a formatted value back to a number:

```ts
const value = NumberFormatter.parseValue("$1,234.56");
// → 1234.56
```

---

## 📚 Common Use Cases

### 1. **Financial Applications**
```ts
const moneyFormatter = new NumberFormatter("", {
	style: 'currency',
	currency: 'USD',
	decimals: 2,
	min: 0
});
```

### 2. **Percentage Inputs**
```ts
const percentFormatter = new NumberFormatter("", {
	style: 'percent',
	decimals: 1,
	min: 0,
	max: 1
});
```

### 3. **Quantity Inputs**
```ts
const quantityFormatter = new NumberFormatter("1", {
	decimals: 0,
	min: 1,
	max: 999,
	useGrouping: false
});
```

### 4. **Scientific Notation**
```ts
const scientificFormatter = new NumberFormatter("", {
	decimals: 3,
	useGrouping: false,
	allowNegative: true
});
```

---

## 🌐 Browser Compatibility

- **Locale Detection**: Automatically detects browser locale via `navigator.language`
- **SSR Support**: Defaults to "en-US" in server-side environments
- **Modern Browsers**: Uses `Intl.NumberFormat` for reliable formatting
- **Fallback**: Graceful degradation if formatting fails

---

## 🧠 Notes

* `handler` acts as a two-way reactive setter for `<input>` elements
* Validation runs automatically on every input change
* Strict mode (`strict: true`) rejects invalid input entirely
* Non-strict mode allows invalid input but marks it as invalid
* Locale is automatically detected from browser settings
* All stores are reactive and integrate seamlessly with Svelte's reactivity system

---

## 🔗 Links

* 📁 GitHub: [https://github.com/dev-henen/svelte-number-formatter](https://github.com/dev-henen/svelte-number-formatter)
* 📦 NPM: [https://www.npmjs.com/package/svelte-number-formatter](https://www.npmjs.com/package/svelte-number-formatter)
* 📦 GitHub Package: [https://github.com/dev-henen/svelte-number-formatter/packages](https://github.com/dev-henen/svelte-number-formatter/packages)

---

## 📜 License

MIT © [dev-henen](https://github.com/dev-henen)

---

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
