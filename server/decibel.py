from scipy.io.wavfile import read
import numpy as np
import math
import statistics
import json
samprate, wavdata = read('Dog.wav')
n = wavdata.size
t= wavdata.size / samprate
t = math.ceil(t*10)
chunks = np.array_split(wavdata, t)
dbs =[]
for chunk in chunks:
    mean  = statistics.mean(chunk**2)
    if (mean <0):
        db =0
    else:
        if( mean == 0):
            db =0
        else:
            db = 20*math.log10( math.sqrt(statistics.mean(chunk**2)) )
    dbs.append(db)
#dbs = [20*math.log10( math.sqrt(statistics.mean(chunk**2)) ) for chunk in chunks]
print(dbs)
with open('data.json', 'w') as outfile:
    json.dump(dbs, outfile)
