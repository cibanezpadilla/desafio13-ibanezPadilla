import { usersService } from "../repositoryServices/index.js";
/* import { findByEmail, findById, createOne } from "../services/users.service.js"; */
/* import { jwtValidation } from "../middlewares/jwt.middlewares.js"; */
/* import { authMiddleware } from "../middlewares/auth.middlewares.js"; */
import passport from "passport";
import mongoose from "mongoose";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";


export const findUserById = (req, res) => {
    passport.authenticate("jwt", { session: false }),
    /* authMiddleware(["USER"]), */
    async (req, res) => {
        try{
            const { idUser } = req.params;
            const user = await usersService.findById(idUser);
            if (!user) {
                    // return res.status(404).json({ message: "No User found with the id" });
                    logger.warning("User not found with the id provided")   
                    return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
                }
            res.json({ message: "User", user });
        }catch (error){
            logger.error(error)
            next(error)
        }
        
}};

export const findUserByEmail = async (req, res) => {
    try {
        const { UserEmail } = req.body;        
        const user = await usersService.findByEmail(UserEmail);
        if (!user) {
            // return res.status(404).json({ message: "There is no user found with this email" });
            logger.warning("User not found with the email provided")
            return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
        }
        res.status(200).json({ message: "User found", user });
    } catch (error) {
        logger.error(error)
        next(error)
    }
    
};

export const createUser =  async (req, res) => {
    try{
        const { name, lastName, email, password } = req.body;
        if (!name || !lastName || !email || !password) {
            // return res.status(400).json({ message: "All fields are required" });
            logger.warning("Some data is missing")
            return CustomError.generateError(ErrorMessages.MISSING_DATA,400, ErrorName.MISSING_DATA);
        }
        const createdUser = await usersService.createOne(req.body);
        res.status(200).json({ message: "User created", user: createdUser });
    }catch (error){
        logger.error(error)
        next(error)
    }    
};


export const roleSwapper = async (req, res, next) => {

    const {uid} = req.params
    

    try {
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            logger.warning("Invalid Mongoose ObjectID format")
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
        }

        const user = await usersService.findById(uid)        
        logger.debug({message: "user antes de update", user})

        if (!user) {
            logger.warning("User not found with the email provided")
            return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
        }

        let roleChange;
        if (user.role === 'PREMIUM') {            
            roleChange = { role: 'USER' }
        } else if (user.role === 'USER' ){            
            roleChange = { role: 'PREMIUM' }
        }

        await usersService.updateUser(user.email, roleChange)
        const updatedUser = await usersService.findById(uid); // Obtengo el usuario actualizado desde la base de datos porque si no me lo mostraba sin la actualizacion        
        logger.debug({message: "user updated", updatedUser})
        res.json({ message: "Role updated", user: updatedUser });
        
    } catch (error) {
        logger.error(error)
        next(error)
    }
}