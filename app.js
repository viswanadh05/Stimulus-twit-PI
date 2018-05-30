/* 
DEAKIN UNIVERSITY: THESIS RESEARCH PROJECT
PROJECT: REACTION TO THE STIMULUS BASED ON PERSONALITY
TEAM:
--> VISWANADH BHASKARLA
--> AAFIA PATHAN
*/

//Importing required packages
var Twit = require('twit');
var config = require('./config');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();

var PersonalityInsightsV2 = require('watson-developer-cloud/personality-insights/v2');

var personality_insights = new PersonalityInsightsV2({
    username: 'YOUR_PERSONALITY_INSIGHTS_USERNAME',
    password: 'YOUR_PERSONALITY_INSIGHTS_PASSWORD'
});


http.listen(appEnv.port, appEnv.bind);

//Passing API keys
var T = new Twit(config);

var params = { screen_name: 'TWITTER_HANDLE', count: 200};

//Extracting user timeline with user screen_name and number of tweets required.
T.get('statuses/user_timeline', params, shapeData);

//Function to reform the JSON response data.
function shapeData(err,data,res){
    var text = '';
    data.forEach(function(tweet){
        text+=tweet.text;
    });
    
    if(err){
    	app.get('/', (req,res) => res.send(err));
    }
    else{
        app.get('/', (req,res) => res.send(text));
    }

    personality_insights.profile({
        text: text,
        
        language: 'en' },
        function(err,response){
            if(err)
                console.log('error:',err);
            else
                console.log(JSON.stringify(response,null,2));
        });
    
    console.log("Express Server Running..");
}




