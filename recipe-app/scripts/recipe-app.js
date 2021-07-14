//what to do next-----
//Recipe ingredients amount doesn't change when new ing added, only when clicked on first
//fix that
//2nd..... unnamed note if you make ingredient and it doesnt get assigned a tittle... this will not be alhpabetically arranged.. not sure if should fix

//%85 percent done


let recipes= getSavedRecipes()

const filters = {
    searchText: '',
    sortBy: 'byEdited'
}

renderRecipes(recipes, filters)

//add to recipes and save and render
document.querySelector('#create-recipe').addEventListener('click', (e) =>{
    const id = uuidv4()
    //timestamp with moment
    const timestamp = moment().valueOf()
    recipes.push({
        id: id,
        title: '',
        body: '',
        ingredients: [],
        createdAt: timestamp,
        updatedAt: timestamp
    })

    saveRecipes(recipes)
    location.assign(`/edit.html#${id}`)
})



//change can be used when you click away, 'input' is as it goes in real time

document.querySelector('#search-text').addEventListener('input', (e) =>{
    filters.searchText = e.target.value
    renderRecipes(recipes, filters)
})


//for name form.. contains prevent default example


//for dropdown
document.querySelector('#filter-by').addEventListener('change', (e) =>{
    filters.sortBy = e.target.value
    renderRecipes(recipes, filters)
    
})


//this is the live reload stuff
window.addEventListener('storage', (e) =>{
    if (e.key ==='recipes'){
        recipes = JSON.parse(e.newValue)
        renderRecipes(recipes, filters)
    }
})

