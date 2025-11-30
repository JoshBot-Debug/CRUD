import * as React from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem, { type MenuItemProps } from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "./MenuButton";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import type { PopoverPosition, PopoverReference } from "@mui/material/Popover";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export type OptionsMenuItem = Omit<MenuItemProps, "onClick"> & {
  label: string | React.ReactNode;
  seperator?: boolean;
  onClick?: (close: () => void) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

interface Props {
  label?: string;
  open?: boolean;
  anchorPosition?: PopoverPosition | null;
  anchorElement?: HTMLElement | null;
  anchorReference?: PopoverReference;
  onClose?: (value: null) => void;
  menuItems: Array<OptionsMenuItem>;
}

export default function OptionsMenu(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const anchorElement = props.anchorElement ?? anchorEl;
  const open = props.open ?? Boolean(anchorElement);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    if (props.onClose) props.onClose(null);
  };
  return (
    <React.Fragment>
      {!!props.label ? (
        <Button
          aria-label="Open menu"
          onClick={handleClick}
          sx={{ borderColor: "transparent" }}
          variant="text"
          disabled={!props.menuItems.length}
        >
          {props.label}
        </Button>
      ) : (
        <MenuButton
          hidden={props.open !== undefined}
          aria-label="Open menu"
          onClick={handleClick}
          sx={{ borderColor: "transparent" }}
          disabled={!props.menuItems.length}
        >
          <MoreVertRoundedIcon />
        </MenuButton>
      )}

      <Menu
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorReference={props.anchorReference}
        anchorPosition={props.anchorPosition || undefined}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        {props.menuItems.flatMap((props, i) => {
          const result = [
            <MenuItem
              key={`${i}-item`}
              {...props}
              onClick={() =>
                props.onClick ? props.onClick(handleClose) : handleClose()
              }
            >
              {!props.children && (
                <>
                  {props.startIcon && (
                    <ListItemIcon sx={{ mr: 1 }}>
                      {props.startIcon}
                    </ListItemIcon>
                  )}
                  <ListItemText>{props.label}</ListItemText>
                  {props.endIcon && (
                    <ListItemIcon sx={{ ml: 1 }}>{props.endIcon}</ListItemIcon>
                  )}
                </>
              )}
              {!props.children && props.children}
            </MenuItem>,
          ];

          if (props.seperator)
            result.push(<Divider key={`${props.label}-divider`} />);

          return result;
        })}
      </Menu>
    </React.Fragment>
  );
}
