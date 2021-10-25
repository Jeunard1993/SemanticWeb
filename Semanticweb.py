#!/usr/bin/env python
#alias python=/usr/local/bin/python3
from SPARQLWrapper import SPARQLWrapper, JSON
from flask import Flask, request,json, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd


api = Flask(__name__)
cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'


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


def get_query(country, interests):
    
    result = "?result"
    name = "?name"
    n_interests = 1
    
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
  BIND(wd:Q727 as ?wd)
  SERVICE <https://sophox.org/sparql> {
"""
    for i in interests:
        new_resutls  = result+f"{n_interests}"
        new_name = name+f"{n_interests}"
        query_section = f"""  {new_resutls} osmt:tourism  "{i}";
        osmt:name {new_name};
        osmt:addr:country "{country}";
        osmt:addr:city ?city."""
        query += query_section
        n_interests += 1
    query+= "}"+"} LIMIT 5"
    return query;




if __name__ == "__main__":
    api.run() 

