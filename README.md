# Overflow

[![npm version](https://img.shields.io/npm/v/overflow-toolbar)](https://www.npmjs.com/package/overflow-toolbar)
[![bundle size](https://img.shields.io/bundlephobia/minzip/overflow-toolbar)](https://bundlephobia.com/package/overflow-toolbar)
[![license](https://img.shields.io/npm/l/overflow-toolbar)](./LICENSE)
[![CI](https://github.com/wesjones/overflow/actions/workflows/ci.yml/badge.svg)](https://github.com/wesjones/overflow/actions/workflows/ci.yml)

A responsive toolbar overflow component that automatically collapses items into a dropdown menu as the container shrinks. Items transition through three states: **visible** → **min** (icon-only) → **hidden** (moved to menu).

<a href="https://wesjones.github.io/overflow/" target="_blank"><strong>Live Demo</strong></a>

## Features

- **Automatic overflow detection** — items collapse into a menu as the container narrows using ResizeObserver
- **Three item states** — visible, min (icon-only), and hidden (in menu)
- **Compact mode** — items collapse one at a time instead of all at once
- **Reverse mode** — collapse from the left instead of the right
- **Menu-only items** — items that always live in the dropdown (e.g. Help, About)
- **Min state** — items shrink to icon-only before being fully hidden
- **Three implementations** — React/Radix UI (shadcn-compatible), Material UI, and vanilla JavaScript
- **Tree-shakeable** — import only the variant you need via subpath exports
- **TypeScript** — full type declarations included

## Install

```bash
npm install overflow-toolbar
```

## Quick Start

### Radix UI / shadcn (React)

```tsx
import { RxOverflow, RxOverflowItem, RxOverflowMenu } from 'overflow-toolbar/rx';
import 'overflow-toolbar/rx/styles';
import 'overflow-toolbar/styles';

<RxOverflow style={{ gap: 8 }}>
  <RxOverflowMenu opener={<button>More</button>}>
    <RxOverflowItem menuid="format"><button>Format</button></RxOverflowItem>
    <RxOverflowItem menuid="filter"><button>Filters</button></RxOverflowItem>
  </RxOverflowMenu>

  <RxOverflowItem menuid="format"><button>Format</button></RxOverflowItem>
  <RxOverflowItem menuid="filter"><button>Filters</button></RxOverflowItem>
</RxOverflow>
```

### Material UI (React)

```tsx
import { MuiOverflow, MuiOverflowItem, MuiOverflowMenu } from 'overflow-toolbar/mui';
import 'overflow-toolbar/styles';
import { Button, MenuItem } from '@mui/material';

<MuiOverflow sx={{ gap: 1 }}>
  <MuiOverflowMenu opener={<Button>More</Button>}>
    <MuiOverflowItem menuid="format"><MenuItem>Format</MenuItem></MuiOverflowItem>
    <MuiOverflowItem menuid="filter"><MenuItem>Filters</MenuItem></MuiOverflowItem>
  </MuiOverflowMenu>

  <MuiOverflowItem menuid="format"><Button>Format</Button></MuiOverflowItem>
  <MuiOverflowItem menuid="filter"><Button>Filters</Button></MuiOverflowItem>
</MuiOverflow>
```

### Vanilla JavaScript

```js
import { OverflowToolbar } from 'overflow-toolbar/vanilla';
import 'overflow-toolbar/vanilla/styles';
import 'overflow-toolbar/styles';

const ul = document.querySelector('#my-toolbar');
const toolbar = new OverflowToolbar(ul);

// Later: toolbar.update() after DOM changes
// Cleanup: toolbar.destroy()
```

```html
<ul id="my-toolbar">
  <li data-overflow-role="menu">
    <button data-menu-trigger>More</button>
    <div data-menu-panel>
      <button data-menuid="format">Format</button>
      <button data-menuid="filter">Filters</button>
    </div>
  </li>
  <li data-overflow-role="item" data-menuid="format">
    <button>Format</button>
  </li>
  <li data-overflow-role="item" data-menuid="filter">
    <button>Filters</button>
  </li>
</ul>
```

## Subpath Imports

Import only what you need for optimal tree-shaking:

| Import path | Contents |
|---|---|
| `overflow-toolbar` | Everything (all variants) |
| `overflow-toolbar/core` | Core React components (`Overflow`, `OverflowItem`, `OverflowMenu`, `OverflowController`) |
| `overflow-toolbar/rx` | Radix UI / shadcn variant (`RxOverflow`, `RxOverflowItem`, `RxOverflowMenu`) |
| `overflow-toolbar/mui` | Material UI variant (`MuiOverflow`, `MuiOverflowItem`, `MuiOverflowMenu`) |
| `overflow-toolbar/vanilla` | Vanilla JS (`OverflowToolbar`) |
| `overflow-toolbar/styles` | Core CSS (required by all variants) |
| `overflow-toolbar/rx/styles` | Radix UI styles |
| `overflow-toolbar/vanilla/styles` | Vanilla JS styles |

## API

### `Overflow` / `RxOverflow` / `MuiOverflow`

The container component. Wraps toolbar items and the overflow menu.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Overflow items and menu |
| `compact` | `boolean` | `false` | Collapse items one at a time |
| `reverse` | `boolean` | `false` | Collapse from the left |
| `className` | `string` | — | CSS class name |
| `style` | `CSSProperties` | — | Inline styles |
| `sx` | `SxProps` | — | MUI system props (MUI only) |

### `OverflowItem` / `RxOverflowItem` / `MuiOverflowItem`

Wraps each toolbar item. Place matching items in both the toolbar and the menu, linked by `menuid`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Item content |
| `menuid` | `string` | — | Links toolbar item to its menu counterpart |
| `minStateWidth` | `string` \| `number` | — | Width in min state (`string` for Rx, `number` for MUI spacing units) |

### `OverflowMenu` / `RxOverflowMenu` / `MuiOverflowMenu`

The dropdown menu container. Must include an `opener` element (the trigger button).

| Prop | Type | Description |
|---|---|---|
| `children` | `ReactNode` | Menu items |
| `opener` | `ReactNode` | The button that opens the menu |

### `OverflowController`

Framework-agnostic controller class for building custom implementations.

| Method | Description |
|---|---|
| `connect()` | Start observing and apply initial state |
| `disconnect()` | Stop observing and clear all applied styles/attributes |
| `update()` | Re-scan children and restart (call after DOM changes) |

## Important: No Wrapper Elements

`OverflowItem` and `OverflowMenu` components **must** be direct children of the `Overflow` container. Do not wrap them in `<div>`, `<span>`, layout components, or any other intermediate elements.

The overflow engine scans immediate children for internal role markers to measure, track, and transition items between states. Wrapper elements break this scan, causing items to never collapse, never appear in the menu, or fail to transition between visible/min/hidden states.

```tsx
{/* WRONG — wrapper breaks overflow behavior */}
<RxOverflow>
  <div className="group">
    <RxOverflowItem menuid="a"><button>A</button></RxOverflowItem>
    <RxOverflowItem menuid="b"><button>B</button></RxOverflowItem>
  </div>
</RxOverflow>

{/* CORRECT — items are direct children */}
<RxOverflow>
  <RxOverflowItem menuid="a"><button>A</button></RxOverflowItem>
  <RxOverflowItem menuid="b"><button>B</button></RxOverflowItem>
</RxOverflow>
```

The same rule applies to the vanilla JS variant — `<li>` elements with `data-overflow-role` must be direct children of the `<ul>` container.

## Modes

### Compact Mode

Items collapse one at a time with tight spacing. Adjacent buttons get squared-off corners for a grouped look:

```tsx
<RxOverflow compact>
  {/* items... */}
</RxOverflow>
```

### Reverse Mode

Items collapse from the left side first instead of the right:

```tsx
<RxOverflow reverse>
  {/* items... */}
</RxOverflow>
```

### Min State

Items shrink to a fixed width (icon-only) before being fully hidden:

```tsx
<RxOverflowItem menuid="format" minStateWidth="2.25rem">
  <button><FormatIcon /> Format</button>
</RxOverflowItem>
```

For MUI, `minStateWidth` accepts a number (theme spacing units):

```tsx
<MuiOverflowItem menuid="format" minStateWidth={5}>
  <Button><FormatIcon /> Format</Button>
</MuiOverflowItem>
```

### Menu-Only Items

Items without a `menuid` always stay where they are — in the toolbar or in the menu:

```tsx
<RxOverflowMenu opener={<button>More</button>}>
  <RxOverflowItem menuid="format"><button>Format</button></RxOverflowItem>
  {/* Always in the menu */}
  <RxOverflowItem><div role="separator" /></RxOverflowItem>
  <RxOverflowItem><button>Help</button></RxOverflowItem>
</RxOverflowMenu>
```

## Vanilla JS

The vanilla implementation uses `data-` attributes for configuration:

| Attribute | Element | Description |
|---|---|---|
| `data-overflow-role="item"` | `<li>` | Marks a toolbar item |
| `data-overflow-role="menu"` | `<li>` | Marks the menu container |
| `data-menuid` | `<li>`, menu item | Links toolbar and menu items |
| `data-min-state-width` | `<li>` | Min-state width (CSS value) |
| `data-menu-trigger` | `<button>` | The menu open/close button |
| `data-menu-panel` | `<div>` | The menu panel (uses Popover API) |

```js
const toolbar = new OverflowToolbar(document.querySelector('ul'), {
  compact: true,
  reverse: false,
});

toolbar.update();   // after DOM changes
toolbar.destroy();  // cleanup
```

## Browser Support

Requires [ResizeObserver](https://caniuse.com/resizeobserver) (all modern browsers). The vanilla JS variant also uses the [Popover API](https://caniuse.com/mdn-api_htmlelement_popover) for the dropdown menu.

## Contributing

```bash
git clone https://github.com/wesjones/overflow.git
cd overflow
pnpm install
pnpm storybook     # dev with Storybook on port 6006
pnpm test:unit     # run unit tests
pnpm build:lib     # build the library
pnpm typecheck     # check types
pnpm lint           # lint
```

## Also Known As

This component implements what is commonly known as a responsive toolbar, overflow menu, adaptive toolbar, collapsible toolbar, priority+ pattern, priority-plus navigation, toolbar button group overflow, responsive action bar, command bar, or "more menu." It handles responsive buttons, auto-collapse, icon-only collapse, and dynamic toolbar resizing using ResizeObserver. The Radix UI variant is fully compatible with shadcn/ui projects.

## License

[MIT](./LICENSE)
