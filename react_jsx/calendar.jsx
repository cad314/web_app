//Import react calendar components
let React = require("react");
let ReactDOM = require("react-dom");
let Calendar = require("./react_calendar.jsx");

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