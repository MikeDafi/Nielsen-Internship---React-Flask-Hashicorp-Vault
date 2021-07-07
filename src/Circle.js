import React from 'react';

function Circle(props) {
  const diameter = props.diameter;
  return (
    <div style={{width:diameter,height:diameter,borderRadius:diameter/2,borderWidth:3,backgroundColor:"rgb(232, 232, 232)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        {props.icon}
        <div style={{fontSize:20,overflowWrap:"normal",width:diameter - 50,textAlign:"center"}}>{props.text}</div>
    </div>
  );
}

export default Circle;
