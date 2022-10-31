'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [{
      email: 'admin.jamous1999@gmail.com',
      password: '$2b$10$fE1XjGf4PmsElCvRlegVaeV3dX4GGr7Sk4EcSsQRwp18W/OLt4uEW',
      userRole: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },]);
  },
};
