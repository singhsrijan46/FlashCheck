import Contact from '../models/Contact.js';
import { sendContactConfirmationEmail } from '../services/emailService.js';

// Submit contact form
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create new contact submission
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim()
        });

        await contact.save();

        // Send confirmation email to user
        try {
            await sendContactConfirmationEmail({
                userName: name,
                userEmail: email,
                message: message
            });
        } catch (emailError) {
    
            // Don't fail the request if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            contactId: contact._id
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to submit contact form. Please try again.'
        });
    }
};

// Get all contact submissions (admin only)
export const getAllContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        
        const query = {};
        
        // Filter by status
        if (status && ['pending', 'read', 'replied', 'resolved'].includes(status)) {
            query.status = status;
        }
        
        // Search by name, email, or message
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalContacts: total,
                hasNextPage: skip + contacts.length < total,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact submissions'
        });
    }
};

// Get single contact by ID (admin only)
export const getContactById = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findById(id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact submission'
        });
    }
};

// Update contact status (admin only)
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'read', 'replied', 'resolved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, read, replied, or resolved'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            { 
                status,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to update contact status'
        });
    }
};

// Delete contact submission (admin only)
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact submission deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to delete contact submission'
        });
    }
};

// Get contact statistics (admin only)
export const getContactStats = async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalContacts = await Contact.countDocuments();
        const recentContacts = await Contact.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        });

        const statsObject = {
            total: totalContacts,
            recent: recentContacts,
            byStatus: {
                pending: 0,
                read: 0,
                replied: 0,
                resolved: 0
            }
        };

        stats.forEach(stat => {
            statsObject.byStatus[stat._id] = stat.count;
        });

        res.status(200).json({
            success: true,
            data: statsObject
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact statistics'
        });
    }
};
