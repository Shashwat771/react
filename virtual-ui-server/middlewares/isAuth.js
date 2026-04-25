import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
      const { token } = req.cookies;
      
      if (!token) {
        console.log("⚠️ No token provided");
        return res.status(401).json({ message: "No authentication token provided" });
      }
      
      try {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!verifyToken) {
          return res.status(401).json({ message: "Invalid token" });
        }
        
        req.userId = verifyToken.userId;
        next();
      } catch (tokenError) {
        console.log("Token verification error:", tokenError.message);
        return res.status(401).json({ message: "Token expired or invalid" });
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({ message: `Authentication error: ${error.message}` });
    }
};

export default isAuth;