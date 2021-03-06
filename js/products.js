const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
var currentCategoriesArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function sortCategories(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) {
        return -1;
      }
      if (aCount < bCount) {
        return 1;
      }
      return 0;
    });
  }

  return result;
}

function showCategoriesList() {
  let htmlContentToAppend = "";
  for (let i = 0; i < currentCategoriesArray.length; i++) {
    let category = currentCategoriesArray[i];

    if (
      (minCount == undefined ||
        (minCount != undefined &&
          parseInt(category.cost) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(category.cost) <= maxCount))
    ) {
      if (
        query == undefined ||
        category.name.toLowerCase().indexOf(query) != -1 ||
        category.description.toLowerCase().indexOf(query) != -1
      ) {
        htmlContentToAppend += `
            <div class="col-md-4 col-lg-3">

            <a href="#" class="card mb-4 shadow-sm custom-card">

              <img src="${category.imgSrc}" class="card-img-top">
              <div class="card-body">
              <h3 class="mb-3">${category.name}</h3>
              <h6 class="card-subtitle mb-2 text-muted">${category.currency} ${category.cost}</h6>
                  <p class="card-text">
                    ${category.description}
                  </p>
              </div>
              
            </a>

          </div>
        `;
      }
    }

    if (htmlContentToAppend === "") {
      document.getElementById("contenido").innerHTML = `<h3 class="mt-5">Producto no encontrado...</h3>`
      // Opción de "Elemento no encontrado" con un Gif
      // document.getElementById("contenido").innerHTML = `<img src="./img/travolta.gif" class="mt-4">`
    } else {
      document.getElementById("contenido").innerHTML = htmlContentToAppend;
    }
  }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;

  if (categoriesArray != undefined) {
    currentCategoriesArray = categoriesArray;
  }

  currentCategoriesArray = sortCategories(
    currentSortCriteria,
    currentCategoriesArray
  );

  //Muestro las categorías ordenadas
  showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  query = document.getElementById("buscadorDOM").value.toLowerCase();

  getJSONData(PRODUCTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
    }
  });

  document.getElementById("sortAsc").addEventListener("click", function () {
    sortAndShowCategories(ORDER_ASC_BY_NAME);
  });

  document.getElementById("sortDesc").addEventListener("click", function () {
    sortAndShowCategories(ORDER_DESC_BY_NAME);
  });

  document
    .getElementById("sortByCount")
    .addEventListener("click", function () {
      sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

  document
    .getElementById("clearRangeFilter")
    .addEventListener("click", function () {
      document.getElementById("rangeFilterCountMin").value = "";
      document.getElementById("rangeFilterCountMax").value = "";

      minCount = undefined;
      maxCount = undefined;

      showCategoriesList();
    });

  document
    .getElementById("rangeFilterCount")
    .addEventListener("click", function () {
      //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
      //de productos por categoría.
      minCount = document.getElementById("rangeFilterCountMin").value;
      maxCount = document.getElementById("rangeFilterCountMax").value;

      if (
        minCount != undefined &&
        minCount != "" &&
        parseInt(minCount) >= 0
      ) {
        minCount = parseInt(minCount);
      } else {
        minCount = undefined;
      }

      if (
        maxCount != undefined &&
        maxCount != "" &&
        parseInt(maxCount) >= 0
      ) {
        maxCount = parseInt(maxCount);
      } else {
        maxCount = undefined;
      }

      showCategoriesList();
    });

  document.getElementById("buscadorDOM").addEventListener("input", function (e) {
    query = document.getElementById("buscadorDOM").value.toLowerCase();
    showCategoriesList();
  })

});