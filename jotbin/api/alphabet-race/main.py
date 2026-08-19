from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jotbin.net"],
    allow_methods=["GET","POST"],
    allow_headers=["content-type"]
)

class Score(BaseModel):
    name: str
    time: int

@app.get("/leaderboard")
def getLeaderboard():
    with open("./leaderboard.json", "rt") as f:
        return json.load(f)

@app.post("/leaderboard")
def postLeaderboard(score: Score):
    with open("./leaderboard.json", "r+t") as f:
        data = json.load(f)
        maxTimeIndex = 0
        
        # add score to end of array, sort list, and remove max time if len > 10
        data.append(score.model_dump())
        data = sortByTime(data)
        if (len(data) > 10):
            data.pop()

        # store json and return content of updated json file
        f.seek(0)
        json.dump(data, f)
        f.truncate()
        return data


# utility functions
def sortByTime(list):
    if (len(list) < 2): return list

    for i in range (1, len(list)):
        while (i > 0 and list[i]["time"] < list[i - 1]["time"]):
            temp = list[i]
            list[i] = list[i - 1]
            list[i - 1] = temp
            i -= 1
    
    return list
