import hashlib
import boto3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import numpy as np
from matplotlib import pyplot as plt
import scipy.io.wavfile as wav
from numpy.lib import stride_tricks
import io

# Config
api = Flask(__name__)
api.secret_key = "secretkey"
api.config['UPLOAD_FOLDER'] = '/tmp/'
CORS(api)
port = 27017
name = 'wildly'
mongo = PyMongo(
    api, uri=f"mongodb://localhost:{port}/{name}")
api_version = '/api/v2'

# Collections
meta_coll = mongo.db.metadata
tags_coll = mongo.db.tags
anno_coll = mongo.db.annotations
user_coll = mongo.db.users
user_perm_coll = mongo.db.user_permissions
dev_info_coll = mongo.db.device_info
dev_coll = mongo.db.devices
dev_grp_coll = mongo.db.device_groups
tag_dict_coll = mongo.db.tag_dictionary
pred_coll = mongo.db.predictions
file_info =  mongo.db.files_info
# Status codes
STATUS_CODE_OK = 200
STATUS_CODE_OK_CREATED = 201
STATUS_CODE_BAD_REQUEST = 400
STATUS_CODE_NOT_FOUND = 404





def stft(sig, frameSize, overlapFac=0.5, window=np.hanning):
    win = window(frameSize)
    hopSize = int(frameSize - np.floor(overlapFac * frameSize))
    samples = np.append(np.zeros(int(np.floor(frameSize/2.0))), sig)
    cols = np.ceil( (len(samples) - frameSize) / float(hopSize)) + 1
    samples = np.append(samples, np.zeros(frameSize))
    frames = stride_tricks.as_strided(samples, shape=(int(cols), frameSize), strides=(samples.strides[0]*hopSize, samples.strides[0])).copy()
    frames *= win
    return np.fft.rfft(frames)

def logscale_spec(spec, sr=44100, factor=20.):
    timebins, freqbins = np.shape(spec)
    scale = np.linspace(0, 1, freqbins) ** factor
    scale *= (freqbins-1)/max(scale)
    scale = np.unique(np.round(scale))
    newspec = np.complex128(np.zeros([timebins, len(scale)]))
    for i in range(0, len(scale)):
        if i == len(scale)-1:
            newspec[:,i] = np.sum(spec[:,int(scale[i]):], axis=1)
        else:
            newspec[:,i] = np.sum(spec[:,int(scale[i]):int(scale[i+1])], axis=1)
    allfreqs = np.abs(np.fft.fftfreq(freqbins*2, 1./sr)[:freqbins+1])
    freqs = []
    for i in range(0, len(scale)):
        if i == len(scale)-1:
            freqs += [np.mean(allfreqs[int(scale[i]):])]
        else:
            freqs += [np.mean(allfreqs[int(scale[i]):int(scale[i+1])])]
    return newspec, freqs


def plotstft(audiopath, binsize=2**10, plotpath=None, colormap="hot"):
    samplerate, samples = wav.read(audiopath)
    s = stft(samples, binsize)
    sshow, freq = logscale_spec(s, factor=1.0, sr=samplerate)
    ims = 20.*np.log10(np.abs(sshow)/10e-6) # amplitude to decibel
    timebins, freqbins = np.shape(ims)
    plt.figure(figsize=(12, 2))
    plt.imshow(np.transpose(ims), origin="lower", aspect="auto", cmap='inferno', interpolation="none")
    xlocs = np.float32(np.linspace(0, timebins-1, 5))
    ylocs = np.int16(np.round(np.linspace(0, freqbins-1, 10)))
    plt.xticks([])
    plt.yticks([])
    plt.gca().set_axis_off()
    plt.box(False)
    plt.margins(0,0)
    plt.gca().set_axis_off()
    plt.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0,
                hspace = 0, wspace = 0)
    plt.margins(0,0)
    plt.gca().xaxis.set_major_locator(plt.NullLocator())
    plt.gca().yaxis.set_major_locator(plt.NullLocator())
    if plotpath:
        img_data = io.BytesIO()
        plt.savefig(img_data, format='jpg')
        img_data.seek(0)
        c= boto3.client('s3')
        file_dest = "spectrogram_images/"+plotpath+".jpg"
        c.put_object(Body=  img_data, Bucket= "wildly-public", Key= file_dest, ContentType= 'image/jpeg', ACL='public-read')
        print ('image stored in s3')

    plt.clf()
    return ims

@api.route(f'{api_version}/add_meta/scrape', methods=['POST'])
def add_scrape_metadata():
    '''Inserts metadata from a scrape script into database'''
    common = add_common_metadata()
    try:
        common['source_type'] = "scrape"
        common['recordist'] = request.json['recordist']
        common['names'] = {
            'common_name': request.json['common_name'],
            'scientific_name': request.json['scientific_name']}
        coll = mongo.db.metadata
        id = coll.insert_one(common)
        resp = jsonify({"message": "Added Scrape Metadata",
                        "id": f"{id.inserted_id}"})
        resp.status_code = STATUS_CODE_OK
        return resp
    except Exception as ex:
        print(ex)
        err = jsonify({"message": "Error adding scrape metadata"})
        return err


@api.route(f'{api_version}/add_meta/device', methods=['POST'])
def add_device_metadata():
    '''Inserts metadata uploaded from a device into database'''
    common = add_common_metadata()
    try:
        common['source_type'] = "device"
        common['source_info'] = {
            'device_name': request.json['device_name'],
            'device_id': request.json['device_id']}
        coll = mongo.db.metadata
        id = coll.insert_one(common)
        resp = jsonify({"message": "Added Device Metadata",
                        "id": f"{id.inserted_id}"})
        resp.status_code = STATUS_CODE_OK
        return resp
    except Exception as ex:
        print(ex)
        err = jsonify({"message": "Error adding device metadata"})
        return err


@api.route(f'{api_version}/add_meta/user', methods=['POST'])
def add_user_metadata():
    '''Inserts metadata uploaded by a user into database'''
    common = add_common_metadata()
    try:
        common['source_type'] = "user"
        common['source_info'] = {
            'user_name': request.json['user_name'],
            'user_id': request.json['user_id']}
        coll = mongo.db.metadata
        id = coll.insert_one(common)
        resp = jsonify({"message": "Added User Metadata",
                        "id": f"{id.inserted_id}"})
        resp.status_code = STATUS_CODE_OK
        return resp
    except Exception as ex:
        print(ex)
        err = jsonify({"message": "Error adding user metadata"})
        return err


@api.route(f'{api_version}/edit_metadata', methods=['POST'])
def edit_metadata():
    '''Inserts metadata uploaded by a user into database'''
    try:
        r  = request.get_json()
        coll = mongo.db.file_info
        print(r)

                file_info.update_one({'_id':r['file_id']}, {"$set":{'metadata':r}})
        resp = jsonify({"message": "Updated  Metadata"})
        resp.status_code = STATUS_CODE_OK
        return resp
    except Exception as ex:
        print(ex)
        err = jsonify({"message": "Error in editing  metadata"})
        return err


@api.route(f'{api_version}/get_meta', methods=['POST'])
def get_meta():
    '''Find a document in metadata collection'''
    try:
        meta = request.get_json()
        meta_resp = meta_coll.find_one_or_404({'_id': meta["_id"]})
        return jsonify(meta_resp), STATUS_CODE_OK

    except Exception as ex:
        print(ex)
        err = jsonify({"response": "Could not find metadata in database",
                       "message": f"{ex}"})
        return err, STATUS_CODE_NOT_FOUND



@api.route(f'{api_version}/get_file', methods=['POST'])
def get_file():
    try:
        r  = request.get_json()
        if 'username' in r:
            if( r["type"]=="work_files"):
                a_resp = anno_coll.distinct( "file_hash", {"added_by" : r['username']})
                if(r['skip'] > (len(a_resp) -1)):
                    return jsonify({'msg':"there are no  more files"}), STATUS_CODE_OK
                f_resp = file_info.find({ '_id':a_resp[r['skip']]  } ).limit(1)

            elif ( r["type"]=="my_files"):
                f_resp = file_info.find({"updated_by" : r['username']}).sort("updated_at", -1).skip( r['skip'] ).limit(1)
        else:
            f_resp = file_info.aggregate([{ '$sample': { 'size': 1 } }])
        if(f_resp):
            c = 0
            for f in f_resp:
                c+=1
                annotations = anno_coll.find({'file_hash':f['_id']})
                all_a =[]
                for a in annotations:
                    all_a.append(a)
                f['annotations'] = all_a
                return jsonify(f), STATUS_CODE_OK
            if(c ==0):
                return jsonify({'msg':"there are no  more files"}), STATUS_CODE_OK
        else:
            return jsonify({'msg':"there are no file"}), STATUS_CODE_OK
    except Exception as ex:
        print(ex)
        err = jsonify({"response": "Could not find any file  in database",
                       "message": f"{ex}"})
        return err, STATUS_CODE_NOT_FOUND




@api.route(f'{api_version}/upload_file', methods=['POST'])
def upload_file():
    try:
        f = request.files['file']
        h = request.headers
        mt = request.mimetype
        client = boto3.client('s3')
        d = dict(request.values)
        _id = hashlib.md5(f.filename.encode('UTF-8') +d['file_size'].encode('UTF-8')).hexdigest()
        file_ext = f.filename.rsplit('.', 1)[-1]
        file_dest = "audio_files/"+_id+"."+file_ext
        if(file_ext =='wav'):
            fname = secure_filename(f.filename)
            print (fname)
            f.save(os.path.join('folder_path', 'temp.wav'))
            ims = plotstft('wave_file_path', plotpath = _id )
        client = boto3.client('s3')
        f.seek(0)
        client.put_object(Body=  f, Bucket= "wildly-public", Key= file_dest, ContentType= mt, ACL='public-read')
        f_info ={ 'file_name': f.filename, 'size':h['content-length'], 'wildly_name': _id, 'type':file_ext}
        file_data ={}
        metadata ={}
        location ={}
        external_source_link = added_by=''
        for i in  request.values:
            if(i =="external_link"):
                metadata[i]  =  request.values[i]
            elif(i =="added_by"):
                file_data['updated_by'] = request.values[i]
                metadata[i] = request.values[i]
            elif(i =="added_at"):
                file_data['updated_at'] = datetime.now().isoformat()
                metadata[i] = request.values[i]
            else:
                location[i] = request.values[i]

        f_info['name'] = f.name

        metadata['location'] = location
        file_data['metadata'] = metadata
        file_data['file_info'] = f_info
        file_data["file_source"] =  "https://wildly-public.s3.ap-south-1.amazonaws.com/audio_files/"+ _id + '.'+file_ext
        file_info.update({'_id':_id}, {"$set":file_data}, upsert=True)
        if(f):
            return jsonify({'msg':"file received"}), STATUS_CODE_OK
        else:
            return jsonify({'msg':"file not uploaded"}), STATUS_CODE_OK
    except Exception as ex:
        print(ex)
        err = jsonify({"response": "Problem in processing the form",
                       "message": f"{ex}"})
        return err, STATUS_CODE_NOT_FOUND




@api.route(f'{api_version}/add_annotation', methods=['POST'])
def add_annotations():
    '''Inserts an array annotations into database'''
    try:
        file_id = request.json['file_id']
        anno_str = file_id + str(datetime.utcnow())
        annotations_id = hashlib.md5(anno_str.encode('UTF-8')).hexdigest()
        annotations = {
            '_id': annotations_id,
            'file_id': file_id,
            'all_tags': request.json['all_tags']
        }
        coll = mongo.db.annotations
        annotations_insert = coll.insert_one(annotations)
        resp = jsonify({"message": "Added Annotations",
                        "tag_id": f"{annotations_insert.inserted_id}"})
        resp.status_code = STATUS_CODE_OK
        return resp
    except Exception as ex:
        print(ex)
        err = jsonify({"message": "Error adding annotations"})
        return err

@api.route(f'{api_version}/add_user_annotations', methods=['POST'])
def add_user_annotations():
    try:
        r  = request.get_json()
        coll = mongo.db.annotations
        coll.remove({ 'file_hash': r['file_id'] } )
        all_a =[]
        for a in r['annotations']:
            a['_id'] =  hashlib.md5( ( str(a['x']) + str(a['y'])+ str(a['width']) + str(a['height'])  ).encode('UTF-8')  ).hexdigest()
            a['file_hash'] = r['file_id']
            if 'updated_at' not in  a:
                a['updated_at'] = datetime.now().isoformat()
                all_a.append(a)
        coll.insert_many(all_a)
        return jsonify({'msg':"annotations are added"}), STATUS_CODE_OK
    except Exception as ex:
        print(ex)
        err = jsonify({"response": "Could not find any file  in database",
                       "message": f"{ex}"})
        return err, STATUS_CODE_NOT_FOUND


@api.route(f'{api_version}/update_annotations/<annotations_id>/<tag_id>',
           methods=['PUT'])
def update_annotations(annotations_id, tag_id):
    '''Updates annotations documents in database'''
    try:
        annotations = {
            '$set': {'file_id': request.json['file_id']},
            '$addToSet': {'all_tags': tag_id}
        }
        coll = mongo.db.annotations
        annotations_update = coll.update_one(
            {'_id': annotations_id}, annotations)
        resp = jsonify({"message": "Updated Annotations",
                        "id": f"{annotations_update.upserted_id}"})
        resp.status_code = STATUS_CODE_OK
        return resp
    except Exception as ex:
        print(ex)
        err = jsonify({"message": "Error updating annotations"})
        return err


@api.route(f'{api_version}/get_annotations', methods=['POST'])
def get_annotations():
    '''Find a document in annotations collection'''
    try:
        anno = request.get_json()
        anno_resp = anno_coll.find_one_or_404({'_id': anno["_id"]})
        return jsonify(anno_resp), STATUS_CODE_OK

    except Exception as ex:
        print(ex)
        err = jsonify({"response": "Could not find annotation in database",
                       "message": f"{ex}"})
        return err, STATUS_CODE_NOT_FOUND





#################
# Main Function #
#################

if __name__ == "__main__":
    api.run(debug=True, host='0.0.0.0', port=5000)  # CHANGE
