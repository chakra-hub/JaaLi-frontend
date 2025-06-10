// pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

type StreamForm = {
  _id: string | null;
  teamAName: string;
  teamALogo: string;
  teamBName: string;
  teamBLogo: string;
  leagueName: string;
  startTime: string;
  startDate: string;
  timeUntilStart: string;
  streamUrl: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<StreamForm[]>([]);
  const [form, setForm] = useState<StreamForm | null>(null);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const res = await API.get("/getAllStreams");
      setStreams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (form?._id) {
        await API.put(`/updateStream`, form);
      } else {
        await API.post("/stream", form);
      }
      setForm({
        _id: null,
        teamAName: "",
        teamALogo: "",
        teamBName: "",
        teamBLogo: "",
        leagueName: "",
        startTime: "",
        startDate: "",
        timeUntilStart: "",
        streamUrl: "",
      }); // Clear form after create
      fetchStreams();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/deleteStream/${id}`);
      fetchStreams();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (stream: StreamForm) => {
    setForm(stream);
  };
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Admin Stream Management
      </Typography>
      <Box mb={2} display="flex" alignItems="center">
        <Button variant="outlined" onClick={() => navigate("/")}>
          Back
        </Button>
        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() =>
            setForm({
              _id: null,
              teamAName: "",
              teamALogo: "",
              teamBName: "",
              teamBLogo: "",
              leagueName: "",
              startTime: "",
              startDate: "",
              timeUntilStart: "",
              streamUrl: "",
            })
          }
        >
          Create New Stream
        </Button>
      </Box>
      {/* Form */}
      {form && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {form._id ? "Edit Stream" : "Add New Stream"}
          </Typography>

          <Grid container spacing={2}>
            {[
              "leagueName",
              "teamAName",
              "teamBName",
              "startTime",
              "startDate",
              "timeUntilStart",
              "streamUrl",
              "teamALogo",
              "teamBLogo",
            ].map((field) => (
              <Grid key={field}>
                <TextField
                  label={field}
                  name={field}
                  fullWidth
                  value={form[field as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={2}>
            <Button variant="contained" onClick={handleSubmit}>
              {form._id ? "Update" : "Add"}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Stream List */}
      <Typography variant="h5" gutterBottom>
        Existing Streams
      </Typography>

      {streams.map((stream: StreamForm) => (
        <Paper key={stream._id} elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">
            {stream.teamAName} vs {stream.teamBName} ({stream.leagueName})
          </Typography>
          <Typography variant="body2">Date: {stream.startDate}</Typography>
          <Typography variant="body2">Time: {stream.startTime}</Typography>
          <Box mt={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleEdit(stream)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDelete(stream._id!)}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default AdminDashboard;
