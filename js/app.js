//!1. declarar variáveis referentes ao form e usar document.querySelector
let inputName = document.querySelector("#filter-name"); //*nome do produto
let selectFilterType = document.querySelector("#filter-type"); //*tipo de produto
let selectFilterBrand = document.querySelector("#filter-brand"); //* a marca do produto
let selectSortType = document.querySelector("#sort-type"); //*filtro de avalização
let sectionProducts = document.querySelector(".catalog");

//!2. Declarar a variável que vai receber todos os produtos
let produtosAll = []; //*array dos produtos

//!2. Criar método load - SERVE PARA CARREGAR OS PRODUTOS
async function load() {
  //!2.2  promises / async / await
  //!carregar as lista dos produtos usando o metodo fecth e asycn - await dos itens 3.1,3.1.1, e 3.1.2
  const promiseData = await fetch("http://localhost:3000/products"); //?uma função, um retorno de uma promessa pega os produtos da internet
  //const promiseData = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json');

  const data = await promiseData.json();

  //!2.3 Métodos de array: map, interando e recuperando o necessarios
  const brands = [...new Set(data.map((p) => p.brand))]; //!2.4 Collection: Set
  const product_types = [...new Set(data.map((p) => p.product_type))]; // os tres ponto tem afunção de espelha todos os elementos

  //!cchamando as funções builfForm e buildCatalog
  buildForm(brands, product_types);
  produtosAll = data;
  buildCatalog(data);
} //!pesquisar sobre a parte de builfForm
//forEach - evitar o codigo padrao do for
//!lembrar de chamar a propria função
load();
//!iten 6
function buildCatalog(listProducts) {
  let productAll = "";
  listProducts.forEach((p) => {
    const productHtml = productItem(p);
    productAll += productHtml;
  });

  sectionProducts.innerHTML = productAll;
}
//! construindo o formulario e definindo os parametros
function buildForm(arrayBrands, arrayTypes) {
  //!7.2 Há os selects de marca e tipo, além do select para ordenação e o campo de texto de busca. Em todos acrescentamos class="input-filter".
  //! Assim, poderemos recuperar todos de uma vez e adicionarmos o tratador de eventos.
  document.querySelectorAll(".input-filter").forEach((item) => {
    //!7.1 Criar o método createEventFilters, e deixar sua chamada também na função load;
    const eventFilter = (event) => {
      // Aqui há um laço sobre os itens
      //!recuperando as referências dos inputs para obter os valores em breve:
      const name = inputName.value;
      const brand =
        selectFilterBrand.options[selectFilterBrand.selectedIndex].value;
      const type =
        selectFilterType.options[selectFilterType.selectedIndex].value;
      const sortbY = selectSortType.options[selectSortType.selectedIndex].text;
      //!aplicando o filtro na coleção de produtos
      let result = produtosAll;

      if (name) {
        result = result.filter((p) =>
          p.name.toUpperCase().includes(name.toUpperCase())
        );
      }
      if (brand) {
        result = result.filter((p) => p.brand == brand);
      }
      if (type) {
        result = result.filter((p) => p.product_type == type);
      }
      if (sortbY) {
        //!a implementação da ordenação
        switch (sortbY) {
          case "Melhor Avaliados":
            result.sort((p1, p2) => (p2.rating | 0) - (p1.rating | 0));
            break;
          case "Menores Preços":
            result.sort(
              (p1, p2) => parseFloat(p1.price) - parseFloat(p2.price)
            );
            break;
          case "Maiores Preços":
            result.sort(
              (p1, p2) => parseFloat(p2.price) - parseFloat(p1.price)
            );
            break;
          case "A-Z":
            result.sort((p1, p2) => {
              if (p2.name > p1.name) return -1;

              if (p1.name > p2.name) return 1;

              return 0;
            });
            break;
          case "Z-A":
            result.sort((p1, p2) => {
              if (p1.name > p2.name) return -1;

              if (p2.name > p1.name) return 1;

              return 0;
            });

            break;
        }
      }
      buildCatalog(result);
    };

    item.addEventListener("change", eventFilter);
  });
  //! laços sobre os arrays
  arrayBrands.forEach((b) => {
    option = document.createElement("option");
    option.value = b;
    option.text = b;
    selectFilterBrand.add(option);
  });

  arrayTypes.forEach((b) => {
    option = document.createElement("option");
    option.value = b;
    option.text = b;
    selectFilterType.add(option);
  });
}
function productItem(product) {
  //!productItem alterado
  const item = `<div class="product" data-name="${product.name}" data-brand="${
    product.brand
  }" data-type="${product.category}" tabindex="508">
    <figure class="product-figure">
        <img src="${product.image_link}" 
            width="215" height="215" 
            alt="${product.image_link}" 
            onerror="javascript:this.src='img/unavailable.png'">
    </figure>
    <section class="product-description">
        <h1 class="product-name">${product.name}</h1>
        <div class="product-brands"><span class="product-brand background-brand">${
          product.brand
        }</span>
    <span class="product-brand background-price">${
      product.price * 5.5
    }</span></div>
    </section>
    ${loadDetails(product)}
    </div>`;

  return item;
}
//! itens 5, 5.1 e 5.2
function loadDetails(product) {
  //!loadDetails alterado
  let details = `<section class="product-details"><div class="details-row">
  <div>Brand</div>
  <div class="details-bar">
    <div class="details-bar-bg" style="width= 250">${product.brand}</div>
  </div>
</div><div class="details-row">
  <div>Price</div>
  <div class="details-bar">
    <div class="details-bar-bg" style="width= 250">${
      (product.price * 5.5) | 0
    }</div>
  </div>
</div><div class="details-row">
  <div>Rating</div>
  <div class="details-bar">
    <div class="details-bar-bg" style="width= 250">${
      parseFloat(product.rating) | 0
    }</div>
  </div>
</div><div class="details-row">
  <div>Category</div>
  <div class="details-bar">
    <div class="details-bar-bg" style="width= 250">${
      product.category || ""
    }</div>
  </div>
</div><div class="details-row">
  <div>Product_type</div>
  <div class="details-bar">
    <div class="details-bar-bg" style="width= 250">${
      product.product_type || ""
    }</div>
  </div>
</div></section>`;

  return details;
}
