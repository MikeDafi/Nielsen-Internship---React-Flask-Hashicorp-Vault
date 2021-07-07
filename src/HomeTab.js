import React from 'react';
import Circle from './Circle';
import {AiFillDelete,AiOutlineFileAdd,AiOutlineRead} from "react-icons/ai";
import { BiLink,BiUnlink,BiEdit } from "react-icons/bi";
import IconButton from '@material-ui/core/IconButton';

import { useState, useEffect } from 'react';
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
function HomeTab(props) {

  const {  width } = useWindowDimensions();
  return (
    <div style={{position:"absolute",display:"flex",flexDirection:"column",width:"95vw",height:"95vh"}}>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-around",height:width/6 + 20}}>
        <IconButton onClick={() => {props.handleChange(0)}}>
        <Circle diameter={(width/6)} icon={<AiOutlineFileAdd style={{width:100,height:100}}/>} text={"Create a Policy"}/>
        </IconButton>

        <IconButton onClick={() => {props.handleChange(1)}}>
        <Circle diameter={(width/6)} icon={<AiFillDelete style={{width:100,height:100}}/>} text={"Delete a Policy"}/>
        </IconButton>
        <IconButton onClick={() => {props.handleChange(2)}}>
        <Circle diameter={(width/6)} icon={<AiOutlineRead style={{width:100,height:100}}/>} text={"View a Policy"}/>
        </IconButton>
        <IconButton onClick={() => {props.handleChange(4)}}>
        <Circle diameter={(width/6)} icon={<BiEdit style={{width:100,height:100}}/>} text={"Update a Policy"}/>
        </IconButton>

        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"center",height:(width/6) + 20}}> 
        <IconButton onClick={() => {props.handleChange(5)}}>
          <Circle diameter={(width/6)} icon={<BiUnlink style={{width:100,height:100}}/>} text={"Disconnect Policy From Role"}/>
          </IconButton>

          <div style={{fontSize:width /15,fontWeight:600,fontFamily:"Helvetica",marginLeft:100,marginRight:100,overflowWrap:"normal", width:200,display:"flex",justifyContent:"center",alignItems:"center",textAlign:"center"}}>Policy Manager</div>
          <IconButton onClick={() => {props.handleChange(6)}}>
          <Circle diameter={(width/6)} icon={<BiLink style={{width:100,height:100}}/>} text={"Connect a Policy From Role"}/>
          </IconButton>

        </div>

    </div>
  );
}

export default HomeTab;
