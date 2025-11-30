import type React from "react";
import { Icon } from "./icons";

export type MainMenuItem = {
  label: string;
  Icon: React.ReactNode;
  to: string;
};

export const MainMenuItems: MainMenuItem[] = [
  { label: "Dashboard", Icon: Icon.Dashboard, to: "/dashboard" },
  { label: "Users", Icon: Icon.Users, to: "/users" },
  { label: "Security", Icon: Icon.Security, to: "/security" },
];

export const SecondaryMenuItems: MainMenuItem[] = [
  { label: "Settings", Icon: Icon.Settings, to: "#" },
];
