import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ConfirmationMessage from './ConfirmationMessage';
function CreateAPolicy(props) {
  const [nameOfPolicy,setName] = React.useState("")
  const [secretPath,setSecretPath] = React.useState("")
  const [nameError,setNameError] = React.useState("")
  const [secretPathError,setSecretError] = React.useState("")
  const [checkedError,setCheckedError] = React.useState("")
  const [checkedCategories,setChecked] = React.useState([])
  const [conVisible,setConVisible] = React.useState(false)
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
    
    async function handleSubmit(event){
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

    function confirmationAnswer(value){
        setConVisible(false)
        if(value){
            handleSubmit()
        }
    }

  return (
      <div style={{display:"flex",flexDirection:"column",width:"95vw",height:"80vh",alignItems:"center"}} >
        <p style={{fontSize:50,color:"black",textAlign:"left",fontWeight:500}}>Create a Policy</p>
        <div style={{display:"flex",flexDirection:"column",width:"95vw",height:"80vh",alignItems:"center"}}>
        <Form onSubmit={checkForErrors} style={{display:"flex",flexDirection:"column",height:100}}>
            <Form.Group key={"policyInput"}controlId="policyInput" onChange={(event) => setName(event.target.value)}style={{display:"flex",flexDirection:"column",textAlign:"left",marginRight:30}}>
                <Form.Label>
                <div style={{overflow:"hidden",whiteSpace:"nowrap",color:"black",marginRight:15}}>
                Name of Policy: 
                </div>
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={nameOfPolicy}
                    onChange={(event) => setName(event.target.value)}
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
                        <div style={{width:50,textAlign:"center"}}>{value === 0 && "Create"}{value === 1 && "Read"}{value === 2 && "Update"}{value === 3 && "Delete"}</div>
                        <Checkbox
                            checked={checkedCategories.indexOf(value) !== -1}
                            onChange={() => handleToggle(value)}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </div>)}
                {[2,3].map((value) => 
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{width:50,textAlign:"center"}}>{value === 0 && "Create"}{value === 1 && "Read"}{value === 2 && "Update"}{value === 3 && "Delete"}</div>
                        <Checkbox
                            checked={checkedCategories.indexOf(value) !== -1}
                            onChange={() => {handleToggle(value)}}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </div>)}
                </div>
                {checkedError !== "" &&  <p style={{color:"red",fontSize:15}}>{checkedError}</p>}

            </div>
            <Button variant="primary" type="submit" style={{width:100,height:40,marginTop:30}}>
                Submit
            </Button>
        </Form>
      </div>
      {conVisible && <ConfirmationMessage message={"create a policy?"} setAnswer={confirmationAnswer}/>}
      </div>
  );
}

export default CreateAPolicy;
 