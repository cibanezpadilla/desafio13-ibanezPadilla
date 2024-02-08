import { logger } from "../utils/logger.js";


//ESTO FUNCIONA BIEN, PERO PARA PROBARLO EN EL THUNDERCLIENT TENGO QUE PRIMERO
// HACER MI LOGIN EN EL THUNDERCLIENT http://localhost:8080/api/sessions/login
// HACER METODO POST Y PASARLE POR BODY 
//{
//   "email": "ELMAIL",
//   "password": "LAPASS"
// }
// TAMBIEN TENGO QUE ANTES COMENTAR EL REDIRECT DEL METODO POST DE LOGIN EN EL SESSIONS ROUTER

/* export const authMiddleware = (roles) => { // le voy a pasar arreglo con roles, en este caso ["admin"]
    return (req, res, next) => {
        const {user} = req
        console.log("req del authMiddleware", req.user)        
        logger.info({ message: "user en authMiddleware original", user })
        if (!user){
          return res.status(401).json({ message: "Unauthorized, cant find any user"})
        }
        if (roles && !roles.includes(user.role)) {
            return res.status(403).json({message: "Forbidden"})
        }
        next()
    }
} */




// ESTE ES EL AUTHMIDDLEWARE QUE ARMAMOS CON BEBO 
// SIRVE PARA SACAR EL TOKEN DE HEADERS Y TAMBIEN DE COOKIES 
// NO HACE FALTA COMENTAR LO DE REDIRECT DEL SESSION ROUTER PORQUE NO HAGO EL LOGIN DESDE EL 
// THUNDERCLIENT, ENTONCES NO REDIRIGE Y NO SE TRABA AHI 
// LOGEO DESDE EL NAVEGADOR, COPIO EL TOKEN QUE RECIBO POR CONSOLA Y LO PEGO EN 
// HEADERS, EN AUTHORIZACION, BEARER Y PEGO EL TOKEN PARA HACER EL POST DEL ENDPOINT
// QUE UTILICE AUTHMIDDLEWARE

import jwt from "jsonwebtoken";
import config from "../config/config.js"
const SECRET_KEY_JWT = config.secret_jwt

export const authMiddleware = (roles) => {
  return (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Verifica el header Authorization
    
    if (!token && req.cookies) {
      token = req.cookies.token; // Verifica las cookies en busca del token
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized no hay usuario' });
    }

    try {      
      const decoded = jwt.verify(token, SECRET_KEY_JWT);
      // console.log("entrando aca", decoded)
      req.user = decoded;
      // console.log(req.user, "estamos aca dentro")
      
      
      if (roles && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized error' });
    }
  };
};