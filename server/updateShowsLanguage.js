import mongoose from 'mongoose';
import Show from './models/Show.js';

const updateShowsLanguage = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/movieTicket');
        console.log('Connected to MongoDB');
        
        // Find all shows that don't have a language field or have undefined language
        const showsToUpdate = await Show.find({
            $or: [
                { language: { $exists: false } },
                { language: undefined },
                { language: null }
            ]
        });
        
        console.log(`Found ${showsToUpdate.length} shows to update`);
        
        if (showsToUpdate.length > 0) {
            // Update all shows to have 'English' as default language
            const result = await Show.updateMany(
                {
                    $or: [
                        { language: { $exists: false } },
                        { language: undefined },
                        { language: null }
                    ]
                },
                { $set: { language: 'English' } }
            );
            
            console.log(`Updated ${result.modifiedCount} shows with default language`);
        }
        
        // Show all shows and their languages
        const allShows = await Show.find().select('_id language format screen showDateTime');
        console.log('All shows with languages:');
        allShows.forEach(show => {
            console.log(`Show ${show._id}: Language=${show.language}, Format=${show.format}, Screen=${show.screen}, DateTime=${show.showDateTime}`);
        });
        
        await mongoose.connection.close();
        console.log('Database connection closed');
        
    } catch (error) {
        console.error('Error updating shows:', error);
        process.exit(1);
    }
};

updateShowsLanguage();
