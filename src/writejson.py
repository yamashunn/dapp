import json
from collections import OrderedDict
import ndjson ##追記保存のパッケージ

filename = "/Users/e205733/Dapp/truffle-tutorial/pet-shop-tutorial/src/otameshi.json"
json_data = {}

def addjson(id,name,picture,age,breed,location):

    word = {"id":str(id),"name":name,"picture":picture,"age":str(age),"breed":breed,"location":location}

    with open(filename, "r", encoding="utf-8_sig") as f:

        json_data = json.load(f)

    json_data.append(word)#追加

    with open(filename, "w", encoding="utf-8_sig") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=4)

    return "sucess"


a=addjson("18","shunto","images/rushia.jpeg","20","homosapi","Tokyo, Japan")
b=json.dumps(a,indent=4,ensure_ascii=False)   ##見やすく日本語ok
print(b)



