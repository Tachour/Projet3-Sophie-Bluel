// Récupération des projets
fetch("http://localhost:5678/api/works")
  .then(res => {
    return res.json();
  })
  .then(json => console.log(json))

// Récupération des catégories

fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(data => {
    console.log("Catégories :", data);
  });

  // Sélectionne la div qui contiendra les projets
const gallery = document.querySelector(".gallery");

// Appelle l'API pour récupérer les projets
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(works => {
    console.log("Travaux récupérés :", works);

    // Parcourt chaque projet et l'ajoute dans la galerie
    works.forEach(work => {
      // Crée la balise <figure>
      const figure = document.createElement("figure");

      // Crée et configure l'image
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      // Crée la légende (figcaption)
      const caption = document.createElement("figcaption");
      caption.innerText = work.title;

      // Ajoute l'image et le texte dans la figure
      figure.appendChild(img);
      figure.appendChild(caption);

      // Ajoute la figure à la galerie
      gallery.appendChild(figure);
    });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des travaux :", error);
  });


