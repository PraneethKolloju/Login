const express = require('express');
const bodyparser = require('body-parser');
const http = require('https');
const re = require('request');
const { response } = require('express');



const app = express();
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html');
})

app.post('/', function (req, res) {
    //    console.log(request.body.username);

    const FName = req.body.firstname;
    const LName = req.body.lastname;
    const EMail = req.body.usermail;
    const data = {
        members: [
            {
                email_address: EMail,
                status: 'subscribed',
                merge_fields: {
                    FNAME: FName,
                    LNAME: LName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = 'https://us21.api.mailchimp.com/3.0/lists/c513953163';
    const options = {
        method: 'POST',
        auth: 'praneeth:9b7563d8b5b9b85d439bf1e3f84f0037-us21'
    }
    const request = http.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on('data', function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post('/failure', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.listen(process.env.PORT || 3000);
