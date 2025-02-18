<template>
    
    <div class="login-container">
        <!-- En-tête avec SECURIT -->
        <header>
            <div class="securit-header">
                <img src="/images/logo.webp">
            </div>
        </header>
    
        <!-- Contenu principal -->
        <main>
            <h1 class="form-group mb-2">Nouvelle Visite</h1>

            <form  @submit.prevent = "createNewVisit" >
                <!-- Date de la visite -->
                <div class="form-group mb-2 search">
                    <label for="date">Date :</label>
                    <input type="date" id="date" name="date" v-model = " form_data.date" required />
                </div>
    
                <!-- Choix de l'entreprise -->
                <div class="form-group mb-2">
                    <label for="enterprise">Entreprise :</label>
                    <select v-model = " form_data.company_id" name="company_id" id="company" required>
                        <option value="" disabled selected> Choisissez...</option>
                        <option v-for="company in companiesList" :key="company.id" :value="company.id" >
                            {{ company.name }}
                        </option>
                    </select>
                </div>
    
                <!-- Compte-rendu de la visite -->
                <div class="form-group mb-4">
                    <label for="report">Compte-rendu :</label>
                    <textarea id="report" name="report" rows="4" v-model = " form_data.report" placeholder="Décrivez la visite..." required></textarea>
                </div>

                <input type="hidden" v-model="form_data.user_id" />
    
                <!-- Bouton de soumission -->
                <div class="form-group mb-4">
                    <button type="submit" class="button">Enregistrer la visite</button>
                </div>
            </form>
            

            <!-- Bandeau de navigation -->
            <footer>
                <div class="nav-bar">
                    <div class="nav-item active">
                        <p>&#9733;</p>  <!-- Affiche une étoile pleine -->
                        <span>Visites</span>
                    </div>

                    <div class="nav-item">
                        <p>&#9733;</p>  <!-- Affiche une étoile pleine -->
                        <span>Entreprises</span>
                    </div>

                    <div class="nav-item">
                        <p>&#9733;</p>  <!-- Affiche une étoile pleine -->
                        <span>Réglages</span>
                    </div>
                </div>
            </footer>
        </main>
    </div>
    
</template>

<script setup>
    import { companies } from "/src/use/useCompany"
    import {ref, onMounted} from 'vue'
    import router from '../router'

    const companiesList = ref([])
    const form_data = ref({})
   

    onMounted(async () => {
        const response = await fetch("/api/new_visit")
        companiesList.value = await response.json() 
        
        for (const company of companiesList.value) {
            companies.value[company.id] = company
    }
    
    });


    async function createNewVisit() {

    const response = await fetch('/api/create_new_visit', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'
            },
            body: JSON.stringify(form_data.value), 
        })

        if (response.status === 201) {
            router.push("visit")
       
        } else {
         error_message.value = "erreur inconnue"
        }
    
    }
</script>