const titleElement = document.querySelector('#recipe-title')
const bodyElement = document.querySelector('#recipe-body')
const removeElement = document.querySelector('#remove-recipe')
const addIngredient = document.querySelector('#add-ingredient')
const dateElement = document.querySelector('#last-edited')
const recipeId = location.hash.substring(1)

let recipes = getSavedRecipes()
let recipe = recipes.find((recipe) => recipe.id === recipeId)

if (recipe === undefined) {
    location.assign('/index.html')
}

titleElement.value = recipe.title
bodyElement.value = recipe.body
dateElement.textContent = generateLastEdited(recipe.updatedAt)

renderIngredients()

// title edits save as you type
titleElement.addEventListener('input', (e) => {
    recipe.title = e.target.value
    recipe.updatedAt = moment().valueOf()
    dateElement.textContent = generateLastEdited(recipe.updatedAt)
    saveRecipes(recipes)
})

// recipe steps save as you type
bodyElement.addEventListener('input', (e) => {
    recipe.body = e.target.value
    recipe.updatedAt = moment().valueOf()
    dateElement.textContent = generateLastEdited(recipe.updatedAt)
    saveRecipes(recipes)
})

removeElement.addEventListener('click', () => {
    removeRecipe(recipe.id)
    saveRecipes(recipes)
    location.assign('/index.html')
})

addIngredient.addEventListener('submit', (e) => {
    e.preventDefault()

    const ingredientText = e.target.elements.text.value.trim()

    if (ingredientText.length !== 0) {
        recipe.ingredients.push({
            id: uuidv4(),
            ingredient: ingredientText,
            have: false
        })

        recipe.updatedAt = moment().valueOf()
        dateElement.textContent = generateLastEdited(recipe.updatedAt)
        renderNewIngredient(recipe.ingredients[recipe.ingredients.length - 1])
        saveRecipes(recipes)
    }

    e.target.elements.text.value = ''
})

// keeps this tab in sync if the recipe changes in another tab/window
window.addEventListener('storage', (e) => {
    if (e.key === 'recipes') {
        recipes = JSON.parse(e.newValue)
        recipe = recipes.find((recipe) => recipe.id === recipeId)

        if (!recipe) {
            location.assign('/index.html')
            return
        }

        titleElement.value = recipe.title
        bodyElement.value = recipe.body
        dateElement.textContent = generateLastEdited(recipe.updatedAt)
    }
})
