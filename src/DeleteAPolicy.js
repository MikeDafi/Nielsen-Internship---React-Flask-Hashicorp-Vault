import React,{useEffect,useCallback} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ScrollableList from './ScrollableList';
import Button from '@material-ui/core/Button';
import ReactLoading from 'react-loading'
import ConfirmationMessage from './ConfirmationMessage';

function DeleteAPolicy(props) {
    const [roleToPolicyCheckList,setrTPC] = React.useState([])
    const [policytoPolicyInfoCheckList,setPTPIC] = React.useState([])
    const [roleError,setRoleError] = React.useState("")
    const [policyError,setPolicyError] = React.useState("")
    const [loading,setLoading] = React.useState(false)
    const [inHandleDelete,setinHandleDelete] = React.useState(false)
    const [roleToPolicy,setRoleToPolicy] = React.useState({})
    const [policytoPolicyI,setPolicyToPolicyI] = React.useState({})
    const [conVisible,setConVisible] = React.useState(false)
    useEffect(()=> setRoleToPolicy(props.roleToPolicies),[props.roleToPolicies])
    useEffect(()=> setPolicyToPolicyI(props.policytoPolicyInfo),[props.policytoPolicyInfo])
 
    function checkForErrors(event){
        event.preventDefault()
        if(policytoPolicyInfoCheckList.length === 0){setRoleError("Must Select 1+ Policies");return;}else{setPolicyError("")}
        setConVisible(true)
    }

    function confirmationAnswer(value){
        setConVisible(false)
        if(value){
            handleDelete()
        }
    }

    async function handleDelete(){
        const requestOptions = {
            method:'DELETE',
            body:JSON.stringify({
                policies:"HI"}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        for(var i = 0; i < policytoPolicyInfoCheckList.length;i++){
            var key = policytoPolicyInfoCheckList[i];
            await fetch('/policies?VAULT_TOKEN='+props.token+`&policyLabel=`+ key, requestOptions)
        }
        await setrTPC(Object.keys(roleToPolicy))
        // await setPTPIC([key])
        await setinHandleDelete(true)
    
        setinHandleDelete(false)

        await props.refreshData();
    };

    const handleDisconnect = useCallback(async() => {
        if(roleToPolicyCheckList.length === 0){setRoleError("There are no roles to delete policy from");return;}else{setRoleError("")}
        setLoading(true)
        // const mapToCapabilities = {0:'\\"create\\"',1:'\\"read\\"',2:'\\"update\\"',3:'\\"delete\\"'}
        for(var i = 0; i < roleToPolicyCheckList.length;++i){
            var newPolicies = roleToPolicy[roleToPolicyCheckList[i]].toString()
            for(var j = 0; j < policytoPolicyInfoCheckList.length;j++){
                const index = newPolicies.indexOf(policytoPolicyInfoCheckList[j])
                if(index !== -1){
                    newPolicies = newPolicies.replace(policytoPolicyInfoCheckList[j],"",1)
                    if(newPolicies[index] === ","){newPolicies = newPolicies.substr(0,index) + newPolicies.substr(index,newPolicies.length)}
                }
                const requestOptions = {
                    method:'POST',
                    body:JSON.stringify({
                                        policies:newPolicies}),	
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }
                await fetch('/auth?VAULT_TOKEN='+props.token+`&auth_method=approle&role=`+ roleToPolicyCheckList[i], requestOptions)
            }
        }
        await props.refreshData();
        setrTPC([])
        setPTPIC([])
        setLoading(false)
    },[policytoPolicyInfoCheckList,props,roleToPolicy,roleToPolicyCheckList])

    useEffect(() => {
        if(inHandleDelete){
            handleDisconnect()
        }
    },[inHandleDelete,policytoPolicyInfoCheckList,handleDisconnect])

  return (
      <div style={{textAlign:"left",marginLeft:15,marginBottom:50,display:"flex",alignItems:"center",flexDirection:"column"}}>
        <div style={{fontSize:30,color:"black",textAlign:"left",fontWeight:500}}>Delete Policies</div>
          <div style={{display:"flex",flexDirection:"column"}}>
              <i>1.Checkbox the policies to Delete</i>
              <i>2.Press Delete to delete policies</i>
          </div>
          <div style={{display:"flex",flexDirection:"row",marginTop:5}}>
            <div>
                <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><h5>Policies</h5>{policyError !== "" && <div style={{color:"red",fontSize:15,marginBottom:5}}>{policyError}</div>}</div>       
                {<ScrollableList noDelete={true} list={policytoPolicyI} placeHolder={"Search by Policy or Policy Info"} setChecked={setPTPIC} handleDelete={handleDelete} searchDictionaryValues={false}/>}
            </div>
            <div>
            <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><h5>Roles</h5>{roleError !== "" && <p style={{color:"red",fontSize:15,marginBottom:5}}>{roleError}</p>}</div>       
            { <ScrollableList list={roleToPolicy} placeHolder={"Search by Role or Policy"} noCheckBoxes={true} setChecked={setrTPC} searchDictionaryValues={true}/>}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"center",width:720}}>
          <Button color="secondary" variant="contained" style={{width:100,height:40,marginRight:30}} onClick={checkForErrors}>
                Delete
          </Button>
          {loading &&
          <div style={{position:"absolute",justifyContent:"absolute",alignItems:"center",marginTop:-200,marginLeft:20}}>
            <ReactLoading type={"spin"} color={"blue"} height={50} width={50} />
            <h6>Loading</h6>
          </div>}
          </div>
          {conVisible && <ConfirmationMessage message={"delete a policy?"} setAnswer={confirmationAnswer}/>}
      </div>
  );
}

export default DeleteAPolicy;
 