var fs = require('fs'),
    handlebars = require("handlebars");

var template = fs.readFileSync('./event.handlebars', 'utf-8');
template = handlebars.compile(template);

let jsonData = require('./EVENTS.json');
console.log('loaded', jsonData.length)

let year = '2015';
let fn = `events_${year}.html`;

var yearEvents =jsonData.filter((event) => {
    return (event.start.toString()).startsWith(year)
});
console.log('year:', year, yearEvents.length);


// create file
let buffer;

let top_template = fs.readFileSync('./page_top.handlebars', 'utf-8');
top_template = handlebars.compile(top_template);

buffer = top_template({ 'len': yearEvents.length, 'year': year });
fs.writeFileSync(fn, buffer);    

let getMonthStr = (dateObj) => ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][dateObj.getMonth()];

yearEvents.forEach(evt => {

    var dtStart = new Date(evt.start);
    var dtEnd = new Date(evt.end);

    var startDayStr = `${dtStart.getFullYear()} ${dtStart.getMonth()+1} ${dtStart.getDate()}`;
    var endDayStr = `${dtEnd.getFullYear()} ${dtEnd.getMonth()+1} ${dtEnd.getDate()}`;
    evt.start_day = dtStart.getDate();
    evt.end_day = dtEnd.getDate();
    evt.start_month = getMonthStr(dtStart);
    evt.end_month = getMonthStr(dtEnd);
    evt.start_year = dtStart.getFullYear();
    evt.multiday = (evt.start_day != evt.end_day);
    evt.multimonth = (evt.start_month != evt.end_month);

    // write to file
    var buffer = template(evt);
    console.log(buffer);
    var fn = `events_${year}.html`;
    fs.writeFileSync(fn, buffer, {flag: 'a'});    
});

buffer = fs.readFileSync('./page_bottom.handlebars', 'utf-8');
fs.writeFileSync(fn, buffer, {flag: 'a'});    


return;
