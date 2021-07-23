import logo from './Nielsenlogo.jpg';
import React,{useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import HomeScreen from './HomeScreen';
import './App.css';


function Login() {
  const [token,setToken] = useState("")
  const [error,setError] = useState("Initialized")
  const [authRole,setauthRole] = useState("")
  useEffect(() =>{
    fetch(`token`)
    .then(response => response.json())
    .then(data => {

        if(typeof data !== 'object' && data !== "NA"){
          setToken(data)
        }
    })
  },[])


  async function handleSubmit(event){
    event.preventDefault();
    await fetch(`authRole`)
    .then(response => response.json())
    .then(data => {
        setauthRole(data)
    })
    await fetch(`policies?VAULT_TOKEN=`+ token)
    .then(response => response.json())
    .then(data => {
        setError(data['message'] !== undefined)
    })
  }
  return (
      <div className="App">
        {error === "Initialized" || error === true ? 
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p style={{color:"black",fontSize:"40px"}}>
            Policy Editor
          </p>
          <Form onSubmit={(event) => handleSubmit(event)}>
            <Form.Group controlId="vaultToken" style={{display:"flex",flexDirection:"row"}}>
              <Form.Label>
              <div style={{overflow:"hidden",whiteSpace:"nowrap",color:"black",marginRight:15}}>
                Vault Token:
              </div>
              </Form.Label>
              <Form.Control 
                placeholder="Enter Token" 
                style={{width:300}} 
                value={token}
                onChange={(event) => setToken(event.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            {error === true && <p style={{color:"red",fontSize:15}}>There was an error with the token. Try again.</p>}
          </Form>

        </header>
        : 
        <HomeScreen token={token} authRole={authRole} />}
      </div>
  );
}

export default Login;
