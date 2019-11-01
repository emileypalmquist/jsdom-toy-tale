let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })
  fetchToys()
  listenForSubmit()
  getToyLikesButton()
})

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then (resp => resp.json())
    .then (toys => toyCard(toys))
}

function getToyCollection() {
  return toyCollection = document.getElementById('toy-collection')
}

function toyCard(allToys) {
  getToyCollection().innerHTML = allToys.map ( e =>
    renderSingleToy(e)
  ).join('');
}

function renderSingleToy(toy) {
  return `
    <div class="card", id="${toy.id}">
    <h2>"${toy.name}"</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes </p>
    <button class="like-btn", id="${toy.id}">Like <3</button>
    </div>
  `
}

function listenForSubmit() {
  const addToyButton = document.querySelector('.add-toy-form');
  addToyButton.addEventListener('submit', event => {
    event.preventDefault();
    getToyInfo(event)
  })
}

function getToyInfo(event) {
  const form = event.target
  const name = form.name.value
  const image = form.image.value

  const toy = {
    'name': name,
    'image': image,
    'likes': 0
  }
  newToy(toy)
}

function newToy(toy) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toy)
  }).then(resp => resp.json())
    .then(data => fetchToys(data))  
}

function getToyLikesButton() {
  getToyCollection().addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
      handleLikeButton(event)
    }
  })
}


function handleLikeButton(event) {
  const likedToyContainer = event.target.parentElement
  const toyId = likedToyContainer.id
  const likeDisplay = likedToyContainer.querySelector('p')
  const arrayLikesData = likeDisplay.innerText.split(' ')
  const likesUpdated = parseInt(arrayLikesData[0]) + 1
  const uLikes = likeDisplay.textContent = `${likesUpdated} Likes`
  
  updateLikes(toyId, likesUpdated)
}


function updateLikes(toyId, likesUpdated) {

  const id = parseInt(toyId)
  fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        'likes': likesUpdated
      })
  })
    

}