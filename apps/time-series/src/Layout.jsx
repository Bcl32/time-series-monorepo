import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet } from "react-router-dom";

import { styled, useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CssBaseline from "@mui/material/CssBaseline";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import DatasetIcon from "@mui/icons-material/Dataset";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Layout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="site-wrapper">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {/* ENTER APPBAR TITLE HERE */}
              <p id="appBarText">Home</p>
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>

          <Divider />

          <List component="nav">
            <Link to="/">
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </Link>

            <Link to="/AllCollections">
              <ListItemButton>
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary="Collections" />
              </ListItemButton>
            </Link>

            <Link to="/AllDatafeeds">
              <ListItemButton>
                <ListItemIcon>
                  <RssFeedIcon />
                </ListItemIcon>
                <ListItemText primary="Datafeeds" />
              </ListItemButton>
            </Link>

            <Link to="/AllDatasets">
              <ListItemButton>
                <ListItemIcon>
                  <DatasetIcon />
                </ListItemIcon>
                <ListItemText primary="Datasets" />
              </ListItemButton>
            </Link>

            <Link to="/AllAnomalies">
              <ListItemButton>
                <ListItemIcon>
                  <PrivacyTipIcon />
                </ListItemIcon>
                <ListItemText primary="Anomalies" />
              </ListItemButton>
            </Link>

            <Link to="/AllPredictions">
              <ListItemButton>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Predictions" />
              </ListItemButton>
            </Link>

            <Link to="/AllDetectors">
              <ListItemButton>
                <ListItemIcon>
                  <TroubleshootIcon />
                </ListItemIcon>
                <ListItemText primary="Detectors" />
              </ListItemButton>
            </Link>

            <Link to="/AllHealth">
              <ListItemButton>
                <ListItemIcon>
                  <HealthAndSafetyIcon />
                </ListItemIcon>
                <ListItemText primary="Health" />
              </ListItemButton>
            </Link>

            <Divider sx={{ my: 1 }} />

            {/* <ListSubheader component="div" inset>
              Saved reports
            </ListSubheader>
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Current month" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Last quarter" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Year-end sale" />
            </ListItemButton> */}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <main>
            <Outlet />
          </main>
        </Box>
      </Box>
    </div>
  );
}
