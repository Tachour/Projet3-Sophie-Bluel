// ****** Authentification de l'utilisateur ******

const form = document.querySelector(".login-form")
const errorMsg = document.getElementById("error-message")

form.addEventListener("submit", function (e) {
  e.preventDefault() // Empêche le rechargement

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(response =>
      response.json().then(data => ({
        status: response.status,
        body: data
      }))
    )
    .then(result => {
      if (result.status === 200) {
        // Connexion réussie
        localStorage.setItem("token", result.body.token)
        window.location.href = "index.html"
      } else {
        // Mauvais identifiants
        errorMsg.innerText = '"Erreur dans l’identifiant ou le mot de passe"'
        errorMsg.style.display = "block"
      }
    })
    
})
