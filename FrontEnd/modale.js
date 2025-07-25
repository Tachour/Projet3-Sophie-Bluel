// === OUVERTURE / FERMETURE DE LA MODALE ===
const openModalBtn = document.querySelector(".edit-works")
const modal = document.getElementById("galleryModale")
const closeModalBtn = document.getElementById("closeModaleBtn")

openModalBtn.addEventListener("click", () => {
  resetToMainView() // Toujours revenir sur la vue principale
  modal.showModal()
})

closeModalBtn.addEventListener("click", () => {
  modal.close()
})

// Ferme la modale au clic en dehors (overlay)
modal.addEventListener("click", (event) => {
  const modalContent = modal.querySelector(".modale-content")
  if (!modalContent.contains(event.target)) {
    modal.close()
    resetToMainView() // On reset aussi si fermeture par clic extérieur
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
}

// ====== AFFICHAGE DES PROJETS DANS LA MODALE ======
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
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          figure.remove()
          const mainGallery = document.querySelector(".gallery")
          const mainProject = mainGallery.querySelector(`[data-id="${work.id}"]`)
          if (mainProject) mainProject.remove()
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

// === GESTION DES VUES ===
const galerieView = document.getElementById("galleryView")
const formView = document.getElementById("addPhotoView")
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
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      previewContainer.innerHTML = `<img src="${reader.result}" class="preview-img" />`
      previewContainer.style.display = "block"
      checkFormFields()
    }
    reader.readAsDataURL(file)
  } else {
    previewContainer.style.display = "none"
    checkFormFields()
  }
})

// === VALIDATION DYNAMIQUE DU FORMULAIRE ===
const titleInput = document.getElementById("titleInput")
const categorySelect = document.getElementById("categorySelect")
const submitBtn = document.querySelector(".submit-btn")

;[titleInput, categorySelect].forEach(input => {
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
