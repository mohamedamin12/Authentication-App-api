const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../models/users.model");

/**
 *  @desc    Register Users
 *  @route   /api/auth/register
 *  @method  Post
 *  @access  public
 */

const RegisterUser = asyncHandler(async (req, res) => {
  // validate registration
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  // check if the user is already registered
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    return res.status(400).json({
      message: "User already registered",
    });
  }
  // hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  // create a new user
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  // save the user
  await user.save();

  // generate token
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "10m",
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  // cookie will be set when the refresh token expires
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // cookie will only be sent over https
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  // send response to client
  res.status(201).json({
    user,
    accessToken,
  });
});

/**
 *  @desc    Login Users
 *  @route   /api/auth/login
 *  @method  Post
 *  @access  public
 */
const loginUser = asyncHandler(async (req, res) => {
  // validate Login
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  // check if the user is registered
  let user = await User.findOne({email: req.body.email});
  if (!user) {
    return res.status(400).json({
      message: "email or password not found",
    });
  }
  // check if the password is correct
  const validPassword = await bcrypt.compare(req.body.password , user.password);
  if (!validPassword) {
    return res.status(400).json({
      message: "email or password not found",
    });
  }
  // generate token
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
  // cookie will be set when the refresh token expires
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // cookie will only be sent over https
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  // send response to client
  res.status(201).json({
    email: user.email,
    accessToken,
  });
});

/**
 *  @desc    refresh token
 *  @route   /api/auth/refresh
 *  @method  Get
 *  @access  public
 */
const refreshToken = asyncHandler(async (req, res) => {
  // check if the user is registered
  const cookie = req.cookies;
  if(!cookie.jwt){
    return res.status(401).json({
      message: "unauthorized"
    })
  }
  const refreshToken = cookie.jwt
  jwt.verify(refreshToken , process.env.REFRESH_SECRET_KEY , async (err, decoded) => {
    if(err) return res.status(403).json({message: "Forbidden"})
    const user = await User.findById(decoded.id).exec();
    if(!user) return res.status(404).json({message: "Unauthorized"})
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }
    );
    res.status(201).json({
      accessToken,
    });
  }); 
})

/**
 *  @desc    logout
 *  @route   /api/auth/logout
 *  @method  Post
 *  @access  public
 */

const logout = asyncHandler(async (req, res) => {
  // check if the user is registered
  const cookie = req.cookies;
  if(!cookie.jwt){
    return res.status(401).json({
      message: "unauthorized"
    })
  }
  res.clearCookie("jwt",{
    httpOnly: true, // accessible only by web server
    secure: true, // cookie will only be sent over https
    sameSite: "none",
  });
  res.status(200).json({
    message: "logged out"
  });
});


module.exports = {
  RegisterUser,
  loginUser,
  refreshToken,
  logout,
};
