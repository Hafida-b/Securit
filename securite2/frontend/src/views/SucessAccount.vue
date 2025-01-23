<template>
    <div class="login-container">
        <div>
        <img src="/src/assets/images/logo.png">
        </div>
        <h2>Votre compte a été créé avec succès</h2>
        <a class="large-button" href="/login">Connexion </a>
        
        <div class="error" v-if="error_message">
        <p>{{ error_message }}</p>
      </div>
    </div>
</template>
 
<script setup>


</script>