/**
 * React Calendar Component v0.1.1
 *
 * Copyright 2016, Dimitar Ivanov
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
var React = require("react");
var debug = require("debug");
var busyDayStr = document.getElementById("busyDays").innerHTML;
var availList = document.getElementById("availability").innerHTML;
var calendarID = document.getElementById("calendarID").innerHTML;
var availability = availList.split(',').map(Number);
var busyDays = busyDayStr.split(';').map(Number);

var Calendar = React.createClass({
    displayName: 'Calendar',
    calc: function (year, month) {
        if (this.state.selectedElement) {
            if (this.state.selectedMonth != month || this.state.selectedYear != year) {
                this.state.selectedElement.classList.remove('r-selected');
            } else {
                this.state.selectedElement.classList.add('r-selected');
            }
        }
        return {
            firstOfMonth: new Date(year, month, 1),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    },
    componentWillMount: function () {
        this.setState(this.calc.call(null, this.state.year, this.state.month));
    },
    componentDidMount: function () {},
    componentDidUpdate: function (prevProps, prevState) {
        if (this.props.onSelect && prevState.selectedDt != this.state.selectedDt) {
            this.props.onSelect.call(this.getDOMNode(), this.state);
        }
    },
    getInitialState: function () {
        var date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth(),
            selectedDate: date.getDate(),
            selectedDt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            startDay: 1,
            weekNumbers: false,
            minDate: this.props.minDate ? this.props.minDate : null,
            disablePast: this.props.disablePast ? this.props.disablePast : false,
            dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            firstOfMonth: null,
            daysInMonth: null
        };
    },
    getPrev: function () {
        var state = {};
        if (this.state.month > 0) {
            state.month = this.state.month - 1;
            state.year = this.state.year;
        } else {
            state.month = 11;
            state.year = this.state.year - 1;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month));
        this.setState(state);
    },
    getNext: function () {
        var state = {};
        if (this.state.month < 11) {
            state.month = this.state.month + 1;
            state.year = this.state.year;
        } else {
            state.month = 0;
            state.year = this.state.year + 1;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month));
        this.setState(state);
    },
    selectDate: function (year, month, date, element) {
        if (this.state.selectedElement) {
            this.state.selectedElement.classList.remove('r-selected');
        }
        element.target.classList.add('r-selected');

        this.setState({
            selectedYear: year,
            selectedMonth: month,
            selectedDate: date,
            selectedDt: new Date(year, month, date),
            selectedElement: element.target
        });
    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'r-calendar' },
            React.createElement(
                'div',
                { className: 'r-inner' },
                React.createElement(Header, { monthNames: this.state.monthNamesFull, month: this.state.month, year: this.state.year, onPrev: this.getPrev, onNext: this.getNext }),
                React.createElement(WeekDays, { dayNames: this.state.dayNames, startDay: this.state.startDay, weekNumbers: this.state.weekNumbers }),
                React.createElement(MonthDates, { month: this.state.month, year: this.state.year, daysInMonth: this.state.daysInMonth, firstOfMonth: this.state.firstOfMonth, startDay: this.state.startDay, onSelect: this.selectDate, weekNumbers: this.state.weekNumbers, disablePast: this.state.disablePast, minDate: this.state.minDate })
            )
        );
    }
});

var Header = React.createClass({
    displayName: 'Header',

    render: function () {
        return React.createElement(
            'div',
            { className: 'r-row r-head' },
            React.createElement('div', { className: 'r-cell r-prev', onClick: this.props.onPrev.bind(this), role: 'button', tabIndex: '0' }),
            React.createElement(
                'div',
                { className: 'r-cell r-title' },
                this.props.monthNames[this.props.month],
                ' ',
                this.props.year
            ),
            React.createElement('div', { className: 'r-cell r-next', onClick: this.props.onNext.bind(this), role: 'button', tabIndex: '0' })
        );
    }
});

var WeekDays = React.createClass({
    displayName: 'WeekDays',

    render: function () {
        var that = this,
            haystack = Array.apply(null, { length: 7 }).map(Number.call, Number);
        return React.createElement(
            'div',
            { className: 'r-row r-weekdays' },
            (() => {
                if (that.props.weekNumbers) {
                    return React.createElement(
                        'div',
                        { className: 'r-cell r-weeknum' },
                        'wn'
                    );
                }
            })(),
            haystack.map(function (item, i) {
                return React.createElement(
                    'div',
                    { className: 'r-cell' },
                    that.props.dayNames[(that.props.startDay + i) % 7]
                );
            })
        );
    }
});

var MonthDates = React.createClass({
    displayName: 'MonthDates',

    statics: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: new Date().getDate(),
        today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    render: function () {
        var haystack,
            day,
            d,
            current,
            onClick,
            isDate,
            className,
            weekStack = Array.apply(null, { length: 7 }).map(Number.call, Number),
            that = this,
            startDay = this.props.firstOfMonth.getUTCDay(),
            first = this.props.firstOfMonth.getDay(),
            janOne = new Date(that.props.year, 0, 1),
            rows = 5;

        if (startDay == 5 && this.props.daysInMonth == 31 || startDay == 6 && this.props.daysInMonth > 29) {
            rows = 6;
        }

        className = rows === 6 ? 'r-dates' : 'r-dates r-fix';
        haystack = Array.apply(null, { length: rows }).map(Number.call, Number);
        day = this.props.startDay + 1 - first;
        while (day > 1) {
            day -= 7;
        }
        day -= 1;
        return React.createElement(
            'div',
            { className: className },
            haystack.map(function (item, i) {
                d = day + i * 7;
                return React.createElement(
                    'div',
                    { className: 'r-row' },
                    (() => {
                        if (that.props.weekNumbers) {
                            var wn = Math.ceil(((new Date(that.props.year, that.props.month, d) - janOne) / 86400000 + janOne.getDay() + 1) / 7);
                            return React.createElement(
                                'div',
                                { className: 'r-cell r-weeknum' },
                                wn
                            );
                        }
                    })(),
                    weekStack.map(function (item, i) {
                        d += 1;
                        isDate = d > 0 && d <= that.props.daysInMonth;

                        if (isDate) {
                            current = new Date(that.props.year, that.props.month, d);
                            className = current != that.constructor.today ? 'r-cell r-date' : 'r-cell r-date r-today';
                            if (that.props.disablePast && current < that.constructor.today) {
                                className += ' r-past';
                            } else if (that.props.minDate !== null && current < that.props.minDate) {
                                className += ' r-past';
                            }

                            if (/r-past/.test(className)) {
                                return React.createElement(
                                    'div',
                                    { className: className, role: 'button', tabIndex: '0' },
                                    d
                                );
                            }

                            //Marks scheduled or unavailable days
                            var day = Math.round(current.valueOf()/86400000);
                            var regularDay = true;

                            if(day >= 0 && busyDays.indexOf(day) > -1){
                                className += ' scheduled';
                                regularDay = false;
                            }
                            else if(busyDays.indexOf(-day) > -1){
                                className += ' unavailable';
                                regularDay = false;
                            }

                            //Shows days that are regularly available or by appointment only (if they aren't already scheduled/unavailable)
                            if(regularDay){
                                var todayVal = availability[current.getDay()];
                                if(todayVal > 0){
                                    className += ' open';
                                }
                                else if(todayVal < 0){
                                    className += ' appointmentOnly'
                                }
                            }

                            var link = "/calendar/click?day=" + String(day) + "&id=" + calendarID;
                            return React.createElement(
                                'div',
                                { className: className, key: current.valueOf(),role: 'button', tabIndex: '0', onClick: that.props.onSelect.bind(that, that.props.year, that.props.month, d) },
                                //What is rendered for each calendar square
                                <span title={calendarID}><a href={link}>{d}</a></span>
                            );
                        }

                        return React.createElement('div', { className: 'r-cell' });
                    })
                );
            })
        );
    }
});

module.exports = Calendar;