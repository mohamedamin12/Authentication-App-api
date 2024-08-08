const asyncHandler = require("express-async-handler");
const { User } = require("../models/users.model");

/**
 *  @desc    Get All Users
 *  @route   /api/users
 *  @method  Get
 *  @access  public
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

/**
 *  @desc    Count Users
 *  @route   /api/users/count
 *  @method  Get
 *  @access  public
 */

const countUsers = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  res.status(200).json(users);
});

module.exports = {
  getAllUsers,
  countUsers,
}