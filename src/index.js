const endPoint = "http://127.0.0.1:3000/api/v1/beaches"

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM is loaded")
    getBeaches()

    let createBeachForm = document.querySelector('#create-beach-form')
    createBeachForm.addEventListener('submit', (event) => createFormHandler(event))

    let loginForm = document.querySelector("#login-form")
    loginForm.addEventListener("submit", (event) => loginFormHandler(event))

    // listen for 'click' event on beach container
    
    // let beachContainer = document.querySelector('#beach-container')
    // beachContainer.addEventListener('click', event => {
    //     // console.log('clicked');
    //     let id = event.target.dataset.id;
    //     // debugger
    //     let beach = Beach.findById(id);
    //     // debugger
    //     // console.log(beach);
    //     document.querySelector('#show-beach').innerHTML = beach.renderShowBeach();   
    // }) 

    // let showBeachContainer = document.querySelector('#show-beach')
    // showBeachContainer.addEventListener('click', event => {
    //     // console.log('clicked');
    //     let id = event.target.dataset.id;
    //     // debugger
    //     let beach = Beach.findById(id);
    //     // debugger
    //     console.log(beach);
    //     // Render the edit form when the edit button is clicked
    //     // debugger
    //     document.querySelector('#update-beach').innerHTML = beach.renderUpdateForm();
    //     // listen for the submit event of the edit form and handle the data
    //     document.querySelector('#update-beach').addEventListener('submit', event => updateFormHandler(event)) 
    // })

    // let showBeachContainer = document.querySelector('#show-beach')
    // showBeachContainer.addEventListener('click', event => {
    //     // console.log('clicked');
    //     let id = event.target.dataset.id;
    //     // debugger
    //     let beach = Beach.findById(id);
    //     // debugger
    //     console.log(beach);
    //     deleteBeach()
    // })

    // const deleteButton = document.querySelector(".delete");
    // deleteButton.addEventListener("click", (event) => deleteBeach());
});
  

function getBeaches() {
    fetch(endPoint)
    .then(response => response.json()) 
    .then(beaches => {
            // remember our JSON data is a bit nested due to our serializer
        beaches.data.forEach(beach => {
            // double check how your data is nested in the console so you can successfully access the attributes of each individual object
            //to create new instance of beach class when I made creator in beach.js 
            // 
            let newBeach = new Beach(beach, beach.attributes)
            // render(beach)
            document.querySelector('#beach-container').innerHTML += newBeach.renderBeachCard();
        
  
        })
    })
} 

function loginFormHandler(event) {
    event.preventDefault()
    console.log(event)
    let emailInput = event.target.querySelector("#login-email").value
    event.target.querySelector("#login-email").value = ""
    let pwInput = event.target.querySelector("#login-password").value
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

function createFormHandler(event) {
    event.preventDefault()
    let nameInput = document.querySelector('#input-name').value
    let countryId = parseInt(document.querySelector('#countries').value)
    let locationInput = document.querySelector('#input-location').value
    let descriptionInput = document.querySelector('#input-description').value
    let imageInput = document.querySelector('#input-url').value

        
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
    // in let body Data I am using destructurinf and becouse I gacve same name for key and value I can have  variable let bodyData outside body of fetch request
    let bodyData = {name, country_id, location, description, image_url}

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
        let newBeach = new Beach(beachData, beachData.attributes)
        // render(beach)
        document.querySelector('#beach-container').innerHTML += newBeach.renderBeachCard();
    })
}

// function updateFormHandler(event) {
//     event.preventDefault();
//     let id = event.target.dataset.id;
//     let beach = Beach.findById(id);
//     // debugger
//     const name = event.target.querySelector('#input-name').value;
//     const location = event.target.querySelector('#input-location').value;
//     const description = event.target.querySelector('#input-description').value;
//     const image_url = event.target.querySelector('#input-url').value;
//     const country_id = parseInt(event.target.querySelector('#countries').value);
//     patchBeach(beach, name, location, description, image_url, country_id)
//     eraseText();
// }

//  // Send the PATCH Request to the Backend
// function patchBeach(beach, name, location, description, image_url, country_id) {
//     // debugger
//     const bodyJSON = { beach, name, location, description, image_url, country_id }
//     fetch(`http://localhost:3000/api/v1/beaches/${beach.id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
//       },
//       body: JSON.stringify(bodyJSON),
//     })
//       .then(res => res.json())
//       // our backend responds with the updated beach instance represented as JSON
      
//       .then(updatedBeach => console.log(updatedBeach));
//     //   debugger
// };

// const deleteBeach = (event) => {
//     event.preventDefault()
//     const configObj = {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
//         }
//     }

//     fetch(`${endPoint}/${event.target.dataset.beachId}`, configObj)
//     event.target.parentElement.remove()
// }

// function deleteBeach (event) {
//     debugger
//     event.preventDefault()
//     const configObj = {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
//         }
//     }

//     fetch(`${endPoint}/${event.target.dataset.beachId}`, configObj)
//     event.target.parentElement.remove()
// }


function deleteBeach() {
    let beachDataId = event.target.dataset.id;
    // debugger
    fetch(`http://127.0.0.1:3000/api/v1/beaches/${beachDataId}`, {
      method: "DELETE",
      headers: {
                
                "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
              },
    })
    
    // event.target.parentNode.removeChild()
    //   .then((response) => response.json())
    //   .then((json) => {s
    // debugger
        // let selectedBeach = document.querySelector(
        //   `.card[data-id="${beachDataId}"]`
        // );
        // // debugger
        // selectedBeach.remove();
        event.target.parentElement.parentElement.parentElement.parentElement.remove()
    //   });
    //   debugger
}


