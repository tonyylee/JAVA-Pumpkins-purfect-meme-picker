import { catsData } from '/data.js'

// Cache DOM elements for better clarity and maintainability
const DOM = {
  emotionRadiosContainer: document.getElementById('emotion-radios'),
  getImageBtn: document.getElementById('get-image-btn'),
  gifsOnlyOption: document.getElementById('gifs-only-option'),
  memeModalInner: document.getElementById('meme-modal-inner'),
  memeModal: document.getElementById('meme-modal'),
  memeModalCloseBtn: document.getElementById('meme-modal-close-btn')
}

// Setup event listeners
DOM.emotionRadiosContainer.addEventListener('change', highlightCheckedOption)
DOM.memeModalCloseBtn.addEventListener('click', closeModal)
DOM.getImageBtn.addEventListener('click', renderCat)
DOM.memeModal.addEventListener('click', handleModalClick)

// Highlight the selected radio’s parent div visually
function highlightCheckedOption(event) {
  const radios = document.getElementsByClassName('radio')
  // Remove highlight from all radios
  for (let radio of radios) {
    radio.classList.remove('highlight')
  }
  // Add highlight to selected radio's parent
  event.target.parentElement.classList.add('highlight')
}

// Close the modal by hiding it
function closeModal() {
  DOM.memeModal.style.display = 'none'
}

// Close modal if clicking outside the inner modal content
function handleModalClick(event) {
  if (event.target === DOM.memeModal) {
    closeModal()
  }
}

// Render a random (or single matching) cat image inside the modal and show it
function renderCat() {
  const catObject = getSingleCatObject()
  DOM.memeModalInner.innerHTML = `
    <img 
      class="cat-img" 
      src="./images/${catObject.image}"
      alt="${catObject.alt}"
    >
  `
  DOM.memeModal.style.display = 'flex'
}

// Get one cat object — if multiple match, pick a random one
function getSingleCatObject() {
  const catsArray = getMatchingCatsArray()
  if (catsArray.length === 1) {
    return catsArray[0]
  } else {
    const randomNumber = Math.floor(Math.random() * catsArray.length)
    return catsArray[randomNumber]
  }
}

// Filter catsData to get cats matching the selected emotion and gif preference
function getMatchingCatsArray() {
  const selectedRadio = document.querySelector('input[type="radio"]:checked')
  if (!selectedRadio) return []

  const selectedEmotion = selectedRadio.value
  const isGif = DOM.gifsOnlyOption.checked

  return catsData.filter(cat => {
    return cat.emotionTags.includes(selectedEmotion) && (!isGif || cat.isGif)
  })
}

// Create a list of unique emotions from all cats
function getEmotionsArray(cats) {
  const emotionsSet = new Set()
  for (const cat of cats) {
    for (const emotion of cat.emotionTags) {
      emotionsSet.add(emotion)
    }
  }
  return Array.from(emotionsSet)
}

// Render emotion radio buttons dynamically from unique emotions
function renderEmotionsRadios(cats) {
  const emotions = getEmotionsArray(cats)
  const radioItems = emotions.map(emotion => `
    <div class="radio">
      <label for="${emotion}">${emotion}</label>
      <input
        type="radio"
        id="${emotion}"
        value="${emotion}"
        name="emotions"
      >
    </div>
  `).join('')

  DOM.emotionRadiosContainer.innerHTML = radioItems
}

// Initial rendering of emotion radio buttons on page load
renderEmotionsRadios(catsData)
