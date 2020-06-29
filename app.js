const express = require('express');
const bodyParser =  require('body-parser');
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded ( {extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var cityquery = [];
var citytemprature = [];
var citydescription = [];
var cityicon = [];
var cityHumidity = [];
var cityWind = [];

app.get("/", function(req,res){
    // res.send("this is weather app using ejs");
    res.render("list", {city: cityquery , temprature: citytemprature, forcast: citydescription, imageURL: cityicon, wind:cityWind, humidity: cityHumidity })  
})

app.post("/", function (req, res) {

    var query = req.body.cityName;
    const apiKey = "6c5ea5c5b9748d6284fe70e2c048f6ce";
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units=" + unit;

        https.get(url, function(response){
            console.log(response.statusCode);

            response.on("data", function(data){             // In order to get data from the api response
                const weatherData = JSON.parse(data);
                console.log(weatherData);
                
                var weatherDiscription = weatherData.weather[0].description;      // here weather[0].description is the path where discription is present in the json
                var temprature = weatherData.main.temp;     // similarly main.temp is the path where temprature is stored in json file
                var icon = weatherData.weather[0].icon;
                var imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                var humidity = weatherData.main.humidity;
                var wind = weatherData.wind.speed;

                cityquery.pop();
                citytemprature.pop()
                citydescription.pop();
                cityicon.pop();
                cityHumidity.pop();
                cityWind.pop();
                
                cityquery.push(query);
                citytemprature.push(temprature)
                citydescription.push(weatherDiscription);
                cityHumidity.push(humidity);
                cityWind.push(wind);
                cityicon.push(imageURL);
                res.redirect("/");
            })
            
        })
    // res.redirect("/");
})



app.listen(3000, function(){
    console.log("Server started at port 3000");
})