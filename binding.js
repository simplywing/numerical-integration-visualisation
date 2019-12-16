// Cache DOM elements
const inputElements = document.querySelectorAll('[os-model]');
const boundElements = document.querySelectorAll('[os-bind]');
// Initialize scope variable to hold the state of the model.
let scope = {};


function init() {
  // Loop through input elements
  for (let el of inputElements) {
      console.log(el.type);
    if (el.type === 'text' || el.type === 'number' || el.type === 'range') {
      // Get property name from each input with an attribute of 'os-model'
      let propName = el.getAttribute('os-model');
      console.log("Propname", propName);

      // Update bound scope property on input change
      el.addEventListener('input', e => {
        scope[propName] = el.value;
      });

      // Set property update logic
      setPropUpdateLogic(propName);
    }
  }
};

function setPropUpdateLogic(prop) {
  if (!scope.hasOwnProperty(prop)) {
    let value;
    Object.defineProperty(scope, prop, {
      // Automatically update bound dom elements when a scope property is set to a new value
      set: (newValue) => {
        value = newValue;

        // Set input elements to new value
        for (let el of inputElements) {
          if (el.getAttribute('os-model') === prop) {
            if (el.type) {
              el.value = newValue;
            }
          }
        }
        // Set all other bound dom elements to new value
        for (let el of boundElements) {
          if (el.getAttribute('os-bind') === prop) {
            if (!el.type) {
              el.innerHTML = newValue;
            }
          }
        }
      },
      get: () => {
        return value;
      },
      enumerable: true
    })
  }
}

init();