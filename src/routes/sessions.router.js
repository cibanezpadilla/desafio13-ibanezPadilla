import { uManager } from "../DAL/dao/users.dao.js";
import { hashData, compareData } from "../utils.js";
import {Router} from "express"
import passport from "passport"
import "../passport.js"
import { generateToken } from "../utils.js"
import UsersResponseDto from "../DAL/dtos/users-response.dto.js";
import { transporter } from "../utils/nodemailer.js"
import CustomError from "../errors/error.generator.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";


const router = Router();


router.post('/signup', passport.authenticate('signup'),(req, res) => {
    res.json({message: 'Signed up'})    
})





router.get('/current', passport.authenticate('jwt', {session: false}), async(req, res) => {
  /* const userDTO = new UsersResponseDto(req.user); */
  /* console.log("req.headers",req.headers.cookie); */
  res.status(200).json({message: 'User logged', user: req.user})  
})


router.get('/signout', async(req, res)=>{
  req.session.destroy(()=> {       
      res.redirect('/login')
  })
})


//ESTO ES LO QUE HIZO EL PROFE EN CLASE QUE AL FINAL LO REFORMULÉ
router.post('/login', passport.authenticate('login', {failureMessage: true, failureRedirect: "/login"}),(req, res) => {
  //  res.json({message: 'Signed up'})
    //le paso el req.user por parámetro a generateToken para guardar en el token la info del usuario
    
    const {_id, name, email, age, role, carts} = req.user    
   
    const token = generateToken({ _id, name, email, age, role, carts})
    //ahora guardo en cookies el token, 'token' va a ser el nombre de la cookie
    //maxAge es la duracion de la cookie y httpOnly para que  no se pueda
    //recuperar esa cookie desde el front, solo va a ser accedido desde un request http
    res.cookie('token', token, { maxAge: 90000, httpOnly: true })
    res.json({message: 'Loged'}) //este para loggear desde el thunderclient
    /* return res.redirect('/api/sessions/current') */
    /* console.log("req.user del login de session router", req.user) */
}) 


router.post("/restart/:id", async (req, res) => { 
  const { pass, repeat } = req.body;
  const { id } = req.params  
  const user = await uManager.findUserByID(id);  
     
  if(req.cookies.tokencito){
      try {    
      
        if (pass !== repeat){
          return res.json({ message: "Passwords must match" });
        }
        const isPassRepeated = await compareData(pass, user.password)
        if(isPassRepeated){
          return res.json({ message: "This password is not allowed" });
        }     
        const newHashedPassword = await hashData(pass);    
        user.password = newHashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated", user });
      } catch (error) {
        res.status(500).json({ error });
      }
  } else {
    console.log("No hay token en las cookies. Redirigiendo manualmente a /restore");
    return res.redirect("/restore")
  }
      
});



router.post("/restore", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await uManager.findUserByEmail(email);      
    if (!user) {        
      return res.send("User does not exist with the email provided");
    }
    await transporter.sendMail({
      from: "internetcosmikfaery@gmail.com",
      to: email,
      subject: "Recovery instructions",
      html: `<b>Please click on the link below</b>
            <a href="http://localhost:8080/restart/${user._id}">Restore password</a>
      `,
    });

    const tokencito = generateToken({email}) 
       
    res.cookie('tokencito', tokencito, { maxAge: 3600000, httpOnly: true })
    console.log("tokencito", tokencito)
    
    res.status(200).json({ message: "Recovery email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export default router



