const endPoint = "http://127.0.0.1:3000/api/v1/beaches"

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM is loaded")
    getBeaches()

    // In the DOMContentLoaded event listener find the form on the DOM and attach a submit event listener to the form element.
    const createBeachForm = document.querySelector('#create-beach-form')
    createBeachForm.addEventListener('submit', (e) => createFormHandler(e))

    const loginForm = document.querySelector("#login-form")
    loginForm.addEventListener("submit", (e) => loginFormHandler(e))

    // listen for 'click' event on beach container
    // let beachContainer = document.getElementById("read")
    const beachContainer = document.querySelector('#beach-container')
    beachContainer.addEventListener('dblclick', e => {
        // console.log('clicked');
        const id = e.target.dataset.id;
        // debugger
        const beach = Beach.findById(id);
        // debugger
        // console.log(beach);
        document.querySelector('#show-beach').innerHTML = beach.renderShowBeach();      
    }) 
    // let showBeachContainer = document.getElementById('#edit')
    const showBeachContainer = document.querySelector('#show-beach')
    showBeachContainer.addEventListener('dblclick', e => {
        // console.log('clicked');
        const id = e.target.dataset.id;
        // debugger
        const beach = Beach.findById(id);
        // debugger
        // console.log(beach);
        // Render the edit form when the edit button is clicked
        // debugger
        document.querySelector('#update-beach').innerHTML = beach.renderUpdateForm();
        // listen for the submit event of the edit form and handle the data
        document.querySelector('#update-beach').addEventListener('submit', e => updateFormHandler(e)) 
    })

    // handelSubmitEdit()

});

// function handelSubmitEdit() {
//     const submitEdit = document.getElementById('create-button')
//     console.log('@@edit', submitEdit)
// }
  

function getBeaches() {
    fetch(endPoint)
    .then(response => response.json()) 
    .then(beaches => {
            // remember our JSON data is a bit nested due to our serializer
        beaches.data.forEach(beach => {
            // double check how your data is nested in the console so you can successfully access the attributes of each individual object
            // create a new instance of the Beach class for every beach in the array from the DB (remember how our data is nested)
            //to create new instance of beach class when I made creator in beach.js 
            // 
            const newBeach = new Beach(beach, beach.attributes)
            // render(beach) - call renderBeachCard() located in Beach class
            document.querySelector('#beach-container').innerHTML += newBeach.renderBeachCard();
        })
    })
} 

function loginFormHandler(event) {
    event.preventDefault()
    console.log(event)
    const emailInput = event.target.querySelector("#login-email").value
    event.target.querySelector("#login-email").value = ""
    const pwInput = event.target.querySelector("#login-password").value
    event.target.querySelector("#login-password").value = ""
    loginFetch(emailInput, pwInput)
}

function loginFetch(email, password) {
    const bodyData = {user: { email, password} }
//   debugger
    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
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

// Gather all the input values and pass it to function to execute the post fetch.
function createFormHandler(e) {
    e.preventDefault()
    const nameInput = document.querySelector('#input-name').value
    const countryId = parseInt(document.querySelector('#countries').value)
    const locationInput = document.querySelector('#input-location').value
    const descriptionInput = document.querySelector('#input-description').value
    const imageInput = document.querySelector('#input-url').value

        
    postBeach(nameInput, countryId, locationInput, descriptionInput, imageInput)
    eraseText();
}

function eraseText() {
    document.querySelector('#input-name').value = ""
    document.querySelector('#countries').value = ""
    document.querySelector('#input-location').value = ""
    document.querySelector('#input-description').value = ""
    document.querySelector('#input-url').value = ""
}

function postBeach(name, country_id, location, description, image_url) {
    // console.log(name, country_id, location, description, image_url);
    // in bodyData attributs has to be exactly same lake in db schema, I can give as value whatever variable I want key in body has to be exactly same like in db
    // in const body Data I am using destructuring and becouse I gave same name for key and value I can have  variable const bodyData outside body of fetch request
    const bodyData = {name, country_id, location, description, image_url}

    fetch(endPoint, {
        // POST request
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`},
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(beach => {
        console.log(beach)
        
        const beachData =  beach.data
        // 
        // render JSON response, render data to user to see what created, manuplate DOM by showing user what created, data is pointing to single object not array like in get fetch where I had arrey and .forEach
        // const newBeach = new Beach(beach.data.id, beach.data.attributes)
        const newBeach = new Beach(beachData, beachData.attributes)
        // render(beach) - call renderBeachCard() located in Beach class 
        document.querySelector('#beach-container').innerHTML += newBeach.renderBeachCard();
    })
}

function updateFormHandler(e) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const beach = Beach.findById(id);
    // debugger
    const name = e.target.querySelector('#input-name').value;
    const location = e.target.querySelector('#input-location').value;
    const description = e.target.querySelector('#input-description').value;
    const image_url = e.target.querySelector('#input-url').value;
    const country_id = parseInt(e.target.querySelector('#countries').value);
    patchBeach(beach, name, location, description, image_url, country_id) 
}

 // Send the PATCH Request to the Backend - When the form is submitted we need to make a PATCH request to our server to update this beach record in our database.
function patchBeach(beach, name, location, description, image_url, country_id) {
    // debugger
    const bodyJSON = {name, location, description, image_url, country_id}
    // document.querySelector('#show-beach').innerHTML = beach.bodyJSON

    // debugger
    fetch(`http://localhost:3000/api/v1/beaches/${beach.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify(bodyJSON),
    })
      .then(res => res.json())
      // our backend responds with the updated beach instance represented as JSON
      
      .then(updatedBeachJSON => 
        console.log(updatedBeachJSON) 
        
        //   beach.innerHTML = updatedBeach
    );
    //   debugger
};

function deleteBeach() {
    const beachDataId = event.target.dataset.id;
    // debugger
    fetch(`http://127.0.0.1:3000/api/v1/beaches/${beachDataId}`, {
      method: "DELETE",
      headers: {
                
                "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
              },
    })
        event.target.parentElement.parentElement.parentElement.parentElement.remove()
}

function closeBeach() {
    event.target.parentElement.parentElement.parentElement.parentElement.remove()
}




