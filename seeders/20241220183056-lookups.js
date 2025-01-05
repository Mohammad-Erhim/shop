module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('LookupTypes', [
      {
        id: 1,
        name: 'USER_ROLE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'CATEGORIES',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'ADJUSTMENT_TYPE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'PRODUCT_ATTRIBUTE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'ORDER_STATUS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('Lookups', [
      {
        type: 1,
        value: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 1,
        value: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 3,
        value: 'FIXED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 3,
        value: 'PERCENTAGE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 4,
        value: 'WEIGHT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 4,
        value: 'VOLUME',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 4,
        value: 'COLOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 5,
        value: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 5,
        value: 'PROCESSING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 5,
        value: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 5,
        value: 'CANCELLED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Lookups', null, {});
    await queryInterface.bulkDelete('LookupTypes', null, {});
  },
};
