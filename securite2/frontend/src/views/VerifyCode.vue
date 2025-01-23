<template>
    <div class="login-container">
        <div>
            <img src="/src/assets/images/logo.png" alt="Logo">
        </div>
        <h2>Pour finaliser la création de votre compte, vérifiez votre boîte mail et tapez le code de confirmation</h2>
        <form @submit.prevent="verifyCode">
            <div class="form-group mb-2">
                <label for="code-confirmation">Code de confirmation</label>
                <div class="input-container">
                    <input name="code" v-model="formData.code" type="text" id="code" placeholder="Ex: 12345" required>
                </div>
            </div>
            <br>
            <button type="submit" class="large-button">Continuer</button>
            <br>
            <div class="error" v-if="error_message">
                <p>{{ error_message }}</p>
            </div>    
        </form>
    </div>
</template>

<script setup>

 import { ref } from 'vue'
 import router from '../router'
 import { userEmail } from '/src/use/refEmail'

 const error_message = ref('')
 const formData = ref({})

 async function verifyCode() {
   formData.value.email = userEmail.value
   const response = await fetch('/auth/verify_code', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json',
         },
         body: JSON.stringify(formData.value), 
   });
   if (response.status === 200) {
      router.push('/visits');
   } else if (response.status === 403) {
      error_message.value = "Code de confirmation incorrect.";
   } else {
      error_message.value = "Code de confirmation expiré."
   };  
}

</script>