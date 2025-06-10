import React, { useContext, useEffect, useState } from "react";
import API from "../api/axiosInstance";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import ReactPlayer from "react-player";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Add Stream type
export type Stream = {
  _id?: string;
  teamAName: string;
  teamALogo: string;
  teamBName: string;
  teamBLogo: string;
  leagueName: string;
  startTime: string;
  startDate: string;
  streamUrl: string;
};

// Add this utility function at the top or outside the component
function getTimeUntilStart(startDate: string, startTime: string) {
  if (!startDate || !startTime) return "";
  const [day, month, year] = startDate.split("/").map(Number);
  let hour: number;
  const [h, m] = startTime
    .replace(/[^0-9:]/g, "")
    .split(":")
    .map(Number);
  hour = h;
  const minute = m;
  const isPM = startTime.toLowerCase().includes("pm");
  if (isPM && hour < 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  const matchDate = new Date(year, month - 1, day, hour, minute);
  const now = new Date();
  const diffMs = matchDate.getTime() - now.getTime();

  if (diffMs <= 0) return "Live";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0)
    return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  if (diffHours > 0)
    return `Starts in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  if (diffMins > 0)
    return `Starts in ${diffMins} min${diffMins > 1 ? "s" : ""}`;
  return "Live";
}

interface MatchCardProps {
  teamAName: string;
  teamBName: string;
  teamALogo: string;
  teamBLogo: string;
  leagueName: string;
  startTime: string;
  startDate: string;
  timeUntilStart: string;
  onClick: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  teamAName,
  teamBName,
  teamALogo,
  teamBLogo,
  leagueName,
  startTime,
  startDate,
  timeUntilStart,
  onClick,
}) => {
  const theme = useTheme();
  const [, setTick] = useState(0);
  const isDark = theme.palette.mode === "dark";
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card
      onClick={onClick}
      sx={{
        p: 1,
        borderRadius: 4,
        background: isDark
          ? "linear-gradient(120deg, #0f2027 0%, #2c5364 60%, #00c6ff 100%)"
          : "linear-gradient(120deg, #43cea2 0%, #185a9d 100%)",
        color: "#fff",
        boxShadow: isDark
          ? "0 8px 32px 0 rgba(0,198,255,0.18), 0 1.5px 8px 0 #232526"
          : "0 8px 32px 0 rgba(24,90,157,0.18), 0 1.5px 8px 0 #43cea2",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": {
          boxShadow: isDark
            ? "0 12px 40px 0 #00c6ff88, 0 2px 12px 0 #232526"
            : "0 12px 40px 0 #43cea288, 0 2px 12px 0 #185a9d",
        },
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography
          variant="caption"
          textAlign="center"
          mb={1}
          sx={{
            fontWeight: 700,
            color: "#ffeb3b",
            fontSize: "0.9rem",
            letterSpacing: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: "0 1px 4px #0008",
            textTransform: "uppercase",
          }}
        >
          {leagueName}
        </Typography>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={0}
          wrap="nowrap"
        >
          <Grid sx={{ textAlign: "center" }}>
            <Avatar
              src={teamALogo || "https://placehold.co/40x40?text=Logo"}
              alt={teamAName}
              sx={{
                width: 36,
                height: 36,
                mx: "auto",
                border: "2px solid #ffeb3b",
                background: isDark ? "#222" : "#fff",
                boxShadow: "0 2px 8px #0004",
              }}
            />
            <Typography
              variant="caption"
              noWrap
              sx={{
                fontWeight: 700,
                mt: 0.5,
                fontSize: "0.85rem",
                color: "#fff",
                letterSpacing: 0.5,
                textShadow: "0 1px 4px #0008",
                textTransform: "uppercase",
              }}
            >
              {teamAName}
            </Typography>
          </Grid>
          <Grid sx={{ textAlign: "center" }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#ffeb3b",
                  textShadow: "0 1px 4px #0008",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {startTime}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#fff",
                  opacity: 0.85,
                  textShadow: "0 1px 4px #0008",
                }}
              >
                {startDate}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.8rem",
                  mt: 0.2,
                  color: "#00e676",
                  fontWeight: 700,
                  textShadow: "0 1px 4px #0008",
                  letterSpacing: 0.5,
                  display: "block",
                }}
              >
                {timeUntilStart}
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ textAlign: "center" }}>
            <Avatar
              src={teamBLogo || "https://placehold.co/40x40?text=Logo"}
              alt={teamBName}
              sx={{
                width: 36,
                height: 36,
                mx: "auto",
                border: "2px solid #ffeb3b",
                background: isDark ? "#222" : "#fff",
                boxShadow: "0 2px 8px #0004",
              }}
            />
            <Typography
              variant="caption"
              noWrap
              sx={{
                fontWeight: 700,
                mt: 0.5,
                fontSize: "0.85rem",
                color: "#fff",
                letterSpacing: 0.5,
                textShadow: "0 1px 4px #0008",
                textTransform: "uppercase",
              }}
            >
              {teamBName}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Dummy Sports and Categories Components
const Sports: React.FC = () => (
  <Box p={2}>
    <Typography variant="h6" mb={2}>
      Sports Channels
    </Typography>
    <ul>
      <li>Star Sports 1</li>
      <li>ESPN</li>
      <li>Willow Cricket</li>
      <li>Sky Sports</li>
      <li>Ten Sports</li>
    </ul>
  </Box>
);

const Categories: React.FC = () => (
  <Box p={2}>
    <Typography variant="h6" mb={2}>
      Categories
    </Typography>
    <ul>
      <li>Sports</li>
      <li>News</li>
      <li>Movies</li>
      <li>Kids</li>
      <li>Music</li>
      <li>Entertainment</li>
      <li>Documentary</li>
    </ul>
  </Box>
);

const Streams: React.FC = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamUrl, setSelectedStreamUrl] = useState<string>("");
  const [tab, setTab] = useState<number>(0);
  const [filter, setFilter] = useState<string>("all");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = mode === "dark";
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Add types to fetchAllStreams
  const fetchAllStreams = async (): Promise<Stream[]> => {
    try {
      const response = await API.get<Stream[]>("/getAllStreams");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch streams:", error);
      return [];
    }
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Theme toggler
  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  // Example filter logic (replace with your real data logic)
  const filteredMatches = streams.filter((match: Stream) => {
    const timeStatus = getTimeUntilStart(
      match.startDate,
      match.startTime
    ).toLowerCase();
    if (filter === "all") return true;
    if (filter === "upcoming") return timeStatus.startsWith("starts in");
    if (filter === "live") return timeStatus === "live";
    if (filter === "recent") return timeStatus === "ended";
    return true;
  });

  const isAdmin = JSON.parse(localStorage.getItem("isAdmin") || "false");

  useEffect(() => {
    fetchAllStreams().then((data) => setStreams(data));
  }, []);
  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: isDark
            ? "linear-gradient(120deg, #0f2027 0%, #2c5364 60%, #00c6ff 100%)"
            : "linear-gradient(120deg, #fffbe6 0%, #f5f7fa 60%, #e3f0ff 100%)",
          transition: "background 0.3s",
        }}
      />
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          pb: 8,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "transparent", // Make container background transparent
        }}
      >
        {/* Profile Icon at top right */}
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              color: isDark ? "#ffd600" : "#1976d2",
              fontSize: 32,
            }}
            size="large"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {isAdmin && (
              <MenuItem
                onClick={() => {
                  handleProfileMenuClose();
                  navigate("/admin");
                }}
              >
                Go to Admin Dashboard
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                setMode(isDark ? "light" : "dark");
                handleProfileMenuClose();
              }}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                handleProfileMenuClose();
              }}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </MenuItem>
          </Menu>
        </Box>
        {!selectedStreamUrl && (
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{
              color: isDark ? "#ffeb3b" : "#1976d2",
              textShadow: isDark ? "0 2px 8px #000a" : "0 2px 8px #fff",
              letterSpacing: 2,
              fontWeight: 800,
              // textTransform: "uppercase",
            }}
          >
            JaaLi
          </Typography>
        )}

        {/* Filter Bar */}
        {tab === 0 && !selectedStreamUrl && (
          <Box mb={2} display="flex" justifyContent="center">
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_, val) => val && setFilter(val)}
              size="small"
              color="primary"
              sx={{
                background: isDark ? "#1e2a38" : "#f5f7fa",
                borderRadius: 2,
                boxShadow: "0 2px 8px 0 #0002",
                "& .MuiToggleButton-root": {
                  color: isDark ? "#1976d2" : "#1976d2",
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  "&.Mui-selected": {
                    color: isDark ? "#fff" : "#fff",
                    background: isDark ? "#1976d2" : "#1976d2",
                  },
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="upcoming">Upcoming</ToggleButton>
              <ToggleButton value="live">Live</ToggleButton>
              <ToggleButton value="recent">Recent</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Scrollable Matches List */}
        {tab === 0 && !selectedStreamUrl && (
          <Box
            flex={1}
            minHeight={0}
            width="100%"
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              pr: 0,
              mr: 0,
              "& > *": { width: "100%" },
            }}
          >
            {filteredMatches.map((match: Stream) => (
              <Box
                key={match._id}
                mb={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <MatchCard
                  teamAName={match.teamAName}
                  teamBName={match.teamBName}
                  teamALogo={match.teamALogo}
                  teamBLogo={match.teamBLogo}
                  leagueName={match.leagueName}
                  startTime={match.startTime}
                  startDate={match.startDate}
                  timeUntilStart={getTimeUntilStart(
                    match.startDate,
                    match.startTime
                  )}
                  onClick={() => setSelectedStreamUrl(match.streamUrl)}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Stream Player */}
        {tab === 0 &&
          selectedStreamUrl &&
          (() => {
            // Find the current match for display
            const currentMatch = streams.find(
              (m: Stream) => m.streamUrl === selectedStreamUrl
            );
            const matchTitle = currentMatch
              ? `${currentMatch.teamAName} vs ${currentMatch.teamBName}`
              : "Now Streaming";
            return (
              <Box mt={4}>
                <Button
                  onClick={() => setSelectedStreamUrl("")}
                  sx={{
                    color: isDark ? "#1976d2" : "#fff",
                    backgroundColor: isDark ? "#ffeb3b" : "#1976d2",
                    mb: 2,
                    fontWeight: 700,
                    "&:hover": {
                      backgroundColor: isDark ? "#ffe066" : "#115293",
                    },
                  }}
                  aria-label="Back"
                  size={isMobile ? "small" : "medium"}
                >
                  Back to matches
                </Button>
                <Typography
                  variant="h6"
                  textAlign="center"
                  mb={2}
                  sx={{
                    color: isDark ? "#ffeb3b" : "#1976d2",
                    textShadow: isDark ? "0 2px 8px #000a" : "0 2px 8px #fff",
                    letterSpacing: 1,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {matchTitle}
                </Typography>

                <ReactPlayer
                  url={selectedStreamUrl}
                  playing
                  controls
                  width="100%"
                  height={isMobile ? "240px" : "450px"}
                  style={{
                    background: isDark ? "#111" : "#fff",
                    borderRadius: 8,
                    boxShadow: isDark
                      ? "0 2px 16px #000a"
                      : "0 2px 16px #1976d222",
                  }}
                />
              </Box>
            );
          })()}

        {tab === 1 && <Sports />}
        {tab === 2 && <Categories />}

        {/* Bottom Navigation */}
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: isDark
              ? "linear-gradient(90deg, #0f2027 0%, #2c5364 60%, #00c6ff 100%)"
              : "linear-gradient(90deg, #fffbe6 0%, #e3f0ff 100%)",
            transition: "background 0.3s",
          }}
          elevation={3}
        >
          <BottomNavigation
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            showLabels
            sx={{
              background: "transparent",
            }}
          >
            <BottomNavigationAction
              label="Live Events"
              icon={
                <SvgIcon>
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill={isDark ? "#ffeb3b" : "#1976d2"}
                  />
                </SvgIcon>
              }
              sx={{
                color: isDark ? "#ffeb3b" : "#1976d2",
                fontWeight: 700,
              }}
            />
            <BottomNavigationAction
              label="Sports"
              icon={
                <SvgIcon>
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    fill={isDark ? "#00e676" : "#43cea2"}
                  />
                </SvgIcon>
              }
              sx={{
                color: isDark ? "#00e676" : "#43cea2",
                fontWeight: 700,
              }}
            />
            <BottomNavigationAction
              label="Categories"
              icon={
                <SvgIcon>
                  <rect
                    x="8"
                    y="8"
                    width="8"
                    height="8"
                    fill={isDark ? "#ffd600" : "#185a9d"}
                  />
                </SvgIcon>
              }
              sx={{
                color: isDark ? "#ffd600" : "#185a9d",
                fontWeight: 700,
              }}
            />
          </BottomNavigation>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Streams;
