import React,{useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ScrollableList from './ScrollableList';


function ViewAPolicy(props) {
    const [policytoPolicyI,setPolicyToPolicyI] = React.useState({})
    const [policyToView,setPolicyToView] = React.useState(-1)
    const [viewRawPolicy,setViewRaw] = React.useState(false)
    useEffect(()=> {setPolicyToPolicyI(props.policytoPolicyInfo);console.log(props.policytoPolicyInfo)},[props.policytoPolicyInfo])
    function parsePath(path){
      if(path === undefined) return ""
      var output = []
      while(true){
        var start = path.indexOf("\"")
        var end = path.indexOf("\"",start + 1)
      output.push('path ' + path.substring(start,end -1) + "\"{")
      output.push("capabilities = [" + (path.indexOf("create") !== -1 ? " create": "") + (path.indexOf("update") !== -1 ? " update" : "")+ (path.indexOf("delete") !== -1 ? " delete" : "")+ (path.indexOf("read") !== -1 ? " read": "") + "]")
      output.push('}')
      var newStart = path.indexOf("path \"",end)
      if(newStart === -1){break;}

      path = path.substring(newStart,path.length)
    }

      
      return output
    };

  return (
      <div style={{textAlign:"left",marginLeft:15,marginBottom:50,display:"flex",alignItems:"center",flexDirection:"column"}}>
        <div style={{fontSize:30,color:"black",textAlign:"left",fontWeight:500}}>View a Policy</div>
          <div style={{display:"flex",flexDirection:"row",marginTop:5}}>
            <div>
                <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><h5>Policies</h5></div>       
                {<ScrollableList noDelete={true} list={policytoPolicyI} noCheckBoxes={true}viewedClick={policyToView} onViewClick={(key) => {setPolicyToView(key === policyToView ? -1 : key);setViewRaw(false)}} placeHolder={"Search by Policy or Policy Info"}  searchDictionaryValues={false}/>}
            </div>
            <div style={{display:"flex",flexDirection:"column",marginLeft:20,marginTop:(policyToView !== -1 ? 3 : 27)}}>
              <u style={{fontWeight:500}}onClick={() => setViewRaw(!viewRawPolicy)}>{policyToView !== -1 ? (viewRawPolicy ? "Hide Raw Policy" : "View Raw Policy"): ''}</u>
              <div style={{ height: 350,marginTop:2, overflowY: 'scroll',width:360 }}>{policyToView !== -1 ? (viewRawPolicy ? policytoPolicyI[policyToView].rules : parsePath(policytoPolicyI[policyToView].rules).map(text => <div>{text}</div>)) : 'No Selection Made'}</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"center",width:720}}>
          </div>

      </div>
  );
}

export default ViewAPolicy;
 