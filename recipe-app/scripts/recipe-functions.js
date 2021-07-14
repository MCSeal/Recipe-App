
//read existing recipes for LS
getSavedRecipes = () => {
    const recipesJSON = localStorage.getItem('recipes')
    return recipesJSON !== null ? JSON.parse(recipesJSON) : []
}

//save the recipes to ls

saveRecipes = (recipes) =>{
    localStorage.setItem('recipes', JSON.stringify(recipes))
}

//remove recipe

removeRecipe = (id) => {
    const recipeIndex = recipes.findIndex((recipe) => recipe.id === id)

    if (recipeIndex > -1){
        recipes.splice(recipeIndex, 1)
    }

}

removeIngredient = (id) => {
   const ingredientIndex = recipe.ingredients.findIndex((ingredient) => ingredient.id === id)

    if (ingredientIndex > -1){
        recipe.ingredients.splice(ingredientIndex, 1)
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
            saveRecipes(recipes)
            
            
        })

// //setup remove button
    removeButton.textContent = 'remove'
    removeButton.classList.add('button', 'button--text')
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () =>{
        removeIngredient(ingredient.id)
        saveRecipes(recipes)
        
    })
    
    return todoEl

}

//toggle checkbox complete
//major ballbuster, have doesn't change even though it should
toggleHave = (id) => {
    function findId(id, ingredients){
        for (var i=0; i < recipe.ingredients.length; i++){
            if (recipe.ingredients[i].id === id){
              return ingredients[i]
            }
        }
    
    }
    let ingredient= findId(id, recipe.ingredients)
    if (ingredient !== undefined){
        ingredient.have = !ingredient.have
        var summ = document.querySelector('.list-title')
        const haveIngredients = recipe.ingredients.filter(function(ingredient){
        return ingredient.have == true
    })
        
        summ.textContent = `You have ${haveIngredients.length} ingredients of ${recipe.ingredients.length} needed.`
        //summary.textContent = `You have ${haveIngredients.length} ingredients of ${recipe.ingredients.length} needed.`
        //renderIngredients(recipe.ingredients)
        }
}

generateIngSummary = () => {
    const haveIngredients = recipe.ingredients.filter(function(ingredient){
        return ingredient.have == true
    })
    var summ = document.querySelector('.list-title')
    summ.textContent = `You have ${haveIngredients.length} ingredients of ${recipe.ingredients.length} needed.`
}



const renderIngredients = (ingredient) => {
    const haveIngredients = recipe.ingredients.filter(function(ingredient){
        return ingredient.have == true
    })
   document.querySelector('.ingredients-body').appendChild(generateSummaryDOM(haveIngredients))
    
    
   const ingEl = document.querySelector('.ingredients-body')
   filteredIng = recipe.ingredients
   
    recipe.ingredients.forEach((ingredient)=>{
        ingEl.appendChild(generateIngredients(ingredient))
    })
    

}

const renderNewIngredient = (ingredient) => {
    document.querySelector('.ingredients-body').appendChild(generateIngredients(ingredient))
}


// generate the dom structure for recipe

generateRecipeDom = (recipe) =>{
    
    const recipeEl = document.createElement('a')
    const textEl = document.createElement('p')
    const statusEl = document.createElement('p')

    if(recipe.title.length > 0){
        textEl.textContent = recipe.title 
    } else{
        textEl.textContent = 'Unnamed recipe'
    }
    textEl.classList.add('list-item__title')
    recipeEl.appendChild(textEl)

    //setup link
    recipeEl.setAttribute('href', `/edit.html#${recipe.id}`)
    recipeEl.classList.add('list-item')

    statusEl.textContent = generateLastEdited(recipe.updatedAt)
    statusEl.classList.add('list-item__subtitle')
    recipeEl.appendChild(statusEl)

    return recipeEl
}

 
generateSummaryDOM = (haveIngredients) =>{
    const summary = document.createElement('h2')
    summary.classList.add('list-title')
    summary.textContent = `You have ${haveIngredients.length} ingredients of ${recipe.ingredients.length} needed.`
    
    return summary
}


//sorts functions by that dropdown
 sortRecipes = (recipes, sortBy) => {
    if (sortBy === 'byEdited'){
        return recipes.sort((a, b) => {
                if (a.updatedAt > b.updatedAt) {
                    return -1
                } else if (a.updatedAt < b.updatedAt) {
                    return 1
                } else {
                    return 0
                }
            })
    } else if (sortBy === 'byCreated') {
        return recipes.sort((a, b) => {
            if (a.createdAt > b.createdAt){
                return -1
            } else if (a.createdAt < b.createdAt) {
                return 1
            } else {
                return 0
            }
        })
    } else if (sortBy === 'alphabetical') {
        return recipes.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()){
                return -1
            } else if (a.title.toLowerCase() > b.title.toLowerCase()){
                return 1
            } else {
                return 0
            }
        })
    } else {
        return recipes
    }
 }



//render recipes
const renderRecipes = (recipes, filters) => {
    const recipesEl = document.querySelector('#recipes')
    recipes = sortRecipes(recipes, filters.sortBy)
    const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(filters.searchText.toLowerCase()))

    recipesEl.innerHTML = ''
    
    if (filteredRecipes.length > 0){
        filteredRecipes.forEach((recipe) =>{
            const recipeEl = generateRecipeDom(recipe)
            recipesEl.appendChild(recipeEl)
        })
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No recipes to show at the moment, try adding some.'
        //make class to JS created variability
        emptyMessage.classList.add('empty-message')
        recipesEl.appendChild(emptyMessage)
    }

}

//generate last edited message

generateLastEdited = (timestamp) => {
    return `Last edited ${moment(timestamp).fromNow()}`
}