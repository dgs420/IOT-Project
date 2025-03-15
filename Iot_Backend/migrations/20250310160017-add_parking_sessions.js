'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('parking_sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'rfid_cards',
          key: 'card_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      device_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'devices',
          key: 'device_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      entry_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      exit_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'completed'),
        allowNull: false,
        defaultValue: 'active',
      },
      payment_status: {
        type: Sequelize.ENUM('unpaid', 'paid', 'exempt', 'failed'),
        allowNull: false,
        defaultValue: 'unpaid',
      },
      fee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('parking_sessions', ['card_id']);
    await queryInterface.addIndex('parking_sessions', ['device_id']);
    await queryInterface.addIndex('parking_sessions', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('parking_sessions');
  },
};
