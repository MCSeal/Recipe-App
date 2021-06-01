//read existing notes for LS
getSavedNotes = () => {
    const notesJSON = localStorage.getItem('notes')
    return notesJSON !== null ? JSON.parse(notesJSON) : []
}

//save the notes to ls

saveNotes = (notes) =>{
    localStorage.setItem('notes', JSON.stringify(notes))
}

//remove note

removeNote = (id) => {
    const noteIndex = notes.findIndex((note) => note.id === id)

    if (noteIndex > -1){
        notes.splice(noteIndex, 1)
    }

}

removeIngredient = (id) => {
   const ingredientIndex = note.ingredients.findIndex((ingredient) => ingredient.id === id)

    if (ingredientIndex > -1){
        note.ingredients.splice(ingredientIndex, 1)
        location.reload();
    }

}



const generateIngredients = (ingredient) => {
    const todoEl = document.createElement('label')
    const containerEl = document.createElement('div')
    const todoText = document.createElement('span')
    const checkbox = document.createElement('input')
    checkbox.classList.add('checkbox')
    const removeButton = document.createElement('button')
    
    
        
    //set up text
    todoText.textContent = ingredient.ingredient
    containerEl.appendChild(todoText)
    
    //setup container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

//setup have box
    checkbox.setAttribute('type', 'checkbox')
    checkbox.checked = ingredient.have
    
    containerEl.appendChild(checkbox)
    generateIngSummary();
    checkbox.addEventListener('change', () => {
            toggleHave(ingredient.id)
            saveNotes(notes)
            
            
        })

// //setup remove button
    removeButton.textContent = 'remove'
    removeButton.classList.add('button', 'button--text')
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () =>{
        removeIngredient(ingredient.id)
        saveNotes(notes)
        
    })
    
    return todoEl

}

//toggle checkbox complete
//major ballbuster, have doesn't change even though it should
toggleHave = (id) => {
    function findId(id, ingredients){
        for (var i=0; i < note.ingredients.length; i++){
            if (note.ingredients[i].id === id){
              return ingredients[i]
            }
        }
    
    }
    let ingredient= findId(id, note.ingredients)
    if (ingredient !== undefined){
        ingredient.have = !ingredient.have
        var summ = document.querySelector('.list-title')
        const haveIngredients = note.ingredients.filter(function(ingredient){
        return ingredient.have == true
    })
        
        summ.textContent = `You have ${haveIngredients.length} ingredients of ${note.ingredients.length} needed.`
        //summary.textContent = `You have ${haveIngredients.length} ingredients of ${note.ingredients.length} needed.`
        //renderIngredients(note.ingredients)
        }
}

generateIngSummary = () => {
    const haveIngredients = note.ingredients.filter(function(ingredient){
        return ingredient.have == true
    })
    var summ = document.querySelector('.list-title')
    summ.textContent = `You have ${haveIngredients.length} ingredients of ${note.ingredients.length} needed.`
}



const renderIngredients = (ingredient) => {
    const haveIngredients = note.ingredients.filter(function(ingredient){
        return ingredient.have == true
    })
   document.querySelector('.ingredients-body').appendChild(generateSummaryDOM(haveIngredients))
    
    
   const ingEl = document.querySelector('.ingredients-body')
   filteredIng = note.ingredients
   
    note.ingredients.forEach((ingredient)=>{
        ingEl.appendChild(generateIngredients(ingredient))
    })
    

}

const renderNewIngredient = (ingredient) => {
    document.querySelector('.ingredients-body').appendChild(generateIngredients(ingredient))
}


// generate the dom structure for note

generateNoteDom = (note) =>{
    
    const noteEl = document.createElement('a')
    const textEl = document.createElement('p')
    const statusEl = document.createElement('p')

    if(note.title.length > 0){
        textEl.textContent = note.title 
    } else{
        textEl.textContent = 'Unnamed note'
    }
    textEl.classList.add('list-item__title')
    noteEl.appendChild(textEl)

    //setup link
    noteEl.setAttribute('href', `/edit.html#${note.id}`)
    noteEl.classList.add('list-item')

    statusEl.textContent = generateLastEdited(note.updatedAt)
    statusEl.classList.add('list-item__subtitle')
    noteEl.appendChild(statusEl)

    return noteEl
}

 
generateSummaryDOM = (haveIngredients) =>{
    const summary = document.createElement('h2')
    summary.classList.add('list-title')
    summary.textContent = `You have ${haveIngredients.length} ingredients of ${note.ingredients.length} needed.`
    
    return summary
}


//sorts functions by that dropdown
 sortNotes = (notes, sortBy) => {
    if (sortBy === 'byEdited'){
        return notes.sort((a, b) => {
                if (a.updatedAt > b.updatedAt) {
                    return -1
                } else if (a.updatedAt < b.updatedAt) {
                    return 1
                } else {
                    return 0
                }
            })
    } else if (sortBy === 'byCreated') {
        return notes.sort((a, b) => {
            if (a.createdAt > b.createdAt){
                return -1
            } else if (a.createdAt < b.createdAt) {
                return 1
            } else {
                return 0
            }
        })
    } else if (sortBy === 'alphabetical') {
        return notes.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()){
                return -1
            } else if (a.title.toLowerCase() > b.title.toLowerCase()){
                return 1
            } else {
                return 0
            }
        })
    } else {
        return notes
    }
 }



//render notes
const renderNotes = (notes, filters) => {
    const notesEl = document.querySelector('#notes')
    notes = sortNotes(notes, filters.sortBy)
    const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(filters.searchText.toLowerCase()))

    notesEl.innerHTML = ''
    
    if (filteredNotes.length > 0){
        filteredNotes.forEach((note) =>{
            const noteEl = generateNoteDom(note)
            notesEl.appendChild(noteEl)
        })
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No notes to show at the moment, try adding some.'
        //make class to JS created variability
        emptyMessage.classList.add('empty-message')
        notesEl.appendChild(emptyMessage)
    }

}

//generate last edited message

generateLastEdited = (timestamp) => {
    return `Last edited ${moment(timestamp).fromNow()}`
}