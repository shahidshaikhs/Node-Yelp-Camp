var express = require("express");
var request = require("request");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });


// Database Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (error, allCampgrounds) {
        if (error) {
            console.log("There was a error while getting the Campgrounds")
        }
        else {
            console.log("Successfully fetched the Campground");
            res.render("campgrounds", { campgrounds: allCampgrounds });
        }
    })
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});

app.post("/campgrounds", function (req, res) {
    //1. Get Data from form and add to array
    var name = req.body.campname;
    var image = req.body.imageurl;

    var newcamp = { name: name, image: image };

    Campground.create(
        newcamp, function (error, campground) {
            if (error) {
                console.log("There was a error while adding the Campground")
            }
            else {
                console.log("Successfully Added the Campground");
                res.redirect("campgrounds");
            }
        });
});

app.listen("3000", function () {
    console.log("Yelp Server is running on port 3000");
});

