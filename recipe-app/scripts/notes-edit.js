const titleElement = document.querySelector('#note-title')
const bodyElement= document.querySelector('#note-body')
const removeElement = document.querySelector('#remove-note')
const addIngredient = document.querySelector('#add-ingredient')

const ingredientEl = document.querySelector('#ingredients-body')
const dateElement = document.querySelector('#last-edited')
const noteId = location.hash.substring(1)
let notes = getSavedNotes()

let note = notes.find((note) => note.id === noteId)

if (note === undefined){
    location.assign('/index.html')
}



titleElement.value = note.title
bodyElement.value = note.body
dateElement.textContent = generateLastEdited(note.updatedAt)

renderIngredients(note.ingredients)

//ingredientEl.textContent = generateIngredients(note.ingredients)

//changes title when edited
titleElement.addEventListener('input', (e) => {
        note.title = e.target.value
        note.updatedAt = moment().valueOf()
        dateElement.textContent = generateLastEdited(note.updatedAt)
        saveNotes(notes)
    })

//changes body when edited
bodyElement.addEventListener('input', (e) =>{
    note.body = e.target.value
    note.updatedAt = moment().valueOf()
    dateElement.textContent = generateLastEdited(note.updatedAt)
    saveNotes(notes)
})

//remove button
removeElement.addEventListener('click', () =>{
    removeNote(note.id)
    saveNotes(notes)
    location.assign('/index.html')
})

//add ingredient button
addIngredient.addEventListener('submit', (e) =>{
    
    let ingredientText = e.target.elements.text.value.trim()
    e.preventDefault()
    
    if (ingredientText.length != 0){
        
        note.ingredients.push({
            id: uuidv4(),
            ingredient: ingredientText,
            have: false
        })
        
        note.updatedAt = moment().valueOf()
        dateElement.textContent = generateLastEdited(note.updatedAt)
        renderNewIngredient(note.ingredients[note.ingredients.length-1])
        saveNotes(notes)
    }
   
        e.target.elements.text.value=''

})


//changes other tab(s) to reflect changes in edit page
window.addEventListener('storage', (e) =>{
    if (e.key === 'notes'){
        notes = JSON.parse(e.newValue)
        note = notes.find((note) => note.id === noteId)
        
        if (!note){
            location.assign('/index.html')
        }
        
        
        titleElement.value = note.title
        bodyElement.value = note.body
        dateElement.textContent = generateLastEdited(note.updatedAt)
    }
})