const Internship = require('../models/internship');  // ✅ capital I

const createInternship = async (req, res) => {
    try {
        const internship = await Internship.create({
            ...req.body,
            user: req.user.id  // ✅ id
        });
        res.json({ message: "Internship created successfully", internship });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ user: req.user.id });
        res.json({ success: true, data: internships });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);  // ✅ params
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        if (internship.user.toString() !== req.user.id) {  // ✅ id
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.json({ success: true, data: internship });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateInternship = async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);  // ✅ params
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        if (internship.user.toString() !== req.user.id) {  // ✅ id
            return res.status(401).json({ message: "Unauthorized" });
        }
        const updatedInternship = await Internship.findByIdAndUpdate(
            req.params.id,  // ✅ params
            req.body,
            { new: true }
        );
        res.json({ success: true, data: updatedInternship });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteInternship = async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);  // ✅ params
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        if (internship.user.toString() !== req.user.id) {  // ✅ id
            return res.status(401).json({ message: "Unauthorized" });
        }
        await internship.deleteOne();  // ✅ deleteOne
        res.json({ success: true, message: "Internship deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createInternship,
    getInternships,
    getInternshipById,
    updateInternship,
    deleteInternship
};