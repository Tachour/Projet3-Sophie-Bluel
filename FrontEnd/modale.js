// === OUVERTURE / FERMETURE DE LA MODALE ===
const openModalBtn = document.querySelector(".edit-works")
const modal = document.getElementById("galleryModale")
const closeModalBtn = document.getElementById("closeModaleBtn")

// Ouvre la modale au clic sur "modifier"
openModalBtn.addEventListener("click", () => {
  modal.showModal()
})

// Ferme la modale au clic sur la croix
closeModalBtn.addEventListener("click", () => {
  modal.close()
})

// ====== RÉCUPÉRATION ET AFFICHAGE DES PROJETS DANS LA MODALE ======

const modaleGallery = document.getElementById("modaleGallery")

function displayWorksInModal(works) {
  modaleGallery.innerHTML = ""

  works.forEach(work => {
    const figure = document.createElement("figure")
    figure.classList.add("modale-figure")

    const img = document.createElement("img")
    img.src = work.imageUrl
    img.alt = work.title

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn")
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`

    deleteBtn.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.ok) {
      
      figure.remove()

      const mainGallery = document.querySelector(".gallery")
      const mainProject = mainGallery.querySelector(`[data-id="${work.id}"]`)
      if (mainProject) {
        mainProject.remove()
      }

    } else {
      console.error("Erreur lors de la suppression du projet")
    }

  } catch (error) {
    console.error("Erreur réseau :", error)
  }
})


    figure.appendChild(img)
    figure.appendChild(deleteBtn)
    modaleGallery.appendChild(figure)
  })
}



