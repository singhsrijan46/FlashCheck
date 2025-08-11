import Theatre from "../models/Theatre.js";

// Get all unique states
export const getAllStates = async (req, res) => {
    try {
        const states = await Theatre.distinct('state', { isActive: true }).sort();
        res.json({ success: true, states });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Get cities by state
export const getCitiesByState = async (req, res) => {
    try {
        const { state } = req.params;
        const cities = await Theatre.distinct('city', { state, isActive: true }).sort();
        res.json({ success: true, cities });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Get all theatres
export const getAllTheatres = async (req, res) => {
    try {
        const theatres = await Theatre.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, theatres });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Get theatres by state
export const getTheatresByState = async (req, res) => {
    try {
        const { state } = req.params;
        const theatres = await Theatre.find({ state, isActive: true }).sort({ name: 1 });
        res.json({ success: true, theatres });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Get theatres by city
export const getTheatresByCity = async (req, res) => {
    try {
        const { city } = req.params;
    
        
        const theatres = await Theatre.find({ city, isActive: true }).sort({ name: 1 });

        
        res.json({ success: true, theatres });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Add new theatre
export const addTheatre = async (req, res) => {
    try {
    
        const { name, state, city, address, numberOfScreens } = req.body;

        if (!name || !state || !city || !address || !numberOfScreens) {
    
            return res.json({ success: false, message: 'All fields are required' });
        }

        // Generate screen names array
        const screens = [];
        for (let i = 1; i <= numberOfScreens; i++) {
            screens.push(`Screen ${i}`);
        }



        const theatre = await Theatre.create({
            name,
            state,
            city,
            address,
            screens
        });



        res.json({ 
            success: true, 
            message: 'Theatre added successfully',
            theatre 
        });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Update theatre
export const updateTheatre = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, state, city, address, numberOfScreens } = req.body;

        const theatre = await Theatre.findById(id);
        if (!theatre) {
            return res.json({ success: false, message: 'Theatre not found' });
        }

        // Generate new screen names array if numberOfScreens changed
        let screens = theatre.screens;
        if (numberOfScreens && numberOfScreens !== theatre.screens.length) {
            screens = [];
            for (let i = 1; i <= numberOfScreens; i++) {
                screens.push(`Screen ${i}`);
            }
        }

        const updatedTheatre = await Theatre.findByIdAndUpdate(
            id,
            {
                name: name || theatre.name,
                state: state || theatre.state,
                city: city || theatre.city,
                address: address || theatre.address,
                screens
            },
            { new: true }
        );

        res.json({ 
            success: true, 
            message: 'Theatre updated successfully',
            theatre: updatedTheatre 
        });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Delete theatre (soft delete)
export const deleteTheatre = async (req, res) => {
    try {
        const { id } = req.params;
        
        const theatre = await Theatre.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!theatre) {
            return res.json({ success: false, message: 'Theatre not found' });
        }

        res.json({ 
            success: true, 
            message: 'Theatre deleted successfully' 
        });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Get theatre by ID
export const getTheatreById = async (req, res) => {
    try {
        const { id } = req.params;
        const theatre = await Theatre.findById(id);
        
        if (!theatre) {
            return res.json({ success: false, message: 'Theatre not found' });
        }

        res.json({ success: true, theatre });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
}; 