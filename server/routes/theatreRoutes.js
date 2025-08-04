import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { 
    getAllTheatres, 
    getTheatresByState, 
    getTheatresByCity, 
    addTheatre, 
    updateTheatre, 
    deleteTheatre, 
    getTheatreById 
} from "../controllers/theatreController.js";

const theatreRouter = express.Router();

// Get all theatres
theatreRouter.get('/all', protectAdmin, getAllTheatres);

// Get theatres by state
theatreRouter.get('/state/:state', protectAdmin, getTheatresByState);

// Get theatres by city
theatreRouter.get('/city/:city', protectAdmin, getTheatresByCity);

// Get theatre by ID
theatreRouter.get('/:id', protectAdmin, getTheatreById);

// Add new theatre
theatreRouter.post('/add', protectAdmin, addTheatre);

// Update theatre
theatreRouter.put('/:id', protectAdmin, updateTheatre);

// Delete theatre
theatreRouter.delete('/:id', protectAdmin, deleteTheatre);

export default theatreRouter; 