// ****** Stockage du TOKEN ******
const token = localStorage.getItem("token") 

// ÉTAPE 1 : Récupération des données via fetch
let allWorks = [] // Stockera tous les projets

// 1..Fetch des projets
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()

    // Vérifie que chaque projet ait bien un categoryId
    allWorks = works.map(work => ({
        ...work,
        categoryId: work.categoryId || (work.category ? work.category.id : null)
    }))

    displayWorks(allWorks)           // Galerie principale
    displayWorksInModal(allWorks)    // la modale
}
fetchWorks()

// ****** Fonction pour afficher les projets ******
function displayWorks(works) {
  gallery.innerHTML = "" // Vide la galerie

  works.forEach(work => {
    const figure = document.createElement("figure")
    figure.dataset.id = work.id

    const img = document.createElement("img")
    img.src = work.imageUrl
    img.alt = work.title

    const caption = document.createElement("figcaption")
    caption.innerText = work.title

    figure.appendChild(img)
    figure.appendChild(caption)
    gallery.appendChild(figure)
  })
}

const gallery = document.querySelector(".gallery") // zone d'affichage des projets

// 1.2..Fetch des catégories
async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories")
  const categories = await response.json()
  
  createFilterButtons(categories) 
}
fetchCategories()

// ****** Fonction pour créer les boutons de filtre ******
function createFilterButtons(categories) {
  // ****** Bouton "Tous" ******
  const allBtn = document.createElement("button")
  allBtn.textContent = "Tous"
  allBtn.classList.add("filter-btn")
  allBtn.dataset.id = 0
  filtersContainer.appendChild(allBtn)

  // ****** Boutons pour chaque catégorie ******
  categories.forEach(category => {
    const btn = document.createElement("button")
    btn.textContent = category.name
    btn.classList.add("filter-btn")
    btn.dataset.id = category.id
    filtersContainer.appendChild(btn)
  })

  // ****** Gestion des clics sur les boutons ******
  const buttons = document.querySelectorAll(".filter-btn")
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const categoryId = parseInt(button.dataset.id)

      //  Utilise allWorks mis à jour + vérifie categoryId
      const filteredWorks = categoryId === 0
        ? allWorks
        : allWorks.filter(work => parseInt(work.categoryId) === categoryId)

      displayWorks(filteredWorks) // affiche les projets filtrés
    })
  })
}

const filtersContainer = document.getElementById("filters")

// ****** Bouton modifier + barre noire + logout en mode connecté ******
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token")
  const loginLink = document.getElementById("loginLink")

  if (token) {
    // Mode connecté
    const modeEditionBar = document.getElementById("mode-edition")
    const editButton = document.querySelector(".edit-works")

    if (modeEditionBar) modeEditionBar.classList.remove("hidden")
    if (editButton) editButton.classList.remove("hidden")

    // Affiche "logout" et désactive le lien
    loginLink.textContent = "logout"
    loginLink.href = "#"

    loginLink.addEventListener("click", (e) => {
      e.preventDefault() // empêche la navigation
      localStorage.removeItem("token")
      window.location.reload()
    })

  } else {
    // Mode non connecté
    loginLink.textContent = "login"
    loginLink.href = "login.html" // redirige vers la page de connexion
  }
})
