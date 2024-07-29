import jwt from "jsonwebtoken";

const secret = "secret@123";

function createTokenForUser(user) {
    const payload ={
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profileImageURL: user.profileImageURL
    }
    
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });
    return token;
}

function validateTokenOfUser(token) {
    const payload = jwt.verify(token, secret);
    return payload;
}

export  {createTokenForUser, validateTokenOfUser}