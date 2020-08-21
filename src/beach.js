
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
        console.log(this)
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
                  <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                </div>
                <small class="text-muted">Country: ${this.country.name}</small>
              </div>
            </div>
          </div>
        </div>
        <br><br>
      `
    
    }
}

Beach.all = [];


