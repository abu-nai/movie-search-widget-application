const autoCompleteConfig = {
    renderOption(movie) {
        // if item.Poster === 'N/A' is truthy, return ''; if it is falsy, 
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        // use back ticks to create multi-line string. single quotations will result in a syntax error.
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
            `;
    },
    onOptionSelect(movie) {
        onMovieSelect(movie);
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
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
    }
};

createAutoComplete({
    // the ellipses copies all of the properties of the object autoCompleteConfig into this createAutoComplete object
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
});

createAutoComplete({
    // the ellipses copies all of the properties of the object autoCompleteConfig into this createAutoComplete object
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
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