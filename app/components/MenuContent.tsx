import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { Link, useLocation } from "react-router";
import { MainMenuItems, SecondaryMenuItems } from "~/menu";

export default function MenuContent() {
  const location = useLocation();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {MainMenuItems.map((item, index) => (
          <Link key={index} to={item.to}>
            <ListItem disablePadding sx={{ display: "block", mb: 1 }}>
              <ListItemButton selected={location.pathname.startsWith(item.to)}>
                <ListItemIcon>{item.Icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <List dense>
        {SecondaryMenuItems.map((item, index) => (
          <Link key={index} to={item.to}>
            <ListItem disablePadding sx={{ display: "block", mb: 1 }}>
              <ListItemButton>
                <ListItemIcon>{item.Icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Stack>
  );
}
