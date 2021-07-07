import React from 'react';
import IconButton from '@material-ui/core/IconButton';

function ConfirmationMessage(props) {

  return (
    <div style={{position:"absolute",width:"100vw",height:"100vh",backgroundColor:"rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{backgroundColor:"white",width:400,height:200,borderRadius:20,marginTop:150,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{fontSize:30,fontWeight:500}}>Confirmation Message</div>
        <div>Are you sure you want to {props.message}</div>
        <div style={{display:"flex",flexDirection:"row",marginTop:'auto',justifyContent:"space-between"}}>
          <IconButton style={{width:100,height:100}} onClick={() => props.setAnswer(true)}>
            <div style={{backgroundColor:"green",color:"black",width:75,height:75,borderRadius:75,fontSize:30,fontWeight:500,display:"flex",justifyContent:"center",alignItems:"center"}}>Yes</div>
          </IconButton>
          <IconButton style={{width:100,height:100}}onClick={() => {props.setAnswer(false)}}>
          <div style={{backgroundColor:"red",width:75,height:75,borderRadius:75,fontSize:30,fontWeight:500,display:"flex",justifyContent:"center",alignItems:"center"}}>No</div>

          </IconButton>
        </div>
      </div>

    </div>
  );
}

export default ConfirmationMessage;
