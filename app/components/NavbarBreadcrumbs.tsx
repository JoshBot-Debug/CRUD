import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useLocation, Link as RouterLink } from "react-router";
import Link from "@mui/material/Link";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const queryCache = React.useRef<Record<string, string>>({});

  React.useEffect(() => {
    if (location.pathname && location.search)
      queryCache.current[location.pathname] = location.search;
  }, [location.pathname, location.search]);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Link
        underline="hover"
        color="inherit"
        component={RouterLink}
        to={`/dashboard${queryCache.current["/dashboard"] || ""}`}
      >
        Dashboard
      </Link>

      {pathnames.map((value, index) => {
        if (value == "dashboard") return null;

        const baseLink = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = value.charAt(0).toUpperCase() + value.slice(1);
        const savedSearch = queryCache.current[baseLink] || "";
        const destinationUrl = `${baseLink}${savedSearch}`;
        
        return isLast ? (
          <Typography key={baseLink} color="text.primary" sx={{ fontWeight: 600 }}>
            {label.replaceAll("-", " ")}
          </Typography>
        ) : (
          <Link
            key={baseLink}
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={destinationUrl}
          >
            {label.replaceAll("-", " ")}
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
