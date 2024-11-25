const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('../models/Role');
const User = require('../models/User');
const connectDB = require('./db');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

dotenv.config();
connectDB();

const seedRoles = async () => {
  try {
    await Role.deleteMany({});

    const roles = [
      {
        name: 'Admin',
        permissions: ['create_user', 'delete_user', 'view_users'],
      },
      {
        name: 'Moderator',
        permissions: ['view_users'],
      },
      {
        name: 'User',
        permissions: [],
      },
    ];

    await Role.insertMany(roles);
    logger.info('Roles seeded successfully.');

    // Optionally, create an admin user
    const adminRole = await Role.findOne({ name: 'Admin' });

    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('AdminPass123', 10),
      role: adminRole._id,
      isVerified: true,
    });

    await admin.save();
    logger.info('Admin user seeded successfully.');

    process.exit();
  } catch (err) {
    logger.error(`Error seeding roles: ${err.message}`);
    process.exit(1);
  }
};

seedRoles();
