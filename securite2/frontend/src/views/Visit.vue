<template>
    <div class = "login-container">
        <header>
            <div class="securit-header">
                <img src="/images/logo.webp">
            </div>
        </header>

    <!-- Contenu principal -->
        <main>
        <!-- Titre -->
            <h1>Visites</h1>

            <div class="search"> 
                <!-- Barre de recherche + bouton -->
                <div class="search-container">
                    <i class="loupe"></i>
                    <input type="text" class="search-bar" placeholder="Rechercher...">
                    <p class = "loupe">✖</p>
                </div>

                <div class="add-button">
                    <a href='/new_visit'><i  class="fa-solid fa-plus">+</i></a>
                </div>
            </div>

    <!-- Tableau des visites -->
            

              <table>
                    <thead>
                    
                          <tr>
                            <th>date</th>
                            <th>entreprise</th>
                            <th></th> 
                        </tr>
                    </thead>

                    <tbody>
                      <tr v-for="visit of visitList" key="visit.id">
                        
                          <td>{{new Date(visit.date).toISOString().slice(0, 10)}}</td>
                          <td>{{visit.company.name }}</td>
                          <td class="arrow-cell">
                            <a href="#" class="arrow-link"><i class="fa-solid fa-arrow-right"></i>&#11157;</a>
                          </td>
                        
                      </tr>
                    </tbody>

                </table>
        
        </main>

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
    
    </div>
</template>

<script setup>
    import { visits } from "/src/use/useVisit"
    import {ref, onMounted} from 'vue'

    const visitList = ref([])
   

    onMounted(async () => {
        const response = await fetch("/api/visit")
        visitList.value = await response.json() 
        console.log("visitList", visitList.value)
        
        for (const visit of visitList.value) {
            visits.value[visit.id] = visit
    }
 })
</script>

<style>
body {
    /*
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #fff;
    color: #333;*/

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

  h1 {
    font-size: 1.5em;
    /*text-align: left;
    margin: 0px;
    padding-left: 17px;*/
  }
  
  .search{
    text-align: left;
  }

  /* Centrage du titre SECURIT */
  .securit-header {
    text-align: center;
    font-weight: bold;
    font-size: 0.2em;
    padding: 1px 0;
    
  }

  .securit-header img {
    width: auto;
    height: 150px;
  }
  

  /* Barre de recherche + bouton */
  .search{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100;
  }

  .search-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    width: 70%;
  }
  
  .search-bar {
    width: 100%;
    border: none;
    outline: none;
    flex-grow: 1;
    padding: 5px 10px;
    font-size: 1em;
  }
  
  .add-button {
    background-color: #007bff;
    color: #fff;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2em;
  }
  
  .add-button i {
    color: #fff;
  }

  p.loupe{
    scale: 0.7;
    
  }  
  /* Tableau */
  table {
    width: 90%;
    margin: 0 auto;
    border-collapse: collapse;
  }
  
  th, td {
    text-align: left;
    padding: 10px;
  }
  
  th {
    font-weight: bold;
    border-bottom: 2px solid #ddd;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  /* Bandeau de navigation */
  footer{
    margin-bottom: -10px;
  }
  
  .nav-bar {
    display: flex;
    justify-content: space-around;
    /*padding: 10px 0;*/
  }
  
  .nav-item {
    text-align: center;
    color: #aaa;
    font-size: 1em;
    font-weight: normal;
    flex: 1;
  }
  
  .nav-item.active {
    color: #007bff;
    font-weight: bold;
  }

  /* Styles pour les cellules avec flèches */
.arrow-cell {
    text-align: center;
    width: 40px;
  }
  
.arrow-link {
  color: #007bff; /* Bleu */
  font-size: 50px;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.2s ease;
  margin: 0;
  height: 50px;
}

.arrow-link:hover {
  transform: scale(1.2); /* Effet d'agrandissement au survol */
}

p{
  font-size: 50px;
  margin: 0;
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
 
.button{
  display: block;
  width: 100%;
  height: 40px; 
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

</style>