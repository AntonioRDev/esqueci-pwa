const mainCtn = document.getElementById("main-ctn");
const editItens = [];

window.onload = () => {
  moveToMainPage();
};

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
    case "main":
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
    case "add":
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
    case "edit":
      break;
    default:
      break;
  }
}

function clearMainContainer() {
  while (mainCtn.firstChild) {
    mainCtn.removeChild(mainCtn.firstChild);
  }
}

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
            <p class="mr-3">R$ ?</p>
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
              console.log("edit list ", list.id);
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
          <input id='productPrice' class="border rounded-lg p-1 pl-2 mb-2" type="text" placeholder="Digite o preço do produto..."/>

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

    const id = new Date().valueOf();
    editItens.push({
      id: id,
      name: values.productName,
      price: values.productPrice,
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

      const itemIndex = editItens.findIndex((item) => item.id === id);
      editItens.splice(itemIndex, 1);
    });

    inputs[1].value = "";
    inputs[2].value = "";
  });

  const saveBtn = document.getElementById("save");
  saveBtn.addEventListener("click", () => {
    const listName = document.getElementById("listName").value;

    const listToPersist = {
      id: new Date().valueOf(),
      name: listName,
      products: editItens,
    };

    console.log("listToPersist", listToPersist);

    addListToStorage(listToPersist);
    editItens.splice(0, editItens.length);
    moveToMainPage();
  });
}

// storage functions
function addListToStorage(list) {
  const listsResponse = localStorage.getItem("lists");

  if (!listsResponse) {
    const allLists = [list];
    localStorage.setItem("lists", JSON.stringify(allLists));
  } else {
    const lists = JSON.parse(listsResponse);
    lists.push(list);
    localStorage.setItem("lists", lists);
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

// [
//   {
//     id: 56322123,
//     name: 'lista x',
//     items: [
//       {
//         id: 156456
//         name: 'maionese',
//         value: '350,00'
//       }
//     ],
//     totalValue: '400,00'
//   }
// ]
