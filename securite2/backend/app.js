import "dotenv/config"                             // copie les cles valeurs de .env vers process.env*/
import express from 'express'                      // Importation du framework Express
import {PrismaClient} from '@prisma/client'        // Importation du client Prisma pour interagir avec la base de données
import bcrypt from 'bcryptjs'                      // Importation de bcrypt pour le hachage des mots de passe 
import { v4 as uuidv4 } from 'uuid'                // Importation de la fonction uuid pour générer des identifiants uniques
import cookieParser from 'cookie-parser'           // Importation du middleware pour gérer les cookies 

//import { sendMyMail } from '../frontend/use/use.js'        // Importation de la fonction d'envoi d'e-mails*/
import {sendMyMail, generateRandomCode} from './lib/mail.js'  // Importation de la fonction pour générer des codes aléatoires




const prisma = new PrismaClient() // Création d'une instance du client Prisma pour interagir avec la base de données

const app = express()            // Création d'une instance d'Express
const codes = {}                 // Objet pour stocker les codes de vérification associés aux e-mails

app.set('view engine', 'ejs')    // Configuration du moteur de rendu pour utiliser EJS



 
 //////////////////////////////////////////// ROUTE MIDDLEWARES //////////////////////////////////////////////////////////

 //couche Cookiesparser: middleware pour parser les cookies
 app.use(cookieParser())                           

 //couche bodyparser: middleware pour parser les données du corps des requêtes (formulaires)
 app.use(express.json())      

 //couche assets: middleware pour servir des fichiers statiques (assets)
 app.use('/assets', express.static('./assets'))    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// couche check_user: route pour vérifier les informations de connexion
app.post('/auth/check_user', async(req,res) =>{
   console.log('check_user', req.body)

   
   const {email,password} = req.body                              // Récupération des données du formulaire
   let user = await prisma.user.findUnique
      ({where: {email}})                                          // Recherche de l'utilisateur par e-mail
   
   if (user) { 
      // Vérification du mot de passe
      const match = await bcrypt.compare(password,user.password)

      if (match) {
         // Génération d'un code de vérification aléatoire
         const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
         const mycode = generateRandomCode(5, alphabet)
         codes[email] = mycode                                    // Stockage du code associé à l'e-mail
         
         // Envoi du code de vérification par e-mail
         await sendMyMail({
            from: process.env.MAIL_SENDER,
            to: email,
            subject:'code de vérification Sophie',
            text: mycode,
         })

         // Création d'un cookie de vérification
         res.cookie('code_verif', "123", { httpOnly: true, maxAge: 1*60*1000 })
         res.sendStatus(200);  
 
      } else {
         // Si le mot de passe est incorrecte, affiche un message d'erreur sur la page de connexion
         res.sendStatus(403);
      }
         
   } else {
      // Si l'e-mail n'est pas trouvé dans la base de données, afficher un message d'erreur sur la page de connexion
      res.sendStatus(403)
   }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//couche create account: route pour créer un compte
app.post('/auth/create_account', async(req,res) =>{

   const {email,password,password2} = req.body           // Récupération des données du formulaire
   
   // Vérification si les mots de passe correspondent
   
   let user = await prisma.user.findUnique({
      where: { email}  // Recherche d'un utilisateur par e-mail
   })

   if (user){
      // Si l'utilisateur existe déjà, affiche un message d'erreur
      res.sendStatus(400)
   } else {
      // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
      const hash_password = await bcrypt.hash(password, 3)  // Hachage du mot de passe
      user = await prisma.user.create({
         data:{
            email,
            password : hash_password,
            role: "inspector",         // Rôle par défaut
         }
      })
      res.sendStatus(200)  // Redirection vers la page de validation du compte
      }   
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// couche authentification: route pour vérifier le code de confirmation
app.post('/auth/verify_code', async (req, res) => {
   console.log('verify_code', req.body)
   const {email, code} = req.body                             // Récupération des données du formulaire

   // Vérification si le code fourni correspond au code stocké pour cet email
   if (codes[email] === code){
      const cookie_verif = req.cookies['code_verif'];          // Récupération du cookie de vérification


      // Vérification si le cookie de vérification est valide
      if (cookie_verif !== "123"){
         res.sendStatus(405) // error_message: "Code expiré" // Affichage d'un message d'erreur si le code a expiré

      } else {
         let user = await prisma.user.findUnique({
            where:{email: email}
         });
         // Génération d'un nouvel UUID pour la session
         let myuuid = uuidv4();

         const session = await prisma.session.create ({
            data: {
               session_id: myuuid,
               user_id: user.id
            }
         });
         // Création d'un cookie de session
         res.cookie('session_id', session.session_id, { httpOnly: true, maxAge: 30*60*1000 }); // Cookie valide pendant 30 minutes
         res.sendStatus(200) // Redirection vers la page de visite
      }

   } else {
       // Si le code ne correspond pas, afficher un message d'erreur
      res.sendStatus(403) //error_message: "Code de confirmation invalide"  
   }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/visit', async (req, res) => {

   const current_session = req.cookies.session_id;
   const authenticated_user = await prisma.user.findFirst({

   where: {session: {some: {session_id: current_session}}}

   });

   const visits = await prisma.visit.findMany({
      where: {user_id:authenticated_user.id},
      include: {company : true }
   });

   res.json(visits);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/new_visit', async(req,res) => {

   const current_session = req.cookies.session_id;
   const authenticated_user = await prisma.user.findFirst({

   where: {session: {some: {session_id: current_session}}}

   });
   const companies = await prisma.company.findMany();
   res.json(companies);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/api/create_new_visit', async (req, res) => {
   const { date, company, report } = req.body; 

   const companyId = parseInt(req.body.company_id,10);
   const current_session = req.cookies.session_id;             // récupère l'id de la session
   const authenticated_user = await prisma.user.findFirst({    // récupère l'utilisateur associé à la session actuelle

     where: {session: {some: {session_id: current_session}}}

   });

   const new_visit = await prisma.visit.create({
      data: {
         date: new Date (date),
         company: { connect: { id: companyId } }, // Remplacez companyId par l'ID de l'entreprise existante
         report: report || "",
         user: { connect: { id: authenticated_user.id } }
         
      }
   });
   res.status(201).json(new_visit); 


   // const visits = await prisma.visit.findMany({
   //    include: {company : true }
   // });

  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Configuration du port d'écoute
const PORT = process.env.PORT || 3000  // Utilisation du port défini dans les variables d'environnement ou 3000 par défaut
app.listen(PORT, () => {
   // Affichage d'un message dans la console pour indiquer que le serveur est en cours d'exécution
   console.log(`Server listening on port http://localhost:${PORT}`)
})
