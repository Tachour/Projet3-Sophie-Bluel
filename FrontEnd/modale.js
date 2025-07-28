// === OUVERTURE / FERMETURE DE LA MODALE ===
const openModalBtn = document.querySelector(".edit-works")
const modal = document.getElementById("galleryModale")
const closeModalBtn = document.getElementById("closeModaleBtn")

const galerieView = document.getElementById("galleryView")
const formView = document.getElementById("addPhotoView")

// ✅ On attend que le DOM soit prêt pour vérifier le token
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token")

  if (!token && openModalBtn) {
    openModalBtn.style.display = "none"  // Masque bouton en mode déconnecté
  } else if (token && openModalBtn) {
    openModalBtn.style.display = "inline-block" // Affiche bouton en mode connecté
  }
})

// Ouverture de la modale (uniquement si bouton visible)
if (openModalBtn) {
  openModalBtn.addEventListener("click", () => {
    resetToMainView() // Revenir toujours à la vue principale
    modal.showModal()
  })
}

// Fermeture croix
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    modal.close()
    resetToMainView()
  })
}

// Fermer au clic en dehors
modal.addEventListener("click", (event) => {
  const modalContent = modal.querySelector(".modale-content")
  if (!modalContent.contains(event.target)) {
    modal.close()
    resetToMainView()
  }
})


// === Fonction pour revenir à la vue principale ===
function resetToMainView() {
  formView.classList.add("hidden")
  galerieView.classList.remove("hidden")
  document.getElementById("photoForm").reset()
  previewContainer.innerHTML = ""
  previewContainer.style.display = "none"
  submitBtn.classList.remove("active")
  submitBtn.disabled = true

  // Réaffiche la zone upload
  document.querySelectorAll(".upload-area i, .upload-area label, .upload-area small").forEach(el => {
    el.style.display = "block"
  })
}

// ====== AFFICHAGE DES PROJETS DANS LA MODALE ======
const modaleGallery = document.getElementById("modaleGallery")

function displayWorksInModal(works) {
  modaleGallery.innerHTML = ""

  works.forEach(work => {
    const figure = document.createElement("figure")
    figure.classList.add("modale-figure")
    figure.dataset.id = work.id

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
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          const modaleProject = modaleGallery.querySelector(`figure[data-id="${work.id}"]`)
          if (modaleProject) modaleProject.remove()

          const mainProject = document.querySelector(`.gallery [data-id="${work.id}"]`)
          if (mainProject) mainProject.remove()

          allWorks = allWorks.filter(item => item.id !== work.id)
          displayWorksInModal(allWorks)
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



// === GESTION DES VUES ===
const btnAddPhoto = document.getElementById("addPhotoBtn")
const backToGalleryBtn = document.getElementById("backToGalleryBtn")

btnAddPhoto.addEventListener("click", () => {
  galerieView.classList.add("hidden")
  formView.classList.remove("hidden")
})

backToGalleryBtn.addEventListener("click", resetToMainView)

// === CHARGEMENT DES CATÉGORIES ===
async function loadCategoriesInSelect() {
  try {
    const response = await fetch("http://localhost:5678/api/categories")
    const categories = await response.json()
    const select = document.getElementById("categorySelect")

    select.innerHTML = `<option value="" disabled selected hidden></option>`

    categories.forEach(cat => {
      const option = document.createElement("option")
      option.value = cat.id
      option.textContent = cat.name
      select.appendChild(option)
    })
  } catch (error) {
    console.error("Erreur chargement catégories :", error)
  }
}
loadCategoriesInSelect()

// === PRÉVISUALISATION IMAGE ===
const inputFile = document.getElementById("imageUpload")
const previewContainer = document.getElementById("previewContainer")

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0]
  const uploadArea = document.querySelector(".upload-area")

  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      previewContainer.innerHTML = `<img src="${reader.result}" class="preview-img" />`
      previewContainer.style.display = "block"

      uploadArea.querySelectorAll("i, label, small").forEach(el => el.style.display = "none")

      checkFormFields()
    }
    reader.readAsDataURL(file)
  } else {
    previewContainer.innerHTML = ""
    previewContainer.style.display = "none"
    uploadArea.querySelectorAll("i, label, small").forEach(el => el.style.display = "block")
    checkFormFields()
  }
})

// === VALIDATION DYNAMIQUE DU FORMULAIRE ===
const titleInput = document.getElementById("titleInput")
const categorySelect = document.getElementById("categorySelect")
const submitBtn = document.querySelector(".submit-btn")

const fields = [titleInput, categorySelect]
fields.forEach(input => {
  input.addEventListener("input", checkFormFields)
})
inputFile.addEventListener("change", checkFormFields)

function checkFormFields() {
  const image = inputFile.files[0]
  const title = titleInput.value.trim()
  const category = categorySelect.value

  if (image && title !== "" && category !== "") {
    submitBtn.classList.add("active")
    submitBtn.disabled = false
  } else {
    submitBtn.classList.remove("active")
    submitBtn.disabled = true
  }
}

// === ENVOI DU FORMULAIRE D'AJOUT ===
const form = document.getElementById("photoForm")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const image = inputFile.files[0]
  const title = titleInput.value
  const category = categorySelect.value
  const token = localStorage.getItem("token")

  if (!image || !title || !category) {
    alert("Tous les champs sont requis")
    return
  }

  const formData = new FormData()
  formData.append("image", image)
  formData.append("title", title)
  formData.append("category", category)

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    if (!response.ok) throw new Error("Erreur lors de l’ajout")

    const newWork = await response.json()
    allWorks.push(newWork)
    displayWorks(allWorks)
    displayWorksInModal(allWorks)

    resetToMainView()
    modal.showModal()
  } catch (error) {
    console.error("Erreur ajout projet :", error)
    alert("Erreur lors de l’ajout du projet")
  }
})
