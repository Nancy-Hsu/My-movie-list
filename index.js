const Base_URL = 'https://movie-list.alphacamp.io'
const Index_URL = Base_URL + '/api/v1/movies/'
const Poster_URL = Base_URL + '/posters/'
const movies = []
let filterMovies = []
const dataPanel = document.querySelector('#data-panel')
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')
//// 渲染 Movie List 功能
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
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>`
  });

  dataPanel.innerHTML = rawHTML
}

////渲染 Movie List執行程式
axios.get(Index_URL).then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  RenderMovieList(getMovieByPage(1))
}).catch((err) => console.log(err))


////dataPanel綁定事件
dataPanel.addEventListener('click', function onPanelClicked(e) {
  const target = e.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-add-favorite')){
    addToFavorite(Number(target.dataset.id))
  }

})

function addToFavorite(id) {
  const favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find( movie => movie.id === id)
  if (favoriteList.some(item => item.id === id)) {
    return alert('You have added this movie')
  }
  favoriteList.push(movie)
  
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList))
  alert('電影已加入收藏清單')
  
  
}




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


//// for search function
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//// input 綁定事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {

  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()

  // if (!keyword.length) {
  //   return alert('Please Insert a word for searching')
  // }
  filterMovies = movies.filter((movie) =>  movie.title.toLowerCase().includes(keyword))

  if (!filterMovies.length) {
    return alert(`Sorry, there is no movie about ${keyword}`)
  }

  renderPaginator(filterMovies.length)
  
  RenderMovieList(getMovieByPage(1))
})


function getMovieByPage(page) {
  const data = filterMovies.length ? filterMovies : movies
  const startPage = (page - 1) * MOVIES_PER_PAGE
  const endPage = startPage + MOVIES_PER_PAGE
  return data.slice(startPage, endPage)
}

function renderPaginator(amount) {
  const numOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  const target = event.target
  if (target.tagName !== 'A') return
  const page = Number(target.dataset.page)
  RenderMovieList(getMovieByPage(page))
})