//done 
$(document).ready(function () {
  const $recipesList = $("#recipes-list"); // Select the recipes list container

  // Check if the page has the container for listing recipes
  if ($recipesList.length) {
    // Load recipe data from the JSON file
    $.getJSON("recipes_array.json", function (recipes) {
      // Load the card template
      $.get("recipemenutemplate.html", function (template) {
        recipes.forEach(recipe => {
          // Replace placeholders in the template with actual recipe data
          const populatedTemplate = template
            .replace("{image}", recipe.image)
            .replace("{title}", recipe.title)
            .replace("{exerpt}", recipe.exerpt)
            .replace("{id}", recipe.id);

          // Append the populated template to the recipes list
          $recipesList.append(populatedTemplate);
        });
      });
    });
  }

  // Check if the page is the recipe details page
  const $recipeDetails = $("#recipeDetails");
  if ($recipeDetails.length) {
    const recipeId = getQueryParam('id'); // Get the recipe ID from the URL

    // Load recipe data from the JSON file
    $.getJSON("recipes_array.json", function (recipes) {
      const recipe = recipes.find(r => r.id.toLowerCase() === recipeId?.toLowerCase());

      // If recipe exists, load and populate the recipe details template
      if (recipe) {
        $.get("recipe_template.html", function (template) {
          const stepsList = recipe.steps.map(step => `<li>${step}</li>`).join('');
          const populatedTemplate = template
            .replace("{image}", recipe.image)
            .replace("{title}", recipe.title)
            .replace("{exerpt}", recipe.exerpt)
            .replace("{steps}", stepsList);

          // Insert the populated template into the container
          $recipeDetails.html(populatedTemplate);
        });
      }
    });
  }
});

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Handler for the data stored in  recipes_array.json
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        // Fetch the JSON data
        $.getJSON('recipes.json', function(recipes) {
            // Find the recipe by ID
            const recipe = recipes.find(r => r.id === recipeId);

            if (recipe) {
                // Populate 
                $('#recipeTitle').text(recipe.title);
                $('#recipeImage').attr('src', recipe.image).attr('alt', recipe.title);
                $('#recipeExerpt').text(recipe.exerpt);

              // Populate the ingredients list
               $('#ingredientsList').empty(); // Clear existing content
              recipe.ingredients.forEach(ingredient => {
              const ingredientItem = `<li class="list-group-item">${ingredient}</li>`;
              $('#ingredientsList').append(ingredientItem);
               });

                // Clears the steps container before use
                $('#stepsContainer').empty();

                // Loops through the steps array and add each step of the recipe
                recipe.steps.forEach((step, index) => {
                    const stepElement = $('<div class="steps"></div>');
                    stepElement.text(`Step ${index + 1}: ${step}`);
                    $('#stepsContainer').append(stepElement);
                });
            } else {
                $('#recipeDetails').html('<p>Recipe not found.</p>');
            }
        }).fail(function() {
            $('#recipeDetails').html('<p>Error loading recipe data.</p>');
        });
    } else {
        $('#recipeDetails').html('<p>No recipe ID provided.</p>');
    }
});
