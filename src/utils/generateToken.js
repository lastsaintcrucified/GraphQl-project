import jwt from "jsonwebtoken";

const gnerateToken = (userId) => {
    return jwt.sign({userId},"helloworld",{expiresIn: "7h"})
}

export { gnerateToken as default}