// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editId = '';

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem);

// clear items
clearBtn.addEventListener('click', clearItems);

// load items
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();             // generate a unique ID by using a .getTime() stamp

     if(value && !editFlag) {                               // not an empty string and editFlag is false
       createListItem(id, value);

// display alert
      displayAlert('item added to the list', 'success');

// show container
      container.classList.add('show-container');

// ADD TO LOCAL STORAGE
      addToLocalStorage(id, value);

// set back to default
      setBackToDefault();
     } else if (value && editFlag) {
      editElement.innerHTML = value;
      displayAlert('list item changed', 'success');
// edit local storage
      editLocalStorage(editId, value);   
      setBackToDefault();
     }     
        else {
            displayAlert('please enter value', 'danger');
        }
      }

// display alert
     function displayAlert(text, action) {
        alert.textContent = text;
        alert.classList.add(`alert-${action}`);

// remove alert with a timeout
        setTimeout(function() {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
        }, 2000);
     }
// clear items
      function clearItems() {
        const items = document.querySelectorAll('.grocery-item');
        if(items.length > 0) {
            items.forEach(function(item) {
                list.removeChild(item);
            }); 
        }
// remove the 'clear items' button - and show alert after all items are removed
        container.classList.remove('show-container');
        displayAlert('empty list', 'success');
        setBackToDefault();
        localStorage.removeItem('list');  // removed all items - and key-value pair -
      }                                   // from local storage using the 'Clear Items" btn
// delete function
      function deleteItem(e) {
        const element = e.currentTarget.parentElement.parentElement;
        const id = element.dataset.id;
        list.removeChild(element);
        if(list.children.length === 0) {
            container.classList.remove('show-container');
        }
        displayAlert('item removed', 'danger');
        setBackToDefault();

// remove from local storage
      removeFromLocalStorage(id);
  }

// edit function
      function editItem(e) {
        const element = e.currentTarget.parentElement.parentElement;
// set edit item
      editElement = e.currentTarget.parentElement.previousElementSibling;  
      
// set form edit value
      grocery.value = editElement.innerHTML;
      editFlag = true;
      editId = element.dataset.id;
      submitBtn.textContent = 'edit';  // change button to "Edit"
  }

// set back to default
     function setBackToDefault() {
      grocery.value = '';
      editFlag = false;
      editId = '';
      submitBtn.textContent = 'submit';
    }
// LOCAL STORAGE **********
     function addToLocalStorage(id, value) {
      // const grocery = { id:id, value:value };  // shorter ES6 version syntax below
      const grocery = { id, value };
      let items = getLocalStorage();

      items.push(grocery);
      localStorage.setItem('list', JSON.stringify(items));
}
function removeFromLocalStorage(id) {
      let items = getLocalStorage()
      items = items.filter(function (item) {
       if(item.id !== id) {
        return item;
       }
      });
      localStorage.setItem('list', JSON.stringify(items));
}
function editLocalStorage(id, value) {
      let items = getLocalStorage();
      items = items.map(function(item) {
       if(item.id === id) {
        item.value = value;
       }
       return item;
      });
      localStorage.setItem('list', JSON.stringify(items));
}
function getLocalStorage() {
      return localStorage.getItem('list') 
      ? JSON.parse(localStorage.getItem('list'))
      : [];
}
// localStorage API
// setItem()
// getItem()
// removeItem()
// save as strings
// localStorage.setItem('orange', JSON.stringify(['Max', 'Luna']
// ));
// const oranges = JSON.parse(localStorage.getItem('orange'));
// console.log(oranges);
// localStorage.removeItem('orange');

// ****** SETUP ITEMS **********
 function setupItems() {
   let items = getLocalStorage();
   if(items.length > 0) {
      items.forEach(function(item) {
        createListItem(item.id, item.value)

      });
  container.classList.add('show-container');
   }   
 }
  function createListItem(id, value) {
      const element = document.createElement('article');
// add class
      element.classList.add('grocery-item');
// add ID
    const attr = document.createAttribute('data-id')
      attr.value = id;
      element.setAttributeNode(attr);
      element.innerHTML = `<p class="title">${value}</p>
      <div class="btn-container">
        <button type="button" class="edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>`;

// select and setup the delete &  edit buttons
      const deleteBtn = element.querySelector('.delete-btn');
      const editBtn = element.querySelector('.edit-btn');
      deleteBtn.addEventListener('click', deleteItem);
      editBtn.addEventListener('click', editItem);

// append child
      list.appendChild(element);
  }




// left off at 7:19:22