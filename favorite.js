const Base_URL = 'https://movie-list.alphacamp.io'
const Index_URL = Base_URL + '/api/v1/movies/'
const Poster_URL = Base_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
function RenderMovieList(data) {
  let rawHTML = ``

  data.forEach(item => {
    rawHTML += `        
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src= "${Poster_URL + item.image}"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <!-- Button trigger modal -->
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-delete-movie" data-id="${item.id}">X</button>
              </div>
            </div>
          </div>
        </div>`
  });

  dataPanel.innerHTML = rawHTML
}



////渲染favoriteList
RenderMovieList(movies)

dataPanel.addEventListener('click',function onPanelClicked(e) {
  const target = e.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-delete-movie')){
    deleteFavoriteMovie(Number(target.dataset.id))
  }

})

function deleteFavoriteMovie(id) {
  if (!movies || !movies.length) return 
 
  const movie = movies.findIndex(movie => movie.id === id)
  if (movie === -1 ) return

  movies.splice(movie,1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  RenderMovieList(movies)

}

////showMovieModal
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')


  axios.get(Index_URL + id).then(response => {
    const data = response.data.results
    modalTitle.textContent = data.title
    modalDate.textContent = `Release Date : ${data.release_date}`
    modalDescription.textContent = data.description
    modalImage.innerHTML = `<img src="${Poster_URL + data.image}" alt=""></img>`
    console.log(data)
  })
}