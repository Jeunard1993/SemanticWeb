#!/usr/bin/env python
#alias python=/usr/local/bin/python3
from SPARQLWrapper import SPARQLWrapper, JSON
from flask import Flask, request,json, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd


api = Flask(__name__)
cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'


INTERESTS = [
    "bandstand",
    "bird_hide",
    "bowling_alley",
    "dance",
    "dog_park",
    "escape_game",
    "firepit",
    "fishing",
    "fitness_centre",
    "garden",
    "golf_course",
    "hackerspace",
    "horse_riding",
    "ice_rink",
    "nature_reserve",
    "park",
    "picnic_table",
    "playground",
    "sauna",
    "sports_hall",
    "stadium",
    "summer_camp",
    "swimming_area",
    "swimming_pool",
    "tanning_salon",
    "trampoline_park",
    "water_park",
    "wildlife_hide",
    "alphine_hut",
    "aquarium",
    "artwork",
    "attraction",
    "gallery",
    "information",
    "museum",
    "theme_park",
    "viewpoint",
    "wilderness_hut",
    "zoo",
    "bar",
    "biergarten",
    "cafe",
    "casino",
    "fast_food",
    "food_court",
    "ice_cream",
    "pub",
    "restaurant",
    "bicycle_rental",
    "boat_rental",
    "car_rental",
]

Housing = ["motel", "guest_house",
    "hostel",
    "hotel",
     "chalet",
     "camp_site",
    "caravan_site",
     "apartment",
         "resort",
             "beach_resort"
]


@api.route('/results', methods=['POST'])
@cross_origin()
def get_companies():
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    input_json = request.get_json(force=True)
   
    sparql.setQuery(get_query(input_json['country'],input_json['tourism']))
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    response = jsonify(results['results']['bindings'])
    response.headers.add('Access-Control-Allow-Origin', 'POST')
 #   results_df = pd.io.json.json_normalize(results['results']['bindings'])
 #   print(results_df[['name1.value', 'name2.value','name3.value']].head())
    return response


@api.route('/descriptions', methods=['POST'])
@cross_origin()
def get_interests():
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    input_json = request.get_json(force=True)
   
    sparql.setQuery(get_Descriptions(input_json['name']))
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    response = jsonify(results['results']['bindings'])
    response.headers.add('Access-Control-Allow-Origin', 'POST')
 #   results_df = pd.io.json.json_normalize(results['results']['bindings'])
 #   print(results_df[['name1.value', 'name2.value','name3.value']].head())
    return response

@api.route('/interests', methods=['POST'])
@cross_origin()
def get_interests_distances():
    sparql = SPARQLWrapper("https://sophox.org/sparql")
    input_json = request.get_json(force=True)
   
    sparql.setQuery(get_query_distance_all(input_json['hotels'],input_json['interests']))
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    response = jsonify(results['results']['bindings'])
    print(results['results']['bindings'])
    response.headers.add('Access-Control-Allow-Origin', 'POST')
 #   results_df = pd.io.json.json_normalize(results['results']['bindings'])
 #   print(results_df[['name1.value', 'name2.value','name3.value']].head())
    return response


@api.route('/hotel', methods=['POST'])
@cross_origin()
def get_nearest_hotel():
    sparql = SPARQLWrapper("https://sophox.org/sparql")
    input_json = request.get_json(force=True)
   
    sparql.setQuery(get_nearest_hotel(input_json['interest'],input_json['hotels']))
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    response = jsonify(results['results']['bindings'])
    print(results['results']['bindings'])
    response.headers.add('Access-Control-Allow-Origin', 'POST')
 #   results_df = pd.io.json.json_normalize(results['results']['bindings'])
 #   print(results_df[['name1.value', 'name2.value','name3.value']].head())
    return response




def get_query(country, interests):
    
    result = "?result"
    name = "?name"
    n_interests = 1
    coordinates = "?coordinates"
    distance = "?distance"
    wiki = "?wiki"
    desc = "?desc"
    
    query  = """
PREFIX osmnode: <https://www.openstreetmap.org/node/>
PREFIX osmway: <https://www.openstreetmap.org/way/>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>
PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:>
PREFIX osmm: <https://www.openstreetmap.org/meta/>
PREFIX pageviews: <https://dumps.wikimedia.org/other/pageviews/>
PREFIX osmd: <http://wiki.openstreetmap.org/entity/>
PREFIX osmdt: <http://wiki.openstreetmap.org/prop/direct/>
PREFIX osmp: <http://wiki.openstreetmap.org/prop/>
PREFIX osmps: <http://wiki.openstreetmap.org/prop/statement/>
PREFIX osmpq: <http://wiki.openstreetmap.org/prop/qualifier/>

SELECT * WHERE {
  SERVICE <https://sophox.org/sparql> {
"""
    query_section = f"""  ?results osmt:addr:country "{country}";
    (osmt:tourism|osmt:leisure|osmt:amenity)  ?housing;
    osmt:name ?stay;
    osmt:addr:city ?city;
    osmt:addr:street ?street;
    osmt:addr:housenumber ?housenumber;
    osmt:website ?url;
    osmm:loc ?coordinates.
    FILTER (?housing IN ("motel", "guest_house","hostel", "hotel", "chalet", "camp_site", "caravan_site", "apartment", "resort", "beach_resort") )"""
    query += query_section
    for i in interests:
        new_resutls  = result+f"{n_interests}"
        new_name = name+f"{n_interests}"
        new_coordinates = coordinates+f"{n_interests}"
        new_distance = distance+f"{n_interests}"
        new_wiki = wiki+f"{n_interests}"
        new_desc = desc +f"{n_interests}"
        
        query_section = f"""  {new_resutls} osmt:addr:country "{country}";
       (osmt:tourism|osmt:leisure|osmt:amenity) "{i}";
        osmt:name {new_name};
        osmt:addr:city ?city.
    """   
      #  wikidata = "OPTIONAL{ "+new_resutls+" osmt:wikidata "+new_wiki+" }} OPTIONAL { "+new_wiki+" schema:description "+new_desc+" . FILTER ( lang("+new_desc+") = \"en\" ) .} "
        query += query_section
        n_interests += 1
    query+= "} }"
    print(query)
    return query;



def get_Descriptions(interest_name):
    query  = """
PREFIX osmnode: <https://www.openstreetmap.org/node/>
PREFIX osmway: <https://www.openstreetmap.org/way/>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>
PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:>
PREFIX osmm: <https://www.openstreetmap.org/meta/>
PREFIX pageviews: <https://dumps.wikimedia.org/other/pageviews/>
PREFIX osmd: <http://wiki.openstreetmap.org/entity/>
PREFIX osmdt: <http://wiki.openstreetmap.org/prop/direct/>
PREFIX osmp: <http://wiki.openstreetmap.org/prop/>
PREFIX osmps: <http://wiki.openstreetmap.org/prop/statement/>
PREFIX osmpq: <http://wiki.openstreetmap.org/prop/qualifier/>

SELECT * WHERE {
  SERVICE <https://sophox.org/sparql> {
"""
    city = "?city"
    interest = "?interest"
    n_interests = 1
    query_section = f"""  ?result osmt:addr:country ?country;
       (osmt:tourism|osmt:leisure|osmt:amenity) ?interest;
        osmt:name "{interest_name}";
        osmt:addr:city ?city;
        osmt:wikidata ?wiki.
    """  
    query += query_section 
    query_section = """} Optional{?wiki schema:description ?desc.
              FILTER ( lang(?desc) = "en" ) . }} """
    query += query_section 
    print(query)
    return query;




def get_query_coord(coord, distance, interests):
    
    result = "?result"
    name = "?name"
    n_interests = 1
    
    query  = """


SELECT DISTINCT * WHERE {
"""
    query_section = f"""  ?pitch (osmt:tourism|osmt:leisure|osmt:amenity) ?interest; 
  osmt:name ?name;
  osmt:addr:street ?street;
  osmt:addr:housenumber ?houseNumber;
  osmt:addr:city ?city .
  """
    query += query_section
    interest = """FILTER (?interest  in ("""
    for i,data in enumerate(interests):
        if i == len(interests) - 1:
            interest += f""" "{data}")) """
        else:
            interest += f""" "{data}", """
    query += interest
    query += """ SERVICE wikibase:around { 
    ?pitch osmm:loc ?coordinates."""
    query +=f"""
    bd:serviceParam wikibase:center "{coord}"^^geo:wktLiteral. # somewhere in Suriname
    bd:serviceParam wikibase:radius "{distance}". # kilometers"""
    query +="""
    bd:serviceParam wikibase:distance ?distance.
  }
}

"""
    print(query)
    return query;


def get_query_distance( hotel, interests):
    
    result = "?result"
    name = "?name"
    n_interests = 1
    coordinates = "?coordinates"
    distance = "?distance"
    interest_type = "?interest"
    
    query  = """
PREFIX osmnode: <https://www.openstreetmap.org/node/>
PREFIX osmway: <https://www.openstreetmap.org/way/>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>
PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:>
PREFIX osmm: <https://www.openstreetmap.org/meta/>
PREFIX pageviews: <https://dumps.wikimedia.org/other/pageviews/>
PREFIX osmd: <http://wiki.openstreetmap.org/entity/>
PREFIX osmdt: <http://wiki.openstreetmap.org/prop/direct/>
PREFIX osmp: <http://wiki.openstreetmap.org/prop/>
PREFIX osmps: <http://wiki.openstreetmap.org/prop/statement/>
PREFIX osmpq: <http://wiki.openstreetmap.org/prop/qualifier/>

SELECT * WHERE {
  SERVICE <https://sophox.org/sparql> {
"""
    query_section = f"""  ?results osmt:addr:country ?country;
    (osmt:tourism|osmt:leisure|osmt:amenity)  ?housing;
    osmt:name "{hotel}";
    osmt:addr:city ?city;
    osmm:loc ?coordinates.
"""
    query += query_section
    for i in interests:
        new_resutls  = result+f"{n_interests}"
        new_name = name+f"{n_interests}"
        new_coordinates = coordinates+f"{n_interests}"
        new_distance = distance+f"{n_interests}"
        new_interest_type = interest_type +f"{n_interests}"
        
        query_section = f"""  {new_resutls} osmt:addr:country  ?country;
       (osmt:tourism|osmt:leisure|osmt:amenity) {new_interest_type};
        osmt:name "{i}";
        osmm:loc {new_coordinates};
        osmt:addr:city ?city.
        BIND(geof:distance({new_coordinates}, ?coordinates) AS {new_distance})"""   
        query += query_section
        n_interests += 1
    query+= "}"+"}"
    print(query)
    return query;


def get_query_distance_all( hotel_list, interests):
    result = "?result"
    name = "?name"
    n_interests = 1

    hotels =""
    coordinates = "?coordinates"
    distance = "?distance"
    interest_type = "?interest"
    
    query  = """
PREFIX osmnode: <https://www.openstreetmap.org/node/>
PREFIX osmway: <https://www.openstreetmap.org/way/>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>
PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:>
PREFIX osmm: <https://www.openstreetmap.org/meta/>
PREFIX pageviews: <https://dumps.wikimedia.org/other/pageviews/>
PREFIX osmd: <http://wiki.openstreetmap.org/entity/>
PREFIX osmdt: <http://wiki.openstreetmap.org/prop/direct/>
PREFIX osmp: <http://wiki.openstreetmap.org/prop/>
PREFIX osmps: <http://wiki.openstreetmap.org/prop/statement/>
PREFIX osmpq: <http://wiki.openstreetmap.org/prop/qualifier/>

SELECT * WHERE {
  SERVICE <https://sophox.org/sparql> {
"""
    query_section = f"""   ?results osmt:addr:country ?country;
    (osmt:tourism|osmt:leisure|osmt:amenity)  ?housing;
    osmt:name ?label;
    osmt:addr:city ?city;
    osmm:loc ?coordinates.
"""
    query += query_section
    for i in hotel_list:
        if hotel_list[-1] == i:
            hotel = f"\"{i}\""
        else:
            hotel = f"\"{i}\","
        hotels +=hotel
    query += query_section
    for i in interests:
        new_resutls  = result+f"{n_interests}"
        new_name = name+f"{n_interests}"
        new_coordinates = coordinates+f"{n_interests}"
        new_distance = distance+f"{n_interests}"
        new_interest_type = interest_type +f"{n_interests}"
        
        query_section = f"""  {new_resutls} osmt:addr:country  ?country;
       (osmt:tourism|osmt:leisure|osmt:amenity) {new_interest_type};
        osmt:name "{i}";
        osmm:loc {new_coordinates};
        osmt:addr:city ?city.
        BIND(geof:distance({new_coordinates}, ?coordinates) AS {new_distance})"""   
        query += query_section
        n_interests += 1
    filters = f"FILTER ( ?label IN ({hotels}) )"
    query+= "}"+filters+"}"
    print(query)
    return query;


def get_nearest_hotel( interest, hotel_list):
    result = "?result"
    name = "?name"
    n_interests = 1

    hotels =""
    coordinates = "?coordinates"
    distance = "?distance"
    interest_type = "?interest"
    
    query  = """
PREFIX osmnode: <https://www.openstreetmap.org/node/>
PREFIX osmway: <https://www.openstreetmap.org/way/>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>
PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:>
PREFIX osmm: <https://www.openstreetmap.org/meta/>
PREFIX pageviews: <https://dumps.wikimedia.org/other/pageviews/>
PREFIX osmd: <http://wiki.openstreetmap.org/entity/>
PREFIX osmdt: <http://wiki.openstreetmap.org/prop/direct/>
PREFIX osmp: <http://wiki.openstreetmap.org/prop/>
PREFIX osmps: <http://wiki.openstreetmap.org/prop/statement/>
PREFIX osmpq: <http://wiki.openstreetmap.org/prop/qualifier/>

SELECT ?label WHERE {
  SERVICE <https://sophox.org/sparql> {
"""
    query_section = f"""   ?results osmt:addr:country ?country;
    (osmt:tourism|osmt:leisure|osmt:amenity)  ?housing;
    osmt:name ?label;
    osmt:addr:city ?city;
    osmm:loc ?coordinates.
"""
    query += query_section
    for i in hotel_list:
        if hotel_list[-1] == i:
            hotel = f"\"{i}\""
        else:
            hotel = f"\"{i}\","
        hotels +=hotel
    query_section = f"""  ?result1 osmt:addr:country  ?country;
       (osmt:tourism|osmt:leisure|osmt:amenity) ?interest;
        osmt:name "{interest}";
        osmm:loc ?coordinates1;
        osmt:addr:city ?city.
        BIND(geof:distance(?coordinates1, ?coordinates) AS ?distance)"""   
    query += query_section
    filters = f"FILTER ( ?label IN ({hotels}) )"
    query+= "}"+filters+"} ORDER BY ASC(?distance) Limit 1"
    print(query)
    return query;



if __name__ == "__main__":
    api.run() 

