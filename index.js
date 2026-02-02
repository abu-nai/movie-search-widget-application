// data request to API23456
const fetchData = async (searchTerm) => {
    // the returned response variable will be an object that represents all of the info related to the request that we made. inside of the response object is the data that we should be getting back from the API.
    // axios syntax allows us to specify a second argument as an object that includes all of the different query string parameters we want to search
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '9e8dfdd6',
            s: searchTerm
        }
    });

    if (response.data.Error) {
        return [];
    }

    // uppercase S in Search to match the specific property name in this omdbapi. not the standard way, but must follow the convention the API author set.
    return response.data.Search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

// fetchData is an async function so whenever we call fetchData, it will take some amount of time to process the request and then eventually return the data specified.
// in order to get actual data back (as opposed to a promise), fetchData must be treated like an async function here as well, so we will use async/await
const onInput = async (event) => {
    const movies = await fetchData(event.target.value); // 'event.target.value' gets whatever the user just typed in as the input

    // this code will close the dropdown menu and exit the code block if there are no titles that match the search
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }
    
    resultsWrapper.innerHTML = '';

    dropdown.classList.add('is-active');
    for (let movie of movies) {
        const option = document.createElement('a');
        // if item.Poster === 'N/A' is truthy, return ''; if it is falsy, 
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item');
        // use back ticks to create multi-line string. single quotations will result in a syntax error.
        option.innerHTML = `
        <img src="${imgSrc}"/>
        ${movie.Title}
        `;

        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    };
};

// the 'input' event is triggered any time a user changes the text inside of the input
input.addEventListener('input', debounce(onInput, 500));

// this code will close the dropdown menu if the user clicks anywhere outside of the "autocomplete" div (the root variable)
// event.target tells us what gets clicked
// .contains() method tells us whether or not what we are searching for is found in a specified location
document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

const onMovieSelect = async (movie) => {
    // console.log(movie);
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '9e8dfdd6',
            i: movie.imdbID
        }
    });

    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
}

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}">
                </p>
            </figure>

            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">imdb Votes</p>
        </article>
    `;
};