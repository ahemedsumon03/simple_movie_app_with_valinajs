const MOVIES_API_KEY = 'a3b1be7d580a5980027c35cbc7bc28ce';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const showMovies = document.getElementById('movies');
const animation = document.querySelector('.animation');

const modal = document.querySelector('.modal-overlay');
const close_btn = document.querySelector('.close-btn');

const modal_content = document.querySelector('.modal-content');
const categoriesCheckbox = [...document.querySelectorAll('input[type="checkbox"]')];

categoriesCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
        if (checkbox.checked) {
            e.preventDefault();
            const checkboxValue = checkbox.value;
            const valueSplit = checkboxValue.split(' ');
            const convertId = valueSplit.map(item => {
                let newItem = item.slice(0, item.length - 1);
                return genraData[newItem];
            })
            console.log(convertId);
            showAllMovies().then(data => {
                const genrasIds = data.results?.map(item => {
                    return item.genre_ids;
                })
                const genraFlatid = genrasIds.flatMap((item) => item);

                const filterData = data?.results?.filter(movie => {
                    return movie.genre_ids.includes(convertId[0]);
                })
                console.log(filterData);
                showMovies.innerHTML = '';
                filterData.forEach(movie => {
                    const divElement = document.createElement('div');
                    divElement.classList.add('movie');
                    divElement.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500/${movie?.poster_path}" alt=${movie?.title}/>
              <h3>${movie?.title}</h3>
              <button class="details-btn" data-movie-id=${movie.id}>More Details</button>
            `
                    showMovies.appendChild(divElement);
                })

            }).catch(err => {
                console.error(err.message);
            })
        } else { 
            displayMovies();
        }
    })
})

const showAllMovies = async () => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${MOVIES_API_KEY}`);
        const data = await response.json();
        animation.classList.add('not-loading');
        return data;
    } catch (e) {
        console.error(e.message);
    } finally {
        animation.classList.add('not-loading');
    }
}

const displayMovies = async () => {
    try {
        const movies = await showAllMovies();
        showMovies.innerHTML = '';
        movies.results.forEach(movie => {
            const divElement = document.createElement('div');
            divElement.classList.add('movie');
            divElement.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500/${movie?.poster_path}" alt=${movie?.title}/>
              <h3>${movie?.title}</h3>
              <button class="details-btn" data-movie-id=${movie.id}>More Details</button>
            `
            showMovies.appendChild(divElement);

            const detailsBtn = divElement.querySelector('.details-btn');
            detailsBtn.addEventListener('click', () => {
                const id = detailsBtn.dataset.movieId;
                fetchSingleMovie(id);
                modal.classList.add('open-modal');
            });

            close_btn.addEventListener('click', () => {
                modal.classList.remove('open-modal');
            })
        })
    } catch (e) {
        console.error(e.message);
    }
}

const fetchSingleMovie = async (movieId) => {
    modal_content.innerHTML = '';
    animation.classList.remove('not-show');
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIES_API_KEY}`);
        const data = await response.json();
        const { title, release_date, overview, vote_average, runtime, genres, original_language, popularity } = data;
        animation.classList.add('not-show');
        const genra = genres.map(genre => genre.name).join(', ');
        modal_content.innerHTML = `
          <h2>${title}</h2>
          <p>Language: ${original_language}</p>
          <h3>Genras: ${genra}</h3>
          <p>Release Date: ${release_date}</p>
          <p>Popularity: ${popularity}</p>
          <p>Overview: ${overview}</p>
          <p>Rating: ${vote_average}</p>
          <p>Runtime: ${runtime} minutes</p>
        `

    } catch (error) {
        console.error(error.message);
    } finally {
        animation.classList.add('not-show');
    }
}

const searchMovie = async (query) => {
    try {
        animation.classList.remove('not-show');
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIES_API_KEY}&query=${query}`);

        const data = await response.json();
        animation.classList.add('not-show');
        return data;
    } catch (error) {
        console.error(error.message);
    } finally {
        animation.classList.add('not-show');
    }
}

searchInput.addEventListener('input', e => {
    e.preventDefault();
    const query = searchInput.value;
    if (query) {
        const movies = searchMovie(query);
        movies.then(mymovie => {
            mymovie?.results.map((movie) => {
                const divElement = document.createElement('div');
                divElement.classList.add('movie');
                showMovies.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${movie?.poster_path}" alt=${movie?.title}/>
              <h3>${movie?.title}</h3>
              <p>Release Date: ${movie?.release_date}</p>
              <p>OverView: ${movie?.overview}</p>
              <p>Rating: ${movie?.vote_average}</p>
        `
            });
        }).catch(error => {
            console.error(error.message);
        })
    } else {
        displayMovies();
    }
});

document.addEventListener('DOMContentLoaded', displayMovies);