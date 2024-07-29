import { validateTokenOfUser } from "../services/auth.js";

function checkforAuthCookie(cookieName) {
    return (req, res, next) => {
        const token = req.cookies[cookieName];
        if (token) {
            try {
                const payload = validateTokenOfUser(token);
                if(payload){
                    req.user = payload;
                }
                
            } catch (e) {}

        }
       return next();
    }
}

export {checkforAuthCookie}