import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "~/components/MenuContent";
import OptionsMenu from "~/components/OptionsMenu";
import Logo from "./Logo";
import { useLoaderData, useSubmit } from "react-router";
import { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const submit = useSubmit();
  const loaderData = useLoaderData();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <Logo />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {loaderData.user?.profileImage ? (
          <Avatar
            sizes="small"
            src={loaderData.user?.profileImage}
            sx={{ width: 36, height: 36 }}
          />
        ) : (
          <Avatar sizes="small" sx={{ width: 36, height: 36 }}>
            {loaderData.user?.name?.[0].toUpperCase()}
          </Avatar>
        )}
        <Box
          sx={{
            mr: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {loaderData.user?.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {loaderData.user?.email}
          </Typography>
        </Box>
        <OptionsMenu
          menuItems={[
            { label: "Profile" },
            { label: "My account", seperator: true },
            { label: "Settings", seperator: true },
            {
              label: "Logout",
              onClick: () =>
                submit({}, { method: "POST", action: "/sign-out" }),
              sx: {
                [`& .${listItemIconClasses.root}`]: {
                  ml: "auto",
                  minWidth: 0,
                },
              },
              endIcon: <LogoutRoundedIcon fontSize="small" />,
            },
          ]}
        />
      </Stack>
    </Drawer>
  );
}
