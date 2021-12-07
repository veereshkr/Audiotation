import React, {useRef, useEffect, useState} from 'react'
import {Container} from 'reactstrap'
import Header from '../../components/Header/'
import {  Row, Col, Card, CardTitle, Input, Button} from 'reactstrap'
// Icons
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import {setCurrentUser} from '../../actions/authActions'
import {getNewFile} from '../../actions/authActions'
import {addAnnotations} from '../../actions/authActions'
import {uploadNewFile} from '../../actions/authActions'
import {editMetadata} from '../../actions/authActions'
//import track from '../../components/Audio/birds.mp3';
import {Helmet} from "react-helmet";
import PlayButton from '../../components/PlayButton';
import Audio from '../../components/Audio';
import Volume from '../../components/Volume';
import Seeker from '../../components/Seeker';
import Metadata from './Metadata'
import UploadFile from './UploadFile'


//import { subscribeUser } from '../../subscription';



//import { locations }  from '../../actions/authActions';
var d;
var total_time;
var indicator = 0

var prev= 0
var nv =0
var elapsed =0
var pending =100
var div_width =10
var total_marker_values =  5
const AudioPlayer = (url) => {
    const track  =  url.url


  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  var [isPlaying, setIsPlaying] = useState(false);

  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  let timesRun =0;

  const handleTrackClick = (position) => {

    audioRef.current.currentTime = position;

  };



  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();

    } else {

      audioRef.current.pause();
    }



}, [audioRef, isPlaying]);



  useEffect(() => {
    audioRef.current.volume = volume;
  }, [audioRef, volume]);
  var diff = 0;
  useEffect(a => {


        if((currentTime  > prev )  ){

      const interval = setInterval(() => {

        timesRun +=1
        if(timesRun ===1){
            diff = (currentTime-prev) /50
        }
        //console.log(prev, timesRun,  currentTime,  diff,   '------')

        nv = prev+diff
        if(prev <nv){
            setSeconds(seconds => ((prev)));
            prev =  nv

             div_width = 100 /total_time
             elapsed  = (prev * div_width )


        }else{
            setSeconds(seconds => ((currentTime)));
            prev = currentTime

             div_width = 100 /total_time
             elapsed  = (currentTime * div_width )




        }
        if((elapsed > 0)){

            if(elapsed >=99.99) {

                elapsed =  100
                pending =  (0).toString()+ "%"
                elapsed =  elapsed.toString() + "%"
                setIsPlaying(false)

            }else{
                 elapsed = elapsed + ((100 -elapsed)/100)
                 pending =  (100 -elapsed).toString()+ "%"
                 elapsed =  elapsed.toString() + "%"
            }

        }


         if(timesRun === 50){
             clearInterval(interval);

         }


    }, 2);
    }else{

        prev = currentTime
        if(total_time)
         div_width = 100 /total_time
         elapsed  = (currentTime * div_width )
         if((elapsed > 0)){

             if(elapsed >=99.99) {
                 elapsed =  100
                 pending =  (0).toString()+ "%"
                 elapsed =  elapsed.toString() + "%"
                 setIsPlaying(false)
             }else{
                  elapsed = elapsed + ((100 -elapsed)/100)
                  pending =  (100 -elapsed).toString()+ "%"
                  elapsed =  elapsed.toString() + "%"
             }

         }
         setSeconds(seconds => currentTime);
    }

}, [currentTime])

  if(duration){
      total_time = duration

  }


  var marker_width =((100)/ (total_marker_values*2) ).toFixed(1)+"%"

  var number_width = ( total_time /total_marker_values).toFixed(1)



 var p = isPlaying
 if(duration === currentTime){

     p = false

 }


  return (
    <div className="AudioApp"  style={{width:"100%", padding:"0px"}}>
    <div style={{width:"100%", height:"200px", marginTop:"-200px"}}>
      <div  style={{ width:elapsed ,minHeight:"200px", background:"rgba(0,0,0, 0.3)", transition: "all 0.0s ease"}} > </div>  <div style={{ width:pending,  minHeight:"200px"}} >   </div>
      </div>
      <hr  style={{marginTop:"5px"}}/>
      <div style={{width:"100%", textAlign:"right", marginTop:"-30px", color:"#777777", fontSize:"1.0rem"}}>
      <div style={{width:marker_width, float:"left"}}> | </div>
       <div style={{width:marker_width, float:"left", marginTop:"10px"}}> {number_width} </div>
        <div style={{width:marker_width, float:"left"}}> | </div>
         <div style={{width:marker_width, float:"left", marginTop:"10px"}}> { (2* number_width).toFixed(1)} </div>
          <div style={{width:marker_width, float:"left"}}> | </div>
      <div style={{width:marker_width, float:"left", marginTop:"10px"}}> {(3*number_width).toFixed(1)} </div>
      <div style={{width:marker_width, float:"left"}}> | </div>
      <div style={{width:marker_width, float:"left", marginTop:"10px"}}> {(4*number_width).toFixed(1)} </div>
      <div style={{width:marker_width, float:"left"}}> | </div>
        </div>

      <Seeker  key={track+'seeker'} style={{width:"100%", transition: "width 0,2s ease", transition: "all ease-in-out",}}
        currentTime={seconds}
        duration={duration}
        handleTrackClick={handleTrackClick}
      />
      <Audio  key={track+'audio'}
        track={track}
        ref={audioRef}
        handleDuration={setDuration}
        handleCurrentTime={setCurrentTime}
      />
      {duration? (
          <PlayButton  key={track+'play'} isPlaying={p} setIsPlaying={setIsPlaying} />
      ) :(null)}

      {/*}<Volume volume={volume} setVolume={setVolume} /> */}
    </div>
  );



}

class Home extends React.Component {
  constructor(p) {
    super(p);

    //subscribeUser(this.props.auth.auth.user.username)
    this.state= {big_screen:true,loc_data:'', loc_ids:[], annotations:[], setAnnotations:[], newAnnotation:[], setNewAnnotation:[], metadata_form:false, metadata:false, metdata_added:false, uploadFile:false, file_info:{}, skip:0, no_more_files:false, annotations_added:false, decibel_arr:[]}



    //ReactGA.pageview('home');
    //console.log(this.props.auth.auth)
    if ((!this.props.auth.auth.isAuthenticated) || (this.props.auth.auth.locations.length===0)) {
      this.props.history.push('/login')

    }


    var data ={'data':d}

    if(this.props.auth.auth.isAuthenticated){


  }
}
  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    var data ={'username':this.props.auth.auth.user.username, skip:0,  type:"my_files"}
    var file_id =null
    getNewFile(data).then(function(resp){

        if(resp['_id']){

            file_id = resp['_id']
            var metadata ={} , annotations =[]

            if(resp['metadata']){
                metadata['location_name'] = resp['metadata']['location']['location']
                metadata['country'] = resp['metadata']['location']['country']
                metadata['external_link'] = resp['metadata']['external_link']
                metadata['elevation'] = resp['metadata']['location']['elevation']
                metadata['district'] = resp['metadata']['location']['district']
                metadata['city'] = resp['metadata']['location']['city']
                metadata['state'] = resp['metadata']['location']['state']
                if(!resp['metadata']['location']['gps']['latitude']){
                    var sp = resp['metadata']['location']['gps'].split(',')
                    metadata['gps'] = sp[0]+',' +sp[1]
                    resp['metadata']['location']['gps'] = metadata['gps']

                }else{
                    metadata['gps'] = resp['metadata']['location']['gps']['latitude']+',' +resp['metadata']['location']['gps']['longitude']
                    resp['metadata']['location']['gps'] = metadata['gps']
                }
                metadata['added_at'] = resp['metadata']['added_at']

            }
            if(resp['annotations']){
                annotations = resp['annotations']
            }

            this.setState({file_info:resp, metadata:metadata, annotations:annotations})
        }

    }.bind(this))



  }

  componentWillMount() {


  }
  resize() {
      this.setState({big_screen: window.innerWidth > 760});
  }


  AudioP() {
      //var url ="https://audiotation-public.s3.ap-south-1.amazonaws.com/audio_files/854e446451a0e9a0e5b5f9fab70e430c.wav"
      var url
      if(this.state.file_info.file_source){
          url = this.state.file_info.file_source
          return (
              <div style={{margin:"0 auto", padding:"0px", maxWidth:"1300px", minWidth:"1300px", width:"100%"}}>
              <div style={{width:"50px",  float:"left", minHeight:"100px"}}>

              </div>

            <div style={{margin:"0 auto", padding:"0px", maxWidth:"1200px", minWidth:"1200px", float:"left"}}>


              <AudioPlayer   key ={this.state.file_info.file_source}  url ={this.state.file_info.file_source}
              style={{ background: "#bbffff" , padding:"0px "}} />
            </div>
            <div style={{width:"50px",  float:"left",  minHeight:"100px"}}>

            </div>
            </div>
          );
      }else{
          return(<div style={{width:"100%", minHeight:"50px",  fontSize:"1.3rem" , paddingLeft:"50px", marginTop:"50px",  color:"#999999"}}> Loading... </div>)
      }

   }

  sS(v) {

    localStorage.setItem('selectedLocation', v)

    if(localStorage.languages !== 'undefined'){

      setCurrentUser(jwtDecode(localStorage.jwtToken), JSON.parse(localStorage.locationInfo), v, null,JSON.parse(localStorage.languages))

    }else{
      setCurrentUser(jwtDecode(localStorage.jwtToken), JSON.parse(localStorage.locationInfo), v, null,[])

    }
  }

  handleChange( value, event) {
      var annotations = this.state.annotations
      annotations[value.key - 1 ]['species'] =   event.target.value
      annotations[value.key - 1 ]['added_by'] =  this.props.auth.auth.user.username
      this.setState({annotations:annotations, annotations_added:false})

  }
  delAnnotations( value, event) {
      var annotations = this.state.annotations

      annotations.splice((value.key - 1), 1);
      for(var i=0; i<annotations.length; i++){
          annotations[i]['key'] = i+1
      }

     this.setState({annotations:annotations, annotations_added:false})

  }
  submit_annotations() {
      var data ={annotations: this.state.annotations,  file_id: this.state.file_info._id,  last_annotation_modified_by: this.props.auth.auth.user.username}

      addAnnotations(data).then(function(resp){

         this.setState({annotations_added:true})

      }.bind(this))

  }
  metadata_form() {


      this.setState({metadata_form:true, uploadFile:false})

  }
  upload_form() {


      this.setState({uploadFile:true, metadata_form:false})

  }
  close_metadata_form() {


      this.setState({metadata_form:false})

  }
  close_upload_form() {


      this.setState({uploadFile:false})

  }

  metadata( values){

      var metadata = {}
      metadata['external_link'] = values['external_link']
      delete values.external_link;
      metadata['location'] = {location:values['location_name'], district:values['district'], city:values['city'],state:values['state'], country:values['country'], elevation:values['elevation'], gps:values['gps'] }
      metadata['added_by'] = this.props.auth.auth.user.username
      metadata['added_at'] = new Date().toISOString()
      metadata['file_id'] =  this.state.file_info._id

      editMetadata(metadata).then(function(resp){
          if(resp){

               var file_info = this.state.file_info
               file_info['metadata'] =  metadata
               this.setState({metadata: metadata, file_info:file_info,  metdata_added:true})

          }
      }.bind(this))


  }
  next(){
      var skip = this.state.skip
      skip++
      var data ={'username':this.props.auth.auth.user.username, skip:skip,  type:"my_files"}
      getNewFile(data).then(function(resp){
          if(resp['_id']){
              var metadata ={}, annotations=[]
              if(resp['metadata']){
                  metadata['location_name'] = resp['metadata']['location']['location']
                  metadata['country'] = resp['metadata']['location']['country']
                  metadata['external_link'] = resp['metadata']['external_link']
                  metadata['elevation'] = resp['metadata']['location']['elevation']
                  metadata['district'] = resp['metadata']['location']['district']
                  metadata['city'] = resp['metadata']['location']['city']
                  metadata['state'] = resp['metadata']['location']['state']
                  if(!resp['metadata']['location']['gps']['latitude']){
                      var sp = resp['metadata']['location']['gps'].split(',')
                      metadata['gps'] = sp[0]+',' +sp[1]
                      resp['metadata']['location']['gps'] = metadata['gps']

                  }else{
                      metadata['gps'] = resp['metadata']['location']['gps']['latitude']+',' +resp['metadata']['location']['gps']['longitude']
                      resp['metadata']['location']['gps'] = metadata['gps']
                  }
                  metadata['added_at'] = resp['metadata']['added_at']
                  metadata['added_by'] = resp['metadata']['added_by']


              }
              if(resp['annotations']){
                  annotations = resp['annotations']
              }
              this.setState({file_info:resp, metadata:metadata, skip:skip, annotations:annotations})

          }else{
              this.setState({no_more_files:true})
          }

      }.bind(this))

  }

  uploadFile( values){
     values['username'] = this.props.auth.auth.user.username
      values['uploaded_at_user_time'] = new Date().toISOString()

      uploadNewFile(values).then(function(resp){


          this.props.history.push('/myfiles/')

      }.bind(this))


  }


   DisplayMetadata(){
       return(

           <Row  style={{background:"#ffffff", borderRadius:"10px", border:"1px solid #bbbbbb", fontSize:"1.3rem" , padding:"50px"}}>

           {this.state.metdata_added?( <Col xs="12" sm="12" lg="12"  style={{padding:"0 50px", background: "#fffbfb", width:"100%"}}> Thank you for adding metadata </Col>):(null)}
           <Col xs="6" sm="6" lg="6"  > <span style={{color:"#999999"}}>Source : </span> <a href={this.state.file_info.metadata.external_link}>{this.state.metadata.external_link} </a></Col>
           <Col xs="6" sm="6" lg="6"  >  <span style={{color:"#999999"}}>Location Name :  </span>{this.state.file_info.metadata.location.location} </Col>
             <Col xs="6" sm="6" lg="6"  >  <span style={{color:"#999999"}}>City : </span> {this.state.file_info.metadata.location.city} </Col>
           <Col xs="6" sm="6" lg="6"  >  <span style={{color:"#999999"}}>District : </span> {this.state.file_info.metadata.location.district} </Col>
            <Col xs="6" sm="6" lg="6"  >  <span style={{color:"#999999"}}>State : </span> {this.state.file_info.metadata.location.state} </Col>

           <Col xs="6" sm="6" lg="6"  >  <span style={{color:"#999999"}}>Country :  </span>{this.state.file_info.metadata.location.country} </Col>
             <Col xs="6" sm="6" lg="6"  > <span style={{color:"#999999"}}>Elevation : </span> {this.state.file_info.metadata.location.elevation} </Col>
           <Col xs="6" sm="6" lg="6"  >   <span style={{color:"#999999"}}>GPS:  </span>{this.state.file_info.metadata.location.gps} </Col>
           <Col xs="6" sm="6" lg="6"  >   <span style={{color:"#999999"}}>Added By : </span> {this.state.file_info.metadata.added_by} </Col>
           <Col xs="6" sm="6" lg="6"  >   <span style={{color:"#999999"}}>Added At:  </span> {this.state.file_info.metadata.added_at} </Col>
           </Row>

       )
   }
   DrawAnnotations(){
  const annotations = this.state.annotations

  const newAnnotation = this.state.newAnnotation



  const handleMouseDown = (event) => {

    if (newAnnotation.length === 0) {

      var { x, y } = event.target.getStage().getPointerPosition();

       this.setState({ newAnnotation:[{ x, y, width: 0, height: 0, key: "0" }]});

    }
  };

  const handleMouseUp = (event) => {
      var annotations = this.state.annotations

    if (this.state.newAnnotation.length === 1) {


      const sx = this.state.newAnnotation[0].x;
      const sy = this.state.newAnnotation[0].y;

      const { x, y } = event.target.getStage().getPointerPosition();
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        key: annotations.length + 1
      };
      if(annotationToAdd.width <0){
          annotationToAdd['x'] = x
           annotationToAdd['width'] = sx-x
      }
      if(annotationToAdd.height <0){
          annotationToAdd['y'] = y
           annotationToAdd['height'] = sy-y
      }
      var start_time  = ((annotationToAdd['x'] *total_time)/1200).toFixed(2)
      annotationToAdd['start_time'] = start_time
      var end_time  = (((annotationToAdd['x'] + annotationToAdd['width'] ) *total_time)/1200).toFixed(2)
      annotationToAdd['end_time'] = end_time
      annotationToAdd['total_track_time'] = total_time

      if((annotationToAdd.width >0) &&( annotationToAdd.height>0)){
        annotations.push(annotationToAdd);
     }

     this.setState({newAnnotation:[]})
        //console.log('--- ----', annotations , newAnnotation)


      this.setState({annotations:annotations})


  }else{

      this.setState({ newAnnotation:[]})
  }
  };

  const handleMouseMove = (event) => {
    if (this.state.newAnnotation.length === 1) {

      const sx = this.state.newAnnotation[0].x;
      const sy = this.state.newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      this.setState({ newAnnotation:[
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: "0"
        }
      ]});
    }
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];
  const cell_style = {margin:0 , border:"1px solid #ccc" , padding:"10px 0", minHeight:"40px"}
  if (true) {

            var u = "https://audiotation-public.s3.ap-south-1.amazonaws.com/spectrogram_images/" +this.state.file_info._id +".jpg"




  return (
    <div  style={{margin: "10px 20px", background: "#fbf5ff",  padding: "20px",  border: "1px solid #cdaee0", borderRadius: "10px"}}>
    <div style={{width:"1300px", margin:"0 auto", padding:"0px"}}>
    <div style={{width:"50px", height:"200px", float:"left", background:"#fdd", margin:"0px"}}>
    <img src="/img/frequency.jpg" />
    </div>
    <Stage
      style={{
          maxWidth:"1200px",
          margin:"0 auto",
          width:"100%",
          minWidth:"1200px",
          backgroundColor:"#ff0000",
          float:"left",
        background:
          "#210230 url(" +
          `${u}` +
          ")"
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width={1200 }
      height={200}
    >
      <Layer>
        {annotationsToDraw.map((value) => {

          return (
              <Group key ={value.x}>
            <Rect

              x={value.x}
              y={value.y}
              width={value.width}
              height={value.height}
              fill="rgba(255,255,0,0.1)"
              stroke="rgba(255,255,255,0.8)"
            />
            {value.species ? (
                <Text

                  x={value.x + 5}
                  y={value.y + 5}
                  text = {value.species}
                  fontSize= "15"
                  fill="rgba(255,255,255,1)"

                />
            ):(null)}

            </Group>
          );
        })}
      </Layer>
      <Layer>



      </Layer>


    </Stage>
    <div style={{width:"50px", height:"200px", float:"left", background:"#fdd", margin:"0"}}>
    <img src="/img/colormap.jpg" />
    </div>
    </div>

    <div className='indent hRowM' style={{marginLeft:'-5px' , width:"100%", margin:"0px", padding:"0px"}}>


     {this.AudioP()}

    </div>
    <div style={{width:"100%", padding:"20px 40px 20px 60px" }}>
    <Row  style={{fontSize:"1.4rem" ,  color:"rgb(93 93 93)", padding:"20px 0 0 10px", width:"100%"}} >
    <Col xs="6" sm="6" lg="6">
        Annotations
    </Col>
    <Col xs="6" sm="6" lg="6">
        {this.state.annotations_added ?(<span> Thank you for adding annotations</span>):(null)}
    </Col>
    </Row>
    <Row style={{width:"100%", background:"rgb(243 243 243)", textAlign:"center" , fontSize:"1.1rem", color:"#3d099c"}} >


    <Col xs="1" sm="1" lg="1" style={cell_style}>
       Sl No.
    </Col>
         <Col xs="1" sm="1" lg="1" style={cell_style}>
            Start Time(s)
         </Col>
         <Col xs="1" sm="1" lg="1" style={cell_style}>
            End  Time(s)
         </Col>

         <Col xs="2" sm="2" lg="2" style={cell_style}>
            Low Freq (HZ)
         </Col>
         <Col xs="2" sm="2" lg="2" style={cell_style}>
            High Freq (HZ)
         </Col>
         <Col xs="1" sm="1" lg="1" style={cell_style}>
            Decibel
         </Col>
         <Col xs="3" sm="3" lg="3" style={cell_style}>
            Species Name
         </Col>

         <Col xs="1" sm="1" lg="1" style={cell_style}>
            Del
         </Col>



    </Row>

    {(this.state.annotations.length === 0)?(<Row style={{width:"100%", background:"#ffffff", textAlign:"center" , fontSize:"1.1rem"}} >


    <Col xs="1" sm="1" lg="1" style={cell_style}>

    </Col>
         <Col xs="1" sm="1" lg="1" style={cell_style}>

         </Col>
         <Col xs="1" sm="1" lg="1" style={cell_style}>

         </Col>

         <Col xs="2" sm="2" lg="2" style={cell_style}>

         </Col>
         <Col xs="2" sm="2" lg="2" style={cell_style}>

         </Col>
         <Col xs="1" sm="1" lg="1" style={cell_style}>

         </Col>
         <Col xs="3" sm="3" lg="3" style={cell_style}>

         </Col>
         <Col xs="1" sm="1" lg="1" style={cell_style}>

         </Col>



    </Row>) :(null)}

    {annotationsToDraw.map((value) => {

        var time_pixel = 1200 / total_time

        var x1 = (value.x/time_pixel)
        var x2 =  ((value.x + value.width)/ time_pixel)
        if(x1 > x2){

            var tmp = x2
            x2 =x1
            x1=tmp

        }
        var f_max = 22000, f_min = 1
        var f_s = ((Math.log(f_max) -  Math.log(f_min))/200)
        var y1 = Math.exp(((200 - value.y) * f_s) +   Math.log(f_min) ).toFixed(3)
        var y2 =  Math.exp(((200 - (value.y + value.height) ) *  f_s)+   Math.log(f_min) ).toFixed(3)

        var small = y2
        var large = y1
        if(parseInt(y2)> parseInt(y1)){

            small = y1
            large = y2

        }else if(parseInt(y2)<parseInt(y1)){

            small = y2
            large = y1
        }
        if(!total_time){

            x1 = this.state.annotations[value.key -1]['start_time']
            x2 = this.state.annotations[value.key -1]['end_time']

        }else{
            x1 = x1.toFixed(2)
            x2 = x2.toFixed(2)
        }


      return(
         <Row key ={value.key +value.x} style={{width:"100%", background:"#ffffff", textAlign:"center" , fontSize:"1.2rem"}} >
          <Col xs="1" sm="1" lg="1" style={{margin:0 , border:"1px solid #ccc" , padding:"10px 0"}}>
            {value.key }
          </Col>
               <Col xs="1" sm="1" lg="1" style={cell_style}>
                  {x1 }
               </Col>
               <Col xs="1" sm="1" lg="1"style={cell_style}>
                 {x2 }
               </Col>

               <Col xs="2" sm="2" lg="2" style={cell_style}>
                  {small}
               </Col>
               <Col xs="2" sm="2" lg="2" style={cell_style}>
                 {large}
               </Col>
               <Col xs="1" sm="1" lg="1" style={cell_style}>

                    {value.decibel}
                </Col>

               <Col xs="3" sm="3" lg="3" style={{margin:0 , border:"1px solid #ccc" , padding:"10px 10px", minHeight:"40px"}}>
                  <Input  type="text" name="species" id="SpeciesName"  value={value.species}  onChange={this.handleChange.bind(this, value)} style={{padding:"2px 5px" }} />
               </Col>

                <Col xs="1" sm="1" lg="1" style={cell_style}   onClick={this.delAnnotations.bind(this, value)}   >
                <span style={{cursor:"pointer", color:"#3d099c"}}    > X </span>

                </Col>




          </Row>)
    })}
    </div>
    {(this.state.annotations.length >0)  ?(<div style={{textAlign:"right", width:"100%", paddingRight:"80px", fontSize:"1.6rem"}}>
    <Button   outline style={{borderRadius:"10px", border:"1px solid rgb(52, 0, 146)", borderRadius:"20px", background:"#ffffff"}}
     onClick={this.submit_annotations.bind(this)}>
     <span style={{color:"rgb(52, 0, 146)", padding:"0 10px" }}> Submit
     </span> </Button> </div>):(null)}
    </div>
);}
else{
    return(null)
}
};


  tH(v) {
    this.props.auth.auth.selected = v
    //console.log(this.props.auth.auth.selected);
    this.sS(v)


        this.props.history.push('/' + this.props.auth.auth.locations[v].name.replace(/[^a-zA-Z0-9]/g, '') + '/orders/')


  }




  render() {

    if (this.props.auth.auth.user.username) {
      return (
        <div ref="myRef">
          <Helmet>
            <title> Audiotation | My Files </title>
          </Helmet>
          <Header/>
          <Container fluid style={{
            padding: "80px 10px 80px 0px",
            background:"rgb(214 228 226)"
          }}>
            <div className="animated fadeIn">
            <Row  style={{padding:"20px 0px 30px 0px"}}>
              <Col xs="6" sm="6" lg="6" className='hRC' style={{fontSize:"1.2rem" , paddingLeft:"70px" , color:"#555555" , textAlign:"left" }}>
                <span style={{padding:"0 10px 0 0"}}>
                <Button    onClick = {this.upload_form.bind(this)} color="#ff0000"  size ="sm"  outline   style={{ border:"1px solid rgb(52 0 146)" , borderStyle:"dotted",  paddingTop:"0px  !important", fontSize:"1.2rem !important", borderRadius:"20px"}}>  <span style={{fontSize:"1.2rem", color:"rgb(52 0 146)", padding:"0 20px"}}>  <i className="fa fa-upload " style={{paddingRight:"10px"}}></i> Upload </span>  </Button>

                </span><span style={{padding:"0 10px"}}>
                {/*}<Button   color="#ff0000"  size ="sm"  outline   style={{ border:"1px solid rgb(52 0 146)" , paddingTop:"0px  !important", fontSize:"1.2rem !important", borderRadius:"20px"}}>  <span style={{fontSize:"1.2rem", color:"rgb(52 0 146)", padding:"0 20px"}}>  <i className="fa fa-chevron-left " style={{paddingRight:"10px"}}></i>  Prev </span>  </Button> */}
                 <a href="/mywork"><Button    color="#ff0000"  size ="sm"  outline   style={{ border:"1px solid rgb(52 0 146)" , borderStyle:"dotted",  paddingTop:"0px  !important", fontSize:"1.2rem !important", borderRadius:"20px"}}>  <span style={{fontSize:"1.2rem", color:"rgb(52 0 146)", padding:"0 20px"}}>  <i className="fa fa-paw " style={{paddingRight:"10px"}}></i> My Work </span>  </Button> </a>


                </span>
              </Col>

              <Col xs="6" sm="6" lg="6"  style={{fontSize:"1.2rem" , paddingRight:"70px" , color:"#555555" , textAlign:"right"}}>
              <span style={{padding:"0 10px"}}>
              {/*  <Button   onClick = {this.metadata_form.bind(this)} color="#ff0000"  size ="sm"  outline   style={{ border:"1px solid rgb(52 0 146)" , borderStyle:"dotted",  paddingTop:"0px  !important", fontSize:"1.2rem !important", borderRadius:"20px"}}>  <span style={{fontSize:"1.2rem", color:"rgb(52 0 146)", padding:"0 20px"}}>  <i className="fa fa-plus-circle " style={{paddingRight:"10px"}}></i> Add Metadata </span>  </Button> */}
               <a href="/home"> <Button    color="#ff0000"  size ="sm"  outline   style={{ border:"1px solid rgb(52 0 146)" , borderStyle:"dotted",  paddingTop:"0px  !important", fontSize:"1.2rem !important", borderRadius:"20px"}}>  <span style={{fontSize:"1.2rem", color:"rgb(52 0 146)", padding:"0 20px"}}>  <i className="fa fa-files-o " style={{paddingRight:"10px"}}></i> Audiotation Files </span>  </Button> </a>

              </span>
              <span style={{padding:"0 0 0 10px"}}>
                <Button    onClick = {this.next.bind(this)} color="#ff0000" size ="sm"  outline  style={{ border:"1px solid rgb(52 0 146)" , paddingTop:"0px!important", fontSize:"1.2rem !important", borderRadius:"20px"}}> <span style={{fontSize:"1.2rem", color:"rgb(52 0 146)", padding:"0 20px"}} >  Next  <i className="fa fa-chevron-right" style={{paddingLeft:"10px"}}></i> </span> </Button>
                </span>
              </Col>

            </Row>

            {this.state.uploadFile ?(
                <Row style={{margin:"0 auto", padding:"20px"}}>
                    <Col xs="1" sm="1" lg="1" >
                    </Col>
                     <Col xs="10" sm="10" lg="10" >
                     <div style={{width:"100%", textAlign:"right", marginBottom:"-50px"}}>  <i  onClick = {this.close_upload_form.bind(this)} className="fa fa-close " style={{paddingRight:"20px" ,color:"rgb(52, 0, 146)", cursor:"pointer"}} />  </div>

                    <UploadFile   onSubmit={this.uploadFile.bind(this)} />

                    </Col>
                    <Col xs="1" sm="1" lg="1" >
                    </Col>
                 </Row>

            ):(null)}

              <Row >
                <Col xs="12" sm="12" lg="7" className='hRC' style={{fontSize:"1.3rem" , paddingLeft:"80px" , color:"rgb(93 93 93)" }}>
                  File Name: {this.state.file_info.file_info ?(<span> {this.state.file_info.file_info.file_name} </span>):(null)}


                </Col>
                <Col xs="12" sm="12" lg="5" style={{fontSize:"1.3rem" , paddingRight:"80px" , textAlign:"right" }} >
                 {this.state.no_more_files ?(<span style={{color:"rgb(206 1 57)", paddingRight:"20px"}}> No more files to be shown</span>):(<span style={{fontSize: "1.3rem",
    fontWeight: "500", color: "#888888"}}> Your Files </span>)}
                 {(window.innerWidth <1400) ?(<span style={{color:"rgb(206 1 57)", paddingRight:"20px"}}>  Please use bigger display screen</span>):( null) }
                 </Col>
              </Row>

              <Row className='indent hRowM' style={{marginLeft:'-5px',  paddingTop:"0px"}}>

              <Col xs="12" sm="12" lg="12">
               {this.DrawAnnotations()}
              </Col>

              {this.state.metadata_form ?(
                  <Row >
                    <Col xs="12" sm="12" lg="12" className='hRC' style={{fontSize:"1.3rem" , padding:"30px 70px 30px 80px" , color:"rgb(93 93 93)" }}>

                      {this.state.metdata_added ?(null):(
                          <div style={{width:"100%"}} >
                          <div style={{width:"100%", textAlign:"right", marginBottom:"-50px"}}>  <i  onClick = {this.close_metadata_form.bind(this)} className="fa fa-close " style={{paddingRight:"20px" ,color:"rgb(52, 0, 146)", cursor:"pointer"}} />
                          </div>
                          <div style={{width:"100%"}} >
                                <Metadata   prefill={this.state.file_info.metadata}  el = {this.state.metadata.external_link}  onSubmit={this.metadata.bind(this)}  />
                            </div>
                           </div>
                      )}

                    </Col>

                  </Row>
              ):(
                      null


              )}

               <Col xs="12" sm="12" lg="12">
                   <div style={{width:"100%", padding:"20px 50px 20px 50px" }}>
                      <Row  style={{fontSize:"1.4rem" ,  color:"rgb(93 93 93)", padding:"20px 0 0 0px"}} >
                         <Col xs="6" sm="6" lg="6">  Metadata </Col>

                          <Col xs="6" sm="6" lg="6"  style={{textAlign:"right"}}>
                          {this.props.auth.auth.user.username === this.state.file_info.updated_by ?(
                              <Button   onClick = {this.metadata_form.bind(this)} color="#ff0000"  size ="sm"  outline   style={{ border:"1px solid rgb(52 0 146)" , borderStyle:"dotted",  paddingTop:"0px  !important", fontSize:"1.2rem !important", borderRadius:"20px"}}>  <span style={{fontSize:"1.2rem", color:"rgb(52 0 146)", padding:"0 20px"}}>  <i className="fa fa-plus-circle " style={{paddingRight:"10px"}}></i> Edit Metadata </span>  </Button>

                          ):(
                              null
                          )}
                         </Col>

                      </Row>
                      <Row  style={{fontSize:"1.4rem" ,  color:"rgb(93 93 93)", padding:"5px 0 0 0px"}} >


                          {this.state.metadata ?(<div>
                             {this.DisplayMetadata()}
                               </div>):(
                              <div style={{fontSize:"1.2rem",  color:"#888888"}}>
                                There is no metadata for this file.
                               </div>
                          )}
                      </Row>
                  </div>
              </Col>
              </Row>

            </div>

          </Container>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

}
function mSP(s) {return {auth: s}}

export default connect(mSP) (Home)
