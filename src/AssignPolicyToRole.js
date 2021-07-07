import React,{useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ScrollableList from './ScrollableList';
import Button from '@material-ui/core/Button';
import ReactLoading from 'react-loading'
import ConfirmationMessage from './ConfirmationMessage';

function AssignPolicyToRole(props) {
    const [roleToPolicyCheckList,setrTPC] = React.useState([])
    const [policytoPolicyInfoCheckList,setPTPIC] = React.useState([])
    const [roleError,setRoleError] = React.useState("")
    const [policyError,setPolicyError] = React.useState("")
    const [loading,setLoading] = React.useState(false)
    const [roleToPolicy,setRoleToPolicy] = React.useState({})
    const [policytoPolicyI,setPolicyToPolicyI] = React.useState({})
    const [conVisible,setConVisible] = React.useState(false)

    useEffect(()=> setRoleToPolicy(props.roleToPolicies),[props.roleToPolicies])
    useEffect(()=> setPolicyToPolicyI(props.policytoPolicyInfo),[props.policytoPolicyInfo])
    async function handleAssign(){
        if(policytoPolicyInfoCheckList.length === 0){setPolicyError("Must Select 1+ Policies");return;}else{setPolicyError("")}
        if(roleToPolicyCheckList.length === 0){setRoleError("Must Select 1+ Roles");return;}else{setRoleError("")}
        setLoading(true)
        // const mapToCapabilities = {0:'\\"create\\"',1:'\\"read\\"',2:'\\"update\\"',3:'\\"delete\\"'}
        var value = policytoPolicyInfoCheckList.toString() 
        for(var i = 0; i < roleToPolicyCheckList.length;++i){
            value = value+ "," + roleToPolicy[roleToPolicyCheckList[i]].toString()
            const requestOptions = {
                method:'POST',
                body:JSON.stringify({
                                    policies:value}),	
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            await fetch('/auth?VAULT_TOKEN='+props.token+`&auth_method=approle&role=`+ roleToPolicyCheckList[i], requestOptions)
        }
        await props.refreshData();
        setrTPC([])
        setPTPIC([])
        setLoading(false)
    };
    function checkForErrors(event){
        event.preventDefault()
        if(policytoPolicyInfoCheckList.length === 0){setPolicyError("Must Select 1+ Policies");return;}else{setPolicyError("")}
        if(roleToPolicyCheckList.length === 0){setRoleError("Must Select 1+ Roles");return;}else{setRoleError("")}
        setConVisible(true)
    }

    function confirmationAnswer(value){
        setConVisible(false)
        if(value){
            handleAssign()
        }
    }

  return (
      <div style={{textAlign:"left",marginLeft:15,marginBottom:50,display:"flex",alignItems:"center",flexDirection:"column"}}>
        <div style={{fontSize:30,color:"black",textAlign:"left",fontWeight:500}}>Assign Policies to Roles</div>
          <div style={{display:"flex",flexDirection:"column"}}>
              <i>1.Checkbox the policies</i>
              <i>2.Checkbox the roles</i>
              <i>3.Press Assign to assign policies to roles</i></div>
          <div style={{display:"flex",flexDirection:"row",marginTop:5}}>
            <div>
                <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><h5>Policies</h5>{policyError !== "" && <div style={{color:"red",fontSize:15,marginBottom:5}}>{policyError}</div>}</div>       
                { <ScrollableList noDelete={true} list={policytoPolicyI} placeHolder={"Search by Policy or Policy Info"} setChecked={setPTPIC}  searchDictionaryValues={false}/>}
            </div>
            <div>
            <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><h5>Roles</h5>{roleError !== "" && <p style={{color:"red",fontSize:15,marginBottom:5}}>{roleError}</p>}</div>       
            { <ScrollableList list={roleToPolicy} placeHolder={"Search by Role or Policy"} setChecked={setrTPC} searchDictionaryValues={true}/>}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"center",width:720}}>
          <Button color="primary" variant="contained" style={{width:100,height:40}} onClick={checkForErrors}>
                  Assign
          </Button>
          {loading &&
          <div style={{position:"absolute",justifyContent:"absolute",alignItems:"center",marginTop:-200,marginLeft:20}}>
            <ReactLoading type={"spin"} color={"blue"} height={50} width={50} />
            <h6>Loading</h6>
          </div>}
          </div>
          {conVisible && <ConfirmationMessage message={"assign policies from roles?"} setAnswer={confirmationAnswer}/>}

      </div>
  );
}

export default AssignPolicyToRole;
 