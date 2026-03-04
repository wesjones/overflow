# Overflow

A responsive overflow component for React that automatically moves toolbar items into a dropdown menu as the container shrinks. Items transition through three states: **visible**, **min** (icon-only), and **hidden** (moved to menu).

[**Live Storybook Demo**](https://wesjones.github.io/overflow/)

## Features

- Items collapse into a menu as the container narrows
- Optional **min state** — items shrink to icon-only before hiding
- **Compact mode** — items collapse one at a time instead of all at once
- **Reverse mode** — items collapse from the left instead of the right
- **Menu-only items** — items that always live in the menu (e.g. Help, About)
- Ships with **MUI** and **Radix UI** implementations, or bring your own

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev          # Vite dev server
pnpm storybook    # Storybook on port 6006
pnpm build        # TypeScript check + Vite build
pnpm lint         # ESLint
```

## Usage

Each implementation follows the same pattern: an `Overflow` container holds `OverflowItem` children and an `OverflowMenu`. Items with a matching `menuid` in both the menu and the toolbar are linked — when the toolbar item overflows, its menu counterpart appears.

### Radix UI

```tsx
import { RxOverflow, RxOverflowItem, RxOverflowMenu } from './components/RxOverflow';

<RxOverflow style={{ gap: 8 }}>
  <RxOverflowMenu opener={<button>...</button>}>
    <RxOverflowItem menuid="format">
      <button>Format</button>
    </RxOverflowItem>
    <RxOverflowItem menuid="filter">
      <button>Filters</button>
    </RxOverflowItem>
  </RxOverflowMenu>

  <RxOverflowItem menuid="format">
    <button>Format</button>
  </RxOverflowItem>
  <RxOverflowItem menuid="filter">
    <button>Filters</button>
  </RxOverflowItem>
</RxOverflow>
```

### MUI

```tsx
import { MuiOverflow, MuiOverflowItem, MuiOverflowMenu } from './components/MuiOverflow';
import { Button, MenuItem } from '@mui/material';

<MuiOverflow sx={{ gap: 1 }}>
  <MuiOverflowMenu opener={<Button>...</Button>}>
    <MuiOverflowItem menuid="format">
      <MenuItem>Format</MenuItem>
    </MuiOverflowItem>
    <MuiOverflowItem menuid="filter">
      <MenuItem>Filters</MenuItem>
    </MuiOverflowItem>
  </MuiOverflowMenu>

  <MuiOverflowItem menuid="format">
    <Button>Format</Button>
  </MuiOverflowItem>
  <MuiOverflowItem menuid="filter">
    <Button>Filters</Button>
  </MuiOverflowItem>
</MuiOverflow>
```

### Min State

Items can shrink to a fixed width (icon-only) before being hidden entirely:

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

### Compact Mode

Collapses items one at a time instead of all at once:

```tsx
<RxOverflow compact>
  {/* ... */}
</RxOverflow>
```

### Reverse Mode

Collapses items from the left side first:

```tsx
<RxOverflow reverse>
  {/* ... */}
</RxOverflow>
```

### Menu-Only Items

Items without a `menuid` always stay where they are — in the toolbar or in the menu:

```tsx
<RxOverflowMenu opener={<button>...</button>}>
  <RxOverflowItem menuid="format">
    <button>Format</button>
  </RxOverflowItem>
  {/* These always appear in the menu */}
  <RxOverflowItem>
    <div role="separator" />
  </RxOverflowItem>
  <RxOverflowItem>
    <button>Help</button>
  </RxOverflowItem>
</RxOverflowMenu>
```

## API

### `Overflow` / `RxOverflow` / `MuiOverflow`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Overflow items and menu |
| `compact` | `boolean` | Collapse items one at a time |
| `reverse` | `boolean` | Collapse from the left |
| `className` / `style` | | Standard HTML attributes |
| `sx` | `SxProps` | MUI system props (MUI only) |

### `OverflowItem` / `RxOverflowItem` / `MuiOverflowItem`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Item content |
| `menuid` | `string` | Links toolbar items to their menu counterparts |
| `minStateWidth` | `string` \| `number` | Width when in min state (string for Rx, number for MUI) |

### `OverflowMenu` / `RxOverflowMenu` / `MuiOverflowMenu`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Menu items |
| `opener` | `ReactNode` | The button that opens the menu |
