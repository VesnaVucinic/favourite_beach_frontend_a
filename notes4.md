PART 3 Review
Events
Fetch (GET and POST)
Implement .catch()
function getBeaches() {
  fetch(endPoint)
    .then(res => res.json())
    .then(json => console.log(json));
    .catch(err => console.log(err);)
}
DOM Manipulation
Render refactor
Refactor your code to make it more DRY and implement a render function you can reuse in multiple places.

function render(beach) {
    const beachMarkup = `
    <div data-id=${beach.id}>
      <h3>${beach.attributes.name}</h3>
      <p>${beach.attributes.country.name}</p>
      <p>${beach.attributes.location}</p>
      <p>${beach.attributes.description}</p>
      <img src=${beach.attributes.image_url} height="200" width="250">
      <br><br>
      <button data-id=${beach.id}>edit</button>
    </div>
    <br><br>`;

    document.querySelector('#beach-container').innerHTML += beachMarkup
}

RT 4 — OOJS Refactor
Refactor Render Using Beach Class
If our only deliverable was to show text on the page, our code would be sufficient. There's a real deficiency with our current implementation though.

Think about the next step where a user clicks one of the edit buttons. Without storing ids in the html elements how could we

a) determine which beach got clicked on and

b) show more information about that beach (the content of the beach)?

Please take a moment to think this through and make sure you understand the following before moving forward.

The only way to solve this problem would be to grab the text of the h3 element from the DOM, use that title to query our backend and do something in our Rails controller along the lines of...

@beach = Beach.find_by(name: params[:name])
This would feel really annoying. We just had access to this data when we retrieved all the beaches, but we effectively threw it away.

This is where we can refactor to use Object Orientation. We can take advantage of the encapsulation provided by objects to store all the data about a particular beach in one place.

If we weren't storing an id on the button, a second annoyance we might notice about our current implementation is that when the edit button is clicked, nothing on the button itself indicates what beach the button is for. We would have to look at the text of it's parent h3 element. We've solved this by adding data-attributes on the parent <div> and <button>.

Create Beach Class and Render Function
/* create a file src/beach.js and link to it from your index.html */
class Beach {
  // map attributes from backend (take values from db) and map those on to beach instances
  constructor(beach, beachAttributes) {
      this.id = beach.id
      // debugger
      this.name = beachAttributes.name
      this.country = beachAttributes.country
      this.location = beachAttributes.location
      this.description = beachAttributes.description
      this.image_url = beachAttributes.image_url
      Beach.all.push(this)
      // console.log(this)
      // debugger
  }

  renderSyllabusCard() {
    return `
            <div data-id=${this.id}>
              <img src=${this.image_url} height="200" width="250">
              <h3>${this.title}</h3>
              <p>${this.category.name}</p>
              <button data-id=${this.id}>edit</button>
            </div>
            <br><br>`;
  }

  renderBeachCard() {
  return `
      <div  class="col-md-4">
        <div class="card mb-4 shadow-sm">
          <img src=${this.image_url} class="card-img-top" alt="...">
          <div class="card text-center" >

          <div class="card-body">
            <h6 class="card-title">${this.name}</h6>
            <p class="card-title">Location: ${this.location}</p>
            <p class="card-title">Country: ${this.country.name}</p>

            <div class="d-flex justify-content-between align-items-center">
            <button type="button" onClick="deleteBeach()" data-id=${this.id} class="btn btn-sm btn-outline-secondary">Delete</button>
            <button type="button" id="read"  data-id=${this.id} class="btn btn-sm btn-outline-secondary">Read more</button>
            </div>
          </div>
        </div>
      </div>
      <br><br>
    `
  }
}

Beach.all = [];
Note: if you are not familiar with html5 data-attributes check them out. We totalllyyyy could have taken the id of the beach and added it to the DOM in the button's id or class properties. However, html ids and classes are typically used for css, not to store data.

But this is exactly what data-attributes are for and should make our lives easier. The important takeaway here is that the data our application logic depends on lives in the DOM itself and we must put it there somehow. Understanding that is more important than how exactly we put that data there.

Refactor GET
/* src/index.js */
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
Refactor POST
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
Creating a Static Method for "Find" Utility
/* src/beach.js */
class Beach {
  // ... previous code

  static findById(id) {
    return this.all.find(beach => beach.id === id);
  }
}

ja
   static findById(id) {
      return this.all.find(beach => beach.id === id);
    }


From learn.co:

Static methods are useful ways to create utility methods for your data. If you have operation that you need do perform on a batch of data (say, find a particular beach in an array, as above), static methods are your go-to tool. Since they are called on the class but don't have access to individual objects, they are somewhat limited in their scope, but can be very powerful in the correct application.

Clicking the 'edit' button & showing a form
Our code above was a true refactoring: we didn't change any functionality, we only changed (and hopefully improved) the implementation details.

Now let's add the ability to click an edit button and show a filled out form. As always, when dealing with handling events we'll want to break this down into a couple steps.

Can we respond to the event at all? First let's just console.log or alert something on a click.

Can we then console.log some data specific to the event. We'll try to console.log the whole beach object we're trying to edit.

Only after all that is wired up will we attempt to show a form with the correct values.

The first step, though straightforward, involves some decision making--where should the code that attaches the event listener go?

There is no right answer here. An argument could be made that it is the responsibility of the Beach class, something like Beach.addEditListeners(). The choice we will go with is to attach the event listeners in index.js which will continue to act as the "parent" of the Beach class. As the application scales and more classes are created, we could make a class called App that will be responsible for higher level things like attaching event listeners. Currently we only have one class, so attaching event listeners in index.js will do.

/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  // fetch and load syllabi
  getSyllabi()
  // listen for 'submit' event on form and handle data
  const createSyllabusForm = document.querySelector("#create-syllabus-form")
  createSyllabusForm.addEventListener("submit", (e) => createFormHandler(e))
  // listen for 'click' event on syllabus container
  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    console.log('clicked');
  });
})
Note: we won't go into event delegation in detail here, but because the edit buttons are dynamically added to the page we cannot put the event listeners on them directly. We have to put the listener on a static element, i.e. the parent <div>, and delegate the listening down to the children

If you see 'clicked' in the console move on to the next step.

You are very much encouraged to try to get the next step working on your own. You need to

a) grab the data-id of the clicked button out of the DOM and

b) find the associated beach instance. Try it on your own. Below is an implementation that works.

/* src/app.js */
document.addEventListener('DOMContentLoaded', () => {
  // ... previous code

  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    const syllabus = Syllabus.findById(id);
    console.log(syllabus);
  });
})

ja
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


Once we have the syllabus instance the next step is pretty easy. Just as we can call a prototype method syllabus.renderListItem on a syllabus instance we'll make a prototype method syllabus.renderUpdateForm and attach HTML to the DOM. This is like telling a syllabus object: 'use your state (all the information about this syllabus) to create an update form for it'.

Create the HTML for your edit form:

/* src/syllabus.js */
class Syllabus {
  // ... prev code

  renderUpdateForm() {
    return `
    <form data-id=${this.id} >
      <h3>Edit a Syllabus!</h3>

      <label>Title</label>
      <input id='input-title' type="text" name="title" value="${this.title}" class="input-text">
      <br><br>

      <label>Description</label>
      <textarea id='input-description' name="description" rows="8" cols="80" value="">${this.description}</textarea>
      <br><br>

      <label>Image URL</label>
      <input id='input-url' type="text" name="image" value="${this.image_url}" class="input-text">
      <br><br>

      <label>Category</label>
      <select id="categories" name="categories" value="${this.category.name}">
        <option value="1">Art</option>
        <option value="2">Tech</option>
        <option value="3">Science</option>
      </select>
      <br><br>

      <input id='edit-button' type="submit" name="submit" value="Edit Syllabus" class="submit">
    </form>
  `;
  }
}

ja
 renderUpdateForm() {
      return `
      <section class="jumbotron text-center">
      <div class="container">
        <form data-id=${this.id}>
          <h3>Edit a Beach!</h3>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default">Name</span>
            </div>
            <input id='input-name' type="text" value="${this.name}" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
          </div> 
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default">Location</span>
            </div>
            <input id='input-location' type="text" value="${this.location}" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Description</span>
            </div>
            <textarea id='input-description' type="text" value="${this.description}" class="form-control" aria-label="With textarea"></textarea>
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon3">Image Url</span>
            </div>
            <input id='input-url' value="${this.image_url}" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
          </div>
  
          <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Select a Country</label>
              </div>
              <select id="countries" value="${this.country.name}" class="custom-select" id="inputGroupSelect01">
                <option selected></option>
                <option value="1">Greece</option>
                <option value="2">Spain</option>
                <option value="3">France</option>
                <option value="4">Portugal</option>
                <option value="5">Cyprus</option>
                <option value="6">Italy</option>
                <option value="7">Croatia</option>
                <option value="8">Great Britain</option>
              </select>
            </div>
          <button id="edit-button" type="submit" class="btn btn-primary">Edit Beach</button>
          <br><br>
      </form>
      </div>
    </section>
    `
 }


Add a div for the form to render in index.html:

<div id="update-syllabus">

</div>

ja
  <div id="update-beach">

  </div>

</main>

Render the edit form when the edit button is clicked:

/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  // ... previous code

  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    const syllabus = Syllabus.findById(id);
    document.querySelector('#update-syllabus').innerHTML = syllabus.renderUpdateForm();
  });
})
Making the PATCH request
When the form is submitted we need to make a PATCH request to our server to update this beach record in our database. Like before, we will start with a straightforward approach and refactor.

It seems like we already have a place in our app where we attach event listeners. Let's add our code there. I will skip a few steps here and go straight to the implementation. When you are trying to grab data from the DOM in your own projects try things like

const title = e.target.querySelector('input').value;

Open up the console, use a debugger, and play around

Listen for the Event
/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  // ... previous code

  // render edit form once button is clicked
  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    const syllabus = Syllabus.findById(id);
    document.querySelector('#update-syllabus').innerHTML = syllabus.renderUpdateForm();
  });

  // listen for the submit event of the edit form and handle the data
  document.querySelector('#update-syllsbus').addEventListener('submit', e => updateFormHandler(e))
})

ja
// listen for the submit event of the edit form and handle the data
    document.querySelector('#update-beach').addEventListener('submit', event => updateFormHandler(event))
})****
Handle the Data from the Event
function updateFormHandler(e) {
  e.preventDefault();
  const id = parseInt(e.target.dataset.id);
  const syllabus = Syllabus.findById(id);
  const title = e.target.querySelector('#input-title').value;
  const description = e.target.querySelector('#input-description').value;
  const image_url = e.target.querySelector('#input-url').value;
  const category_id = parseInt(e.target.querySelector('#categories').value);
  patchSyllabus(syllabus, title, description, image_url, category_id)
}

ja 
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
}*************
Send the PATCH Request to the Backend
function patchSyllabus(syllabus, title, description, image_url, category_id) {
  const bodyJSON = { title, description, image_url, category_id }
  fetch(`http://localhost:3000/api/v1/syllabuses/${syllabus.id}`, {
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
});
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

Note: If you are not familiar with what is going on in the line const bodyJSON = { title, description, image_url, category_id }, look into ES6 Destructuring

Source: JavaScript Rails API Project Setup
