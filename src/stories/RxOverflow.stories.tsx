import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlignLeft, MoreHorizontal, Search, Settings, Workflow } from 'lucide-react';
import { RxOverflow, RxOverflowItem, RxOverflowMenu } from '../components/RxOverflow';

const meta: Meta<typeof RxOverflow> = {
  title: 'Components/RxOverflow',
  component: RxOverflow,
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

type Story = StoryObj<typeof RxOverflow>;

export const Default: Story = {
  args: {
    style: { gap: 8 },
    children: (
      <>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreHorizontal size={16} /></button>}>
          <RxOverflowItem menuid="btn1">
            <button className="rx-menu-item"><AlignLeft size={14} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn2">
            <button className="rx-menu-item"><Workflow size={14} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn3">
            <button className="rx-menu-item">Button 3</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuid="btn1">
          <button className="rx-btn">
            <AlignLeft size={16} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn2">
          <button className="rx-btn">
            <Workflow size={16} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn3">
          <button className="rx-btn">Button 3</button>
        </RxOverflowItem>
      </>
    ),
  },
};

export const MinState: Story = {
  args: {
    style: { gap: 8 },
    children: (
      <>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreHorizontal size={16} /></button>}>
          <RxOverflowItem menuid="btn1">
            <button className="rx-menu-item"><AlignLeft size={14} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn2">
            <button className="rx-menu-item"><Workflow size={14} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn3">
            <button className="rx-menu-item"><Settings size={14} /> Button 3</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuid="btn1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={16} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={16} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn3" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={16} />
            Button 3
          </button>
        </RxOverflowItem>
      </>
    ),
  },
};

export const MenuOnly: Story = {
  args: {
    style: { gap: 8 },
    children: (
      <>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreHorizontal size={16} /></button>}>
          <RxOverflowItem menuid="btn1">
            <button className="rx-menu-item"><AlignLeft size={14} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn2">
            <button className="rx-menu-item"><Workflow size={14} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem>
            <div className="rx-separator" role="separator" />
          </RxOverflowItem>
          <RxOverflowItem>
            <button className="rx-menu-item">Help</button>
          </RxOverflowItem>
          <RxOverflowItem>
            <button className="rx-menu-item">About</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuid="btn1">
          <button className="rx-btn">
            <AlignLeft size={16} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn2">
          <button className="rx-btn">
            <Workflow size={16} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem>
          <button className="rx-btn">
            <Search size={16} />
            Search
          </button>
        </RxOverflowItem>
      </>
    ),
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    children: (
      <>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreHorizontal size={16} /></button>}>
          <RxOverflowItem menuid="btn1">
            <button className="rx-menu-item"><AlignLeft size={14} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn2">
            <button className="rx-menu-item"><Workflow size={14} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn3">
            <button className="rx-menu-item">Button 3</button>
          </RxOverflowItem>
          <RxOverflowItem>
            <div className="rx-separator" role="separator" />
          </RxOverflowItem>
          <RxOverflowItem>
            <button className="rx-menu-item">Help</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuid="btn1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={16} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={16} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn3">
          <button className="rx-btn">Button 3</button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn4" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Search size={16} />
            Search
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn5" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={16} />
            Settings
          </button>
        </RxOverflowItem>
      </>
    ),
  },
};

export const BothSides: Story = {
  render: () => (
    <>
      <RxOverflow compact reverse style={{ minWidth: 0 }}>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreHorizontal size={16} /></button>}>
          <RxOverflowItem menuid="L1">
            <button className="rx-menu-item"><AlignLeft size={14} /> Format</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="L2">
            <button className="rx-menu-item"><Workflow size={14} /> Filters</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="L3">
            <button className="rx-menu-item"><Settings size={14} /> Views</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuid="L1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={16} />
            Format
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="L2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={16} />
            Filters
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="L3" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={16} />
            Views
          </button>
        </RxOverflowItem>
      </RxOverflow>

      <RxOverflow compact style={{ minWidth: 0 }}>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreHorizontal size={16} /></button>}>
          <RxOverflowItem menuid="R1">
            <button className="rx-menu-item"><Search size={14} /> Search</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="R2">
            <button className="rx-menu-item"><Settings size={14} /> Settings</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="R3">
            <button className="rx-menu-item"><AlignLeft size={14} /> Help</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuid="R1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Search size={16} />
            Search
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="R2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={16} />
            Settings
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="R3" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={16} />
            Help
          </button>
        </RxOverflowItem>
      </RxOverflow>
    </>
  ),
};

export const Reverse: Story = {
  args: {
    compact: true,
    reverse: true,
    children: (
      <>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreHorizontal size={16} /></button>}>
          <RxOverflowItem menuid="btn1">
            <button className="rx-menu-item"><AlignLeft size={14} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn2">
            <button className="rx-menu-item"><Workflow size={14} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuid="btn3">
            <button className="rx-menu-item">Button 3</button>
          </RxOverflowItem>
          <RxOverflowItem>
            <div className="rx-separator" role="separator" />
          </RxOverflowItem>
          <RxOverflowItem>
            <button className="rx-menu-item">Help</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuid="btn1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={16} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={16} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn3">
          <button className="rx-btn">Button 3</button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn4" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Search size={16} />
            Search
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuid="btn5" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={16} />
            Settings
          </button>
        </RxOverflowItem>
      </>
    ),
  },
};
