/* import { Users, Products, Carts, Messages, Tickets, ResetTokens } from "../dao/factory.js"; */

import { manager } from "../DAL/dao/products.dao.js";
import { cManager } from "../DAL/dao/carts.dao.js"
import { uManager } from "../DAL/dao/users.dao.js";

import UsersRepository from "./users.repository.js";
import ProductsRepository from "./products.repository.js";
import CartsRepository from "./carts.repository.js";
// import MessagesRepository from "./messagesRepository.js";
// import TicketsRepository from "./ticketsRepository.js";
// import ResetTokensRepository from "./resetTokensRepository.js";

export const usersService = new UsersRepository(uManager);
export const productsService = new ProductsRepository(manager);
export const cartsService = new CartsRepository(cManager);
// export const messagesService = new MessagesRepository(new Messages());
// export const ticketsService = new TicketsRepository(new Tickets());
// export const resetTokensService = new ResetTokensRepository(new ResetTokens());