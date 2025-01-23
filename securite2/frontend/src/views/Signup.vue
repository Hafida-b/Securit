<template>
  <div class="login-container">
    <div>
      <img src="/src/assets/images/logo.png" alt="Logo">
    </div>
    <h2>Création de compte</h2>
    <form @submit.prevent="RegisterAccount">
      <div class="form-group mb-2">
        <label for="email">Email</label>
        <div class="input-container">
          <span class="icon">@</span>
          <input name="email" type="email" id="email" placeholder="Ex: abc@example.com" required>
        </div>
      </div>
      
      <div class="form-group mb-2">
        <label for="email">Fullname</label>
        <div class="input-container">
          <span class="icon">👤 </span>
          <input name="fullname" type="fullname" id="fullname" placeholder="Your fullname" required>
        </div>
      </div>
     
      <div class="form-group mb-4">
        <label for="password">Mot de passe</label>
        <div class="input-container">
          <span class="icon">🔒</span>
          <input name="password" minlength="6" type="password" id="password" placeholder="********" required>
        </div>
        <br>
        <label for="password2">Mot de passe (confirmer)</label>
        <div class="input-container">
          <span class="icon">🔒</span>
          <input name="password2" minlength="6" type="password" id="password2" placeholder="********" required>
        </div>
      </div>
      <button type="submit" class="large-button">Créer</button>
    </form>
    <div class="error">
      <p>{{ error_message }}</p>
    </div>
    <div>
      <a href="/login">Connexion</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const error_message = ref('');

async function RegisterAccount() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;
  const fullname = document.getElementById('fullname').value;

  if (password === password2) {
    const response = await fetch('/auth/register', {//reqquet HTTP
      method: 'POST',//-X
      headers: {
        'Content-Type': 'application/json' //-H
      },
      body: JSON.stringify({ email, password, fullname })//-d
    });

    if (response.status === 200) {
      console.log('Votre compte a été crée avec succes')
      router.push('/success_account'); // Adjust this route as necessary
    } else {
      error_message.value = "Code de confirmation expiré."; // Adjust this message as necessary
    }
  } else {
    error_message.value = 'Les mots de passe ne correspondent pas';
  }
}
</script>