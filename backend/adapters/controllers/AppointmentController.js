
const nodemailer = require('nodemailer');

const AppointmentRepository = require("../../domain/repository/AppointmentRepository");
const AppointmentPort = require("../../application/ports/AppointmentPort");
const AppointmentUseCase = require("../../application/use-cases/AppointmentUseCase");
const port = new AppointmentPort(AppointmentRepository);
const UseCase = new AppointmentUseCase(port);




const getAllAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    const result = await UseCase.getAll(filter);
    res.json(result);
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.stack 
    });
  }
};


const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID format' });
    }

    const result = await UseCase.getById(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // email address from which to send
    pass: process.env.EMAIL_PASS   // password of the email
  }
});

const createAppointment = async (req, res) => {
  try {
    const { userId, specialistId, appointmentDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    if (!mongoose.Types.ObjectId.isValid(specialistId)) {
      return res.status(400).json({ message: 'Invalid specialistId format' });
    }

    const date = new Date(appointmentDate);
    if (isNaN(date.getTime()) || date < new Date()) {
      return res.status(400).json({ message: 'appointmentDate must be a valid future date' });
    }

    const newResource = await UseCase.create(req.body);
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID format' });
    }

    const allowedUpdates = ['status', 'notes', 'appointmentDate'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    // Validate appointmentDate
    if (
      updates.appointmentDate &&
      new Date(updates.appointmentDate) < new Date()
    ) {
      return res.status(400).json({ message: 'appointmentDate cannot be in the past' });
    }

    const updatedResource = await UseCase.update(id, updates);

    if (updatedResource) {
      res.json(updatedResource);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// const updateAppointment = async (req, res) => {
//   try {
//     // Only allow certain fields to be updated
//     const allowedUpdates = ['status', 'notes', 'appointmentDate'];
//     const updates = Object.keys(req.body)
//       .filter(key => allowedUpdates.includes(key))
//       .reduce((obj, key) => {
//         obj[key] = req.body[key];
//         return obj;
//       }, {});

//     // Pass the MongoDB _id directly
//     const updatedResource = await UseCase.update(req.params.id, updates);
    
//     if (updatedResource) {
//       res.json(updatedResource);
//     } else {
//       res.status(404).json({ message: "Appointment not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const mongoose = require('mongoose'); // Ensure this is imported

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID format' });
    }

    const deletedResource = await UseCase.delete(id);
    if (deletedResource) {
      res.json({ message: "Appointment deleted" });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAllAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
};
