// imports
const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const { subtractMinutes } = require('./subtractMinutes');

// static files
app.use(cors());
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use(express.json());

// set views for ejs
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index')
})

// call to calculate recommended sleep times according to inputted time
app.post('/save-time', (req, res) => {
    const selectedTime = req.body.selectedTime;
    console.log('Received Selected Time:', selectedTime);

    const minuteValues = [90 * 6, 90 * 5, 90 * 4, 90 * 3];

    const results = [];

    minuteValues.forEach((minutes) => {
        const result = subtractMinutes(selectedTime, minutes);
        results.push(result);
    });

    console.log('Results: ', results);

    // send the results
    res.json({ results });
});


// port listening
app.listen(port, () => console.info(`yay! listening on port ${port}`))