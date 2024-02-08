import { uManager } from "../DAL/dao/users.dao.js";
import { cManager } from "../DAL/dao/carts.dao.js";
import UsersRequestDto from "../DAL/dtos/users-request.dto.js";
import UsersResponseDto from "../DAL/dtos/users-response.dto.js";
import { hashData } from "../utils.js";

export default class UsersRepository {
    
    async findById(id) {
        const user = uManager.findUserByID(id);
        
        return user;
    }

    async findByEmail(id) {
        const user = uManager.findUserByEmail(id);
        const userDTO = new UsersResponseDto(user);
        return userDTO;
    }

    async createOne(user) {
      const hashPassword = await hashData(user.password);
      const createdCart = await cManager.createCart()
      const userDto = new UsersRequestDto(
        { ...user, 
          cart: createdCart._id,
          password: hashPassword });
      
      const createdUser = await uManager.createUser(userDto);
      return createdUser;
    }    
    
    async updateUser (email, obj) {
      const result = await uManager.updateUser(email, obj);
      return result
  }
}