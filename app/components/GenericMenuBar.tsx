import { Button } from '@mui/material';
import * as React from 'react';

import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
} from '~/components/MenuBar';

// Define types for our dynamic menu structure
export interface MenuItemConfig {
  type?: 'item' | 'separator';
  component?: 'button' | 'checkbox';
  checked?: boolean;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: MenuItemConfig[]; // Nested sub-items
  closeOnClick?: boolean;
  icon?: React.ReactNode;
}

interface GenericIconButtonMenuProps {
  config: MenuItemConfig[];
  ariaLabel?: string;
}

// Inline SVG Three-line (hamburger) icon
const MenuIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// Recursive helper to handle submenus of any depth
function RenderMenuItems({ items }: { items: MenuItemConfig[] }) {
  return (
    <>
      {items.map((item, index) => {
        // 1. Render Separator
        if (item.type === 'separator') {
          return <MenuSeparator key={`separator-${index}`} />;
        }

        // 2. Render Submenu (if children are present)
        if (item.children && item.children.length > 0) {
          return (
            <MenuSubmenuRoot key={item.label || index}>
              <MenuSubmenuTrigger icon={item.icon}>{item.label}</MenuSubmenuTrigger>
              <MenuPortal>
                <MenuPositioner alignOffset={-4}>
                  <MenuPopup>
                    <RenderMenuItems items={item.children} />
                  </MenuPopup>
                </MenuPositioner>
              </MenuPortal>
            </MenuSubmenuRoot>
          );
        }

        // 3. Render Standard Action Item
        return (
          <MenuItem
            key={item.label || index}
            onClick={item.onClick}
            disabled={item.disabled}
            component={item.component}
            checked={item.checked}
            closeOnClick={item.closeOnClick}
            icon={item.icon}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </>
  );
}

// Unified menu component with the generic icon trigger
export default function GenericMenuBar({
  config,
  ariaLabel = "Open menu"
}: GenericIconButtonMenuProps) {
  return (
    <MenuRoot>
      <MenuTrigger aria-label={ariaLabel} style={{ minWidth: "auto" }}>
        <MenuIcon />
      </MenuTrigger>

      <MenuPortal>
        <MenuPositioner sideOffset={8} alignOffset={-54}>
          <MenuPopup>
            <RenderMenuItems items={config} />
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
}