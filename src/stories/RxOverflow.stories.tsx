import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlignLeft, Search, Settings, Workflow } from 'lucide-react';
import { RxOverflow, RxOverflowItem, RxOverflowMenu } from '../components/RxOverflow';
import "../components/RxOverflow/rx.css";


const MoreDots = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="5" cy="12" r="2.5" />
    <circle cx="12" cy="12" r="2.5" />
    <circle cx="19" cy="12" r="2.5" />
  </svg>
);

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
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="btn1">
            <button className="rx-menu-item"><AlignLeft size={18} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn2">
            <button className="rx-menu-item"><Workflow size={18} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn3">
            <button className="rx-menu-item">Button 3</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuId="btn1">
          <button className="rx-btn">
            <AlignLeft size={20} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn2">
          <button className="rx-btn">
            <Workflow size={20} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn3">
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
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="btn1">
            <button className="rx-menu-item"><AlignLeft size={18} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn2">
            <button className="rx-menu-item"><Workflow size={18} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn3">
            <button className="rx-menu-item"><Settings size={18} /> Button 3</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuId="btn1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={20} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={20} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn3" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={20} />
            Button 3
          </button>
        </RxOverflowItem>
      </>
    ),
  },
};

export const Snap: Story = {
  args: {
    snap: true,
    style: { gap: 8 },
    children: (
      <>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="btn1">
            <button className="rx-menu-item"><AlignLeft size={18} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn2">
            <button className="rx-menu-item"><Workflow size={18} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn3">
            <button className="rx-menu-item"><Settings size={18} /> Button 3</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuId="btn1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={20} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={20} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn3" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={20} />
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
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="btn1">
            <button className="rx-menu-item"><AlignLeft size={18} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn2">
            <button className="rx-menu-item"><Workflow size={18} /> Button 2</button>
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
        <RxOverflowItem menuId="btn1">
          <button className="rx-btn">
            <AlignLeft size={20} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn2">
          <button className="rx-btn">
            <Workflow size={20} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem>
          <button className="rx-btn">
            <Search size={20} />
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
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="btn1">
            <button className="rx-menu-item"><AlignLeft size={18} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn2">
            <button className="rx-menu-item"><Workflow size={18} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn3">
            <button className="rx-menu-item">Button 3</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn4">
            <button className="rx-menu-item"><Search size={18} /> Search</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn5">
            <button className="rx-menu-item"><Settings size={18} /> Settings</button>
          </RxOverflowItem>
          <RxOverflowItem>
            <div className="rx-separator" role="separator" />
          </RxOverflowItem>
          <RxOverflowItem>
            <button className="rx-menu-item">Help</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuId="btn1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={20} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={20} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn3">
          <button className="rx-btn">Button 3</button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn4" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Search size={20} />
            Search
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn5" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={20} />
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
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="L1">
            <button className="rx-menu-item"><AlignLeft size={18} /> Format</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="L2">
            <button className="rx-menu-item"><Workflow size={18} /> Filters</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="L3">
            <button className="rx-menu-item"><Settings size={18} /> Views</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuId="L1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={20} />
            Format
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="L2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={20} />
            Filters
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="L3" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={20} />
            Views
          </button>
        </RxOverflowItem>
      </RxOverflow>

      <RxOverflow compact style={{ minWidth: 0 }}>
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="R1">
            <button className="rx-menu-item"><Search size={18} /> Search</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="R2">
            <button className="rx-menu-item"><Settings size={18} /> Settings</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="R3">
            <button className="rx-menu-item"><AlignLeft size={18} /> Help</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuId="R1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Search size={20} />
            Search
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="R2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={20} />
            Settings
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="R3" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={20} />
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
        <RxOverflowMenu opener={<button className="rx-btn"><MoreDots /></button>}>
          <RxOverflowItem menuId="btn1">
            <button className="rx-menu-item"><AlignLeft size={18} /> Button 1</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn2">
            <button className="rx-menu-item"><Workflow size={18} /> Button 2</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn3">
            <button className="rx-menu-item">Button 3</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn4">
            <button className="rx-menu-item"><Search size={18} /> Search</button>
          </RxOverflowItem>
          <RxOverflowItem menuId="btn5">
            <button className="rx-menu-item"><Settings size={18} /> Settings</button>
          </RxOverflowItem>
          <RxOverflowItem>
            <div className="rx-separator" role="separator" />
          </RxOverflowItem>
          <RxOverflowItem>
            <button className="rx-menu-item">Help</button>
          </RxOverflowItem>
        </RxOverflowMenu>
        <RxOverflowItem menuId="btn1" minStateWidth="2.25rem">
          <button className="rx-btn">
            <AlignLeft size={20} />
            Button 1
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn2" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Workflow size={20} />
            Button 2
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn3">
          <button className="rx-btn">Button 3</button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn4" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Search size={20} />
            Search
          </button>
        </RxOverflowItem>
        <RxOverflowItem menuId="btn5" minStateWidth="2.25rem">
          <button className="rx-btn">
            <Settings size={20} />
            Settings
          </button>
        </RxOverflowItem>
      </>
    ),
  },
};
