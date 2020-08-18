
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
        // debugger
    }

    renderBeachCard() {
        // debugger
        return `
        <div data-id=${this.id}>
          <h3>${this.name}</h3>
          <p>${this.country.name}</p>
          <p>${this.location}</p>
          <p>${this.description}</p>
          <img src=${this.image_url} height="200" width="250">
          <br><br>
          <button data-id=${this.id}>edit</button>
        </div>
        <br><br>`;
    
    }
}

Beach.all = [];


