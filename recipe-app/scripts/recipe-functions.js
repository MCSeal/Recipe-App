
// pull whatever recipes are already saved in localStorage
const getSavedRecipes = () => {
    const recipesJSON = localStorage.getItem('recipes')
    return recipesJSON !== null ? JSON.parse(recipesJSON) : []
}

// persist the full recipes array back to localStorage
const saveRecipes = (recipes) => {
    localStorage.setItem('recipes', JSON.stringify(recipes))
}

const removeRecipe = (id) => {
    const recipeIndex = recipes.findIndex((recipe) => recipe.id === id)

    if (recipeIndex > -1) {
        recipes.splice(recipeIndex, 1)
    }
}

const removeIngredient = (id) => {
    const ingredientIndex = recipe.ingredients.findIndex((ingredient) => ingredient.id === id)

    if (ingredientIndex > -1) {
        recipe.ingredients.splice(ingredientIndex, 1)
        location.reload()
    }
}

const generateIngredients = (ingredient) => {
    const todoEl = document.createElement('label')
    const containerEl = document.createElement('div')
    const todoText = document.createElement('span')
    const checkbox = document.createElement('input')
    checkbox.classList.add('checkbox')
    const removeButton = document.createElement('button')

    // text
    todoText.textContent = ingredient.ingredient
    containerEl.appendChild(todoText)

    // container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

    // have/don't-have checkbox
    checkbox.setAttribute('type', 'checkbox')
    checkbox.checked = ingredient.have
    containerEl.appendChild(checkbox)

    checkbox.addEventListener('change', () => {
        toggleHave(ingredient.id)
        saveRecipes(recipes)
    })

    // remove button
    removeButton.textContent = 'remove'
    removeButton.setAttribute('type', 'button')
    removeButton.setAttribute('aria-label', `Remove ${ingredient.ingredient}`)
    removeButton.classList.add('button', 'button--text')
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () => {
        removeIngredient(ingredient.id)
        saveRecipes(recipes)
    })

    return todoEl
}

// flips an ingredient's have/don't-have state and updates the summary line
const toggleHave = (id) => {
    const ingredient = recipe.ingredients.find((item) => item.id === id)
    if (ingredient === undefined) return

    ingredient.have = !ingredient.have
    generateIngSummary()
}

// updates the "You have X of Y ingredients" line - called any time the
// ingredient list changes (toggled, added, or removed)
const generateIngSummary = () => {
    const haveIngredients = recipe.ingredients.filter((ingredient) => ingredient.have === true)
    const summary = document.querySelector('.list-title')
    if (summary) {
        summary.textContent = `You have ${haveIngredients.length} ingredients of ${recipe.ingredients.length} needed.`
    }
}

const renderIngredients = () => {
    const haveIngredients = recipe.ingredients.filter((ingredient) => ingredient.have === true)
    const ingEl = document.querySelector('.ingredients-body')

    ingEl.appendChild(generateSummaryDOM(haveIngredients))

    recipe.ingredients.forEach((ingredient) => {
        ingEl.appendChild(generateIngredients(ingredient))
    })
}

// adds one new ingredient row without re-rendering the whole list, then
// refreshes the summary line - this used to be skipped here, which is
// why the "have X of Y" count never updated when you added a fresh
// ingredient (it only updated when you toggled an existing checkbox)
const renderNewIngredient = (ingredient) => {
    document.querySelector('.ingredients-body').appendChild(generateIngredients(ingredient))
    generateIngSummary()
}

const generateRecipeDom = (recipe) => {
    const recipeEl = document.createElement('a')
    const textEl = document.createElement('p')
    const statusEl = document.createElement('p')

    textEl.textContent = recipe.title.length > 0 ? recipe.title : 'Unnamed recipe'
    textEl.classList.add('list-item__title')
    recipeEl.appendChild(textEl)

    recipeEl.setAttribute('href', `/edit.html#${recipe.id}`)
    recipeEl.classList.add('list-item')

    statusEl.textContent = generateLastEdited(recipe.updatedAt)
    statusEl.classList.add('list-item__subtitle')
    recipeEl.appendChild(statusEl)

    return recipeEl
}

const generateSummaryDOM = (haveIngredients) => {
    const summary = document.createElement('h2')
    summary.classList.add('list-title')
    summary.textContent = `You have ${haveIngredients.length} ingredients of ${recipe.ingredients.length} needed.`
    return summary
}

// sorts the recipe list according to the dropdown selection
const sortRecipes = (recipes, sortBy) => {
    if (sortBy === 'byEdited') {
        return recipes.sort((a, b) => b.updatedAt - a.updatedAt)
    } else if (sortBy === 'byCreated') {
        return recipes.sort((a, b) => b.createdAt - a.createdAt)
    } else if (sortBy === 'alphabetical') {
        return recipes.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
    } else {
        return recipes
    }
}

const renderRecipes = (recipes, filters) => {
    const recipesEl = document.querySelector('#recipes')
    recipes = sortRecipes(recipes, filters.sortBy)
    const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(filters.searchText.toLowerCase()))

    recipesEl.innerHTML = ''

    if (filteredRecipes.length > 0) {
        filteredRecipes.forEach((recipe) => {
            recipesEl.appendChild(generateRecipeDom(recipe))
        })
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No recipes to show at the moment, try adding some.'
        emptyMessage.classList.add('empty-message')
        recipesEl.appendChild(emptyMessage)
    }
}

const generateLastEdited = (timestamp) => {
    return `Last edited ${moment(timestamp).fromNow()}`
}
