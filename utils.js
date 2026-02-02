// takes as argument a function that we want to and a delay value that can be specified by user or defaulted to 1000 ms
const debounce = (func, delay = 1000) => {
    // initialise timeoutId variable
    let timeoutId;
    // debounce returns a wrapper function and also passes along any arguments that the original function may need
    return (...args) => {
        if (timeoutId) { // this if statement will check for the existence of a timeoutId, which will be false the first time onInput runs when the user does the first keypress. the second keypress and on, a timeoutId will exist and we will enter this conditional to stop that existing timer and start a new one with the new input value.
            clearTimeout(timeoutId);
        }
        // whenever you call setTimeout(), it returns an integer that uniquely identifies the timer created by the call. we can assign this return value to the timeoutId variable, which we defined before the onInput func.
        // setTimeout() takes as the first arg a function to call and as the second arg a delay interval
        timeoutId = setTimeout(() => {
            // .apply calls the function as we normally would and pass in all arguments passed through
            func.apply(null, args);
        }, delay)
    };
};