const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Create a new department
exports.createDepartment = async (req, res) => {
    const { name } = req.body;
    try {
        const department = new Department({ name });
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: 'Error creating department', error });
    }
};

// @desc    Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('head', 'email');
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all staff members to populate assignment dropdowns
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).select('email');
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};