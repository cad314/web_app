//Import react calendar components
let React = require("react");
let ReactDOM = require("react-dom");
let Calendar = require("./react_calendar.jsx");
let Dropdown = require("./react_dropdown.jsx");

ReactDOM.render(
    React.createElement(Calendar, {
        onSelect: function (state) {
        console.log(this, state);
        },
        disablePast: true,
        minDate: new Date()
    }),
    document.getElementById("calendar")
);

ReactDOM.render(React.createElement(Dropdown),document.getElementById("dropdown"));