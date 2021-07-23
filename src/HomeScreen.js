import React,{useState,useEffect,useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import logo from './Nielsenlogo.jpg';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import CreateAPolicy from './CreateAPolicy';
import AssignPolicyToRole from './AssignPolicyToRole';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { IconContext } from "react-icons";
import DisconnectPolicyFromRole from './DisconnectPolicyFromRole';
import Tab from '@material-ui/core/Tab';
import DeleteAPolicy from './DeleteAPolicy';
import ViewAPolicy from './ViewAPolicy'
import HomeIcon from '@material-ui/icons/Home';
import {AiFillDelete,AiOutlineFileAdd,AiOutlineRead} from "react-icons/ai";
import { BiLink,BiUnlink,BiEdit } from "react-icons/bi";
import HomeTab from './HomeTab';
import UpdateAPolicy from './UpdateAPolicy';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
          </>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function HomeScreen(props) {
  // props = {token:"s.Fc5ZiBXFXxmbvd4rx6sGaQyZ"}
  const [roleToPolicies,setRoleToPolicies] = useState({})
  const [policytoPolicyInfo,setPTPI] = useState({})
  const [value,setValue] = React.useState(3)
  const classes = useStyles()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = useCallback(async() => {
    var roleToPTemp = {}
    var policiesToPolicyInfo = {}
    await fetch(`/auth?VAULT_TOKEN=` + props.token + `&auth_method=`+props.authRole, {
      method: "GET"
    }).then(response => response.json())
    .then(async data => {
      var roles = data;
      var i = 0;
      for(i = 0; i < roles.length;++i){
        const temp = i;
        await fetch(`/auth?VAULT_TOKEN=` + props.token + `&auth_method=`+props.authRole+`e&role=`+roles[i], {
          method: "GET"
        }).then(response => response.json())
        .then(data => {roleToPTemp[roles[temp]] = data;})
      }
      await setRoleToPolicies(roleToPTemp)
    
    })
    await fetch(`/policies?VAULT_TOKEN=` + props.token, {
      method: "GET"
    }).then(response => response.json())
    .then(async data => {
      var policies = data;
      for(var i = 0; i < policies.length;i++){
        const temp = i;
        await fetch(`/policies?VAULT_TOKEN=` + props.token + `&policyLabel=`+policies[i], {
          method: "GET"
        }).then(response => response.json())
        .then(data => {policiesToPolicyInfo[policies[temp]] = data;})
      }
      await setPTPI(policiesToPolicyInfo)
    })
    
  },[props.token])

  useEffect(() => {
    fetchData();
   },[fetchData])

  return (
      <div className="App" style={{textAlign:"left",marginLeft:15,marginBottom:50}}>
        <div className={classes.root}>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <div style={{fontSize:50,fontFamily:"system-ui",fontWeight:30}}>Policy Manager</div>
            <img alt="nielsenicon" src={logo} style={{height:80}} />
          </div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          aria-label="scrollable centerd force tabs example"
        >
          <Tab label="Create" icon={<IconContext.Provider value={{ size: 25}}>
<AiOutlineFileAdd style={{size:30}}/></IconContext.Provider>} {...a11yProps(0)} />
          <Tab label="Delete" icon={<IconContext.Provider value={{ size: 25}}><AiFillDelete /></IconContext.Provider>} {...a11yProps(1)} />
          <Tab label="View" icon={<IconContext.Provider value={{ size: 25}}><AiOutlineRead /></IconContext.Provider>} {...a11yProps(2)} />
          <Tab label="Home" icon={<IconContext.Provider value={{ size: 25}}><HomeIcon /></IconContext.Provider>} {...a11yProps(3)} />
          <Tab label="Update" icon={<IconContext.Provider value={{ size: 25}}><BiEdit/></IconContext.Provider>} {...a11yProps(4)} />
          <Tab label="Disconnect" icon={<IconContext.Provider value={{ size: 25}}><BiUnlink /></IconContext.Provider>} {...a11yProps(5)} />
          <Tab label="Connect" icon={<IconContext.Provider value={{ size: 25}}><BiLink /></IconContext.Provider>} {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CreateAPolicy refreshData={fetchData}
        token={props.token} />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <DeleteAPolicy refreshData={fetchData} 
          token={props.token} 
          roleToPolicies={roleToPolicies} 
          policytoPolicyInfo={policytoPolicyInfo}
          authRole={props.authRole}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <ViewAPolicy refreshData={fetchData} 
          token={props.token} 
          roleToPolicies={roleToPolicies} 
          policytoPolicyInfo={policytoPolicyInfo}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <HomeTab handleChange={setValue}/>
      </TabPanel>
      <TabPanel value={value} index={4}>
      <UpdateAPolicy refreshData={fetchData} 
          token={props.token}
          policytoPolicyInfo={policytoPolicyInfo}/>
      </TabPanel>
      <TabPanel value={value} index={5}>
      <DisconnectPolicyFromRole refreshData={fetchData} 
          token={props.token} 
          roleToPolicies={roleToPolicies} 
          policytoPolicyInfo={policytoPolicyInfo}
          authRole={props.authRole}/>
      </TabPanel>
      <TabPanel value={value} index={6}>
      <AssignPolicyToRole refreshData={fetchData} 
          token={props.token} 
          roleToPolicies={roleToPolicies} 
          policytoPolicyInfo={policytoPolicyInfo}
          authRole={props.authRole}/>   
      </TabPanel>
    </div>
        {/* <p style={{fontSize:50,color:"black",textAlign:"left",fontWeight:500}}>Policy Editor</p>
        <CreateAPolicy token={props.token} refreshData={fetchData}/>
        {Object.keys(policytoPolicyInfo).length > 0 && 
        <AssignPolicyToRole refreshData={fetchData} 
          token={props.token} 
          roleToPolicies={roleToPolicies} 
          policytoPolicyInfo={policytoPolicyInfo}/>} */}
      </div>
  );
}

export default HomeScreen;
 