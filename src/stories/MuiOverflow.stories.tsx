import { BlurLinear, MoreHoriz, Search, Settings, Workspaces } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MuiOverflow, MuiOverflowItem, MuiOverflowMenu } from '../components/MuiOverflow';

const meta: Meta<typeof MuiOverflow> = {
  title: 'Components/MuiOverflow',
  component: MuiOverflow,
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

type Story = StoryObj<typeof MuiOverflow>;

export const Default: Story = {
  args: {
    sx: { gap: 1 },
    children: (
      <>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="btn1">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Button 1</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn2">
            <MenuItem sx={{ gap: 1 }}><Workspaces /> Button 2</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn3">
            <MenuItem>Button 3</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="btn1">
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Button 1
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn2">
          <Button variant="contained" sx={{ gap: 1 }}>
            <Workspaces />
            Button 2
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn3">
          <Button variant="contained">Button 3</Button>
        </MuiOverflowItem>
      </>
    ),
  },
};

export const AlwaysVisible: Story = {
  args: {
    sx: { gap: 1 },
    children: (
      <>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="btn1">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Button 1</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn2">
            <MenuItem sx={{ gap: 1 }}><Workspaces /> Button 2</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="btn1">
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Button 1
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn2">
          <Button variant="contained" sx={{ gap: 1 }}>
            <Workspaces />
            Button 2
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Search />
            Search
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Settings />
            Settings
          </Button>
        </MuiOverflowItem>
      </>
    ),
  },
};

export const MenuOnly: Story = {
  args: {
    sx: { gap: 1 },
    children: (
      <>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="btn1">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Button 1</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn2">
            <MenuItem sx={{ gap: 1 }}><Workspaces /> Button 2</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem>
            <Divider />
          </MuiOverflowItem>
          <MuiOverflowItem>
            <MenuItem>Help</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem>
            <MenuItem>About</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="btn1">
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Button 1
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn2">
          <Button variant="contained" sx={{ gap: 1 }}>
            <Workspaces />
            Button 2
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Search />
            Search
          </Button>
        </MuiOverflowItem>
      </>
    ),
  },
};

export const MinState: Story = {
  args: {
    sx: { gap: 1 },
    children: (
      <>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="btn1">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Button 1</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn2">
            <MenuItem sx={{ gap: 1 }}><Workspaces /> Button 2</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn3">
            <MenuItem sx={{ gap: 1 }}><Settings /> Button 3</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="btn1" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Button 1
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn2" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Workspaces />
            Button 2
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn3" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Settings />
            Button 3
          </Button>
        </MuiOverflowItem>
      </>
    ),
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    children: (
      <>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="btn1">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Button 1</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn2">
            <MenuItem sx={{ gap: 1 }}><Workspaces /> Button 2</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn3">
            <MenuItem>Button 3</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn4">
            <MenuItem sx={{ gap: 1 }}><Search /> Search</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn5">
            <MenuItem sx={{ gap: 1 }}><Settings /> Settings</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem>
            <Divider />
          </MuiOverflowItem>
          <MuiOverflowItem>
            <MenuItem>Help</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="btn1" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Button 1
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn2" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Workspaces />
            Button 2
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn3">
          <Button variant="contained">Button 3</Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn4" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Search />
            Search
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn5" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Settings />
            Settings
          </Button>
        </MuiOverflowItem>
      </>
    ),
  },
};

export const BothSides: Story = {
  render: () => (
    <>
      <MuiOverflow compact reverse sx={{ minWidth: 0 }}>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="L1">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Format</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="L2">
            <MenuItem sx={{ gap: 1 }}><Workspaces /> Filters</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="L3">
            <MenuItem sx={{ gap: 1 }}><Settings /> Views</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="L1" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Format
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="L2" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Workspaces />
            Filters
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="L3" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Settings />
            Views
          </Button>
        </MuiOverflowItem>
      </MuiOverflow>

      <MuiOverflow compact sx={{ minWidth: 0 }}>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="R1">
            <MenuItem sx={{ gap: 1 }}><Search /> Search</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="R2">
            <MenuItem sx={{ gap: 1 }}><Settings /> Settings</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="R3">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Help</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="R1" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Search />
            Search
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="R2" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Settings />
            Settings
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="R3" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Help
          </Button>
        </MuiOverflowItem>
      </MuiOverflow>
    </>
  ),
};

export const Reverse: Story = {
  args: {
    compact: true,
    reverse: true,
    children: (
      <>
        <MuiOverflowMenu
          opener={
            <Button variant="contained">
              <MoreHoriz />
            </Button>
          }
        >
          <MuiOverflowItem menuid="btn1">
            <MenuItem sx={{ gap: 1 }}><BlurLinear /> Button 1</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn2">
            <MenuItem sx={{ gap: 1 }}><Workspaces /> Button 2</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn3">
            <MenuItem>Button 3</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn4">
            <MenuItem sx={{ gap: 1 }}><Search /> Search</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem menuid="btn5">
            <MenuItem sx={{ gap: 1 }}><Settings /> Settings</MenuItem>
          </MuiOverflowItem>
          <MuiOverflowItem>
            <Divider />
          </MuiOverflowItem>
          <MuiOverflowItem>
            <MenuItem>Help</MenuItem>
          </MuiOverflowItem>
        </MuiOverflowMenu>
        <MuiOverflowItem menuid="btn1" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <BlurLinear />
            Button 1
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn2" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Workspaces />
            Button 2
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn3">
          <Button variant="contained">Button 3</Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn4" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Search />
            Search
          </Button>
        </MuiOverflowItem>
        <MuiOverflowItem menuid="btn5" minStateWidth={5}>
          <Button variant="contained" sx={{ gap: 1 }}>
            <Settings />
            Settings
          </Button>
        </MuiOverflowItem>
      </>
    ),
  },
};
