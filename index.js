// Variáveis de controle
const mainCtn = document.getElementById("main-ctn");
const itemsToAdd = [];
const itemsToEdit = [];
let editingListId = '';

// Evendo de load da janela, sempre renderizando a pagina principal
window.onload = () => {
  moveToMainPage();
};

// Funcao para controlar o header da pagina que contem o titulo da pagina e os botoes laterais.
function controlHeading(page) {
  const headingCtn = document.getElementById("heading-ctn");
  const headingTitle = document.getElementById("heading-title");
  const title = document.getElementById("title");

  const clearIcons = () => {
    const addIcon = document.getElementById("add");
    const saveIcon = document.getElementById("save");
    const editIcon = document.getElementById("edit");
    const backIcon = document.getElementById("back");

    const icons = [addIcon, saveIcon, editIcon, backIcon];
    icons.forEach((icon) => {
      if (icon) {
        headingCtn.removeChild(icon);
      }
    });
  };

  switch (page) {
    case "main": {
      clearIcons();
      const addIcon = document.createElement("div");
      addIcon.id = "add";
      addIcon.className = "absolute right-10 cursor-pointer";
      addIcon.innerHTML = `
          <i class="fa-solid fa-circle-plus"></i>
      `;
      addIcon.addEventListener("click", moveToAddListScreen);

      headingCtn.insertBefore(addIcon, headingTitle);
      title.innerText = "Minhas Listas";
      break;
    }
    case "add": {
      clearIcons();
      const backIcon = document.createElement("div");
      backIcon.id = "back";
      backIcon.className = "absolute left-10 cursor-pointer";
      backIcon.innerHTML = `
          <i class="fa-solid fa-angle-left"></i>
      `;
      backIcon.addEventListener("click", moveToMainPage);

      const saveIcon = document.createElement("div");
      saveIcon.id = "save";
      saveIcon.className = "absolute right-10 cursor-pointer";
      saveIcon.innerHTML = `
          <i class="fa-solid fa-floppy-disk"></i>
      `;

      headingCtn.insertBefore(backIcon, headingTitle);
      headingCtn.insertBefore(saveIcon, headingTitle);
      title.innerText = "Criar Lista";
      break;
    }
    case "edit": {
      clearIcons();
      const backIcon = document.createElement("div");
      backIcon.id = "back";
      backIcon.className = "absolute left-10 cursor-pointer";
      backIcon.innerHTML = `
          <i class="fa-solid fa-angle-left"></i>
      `;
      backIcon.addEventListener("click", moveToMainPage);

      const saveIcon = document.createElement("div");
      saveIcon.id = "save";
      saveIcon.className = "absolute right-10 cursor-pointer";
      saveIcon.innerHTML = `
          <i class="fa-solid fa-floppy-disk"></i>
      `;

      headingCtn.insertBefore(backIcon, headingTitle);
      headingCtn.insertBefore(saveIcon, headingTitle);
      title.innerText = "Editar Lista";
      break;
    }
    default:
      break;
  }
}

// Funcao para limpar a dom do container principal.
function clearMainContainer() {
  while (mainCtn.firstChild) {
    mainCtn.removeChild(mainCtn.firstChild);
  }
}

// Funcao que renderiza a pagina princial e adiciona seus eventos
function moveToMainPage() {
  clearMainContainer();
  controlHeading("main");

  const lists = getLists();

  if (lists && lists.length) {
    const listsCtn = document.createElement("div");
    listsCtn.id = "lists-ctn";
    listsCtn.className = "pt-8 px-6";

    lists.forEach((list) => {
      const listItemCtn = document.createElement("div");
      listItemCtn.id = "list-item-ctn";
      listItemCtn.className =
        "flex flex-col justify-between border rounded-lg p-3 mb-1 cursor-pointer";
      listItemCtn.innerHTML = `        
        <div id=${
          "list-item-" + list.id
        } class="flex justify-between border rounded-lg p-3 mb-1 cursor-pointer">
          <p>${list.name}</p>

          <div class="flex">
            <p class="mr-3">R$ ${list.products.reduce((acc, currentItem) => acc + currentItem.price, 0)}</p>
            <i id=${
              "toggle-item-details-" + list.id
            } class="fa-solid fa-chevron-down"></i>
          </div>
        </div>
      `;

      listsCtn.append(listItemCtn);

      // wait appends
      setTimeout(() => {
        const toggleItemBtn = document.getElementById(
          `toggle-item-details-${list.id}`
        );
        toggleItemBtn.addEventListener("click", () => {
          const { products } = list;
          const itemDetailsCtnId = `item-details-ctn-${list.id}`;
          const itemDetailsCtn = document.getElementById(itemDetailsCtnId);

          if (itemDetailsCtn) {
            itemDetailsCtn.remove();
            toggleItemBtn.classList = "fa-solid fa-chevron-down";
          } else {
            const itemDetailsCtnDiv = document.createElement("div");
            itemDetailsCtnDiv.className = "flex flex-col border rounded-lg p-3";
            itemDetailsCtnDiv.id = itemDetailsCtnId;

            products.forEach((product) => {
              const itemDetailDiv = document.createElement("div");
              itemDetailDiv.className = "flex justify-between";
              itemDetailDiv.innerHTML = `
                <p>${product.name}</p>
                <p>R$ ${product.price}</p>
              `;

              itemDetailsCtnDiv.appendChild(itemDetailDiv);
            });

            const editButtonDiv = document.createElement("div");
            editButtonDiv.className = "flex justify-center mt-2";
            editButtonDiv.id = "edit-item";
            editButtonDiv.innerHTML = `
              <i class="fa-solid fa-pen-to-square cursor-pointer"></i>
            `;
            editButtonDiv.addEventListener("click", () => {
              editingListId = list.id;
              moveToEditListScreen();
            });

            itemDetailsCtnDiv.appendChild(editButtonDiv);
            listItemCtn.appendChild(itemDetailsCtnDiv);
            toggleItemBtn.classList = "fa-solid fa-chevron-up";
          }
        });
      });

      mainCtn.append(listsCtn);
    }, 500);
  } else {
    const emptyListCtn = document.createElement("div");
    emptyListCtn.id = "empty-ctn";
    emptyListCtn.className = "flex items-center justify-center pt-28";
    emptyListCtn.innerHTML = `
      <div class="flex flex-col items-center">
        <img class="w-28 mb-4" src="assets/images/no-data.svg" alt="Lista vazia"/>
        <p>Nenhuma lista criada.</p>
        <p>Clique no + para criar uma nova lista.</p>
      </div>
    `;

    mainCtn.appendChild(emptyListCtn);
  }
}

// Funcao que renderiza a pagina de adicionar uma nova lista e adiciona seus eventos
function moveToAddListScreen() {
  clearMainContainer();
  controlHeading("add");

  const createCtn = document.createElement("div");
  createCtn.id = "create-ctn";
  createCtn.className = "pt-8 px-6";

  createCtn.innerHTML = `
        <form id='add-form' class="flex flex-col mb-6">
          <input id='listName' class="border rounded-lg p-1 pl-2" type="text" placeholder="Digite o nome da lista..."/>

          <div id="divider" class="py-4">
            <div class="w-full border-t border-gray-300"></div>
          </div>

          <input id='productName' class="border rounded-lg p-1 pl-2 mb-2" type="text" placeholder="Digite o nome do produto..."/>
          <input id='productPrice' class="border rounded-lg p-1 pl-2 mb-2" type="number" placeholder="Digite o preço do produto..."/>

          <div class="flex justify-center">
            <button class="border rounded-lg p-2" type='submit'>Adicionar Item</button>
          </div>
        </form>
    `;

  mainCtn.appendChild(createCtn);

  const form = document.getElementById("add-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputs = Array.from(document.querySelectorAll("#add-form input"));
    const values = inputs.reduce(
      (keyValues, input) => ({ ...keyValues, [input.id]: input.value }),
      {}
    );
    
    if(values.productName && values.productPrice) {
      const id = new Date().valueOf();
      itemsToAdd.push({
        id: id,
        name: values.productName,
        price: Number(values.productPrice),
      });
  
      const productDiv = document.createElement("div");
      productDiv.className = "flex justify-between border rounded-lg p-3 mb-1";
      productDiv.innerHTML = `
        <p>${values.productName}</p>
        <div class="flex">
          <p class="mr-6">R$ ${values.productPrice}</p>
          <i id='delete-list-item' class="fa-solid fa-trash cursor-pointer"></i>
        </div>
      `;
      productDiv.setAttribute("data-id", id);
  
      createCtn.appendChild(productDiv);
  
      const deleteBtn = document.querySelector(
        `[data-id="${id}"] #delete-list-item`
      );
      deleteBtn.addEventListener("click", () => {
        productDiv.remove();
  
        const itemIndex = itemsToAdd.findIndex((item) => item.id === id);
        itemsToAdd.splice(itemIndex, 1);
      });
  
      inputs[1].value = "";
      inputs[2].value = "";
    }
  });

  const saveBtn = document.getElementById("save");
  saveBtn.addEventListener("click", () => {
    const listName = document.getElementById("listName").value;

    const listToPersist = {
      id: new Date().valueOf(),
      name: listName,
      products: itemsToAdd,
    };

    addListToStorage(listToPersist);
    itemsToAdd.splice(0, itemsToAdd.length);
    moveToMainPage();
  });
}

// Funcao que renderiza a pagina de editar uma lista e adiciona seus eventos
function moveToEditListScreen() {
  clearMainContainer();
  controlHeading("edit");

  const listToEdit = getListById(editingListId);
  listToEdit.products.forEach(p => itemsToEdit.push(p));

  const editCtn = document.createElement("div");
  editCtn.id = "edit-ctn";
  editCtn.className = "pt-8 px-6";

  editCtn.innerHTML = `
        <div class='flex justify-center mb-2'>
          <button id='delete-list' class="border rounded-lg p-2 bg-red-500 text-white">Excluir Lista</button>
        </div>

        <form id='edit-form' class="flex flex-col mb-6">
          <input id='listName' class="border rounded-lg p-1 pl-2" type="text" placeholder="Digite o nome da lista..."/>

          <div id="divider" class="py-4">
            <div class="w-full border-t border-gray-300"></div>
          </div>

          <input id='productName' class="border rounded-lg p-1 pl-2 mb-2" type="text" placeholder="Digite o nome do produto..."/>
          <input id='productPrice' class="border rounded-lg p-1 pl-2 mb-2" type="text" placeholder="Digite o preço do produto..."/>

          <div class="flex justify-center">
            <button class="border rounded-lg p-2" type='submit'>Adicionar Item</button>
          </div>
        </form>
    `;

  mainCtn.appendChild(editCtn);

  const form = document.getElementById("edit-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputs = Array.from(document.querySelectorAll("#edit-form input"));
    const values = inputs.reduce(
      (keyValues, input) => ({ ...keyValues, [input.id]: input.value }),
      {}
    );
    
    if(values.productName && values.productPrice) { 
      const id = new Date().valueOf();
      itemsToEdit.push({
        id: id,
        name: values.productName,
        price: Number(values.productPrice),
      });
  
      const productDiv = document.createElement("div");
      productDiv.className = "flex justify-between border rounded-lg p-3 mb-1";
      productDiv.innerHTML = `
        <p>${values.productName}</p>
        <div class="flex">
          <p class="mr-6">R$ ${values.productPrice}</p>
          <i id='delete-list-item' class="fa-solid fa-trash cursor-pointer"></i>
        </div>
      `;
      productDiv.setAttribute("data-id", id);
  
      editCtn.appendChild(productDiv);
  
      const deleteBtn = document.querySelector(
        `[data-id="${id}"] #delete-list-item`
      );
      deleteBtn.addEventListener("click", () => {
        productDiv.remove();
  
        const itemIndex = itemsToEdit.findIndex((item) => item.id === id);
        itemsToEdit.splice(itemIndex, 1);
      });
  
      inputs[1].value = "";
      inputs[2].value = "";
    }
  });

  const saveBtn = document.getElementById("save");
  saveBtn.addEventListener("click", () => {
    const listName = document.getElementById("listName").value;

    const listToEdit = {
      id: editingListId,
      name: listName,
      products: itemsToEdit,
    };

    editListInStorage(listToEdit);
    itemsToEdit.splice(0, itemsToEdit.length);
    editingListId = '';
    moveToMainPage();
  });

  const deleteBtn = document.getElementById("delete-list");
  deleteBtn.addEventListener('click', () => {
    removeListInStorage(editingListId);
    itemsToEdit.splice(0, itemsToEdit.length);
    editingListId = '';
    moveToMainPage();
  });

  // populate fields 
  const listNameInput = document.getElementById('listName');
  listNameInput.value = listToEdit.name;

  listToEdit.products.forEach(item => {
    const productDiv = document.createElement("div");
    productDiv.className = "flex justify-between border rounded-lg p-3 mb-1";
    productDiv.innerHTML = `
      <p>${item.name}</p>
      <div class="flex">
        <p class="mr-6">R$ ${item.price}</p>
        <i id='delete-list-item' class="fa-solid fa-trash cursor-pointer"></i>
      </div>
    `;
    productDiv.setAttribute("data-id", item.id);

    editCtn.appendChild(productDiv);

    const deleteBtn = document.querySelector(
      `[data-id="${item.id}"] #delete-list-item`
    );
    deleteBtn.addEventListener("click", () => {
      productDiv.remove();

      const itemIndex = itemsToEdit.findIndex((i) => i.id === item.id);
      itemsToEdit.splice(itemIndex, 1);
    });
  });
}

// Funcoes facilitadoras para gerenciar o storage
function addListToStorage(list) {
  const listsResponse = localStorage.getItem("lists");

  if (!listsResponse) {
    const allLists = [list];
    localStorage.setItem("lists", JSON.stringify(allLists));
  } else {
    const lists = JSON.parse(listsResponse);
    lists.push(list);
    localStorage.setItem("lists", JSON.stringify(lists));
  }
}

function editListInStorage(list) {
  const listsResponse = localStorage.getItem("lists");

  if (listsResponse) {
    const lists = JSON.parse(listsResponse);
    const listToEditIndex = lists.findIndex((l) => l.id === list.id);
    lists[listToEditIndex] = list;

    localStorage.setItem("lists", JSON.stringify(lists));
  } else {
    console.error("editListInStorage error", listsResponse);
  }
}

function removeListInStorage(id) {
  const listsResponse = localStorage.getItem("lists");

  if (listsResponse) {
    const lists = JSON.parse(listsResponse);
    const listToEditIndex = lists.findIndex((l) => l.id === id);
    lists.splice(listToEditIndex, 1);

    localStorage.setItem("lists", JSON.stringify(lists));
  } else {
    console.error("removeListInStorage error", listsResponse);
  }
}

function getLists() {
  const listsResponse = localStorage.getItem("lists");

  if (listsResponse) {
    const lists = JSON.parse(listsResponse);
    return lists;
  } else {
    return undefined;
  }
}

function getListById(id) {
  const listsResponse = localStorage.getItem("lists");

  if (listsResponse) {
    const lists = JSON.parse(listsResponse);
    return lists.find((list) => list.id === id);
  } else {
    return undefined;
  }
}
