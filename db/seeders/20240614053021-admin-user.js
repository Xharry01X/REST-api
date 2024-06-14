
const bcryptjs = require( 'bcryptjs' );
require("dotenv").config()

module.exports = {
    up: (queryInterface, Sequelize) => {
        let password = process.env.ADMIN_PASSWORD;
        const hashPassword = bcryptjs.hashSync(password, 10);
        return queryInterface.bulkInsert('user', [
            {
                userType: 'buyer',
                firstName: 'Harry',
                lastName: 'Brook',
                email: process.env.ADMIN_EMAIL,
                password: hashPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', { userType: 'buyer' }, {});
    },
};