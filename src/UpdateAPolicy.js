import React,{useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import ConfirmationMessage from './ConfirmationMessage';

function UpdateAPolicy(props) {
  const [nameOfPolicy,setName] = React.useState("")
  const [secretPath,setSecretPath] = React.useState("")
  const [nameError,setNameError] = React.useState("")
  const [secretPathError,setSecretError] = React.useState("")
  const [checkedError,setCheckedError] = React.useState("")
  const [checkedCategories,setChecked] = React.useState([])
  const [policytoPolicyI,setPolicyToPolicyI] = React.useState({})
  const [conVisible,setConVisible] = React.useState(false)
  useEffect(()=>{ setPolicyToPolicyI(props.policytoPolicyInfo);},[props.policytoPolicyInfo])
  const handleToggle = (value) => {
    const currentIndex = checkedCategories.indexOf(value);
    const newChecked = [...checkedCategories];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  function checkForErrors(event){
    event.preventDefault()
    if(nameOfPolicy === ""){setNameError("There's an issue with the name");return;}else{setNameError("")}
    if(secretPath === ""){setSecretError("There's an issue with the policy");return;}else{setSecretError("")}
    if(checkedCategories.length === 0){setCheckedError("You must select at least one permission");return;}else{setCheckedError("")}
    setConVisible(true)
}

function confirmationAnswer(value){
    setConVisible(false)
    if(value){
        handleSubmit()
    }
}


    async function handleSubmit(){
        if(nameOfPolicy === ""){setNameError("There's an issue with the name");return;}else{setNameError("")}
        if(secretPath === ""){setSecretError("There's an issue with the policy");return;}else{setSecretError("")}
        if(checkedCategories.length === 0){setCheckedError("You must select at least one permission");return;}else{setCheckedError("")}
        const mapToCapabilities = {0:'\\"create\\"',1:'\\"read\\"',2:'\\"update\\"',3:'\\"delete\\"'}
        const requestOptions = {
            method:'POST',
            body:JSON.stringify({
                                policy:'#\\npath \\"'+secretPath+'\\" {\\n  capabilities = ['+ (mapToCapabilities[checkedCategories[0]]) + checkedCategories.map((e,i) => i > 0 ? (mapToCapabilities[e]) : "")+']\\n}'}),	
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        await fetch('/policies?VAULT_TOKEN='+props.token+'&policyLabel='+nameOfPolicy, requestOptions)
        props.refreshData();
        setName("")
        setSecretPath("")
        setChecked([])
    }

    function parsePath(path){
        if(path === undefined) return ""
        var output = {}
        var start = path.indexOf("\"")
        var end = path.indexOf("\"",start + 1)
        output["path"] = path.substring(start + 1,end -1)
        var temp = ["create","update","delete","read"]
        for(var i = 0; i < temp.length;i++){
            var x = temp[i];
            output[x] = (path.indexOf(x) !== -1)
        }
        return output
      }

  return (
      <div style={{display:"flex",flexDirection:"column",width:"95vw",height:"80vh",alignItems:"center"}} >
        <p style={{fontSize:50,color:"black",textAlign:"left",fontWeight:500}}>Update a Policy</p>
        <div style={{display:"flex",flexDirection:"column"}}>
              <i>1.Select a Policy to Change</i>
              <i>2.Press Submit when finished</i>
          </div>
        <div style={{display:"flex",flexDirection:"column",width:"95vw",height:"80vh",alignItems:"center"}}>
        <Form onSubmit={(event) => checkForErrors(event)} style={{display:"flex",flexDirection:"column",height:100}}>
            <Form.Group key={"policyInput"}controlId="policyInput" onChange={(event) => setName(event.target.value)}style={{display:"flex",flexDirection:"column",textAlign:"left",marginRight:30}}>
                <Form.Label>
                <div style={{overflow:"hidden",whiteSpace:"nowrap",color:"black",marginRight:15}}>
                Name of Policy: 
                </div>
                </Form.Label>
                <Autocomplete
                options={Object.keys(policytoPolicyI)}
                style={{ width: 300 }}
                onOpen={(event)=>{
                    setName("")
                }}
                onChange={(event, newValue) => {
                    setName(newValue);
                    if(policytoPolicyI[newValue] === undefined){
                        setChecked([])
                        setSecretPath("")
                    }else{
                        var temp = ["create","update","delete","read"]
                        const output = parsePath(policytoPolicyI[newValue].rules)
                        setSecretPath(output["path"])
                        var total = []
                        for(var i = 0; i < temp.length;i++){
                            if(output[temp[i]]){total.push(i)}
                        }
                        setChecked(total)
                        
                    }                 
                    
                  }}
                  inputValue={nameOfPolicy}
                  onInputChange={(event, newValue,reason) => {
                    setName(newValue);
                    if(policytoPolicyI[newValue] === undefined){
                        setChecked([])
                        setSecretPath("")
                    }else{
                        var temp = ["create","read","update","delete"]
                        const output = parsePath(policytoPolicyI[newValue].rules)
                        setSecretPath(output["path"])
                        var total = []
                        for(var i = 0; i < temp.length;i++){
                            if(output[temp[i]]){total.push(i)}
                        }
                        setChecked(total)
                        
                    } 
                  }}
                renderInput={(params) => <TextField {...params} label="Enter Name" variant="outlined" />}
                />
                {nameError !== "" &&  <p style={{color:"red",fontSize:15}}>{nameError}</p>}
            </Form.Group>
            <Form.Group key={"pathInput"} controlId="pathInput" onChange={(event) => setSecretPath(event.target.value)}style={{display:"flex",flexDirection:"column",textAlign:"left",marginRight:20}}>
                <Form.Label>
                <div style={{overflow:"hidden",whiteSpace:"nowrap",color:"black",marginRight:15}}>
                Secret Path: 
                </div>
                </Form.Label>
                <Form.Control
                    disabled={policytoPolicyI[nameOfPolicy] === undefined}
                    type="text"
                    placeholder="e.g. secret/foo/*"
                    value={secretPath}
                    onChange={(event) => setSecretPath(event.target.value)}
                />
                {secretPathError !== "" &&  <p style={{color:"red",fontSize:15}}>{secretPathError}</p>}
            </Form.Group>
            <div style={{display:"flex",flexDirection:"column"}}>
                <div style={{overflow:"hidden",whiteSpace:"nowrap",color:"black",marginRight:15}}>
                    Secret Permissions: 
                </div>
                <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                {[0,1].map((value) => 
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{width:50,textAlign:"center"}}>{value === 0 && "Create"}{value === 1 && "Update"}{value === 2 && "Delete"}{value === 3 && "Read"}</div>
                        <Checkbox
                            disabled={policytoPolicyI[nameOfPolicy] === undefined}
                            checked={checkedCategories.indexOf(value) !== -1}
                            onChange={() => handleToggle(value)}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </div>)}
                {[2,3].map((value) => 
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{width:50,textAlign:"center"}}>{value === 0 && "Create"}{value === 1 && "Update"}{value === 2 && "Delete"}{value === 3 && "Read"}</div>
                        <Checkbox
                            disabled={policytoPolicyI[nameOfPolicy] === undefined}
                            checked={checkedCategories.indexOf(value) !== -1}
                            onChange={() => {handleToggle(value)}}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </div>)}
                </div>
                {checkedError !== "" &&  <p style={{color:"red",fontSize:15}}>{checkedError}</p>}

            </div>
            <Button  disabled={policytoPolicyI[nameOfPolicy] === undefined}
                    variant="primary" type="submit" style={{width:100,height:40,marginTop:30}}>
                Submit
            </Button>
        </Form>
      </div>
      {conVisible && <ConfirmationMessage message={"update a policy?"} setAnswer={confirmationAnswer}/>}

      </div>
  );
}

export default UpdateAPolicy;
 