const { Sequelize } = require("sequelize");
const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getAllUser = catchAsync(async (req, res, next) => {
    const users = await user.findAndCountAll({
        where: {
            userType: {
                [Sequelize.Op.ne]: 'buyer',
            },
        },
        attributes: { exclude: ['password'] },
    });

    if (!users) {
        return next(new AppError("Failed to get all user info", 404));
    }

    return res.status(200).json({
        status: "success",
        data: users,
    });
});

module.exports = { getAllUser };
