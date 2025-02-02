import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  TableBody,
  Typography,
  Button,
  TextField,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        console.error("Token not found. User might not be logged in.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/events/getevent",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error.response.data);
      }
    };

    fetchEvents();
  }, [token]);

  // Handle form submission to create a new event
  const handleCreate = async () => {
    const eventData = { name, description, date };

    if (!token) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/create",
        eventData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents([...events, response.data]);
      setName("");
      setDescription("");
      setDate("");
      setSnackbarMessage("Event created successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error creating event:", error.response.data);
    }
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    console.log(id);

    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event._id !== id));
      setSnackbarMessage("Event deleted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting event:", error.response.data);
    }
  };

  // Open edit model for update daata
  const handleEditClick = (event) => {
    setEditEventId(event._id);
    setName(event.name);
    setDescription(event.description);
    setDate(event.date);
    setOpenDialog(true);
  };

  // Handle event update
  const handleUpdate = async () => {
    if (!token || !editEventId) return;

    const updatedEvent = { name, description, date };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/events/${editEventId}`,
        updatedEvent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents(
        events.map((event) =>
          event._id === editEventId ? response.data : event
        )
      );
      setOpenDialog(false);
      setSnackbarMessage("Event updated successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating event:", error.response.data);
    }
  };

  // logout

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container>
      <Typography variant="h4">Event Dashboard </Typography>
      <span style={{ display: "flex", justifyContent: "end" }}>
        <Button onClick={handleLogout} color="error">
          Logout
        </Button>
      </span>
      <p style={{ textAlign: "end" }}>{email.slice(0, 5)}</p>
      {/* for search input */}
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        label="Search Events"
        fullWidth
        margin="normal"
      />

      {/* Create Event Form */}
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Create Event
      </Typography>
      <TextField
        label="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Event Date"
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button
        onClick={handleCreate}
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
      >
        Create Event
      </Button>

      <TableContainer component={Paper} style={{ marginTop: "30px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.filter((event) =>
              event.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              events
                .filter((event) =>
                  event.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditClick(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(event._id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* model open for edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Dashboard;
