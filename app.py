# Import dependencies
from flask import Flask, redirect, render_template, request
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json
import os

# Initialise
app = Flask(__name__)
app.config["MONGO_URI"] = str(os.environ.get('MONGODB_URI',"mongodb://localhost:27017/EATinerary"))
mongo = PyMongo(app)
port = int(os.environ.get("PORT", 5000))

# json data
json_path = os.path.join('data', 'yelp_dataset', 'clean', 'restaurants.json')
with open(json_path) as data:
    json_data = json.load(data)

list_data = [k for k in json_data.values()]

# Setting up mongodb
restaurants = mongo.db.restaurants

# Loading the json data into mongodb
restaurants.delete_many({})
restaurants.insert_many(list_data, ordered=False)

# Home route
@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        city = request.form["city"]
        stars = float(request.form["stars"])
        print('city='+city)
        print('Stars=' + str(stars))
        data = restaurants.find({'City Lowercase': city.lower(), 'Stars': {'$gte': stars}})
        print('matching restaurants=' + str(data.count()))
        return render_template("map.html", data=dumps(data))
    return render_template("EATinerary.html")

# Route to fetch api key
@app.route("/key/", methods=["POST"])
def key():
    return str(os.environ.get('MapboxApiKey'))

# # Chart route
# @app.route("/chart.html")
# def chart():
#     return render_template("chart.html")

# # Table route
# @app.route("/table.html")
# def table():
#     return render_template("table.html")

if __name__ == "__main__": 
    app.run(host='0.0.0.0', port=port, debug= True)