#!/usr/bin/env python

import random
import string

pipeline_name = "hindi_panjabi";
modules = ["tokenizer","utf2wx","morph","postagger","chunker","pruning","guessmorph","pickonemorph","computehead","computevibhakti","parse","root2infinity","transfergrammar","wx2utf","lexicaltransfer","transliterate","agreementfeature","vibhaktispliter","interchunk","intrachunk","agreementdistribution","defaultfeatures","wordgenerator"]


graph = {}

graph["properties"] = {"name" : pipeline_name}
graph["inports"] = []
graph["outports"] = []
graph["groups"] = []
graph["processes"] = {}
graph["connections"] = []


def get_rand():
  return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(4))

# add processes
"""
    "core\/sentence_input_1zk7": {
      "component": "core\/sentence_input",
      "metadata": {
        "label": "Sentence Input",
        "x": 216,
        "y": 468,
        "width": 72,
        "height": 72
      }
    },
"""
pNameDict = {}
processes = []
for m in modules:
  _p = {}
  _p["component"] = pipeline_name+"/"+m
  _p["metadata"] = {}
  _p["metadata"]["label"] = m
  _p["metadata"]["x"] = int(random.random()*400 + 200)
  _p["metadata"]["y"] = int(random.random()*400 + 200)
  _p["metadata"]["width"] = 72
  _p["metadata"]["height"] = 72

  pName = _p["component"]+"_"+get_rand()

  pNameDict[pipeline_name+"/"+m] = pName
  graph["processes"][pName] = _p
  processes.append(_p)



_sentence_input = {
    "component": "core/sentence_input",
    "metadata": {
      "label": "Sentence Input",
      "x": 216,
      "y": 468,
      "width": 72,
      "height": 72
    }
  }

graph["processes"]["core/sentence_input_1zk7"] = _sentence_input;
pNameDict["core/sentence_input"] = "core/sentence_input_1zk7"

_sentence_output = {
    "component": "core/sentence_output",
    "metadata": {
      "label": "Sentence Output",
      "x": 540,
      "y": 360,
      "width": 72,
      "height": 72
    }
  }

graph["processes"]["core/sentence_output_1zk7"] = _sentence_output;
pNameDict["core/sentence_output"] = "core/sentence_output_1zk7"

processes = [_sentence_input] + processes + [_sentence_output]

# Add edges
"""
{
      "src": {
        "process": "core\/sentence_input_1zk7",
        "port": "out_ssf"
      },
      "tgt": {
        "process": "core\/sentence_output_40c",
        "port": "in_ssf"
      },
      "metadata": {
        
      }
    },
"""

for i in range(len(processes)-1):
  source = processes[i]
  target = processes[i+1]

  _e = {}
  _e["src"] = {
    "process" : pNameDict[source["component"]],
    "port" : "out_ssf"
  }
  _e["tgt"] = {
    "process" : pNameDict[target["component"]],
    "port" : "in_ssf"
  }
  _e["metadata"] = {}

  graph["connections"].append(_e)



import json
f = open("graph.json","w")

s = "loadGraph("
s += json.dumps(graph, indent=4)
s += ")"

print s;

f.write(s);
f.close();