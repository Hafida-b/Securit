<template>
  <div class="login-container">
    <div>
      <img src="/src/assets/images/logo.png" alt="Logo">
    </div>
    <h2>Connexion</h2>
    <form @submit.prevent="checkUser"> <!-- appelle la méthode check-user -->
      <div class="form-group mb-2">
        <label for="email">Email</label>
        <div class="input-container">
          <span class="icon">@</span>
          <input type="email" v-model="formData.email" placeholder="Ex: abc@example.com" required>
        </div>
      </div>
      <div class="form-group mb-4">
        <label for="password">Mot de passe</label>
        <div class="input-container">
          <span class="icon">🔒</span>
          <input type="password" v-model="formData.password" id="password" placeholder="********" required>
        </div>
      </div>
      <button type="submit" class="large-button">Connexion</button>
      <div class="error" v-if="error_message">
        <p>{{ error_message }}</p>
      </div>
      <br>
      <div class="new-account">
        <span><a href="signup">Créer un compte</a></span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '../router';
import { userEmail } from '../use/refEmail.js'; 

const error_message = ref('')
const formData = ref({})

async function checkUser() {
  userEmail.value = formData.value.email
  const response = await fetch('/auth/check-user', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value), 
  });
  if (response.status === 200) {
     router.push('/auth/verify_code');
    } else {
    error_message.value = 'Email ou mot de passe incorrect.';
  };
}

</script>

