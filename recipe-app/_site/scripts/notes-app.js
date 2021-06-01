//what to do next-----
//Recipe ingredients amount doesn't change when new ing added, only when clicked on first
//fix that
//2nd..... unnamed note if you make ingredient and it doesnt get assigned a tittle... this will not be alhpabetically arranged.. not sure if should fix

//%85 percent done


let notes= getSavedNotes()

const filters = {
    searchText: '',
    sortBy: 'byEdited'
}

renderNotes(notes, filters)

//add to notes and save and render
document.querySelector('#create-note').addEventListener('click', (e) =>{
    const id = uuidv4()
    //timestamp with moment
    const timestamp = moment().valueOf()
    notes.push({
        id: id,
        title: '',
        body: '',
        ingredients: [],
        createdAt: timestamp,
        updatedAt: timestamp
    })

    saveNotes(notes)
    location.assign(`/edit.html#${id}`)
})



//change can be used when you click away, 'input' is as it goes in real time

document.querySelector('#search-text').addEventListener('input', (e) =>{
    filters.searchText = e.target.value
    renderNotes(notes, filters)
})


//for name form.. contains prevent default example


//for dropdown
document.querySelector('#filter-by').addEventListener('change', (e) =>{
    filters.sortBy = e.target.value
    renderNotes(notes, filters)
    
})


//this is the live reload stuff
window.addEventListener('storage', (e) =>{
    if (e.key ==='notes'){
        notes = JSON.parse(e.newValue)
        renderNotes(notes, filters)
    }
})

