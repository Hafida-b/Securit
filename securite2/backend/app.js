import 'dotenv/config'
import express from 'express'
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'
import {v4 as uuidv4} from 'uuid'
import cookieParser from 'cookie-parser'
import { generateRandomCode, sendMyMail } from './lib/mail.mjs'

const prisma = new PrismaClient()
const app = express()
const codes = {}

/////////////////////// MIDDLEWARES ////////////////////////////
//couche assets
app.use('/assets', express.static('./assets'))

//couche Cookiesparser
app.use(cookieParser())

//couche bodyparser
app.use(express.json())

////////////////////// ROUTES ///////////////////////////////////
//Créer un compte ou Regsiter 
// curl -i -X POST -H 'Content-type: application/json' -d '{"email":"hb31@yopmail.fr" ,"password" : "hb310"}' http://localhost:3000/auth/register
app.post('/auth/signup', async (req, res) => { 
   console.log("check user :" , req.body)
   const { email, password, fullname} = req.body;

   let user = await prisma.user.findUnique({
      where: { email }
   })
   if (user) {
      res.sendStatus(409)
   } else {
      const hashedPassword = await bcrypt.hash(password, 3);
      user = await prisma.user.create({
         data : {
            email, 
            password , 
            fullname ,
         }
      })
      res.send(user)
   }
})

//Vérification de l'Utilisateur
app.post('/auth/check-user', async (req, res) => {
   console.log("check user ", req.body)
   const { email, password } = req.body;
   const user = await prisma.user.findUnique({
            where: { email }
   });

   if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
         const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
         const code = generateRandomCode(5, alphabet);
         codes[email] = code
   
         await sendMyMail ({
            from: process.env.MAIL_SENDER,
            to: email,
            subject: 'Code de vérification ',
            text: `Votre code de confirmation est ${code}`,
         })

         res.cookie('code_verif', '123', { httpOnly: true, maxAge: 1*30*1000 });
         res.sendStatus(200); // si c'est bon passe au next

      } else {
         res.sendStatus(403); // 403 send error 
      }
   } else {
   res.sendStatus(500);
   }
})


//Login 

//Vérification du Code de vérification
app.post('/auth/verify_code', async (req, res) => {
   const {email, code} = req.body;
   const cookie_verif = req.cookies['code_verif'];

   if (cookie_verif === "123") {
      // Si la session est valide, vérifiez le code de vérification
      if (codes[email] === code) {
         const user = await prisma.user.findUnique({
            where: { email: email }
         });

         let session_uuid = uuidv4(); 

         const session = await prisma.session.create({
               data: {
               session_id: session_uuid,
               user_id: user.id,
               }
         });
         res.cookie('session_id', session.session_id, { httpOnly: true, maxAge: 10 * 60 * 1000 });
         res.sendStatus(200); // vers visits

      } else {
         // Si le code de vérification est incorrect
         res.sendStatus(400);
      }
   } else {
      // Si le code a expiré
      res.sendStatus(403);
   }
});

/////////////////// COUCHES SECURISEES /////////////////////////////

// app.use ('/', (req, res, next) => {
//    console.log('Cookies:', req.cookies)
//    if (req.cookies.session_id) {
//       next()
//    } else {
//       res.render('login', {error_message: "Session expirée"})
//    }
// })

// //couche visits
// app.get('/visits', async (req, res) => {
//    res.render('visits', 
//       {error_message : ""}
//    )
// })

////////////////////////////////////////////////////////////////////


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
   console.log(`Server listening on port http://localhost:${PORT}`)
})