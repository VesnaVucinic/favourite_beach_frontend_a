
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

    renderBeachCard() {
        // debugger
        // return `
        // <div data-id=${this.id}>
        //   <h3>${this.name}</h3>
        //   <p>${this.country.name}</p>
        //   <p>${this.location}</p>
        //   <p>${this.description}</p>
        //   <img src=${this.image_url} height="200" width="250">
        //   <br><br>
        //   <button data-id=${this.id}>edit</button>
        // </div>
        // <br><br>`;

    return `
        <div class="col-md-8">
          <div class="card mb-4 shadow-sm">
            <img src=${this.image_url} class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${this.name}</h5>
              <h5 class="card-title">${this.location}</h5>
              <p class="card-text">${this.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" data-id=${this.id} class="btn btn-sm btn-outline-secondary">View</button>
                  <button type="button" data-id=${this.id} class="btn btn-sm btn-outline-secondary">Edit</button>
                </div>
                <small class="text-muted">Country: ${this.country.name}</small>
              </div>
            </div>
          </div>
        </div>
        <br><br>
      `
    }
   
    static findById(id) {
      return this.all.find(beach => beach.id === id);
    }

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
//     return `
//     <form data-id=${this.id} >
//       <h3>Edit a Beach!</h3>
//       <input id='input-name' type="text" name="name" value="${this.name}" placeholder="Enter your beach name..." class="input-text">
//       <br><br>
//       <p>Select a Country</p>
//       <select id="countries" name="countries" value="${this.country.name}">
//         <option value="1">Greece</option>
//         <option value="2">Spain</option>
//         <option value="3">France</option>
    //    <option value="4">Portugal</option>
        // <option value="5">Cyprus</option>
        // <option value="6">Italy</option>
        // <option value="7">Croatia</option>
        // <option value="8">Great Britain</option> 
//       </select>
//       <br><br>
//       <input id='input-location' type="text" name="location" value="${this.location}" placeholder="Enter your beach location..." class="input-text">
//       <br><br>
//       <textarea id='input-description' name="description" rows="8" cols="80" value="${this.description}" placeholder="Enter your beach description..."></textarea>
//       <br><br>
//       <input id='input-url' type="text" name="image" value="${this.image_url}" placeholder="Enter your beach image URL..." class="input-text">
//       <br><br>
  
//       <input id= 'edit-button' type="submit" name="submit" value="Edit Beach" class="submit">
      
//     </form> 

    
//     <br><br>
// </div>

//   `;
    }
}

Beach.all = [];


