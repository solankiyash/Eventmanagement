import React, { useEffect, useState } from "react";
import axios from "axios";
import {
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
  Box,
  Stack,
  IconButton,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

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
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    date: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    date: false,
  });

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
          `${import.meta.env.VITE_API_URL}/api/events/getevent`,
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

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Event name is required";
        if (value.length < 3) return "Event name must be at least 3 characters";
        return "";
      case "description":
        if (!value.trim()) return "Description is required";
        if (value.length < 10)
          return "Description must be at least 10 characters";
        return "";
      case "date":
        if (!value) return "Date is required";
        const selectedDate = new Date(value);
        const now = new Date();
        if (selectedDate < now) return "Date cannot be in the past";
        return "";
      default:
        return "";
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Update field value
    switch (name) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "date":
        setDate(value);
        break;
    }

    // Validate if touched
    if (touched[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    let value;
    switch (field) {
      case "name":
        value = name;
        break;
      case "description":
        value = description;
        break;
      case "date":
        value = date;
        break;
    }

    setFormErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const isFormValid = () => {
    const errors = {
      name: validateField("name", name),
      description: validateField("description", description),
      date: validateField("date", date),
    };
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleCreate = async () => {
    // Set all fields as touched
    setTouched({
      name: true,
      description: true,
      date: true,
    });

    // Validate all fields
    const errors = {
      name: validateField("name", name),
      description: validateField("description", description),
      date: validateField("date", date),
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    const eventData = { name, description, date };

    if (!token) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/create`,
        eventData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents([...events, response.data]);
      setName("");
      setDescription("");
      setDate("");
      setTouched({
        name: false,
        description: false,
        date: false,
      });
      setFormErrors({
        name: "",
        description: "",
        date: "",
      });
      setSnackbarMessage("Event created successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "Error creating event"
      );
      setOpenSnackbar(true);
    }
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    console.log(id);

    if (!token) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
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
    // Format the date to match datetime-local input format
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toISOString().slice(0, 16);
    setDate(formattedDate);
    setOpenDialog(true);
  };

  // Handle event update
  const handleUpdate = async () => {
    if (!token || !editEventId) return;

    const updatedEvent = { name, description, date };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/events/${editEventId}`,
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
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 300 }}>
          Events
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
          <IconButton onClick={handleLogout} color="error" size="small">
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Search and Create Section */}
      <Card sx={{ mb: 4, backgroundColor: "#f8f9fa" }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ mb: 4 }}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                variant="outlined"
                fullWidth
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "12px",
                    backgroundColor: "white",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Event Name"
                name="name"
                value={name}
                onChange={handleFieldChange}
                onBlur={() => handleBlur("name")}
                error={touched.name && !!formErrors.name}
                helperText={touched.name && formErrors.name}
                size="small"
                sx={{ flex: 1, minWidth: "200px", backgroundColor: "white" }}
              />
              <TextField
                label="Event Description"
                name="description"
                value={description}
                onChange={handleFieldChange}
                onBlur={() => handleBlur("description")}
                error={touched.description && !!formErrors.description}
                helperText={touched.description && formErrors.description}
                size="small"
                sx={{ flex: 2, minWidth: "200px", backgroundColor: "white" }}
              />
              <TextField
                label="Event Date"
                name="date"
                type="datetime-local"
                value={date}
                onChange={handleFieldChange}
                onBlur={() => handleBlur("date")}
                error={touched.date && !!formErrors.date}
                helperText={touched.date && formErrors.date}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: "200px", backgroundColor: "white" }}
              />
              <Button
                onClick={handleCreate}
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!isFormValid()}
                sx={{
                  height: "40px",
                  backgroundColor: "#2196f3",
                  "&:hover": { backgroundColor: "#1976d2" },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                  },
                }}
              >
                Create
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Events Table */}
      <TableContainer component={Card} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Event Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.filter((event) =>
              event.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No events found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              events
                .filter((event) =>
                  event.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((event) => (
                  <TableRow key={event._id} hover>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(event)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(event._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          Edit Event
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Event Date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained">
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
    </Box>
  );
};

export default Dashboard;
