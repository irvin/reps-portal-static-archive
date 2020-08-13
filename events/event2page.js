var fs = require('fs'),
    handlebars = require("handlebars");

var template = fs.readFileSync('./event.handlebars', 'utf-8');
template = handlebars.compile(template);

let jsonData = require('../data/EVENTS.json');
console.log('loaded', jsonData.length);

let year = process.argv[2] || '2020';
let fn = `events_${year}.html`;

let yearEvents =jsonData.filter((event) => {
    return (event.start.toString()).startsWith(year);
});
let yearEventLen = yearEvents.length;
console.log('year:', year, yearEventLen);


// create file
let buffer;

let top_template = fs.readFileSync('./page_top.handlebars', 'utf-8');
top_template = handlebars.compile(top_template);

buffer = top_template({ 'len': yearEventLen, 'year': year });
fs.writeFileSync(fn, buffer);    

let getMonthStr = (dateObj) => ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][dateObj.getMonth()];

yearEvents.forEach(evt => { evt.start = new Date(evt.start); });
yearEvents = yearEvents.sort((evt1, evt2) => {
    return (evt1.start != evt2.start)? evt1.start - evt2.start : evt1.end - evt2.end;
});

yearEvents.forEach((evt, index) => {

    var dtStart = evt.start;
    var dtEnd = new Date(evt.end);
    evt.start_day = dtStart.getDate();
    evt.end_day = dtEnd.getDate();
    evt.start_month = getMonthStr(dtStart);
    evt.end_month = getMonthStr(dtEnd);
    evt.start_year = dtStart.getFullYear();
    evt.multiday = (evt.start_day != evt.end_day);
    evt.multimonth = (evt.start_month != evt.end_month);

    evt.slug = evt.remo_url.split('/e/')[1].slice(0, -1);

    // write to file
    var buffer = template(evt);
    console.log(`${index+1} / ${yearEventLen}`);
    var fn = `events_${year}.html`;
    fs.writeFileSync(fn, buffer, {flag: 'a'});    
});

buffer = fs.readFileSync('./page_bottom.handlebars', 'utf-8');
fs.writeFileSync(fn, buffer, {flag: 'a'});    

return;
