// fixed: new ingredients didn't update the "have X of Y" count until you
// toggled a checkbox - see renderNewIngredient in recipe-functions.js

let recipes = getSavedRecipes()

const filters = {
    searchText: '',
    sortBy: 'byEdited'
}

renderRecipes(recipes, filters)

// add a blank recipe and jump straight to its edit page
document.querySelector('#create-recipe').addEventListener('click', () => {
    const id = uuidv4()
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

// live filter as you type
document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value
    renderRecipes(recipes, filters)
})

document.querySelector('#filter-by').addEventListener('change', (e) => {
    filters.sortBy = e.target.value
    renderRecipes(recipes, filters)
})

// keeps this tab in sync if recipes change in another tab/window
window.addEventListener('storage', (e) => {
    if (e.key === 'recipes') {
        recipes = JSON.parse(e.newValue)
        renderRecipes(recipes, filters)
    }
})
