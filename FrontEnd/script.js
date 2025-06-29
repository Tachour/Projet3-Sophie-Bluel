// ===============================
// ÉTAPE 1 : Récupération des données via fetch (en haut du code)
// ===============================

let allWorks = []; // Stockera tous les projets

// Fetch des projets
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(works => {
    console.log("Travaux récupérés :", works);
    allWorks = works; // on stocke les projets
    displayWorks(allWorks); // on les affiche dans la galerie
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des travaux :", error);
  });

// Fetch des catégories
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {
    console.log("Catégories récupérées :", categories);
    createFilterButtons(categories); // création des filtres
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des catégories :", error);
  });


// ===============================
// ÉTAPE 2 : Sélection des éléments du DOM
// ===============================

const gallery = document.querySelector(".gallery");       // zone d'affichage des projets
const filtersContainer = document.getElementById("filters"); // zone des boutons de filtre


// ===============================
// ÉTAPE 3 : Fonction pour afficher les projets
// ===============================

function displayWorks(works) {
  gallery.innerHTML = ""; // Vide la galerie

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}


// ===============================
// ÉTAPE 4 : Fonction pour créer les boutons de filtre
// ===============================

function createFilterButtons(categories) {
  // Bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("filter-btn");
  allBtn.dataset.id = 0;
  filtersContainer.appendChild(allBtn);

  // Boutons pour chaque catégorie
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.classList.add("filter-btn");
    btn.dataset.id = category.id;
    filtersContainer.appendChild(btn);
  });

  // Gestion des clics sur les boutons
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const categoryId = parseInt(button.dataset.id);

      const filteredWorks = categoryId === 0
        ? allWorks
        : allWorks.filter(work => work.categoryId === categoryId);

      displayWorks(filteredWorks); // affiche les projets filtrés
    });
  });
}
