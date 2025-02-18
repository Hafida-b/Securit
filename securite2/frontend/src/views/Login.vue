<template>
    <div class="login-container">
        <div>
            <img src="/images/logo.webp">
        </div>

        <h2>Connexion</h2>

        <form @submit.prevent="checkUser">

            <div class="form-group mb-2">
                <label for="email">Email</label>
                <div class="input-container">
                    <span class="icon">@</span>
                    <input type="email" id="email" name = "email" v-model = "form_data.email" placeholder="Ex: abc@example.com" required>
                </div>
            </div>

            <div class="form-group mb-2">
                <label for="password">Mot de passe</label>
                <div class="input-container">
                    <span class="icon">🔒</span>
                    <input type="password" id="password" name = "password" v-model = "form_data.password" placeholder="********" required>
                </div>
            </div>
                
            <div class="mb-2">
                <button type="submit" class="large-button ">Connexion</button>
            </div>
            
        </form>

        <p class="error">{{error_message }}</p>

        <a href="register">Créer un compte</a>

    </div>

</template>


<script setup>
 import { ref } from 'vue'
 import router from '../router'
 import { emailPerson } from '../use/usePersonEmail'

 const form_data = ref({})
 const error_message = ref("")


async function checkUser () {
    console.log(form_data.value)
    emailPerson.value = form_data.value.email
    const response = await fetch('/auth/check_user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_data.value), 
    })

    if (response.status === 200) {
        router.push("Verify_code")
    } else {
        error_message.value = "Email ou mot de passe incorrect "
    }
}
</script> 

<style scoped>
    
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9f9f9;
}

.login-container {
    text-align: center; /* title text is centered */
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.form-group {
    text-align: left; /* labels are left-aligned */
    width: 100%;
}

.mb-2 {
    margin-bottom: 20px;
}

.mb-4 {
    margin-bottom: 40px;
}

label {
    display: block;
    font-size: 16px;
    margin-bottom: 8px;
}

.input-container {
    display: flex;
    align-items: center;
    border: 2px solid #4f46e5;
    border-radius: 10px;
    padding: 8px 12px;
}

.input-container .icon {
    font-size: 18px;
    color: #4f46e5;
    margin-right: 8px;
}

.input-container input {
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
    flex: 1;
}

.input-container input::placeholder {
    color: #aaa;
}

.input-container:focus-within {
    box-shadow: 0 0 5px #4f46e5;
}

.large-button {
    display: block;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: #fff;
    background-color: grey;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.button{
    display: block;
    width: 100%;
    height: 25px; 
    margin-left: -10px;
    justify-content: center;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #4f46e5;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.button:hover{
    background-color:#22227a;
}

form:valid .large-button{
    background-color:#4f46e5;
}

form:valid .large-button :hover{
    background-color:#22227a;
}

.error{
    color:red
}


/* Champ de recherche et bouton "+" */
.search-container {
display: flex;
justify-content: space-between;
align-items: center;
margin: 20px;
}

.search-box {
display: flex;
align-items: center;
background-color: white;
border: 1px solid #ccc;
border-radius: 20px;
padding: 5px 10px;
width: 60%;
}

.search-box .icon {
font-size: 18px;
color: #888;
}

.search-box input {
border: none;
outline: none;
width: 100%;
padding: 5px;
}

.search-box input::placeholder {
color: #888;
}

.search-container .add-button {
background-color: blue;
color: white;
border: none;
border-radius: 50%;
display:flex;
width: 40px;
height: 40px;
font-size: 24px;

align-items: center;
justify-content: center;
cursor: pointer;
}

/* Liste des visites */
.visites-list {
margin: 20px;
}

.visite {
background-color: white;
border: 1px solid #ccc;
border-radius: 8px;
padding: 15px;

justify-content: space-between;
gap: 20px;
align-items: center;
margin-bottom: 10px;
}

.visite .date,
.visite .entreprise {
font-size: 16px;
}

.visite .arrow {
font-size: 20px;
color: #3e8e41;
text-decoration: none;
}

/* Pied de page */
footer {

padding: 20px;
text-align: center;
}

footer nav  {
list-style: none;
padding: 0;
margin: 0;
}

footer nav div {
display: inline-block;
margin: 0 10px;
}

footer nav div a {
color: black;
text-decoration: none;
font-size: 18px;
}
  



</style>
