import jwt from "jsonwebtoken";

const isLoggedIn = async(req, res, next) => {
  const {token} = req.cookies;
  // console.log("token", token);
  if (!token)
    return res.status(401).json({ error: "Unauthorized. Please login" });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export {
  isLoggedIn,
} ;