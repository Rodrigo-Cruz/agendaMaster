console.log("===AGENDA===");

(function () {
  //user interface
  var ui = {
    fields: document.querySelectorAll("input"),
    button: document.querySelector(".pure-button"),
    table: document.querySelector("tbody")
  };

  //actiosns
  var validateFields = function (e) {
    console.log(ui.fields);
    console.log(e);

    e.preventDefault();  // previninir a ação padrão ("recarregar a pagina")
    var errors = 0;
    var contact = {};

    ui.fields.forEach(function (field) {

      if (field.value.trim().length === 0) {   //trim() remove os espaços antes e depois - no preenchimento do campo
        field.classList.add("error");
        errors++;
      }
      else {
        field.classList.remove("error");
        contact[field.id] = field.value.trim();
      }

    });

    console.log(errors, contact);

    if (errors > 0) {
      document.querySelector(".error").focus();
    } else {
      addContact(contact);
    }
  };

  var addContact = function (contact) {
    var endpoint = "http://localhost:4000/schedule";
    var config = {
      method:"POST",
      body: JSON.stringify(contact), // "JSON.stringify" pega o objeto JS e transforma em texto
      headers: new Headers({
        "Content-type":"application/JSON"
      })
    }
    fetch(endpoint, config)// then quando der erro na chamada      catch quando houver erro na chamada
      .then(cleanFilds)
      .then(getContacts)
      .catch(genericError);
  };

  //MODELO DE FUNÇÃO ANONIMA PARA ARROW FUNCTION ES5 P/ ES6
  var cleanFilds = () => ui.fields.forEach(field => field.value="");      

  var genericError = function() {debugger};

  var getContacts = function () {
    var endpoint = "http://localhost:4000/schedule";
    var config = {
      method:"GET",
      headers: new Headers({
        "Content-type":"application/JSON"

      })
    }
      fetch(endpoint, config)
        .then(function(response){return response.json()})
        .then(getContactsSuccess)
        .catch(genericError);
  };

  var getContactsSuccess = function(contacts){
    var tableRows =[];
    contacts.forEach(function(contact){
      tableRows.push(`
      <tr>
      <td>${contact.id}</td>
      <td>${contact.name}</td>
      <td>j${contact.email}</td>
      <td>${contact.phone}</td>
      <td><a href="#"data-id="${contact.id}" data-action="delete">Excluir</a> </td>
      </tr>
      `);

    });

    ui.table.innerHTML = tableRows.join("");
    //console.table(contacts);
    console.log(tableRows.join(""));

  };

  var confimRemove = function (e) { 
    if (e.target.dataset.action ==="delete" && confirm ("Deseja excluir o item " + e.target.dataset.id + " ?")
    )
    e.preventDefault();
    removeContact(e.target.dataset.id)

  };

var removeContact = function(id){
  var endpoint = "http://localhost:4000/schedule/"+id;
  var config = {
    method:"DELETE",
    headers: new Headers({
      "Content-type":"application/JSON"

    })
  }

  fetch(endpoint, config)
        .then(getContacts)
        .catch(genericError);


  
}


  var init = function () {

    //add events 
    ui.button.onclick = validateFields;
    ui.table.onclick = confimRemove

    getContacts();

  }();
 
  console.log(ui);

})();