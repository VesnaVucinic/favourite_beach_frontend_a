const endPoint = "http://127.0.0.1:3000/api/v1/beaches"

document.addEventListener("DOMContentLoaded", () => {
    // console.log("DOM is loaded")
    getBeaches()
    // listen for 'submit' event on form and handle data
    let createBeachForm = document.querySelector('#create-beach-form')
    createBeachForm.addEventListener('submit', (event) => createFormHandler(event))
    // listen for 'click' event on login form
    let loginForm = document.querySelector("#login-form")
    loginForm.addEventListener("submit", (event) => loginFormHandler(event))
    // listen for 'click' event on beach container
    let beachContainer = document.querySelector('#beach-container')
    beachContainer.addEventListener('click', event => {
    // console.log('clicked');
    let id = event.target.dataset.id;
    // debugger
    let beach = Beach.findById(id);
    // debugger
    // console.log(beach);
    document.querySelector('#update-beach').innerHTML = beach.renderUpdateForm();
  });
    // listen for the submit event of the edit form and handle the data
    document.querySelector('#update-beach').addEventListener('submit', event => updateFormHandler(event))
})
   


function getBeaches() {
    fetch(endPoint)
    .then(response => response.json()) 
    .then(beaches => {
            // remember our JSON data is a bit nested due to our serializer
        beaches.data.forEach(beach => {
            // double check how your data is nested in the console so you can successfully access the attributes of each individual object
            //to create new instance of beach class when I made creator in beach.js 
            // debugger
            let newBeach = new Beach(beach, beach.attributes)
            // render(beach)
            document.querySelector('#beach-container').innerHTML += newBeach.renderBeachCard();
            // debugger
  
        })
    })
} 

function loginFormHandler(event) {
    event.preventDefault()
    // console.log(event)
    const emailInput = event.target.querySelector("#login-email").value
    const pwInput = event.target.querySelector("#login-password").value
    loginFetch(emailInput, pwInput)
}

function loginFetch(email, password) {
    const bodyData = {user: { email, password} }
  
    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(json => {
        // console.log(json);
      localStorage.setItem('jwt_token', json.jwt)
      renderUserProfile()
    })
}

function renderUserProfile() {
    console.log(localStorage.getItem('jwt_token'));
    fetch('http://localhost:3000/api/v1/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      })
      .then(response => response.json())
      .then(json => {
        alert(`Welcome back ${json.user.data.attributes.email}`)
    })
}

function createFormHandler(event) {
    event.preventDefault()
    const nameInput = document.querySelector('#input-name').value
    const countryId = parseInt(document.querySelector('#countries').value)
    const locationInput = document.querySelector('#input-location').value
    const descriptionInput = document.querySelector('#input-description').value
    const imageInput = document.querySelector('#input-url').value
        
    postBeach(nameInput, countryId, locationInput, descriptionInput, imageInput)
}

function postBeach(name, country_id, location, description, image_url) {
    // console.log(name, country_id, location, description, image_url);
    // in bodyData attributs has to be exactly same lake in db schema, I can give as value whatever variable I want key in body has to be exactly same like in db
    // in let body Data I am using destructurinf and becouse I gacve same name for key and value I can have  variable let bodyData outside body of fetch request
    let bodyData = {name, country_id, location, description, image_url}


    fetch(endPoint, {
        // POST request
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(beach => {
        // console.log(beach)
        
        const beachData =  beach.data
        // debugger
        // render JSON response, render data to user to see what created, manuplate DOM by showing user what created, data is pointing to single object not array like in get fetch where I had arrey and .forEach
        let newBeach = new Beach(beachData, beachData.attributes)
        // render(beach)
        document.querySelector('#beach-container').innerHTML += newBeach.renderBeachCard();
    })
}

function updateFormHandler(event) {
    event.preventDefault();
    let id = event.target.dataset.id;
    let beach = Beach.findById(id);
    const name = event.target.querySelector('#input-name').value;
    const location = event.target.querySelector('#input-location').value;
    const description = event.target.querySelector('#input-description').value;
    const image_url = event.target.querySelector('#input-url').value;
    const country_id = parseInt(event.target.querySelector('#categories').value);
    patchBeach(beach, name, location, description, image_url, country_id)
}

// Send the PATCH Request to the Backend
function patchBeach(beach, name, location, description, image_url, country_id) {
    const bodyJSON = { beach, name, location, description, image_url, country_id }
    fetch(`http://localhost:3000/api/v1/beaches/${patchBeach.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(bodyJSON),
    })
      .then(res => res.json())
      // our backend responds with the updated syllabus instance represented as JSON
      .then(updatedNote => console.log(updatedNote));
};

