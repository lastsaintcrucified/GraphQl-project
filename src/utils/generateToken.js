import jwt from "jsonwebtoken";

const gnerateToken = (userId) => {
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: "7h"})
}

export { gnerateToken as default}