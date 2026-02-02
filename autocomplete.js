// configuration object passed as argument will have all of the custom functions that specify how the autocomplete should work inside of our specific application

// we are expecting our config object to have a root element. we then destructure the root property from the config object and pass that in as a parameter/arg.
const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData } ) => {
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `;

    // since we are specifically looking for these elements in the root object, we change from document.querySelector to specifically root.querySelector
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    // fetchData is an async function so whenever we call fetchData, it will take some amount of time to process the request and then eventually return the data specified.
    // in order to get actual data back (as opposed to a promise), fetchData must be treated like an async function here as well, so we will use async/await
    const onInput = async (event) => {
        const items = await fetchData(event.target.value); // 'event.target.value' gets whatever the user just typed in as the input

        // this code will close the dropdown menu and exit the code block if there are no titles that match the search
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }
        
        resultsWrapper.innerHTML = '';

        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
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
};