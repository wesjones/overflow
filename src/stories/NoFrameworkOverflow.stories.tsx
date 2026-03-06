import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import { OverflowToolbar } from '../components/NoFrameworkOverflow';
import '../components/Overflow/Overflow.css';
import '../components/NoFrameworkOverflow/noframework.css';

/* ── Inline SVG icons (no React icon library needed) ──────── */
const iconAlign = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" x2="3" y1="10" y2="10"/><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="14" y2="14"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`;
const iconWorkflow = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>`;
const iconSettings = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
const iconSearch = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
const iconMore = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/></svg>`;
const iconAlign18 = iconAlign.replace(/width="20"/g, 'width="18"').replace(/height="20"/g, 'height="18"');
const iconWorkflow18 = iconWorkflow.replace(/width="20"/g, 'width="18"').replace(/height="20"/g, 'height="18"');
const iconSettings18 = iconSettings.replace(/width="20"/g, 'width="18"').replace(/height="20"/g, 'height="18"');
const iconSearch18 = iconSearch.replace(/width="20"/g, 'width="18"').replace(/height="20"/g, 'height="18"');

/* ── Helper: creates the toolbar HTML + instantiates OverflowToolbar ── */

function NfWrapper({
  html,
  compact,
  reverse,
  snap,
  style,
}: {
  html: string;
  compact?: boolean;
  reverse?: boolean;
  snap?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const toolbarRef = useRef<OverflowToolbar | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = html;
    const tb = new OverflowToolbar(ref.current, { compact, reverse, snap });
    toolbarRef.current = tb;
    return () => tb.destroy();
  }, [html, compact, reverse, snap]);

  return <ul ref={ref} style={style} />;
}

/* ── Storybook meta ───────────────────────────────────────── */
const meta: Meta = {
  title: 'Components/NoFrameworkOverflow',
  decorators: [
    (Story) => (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'hidden',
          border: '1px dashed #ccc',
          padding: 16,
          width: 600,
          minWidth: 100,
          display: 'flex',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj;

/* ── Stories ───────────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <NfWrapper
      style={{ gap: 8 }}
      html={`
        <li data-overflow-role="menu">
          <button class="nf-btn" data-menu-trigger>${iconMore}</button>
          <div class="nf-menu-panel" data-menu-panel>
            <button class="nf-menu-item" data-menu-id="btn1">${iconAlign18} Button 1</button>
            <button class="nf-menu-item" data-menu-id="btn2">${iconWorkflow18} Button 2</button>
            <button class="nf-menu-item" data-menu-id="btn3">Button 3</button>
          </div>
        </li>
        <li data-overflow-role="item" data-menu-id="btn1">
          <button class="nf-btn">${iconAlign} Button 1</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn2">
          <button class="nf-btn">${iconWorkflow} Button 2</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn3">
          <button class="nf-btn">Button 3</button>
        </li>
      `}
    />
  ),
};

export const MinState: Story = {
  render: () => (
    <NfWrapper
      style={{ gap: 8 }}
      html={`
        <li data-overflow-role="menu">
          <button class="nf-btn" data-menu-trigger>${iconMore}</button>
          <div class="nf-menu-panel" data-menu-panel>
            <button class="nf-menu-item" data-menu-id="btn1">${iconAlign18} Button 1</button>
            <button class="nf-menu-item" data-menu-id="btn2">${iconWorkflow18} Button 2</button>
            <button class="nf-menu-item" data-menu-id="btn3">${iconSettings18} Button 3</button>
          </div>
        </li>
        <li data-overflow-role="item" data-menu-id="btn1" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconAlign} Button 1</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn2" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconWorkflow} Button 2</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn3" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconSettings} Button 3</button>
        </li>
      `}
    />
  ),
};

export const Snap: Story = {
  render: () => (
    <NfWrapper
      snap
      style={{ gap: 8 }}
      html={`
        <li data-overflow-role="menu">
          <button class="nf-btn" data-menu-trigger>${iconMore}</button>
          <div class="nf-menu-panel" data-menu-panel>
            <button class="nf-menu-item" data-menu-id="btn1">${iconAlign18} Button 1</button>
            <button class="nf-menu-item" data-menu-id="btn2">${iconWorkflow18} Button 2</button>
            <button class="nf-menu-item" data-menu-id="btn3">${iconSettings18} Button 3</button>
          </div>
        </li>
        <li data-overflow-role="item" data-menu-id="btn1" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconAlign} Button 1</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn2" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconWorkflow} Button 2</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn3" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconSettings} Button 3</button>
        </li>
      `}
    />
  ),
};

export const MenuOnly: Story = {
  render: () => (
    <NfWrapper
      style={{ gap: 8 }}
      html={`
        <li data-overflow-role="menu">
          <button class="nf-btn" data-menu-trigger>${iconMore}</button>
          <div class="nf-menu-panel" data-menu-panel>
            <button class="nf-menu-item" data-menu-id="btn1">${iconAlign18} Button 1</button>
            <button class="nf-menu-item" data-menu-id="btn2">${iconWorkflow18} Button 2</button>
            <div class="nf-separator" role="separator"></div>
            <button class="nf-menu-item">Help</button>
            <button class="nf-menu-item">About</button>
          </div>
        </li>
        <li data-overflow-role="item" data-menu-id="btn1">
          <button class="nf-btn">${iconAlign} Button 1</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn2">
          <button class="nf-btn">${iconWorkflow} Button 2</button>
        </li>
        <li data-overflow-role="item">
          <button class="nf-btn">${iconSearch} Search</button>
        </li>
      `}
    />
  ),
};

export const Compact: Story = {
  render: () => (
    <NfWrapper
      compact
      html={`
        <li data-overflow-role="menu">
          <button class="nf-btn" data-menu-trigger>${iconMore}</button>
          <div class="nf-menu-panel" data-menu-panel>
            <button class="nf-menu-item" data-menu-id="btn1">${iconAlign18} Button 1</button>
            <button class="nf-menu-item" data-menu-id="btn2">${iconWorkflow18} Button 2</button>
            <button class="nf-menu-item" data-menu-id="btn3">Button 3</button>
            <button class="nf-menu-item" data-menu-id="btn4">${iconSearch18} Search</button>
            <button class="nf-menu-item" data-menu-id="btn5">${iconSettings18} Settings</button>
            <div class="nf-separator" role="separator"></div>
            <button class="nf-menu-item">Help</button>
          </div>
        </li>
        <li data-overflow-role="item" data-menu-id="btn1" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconAlign} Button 1</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn2" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconWorkflow} Button 2</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn3">
          <button class="nf-btn">Button 3</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn4" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconSearch} Search</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn5" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconSettings} Settings</button>
        </li>
      `}
    />
  ),
};

export const BothSides: Story = {
  render: () => (
    <>
      <NfWrapper
        compact
        reverse
        style={{ minWidth: 0 }}
        html={`
          <li data-overflow-role="menu">
            <button class="nf-btn" data-menu-trigger>${iconMore}</button>
            <div class="nf-menu-panel" data-menu-panel>
              <button class="nf-menu-item" data-menu-id="L1">${iconAlign18} Format</button>
              <button class="nf-menu-item" data-menu-id="L2">${iconWorkflow18} Filters</button>
              <button class="nf-menu-item" data-menu-id="L3">${iconSettings18} Views</button>
            </div>
          </li>
          <li data-overflow-role="item" data-menu-id="L1" data-min-state-width="2.25rem">
            <button class="nf-btn">${iconAlign} Format</button>
          </li>
          <li data-overflow-role="item" data-menu-id="L2" data-min-state-width="2.25rem">
            <button class="nf-btn">${iconWorkflow} Filters</button>
          </li>
          <li data-overflow-role="item" data-menu-id="L3" data-min-state-width="2.25rem">
            <button class="nf-btn">${iconSettings} Views</button>
          </li>
        `}
      />
      <NfWrapper
        compact
        style={{ minWidth: 0 }}
        html={`
          <li data-overflow-role="menu">
            <button class="nf-btn" data-menu-trigger>${iconMore}</button>
            <div class="nf-menu-panel" data-menu-panel>
              <button class="nf-menu-item" data-menu-id="R1">${iconSearch18} Search</button>
              <button class="nf-menu-item" data-menu-id="R2">${iconSettings18} Settings</button>
              <button class="nf-menu-item" data-menu-id="R3">${iconAlign18} Help</button>
            </div>
          </li>
          <li data-overflow-role="item" data-menu-id="R1" data-min-state-width="2.25rem">
            <button class="nf-btn">${iconSearch} Search</button>
          </li>
          <li data-overflow-role="item" data-menu-id="R2" data-min-state-width="2.25rem">
            <button class="nf-btn">${iconSettings} Settings</button>
          </li>
          <li data-overflow-role="item" data-menu-id="R3" data-min-state-width="2.25rem">
            <button class="nf-btn">${iconAlign} Help</button>
          </li>
        `}
      />
    </>
  ),
};

export const Reverse: Story = {
  render: () => (
    <NfWrapper
      compact
      reverse
      html={`
        <li data-overflow-role="menu">
          <button class="nf-btn" data-menu-trigger>${iconMore}</button>
          <div class="nf-menu-panel" data-menu-panel>
            <button class="nf-menu-item" data-menu-id="btn1">${iconAlign18} Button 1</button>
            <button class="nf-menu-item" data-menu-id="btn2">${iconWorkflow18} Button 2</button>
            <button class="nf-menu-item" data-menu-id="btn3">Button 3</button>
            <button class="nf-menu-item" data-menu-id="btn4">${iconSearch18} Search</button>
            <button class="nf-menu-item" data-menu-id="btn5">${iconSettings18} Settings</button>
            <div class="nf-separator" role="separator"></div>
            <button class="nf-menu-item">Help</button>
          </div>
        </li>
        <li data-overflow-role="item" data-menu-id="btn1" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconAlign} Button 1</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn2" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconWorkflow} Button 2</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn3">
          <button class="nf-btn">Button 3</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn4" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconSearch} Search</button>
        </li>
        <li data-overflow-role="item" data-menu-id="btn5" data-min-state-width="2.25rem">
          <button class="nf-btn">${iconSettings} Settings</button>
        </li>
      `}
    />
  ),
};
