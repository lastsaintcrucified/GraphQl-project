import bcrypt from "bcryptjs";

const hashPassword = (password) =>{
    if(password<8){
        throw new Error('Password must be more than 8 character!')
    }

    return bcrypt.hash(password,10);
}

export {hashPassword as default}