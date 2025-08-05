import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { getAllStates, getCitiesByState, getTheatresByCity, getAllTheatres, addTheatre, updateTheatre, deleteTheatre, getTheatreById } from "../controllers/theatreController.js";

const theatreRouter = express.Router();

// Get all states
theatreRouter.get('/states', protectAdmin, getAllStates);

// Get cities by state
theatreRouter.get('/cities/:state', protectAdmin, getCitiesByState);

// Get theatres by city
theatreRouter.get('/city/:city', protectAdmin, getTheatresByCity);

// Get all theatres
theatreRouter.get('/all', protectAdmin, getAllTheatres);

// Get theatre by ID
theatreRouter.get('/:id', protectAdmin, getTheatreById);

// Add new theatre
theatreRouter.post('/add', protectAdmin, addTheatre);

// Update theatre
theatreRouter.put('/:id', protectAdmin, updateTheatre);

// Delete theatre
theatreRouter.delete('/:id', protectAdmin, deleteTheatre);

export default theatreRouter; 