import React from "react";
import ReactDOM from "react-dom";

//Create a navigation bar component
var navLinks = [["index","/"],["calendar","calendar"],["student","student"],["instructor","instructor"]];

class Link extends React.Component {
    render() {
        return <h3><a href={this.props.destination}>Hello, {this.props.name}</a></h3>;
    }
}

function makeLink(title,dest) {
    return <Link name={title} destination={dest} />;
}

function makeNavBar(navLinks){

    var navBar = [];

    for(var link in navLinks){
        navBar.push(makeLink(link[0],link[1]));
    }

    return React.createElement(<div>{navBar}</div>);
}

ReactDOM.render(
    React.createElement(makeNavBar(navLinks)),
    document.getElementById('nav')
);