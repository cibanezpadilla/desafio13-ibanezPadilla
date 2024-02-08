import { ticketModel } from "../models/ticket.model.js";

class TicketsDao {
    async createTicket(ticket) {
        const response = await ticketModel.create(ticket); 
        return response; 
    }
}

export const ticketsDao = new TicketsDao();