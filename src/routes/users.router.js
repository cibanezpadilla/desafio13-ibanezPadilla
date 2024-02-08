import { Router } from "express";

import {  findUserById, findUserByEmail, createUser, roleSwapper} from "../controllers/users.controller.js";
const router = Router();

router.get(
  "/:idUser", findUserById);


router.post("/", async (req, res) => {
  const user = req.body
  const createdUser = await createUser(user)
  res.json({ createdUser })
})


router.put('/premium/:uid', roleSwapper)

export default router;