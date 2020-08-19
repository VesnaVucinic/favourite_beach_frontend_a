
document.addEventListener('DOMContentLoaded', () => {
    // const beachContainer = document.querySelector('#beach-container')
    // beachContainer.addEventListener('click', event => { 
    //   console.log("clicked");
    const beachContainer = document.querySelector('#beach-container')
    beachContainer.addEventListener('click', event => {
      const id = parseInt(event.target.dataset.id);
      const beach = Beach.findById(id);
      console.log(beach);
    });
})