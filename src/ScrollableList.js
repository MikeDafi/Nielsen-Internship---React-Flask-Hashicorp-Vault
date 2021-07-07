import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import SearchBar from "material-ui-search-bar";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import './App.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    backgroundColor: theme.palette.background.paper,
    overflow:"auto",
    height:300,
    marginTop:-20
  },
  noResults:{
    width: 360,
    backgroundColor: theme.palette.background.paper,
    height:294,
    overflow:"auto",
    marginTop:10
  },
  blue:{
    backgroundColor:"blue"
  }
}));


export default function CheckboxListSecondary(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [clickedDeleteList,setClick] = React.useState([])
  const [searchValue,setSearchValue] = React.useState("");
  const [dictionary,setDict] = React.useState({})
  const [clickedViewList,setView] = React.useState([])
  useEffect(() => {setDict(props.list);setChecked([])},[props.list] )
  const handleCheckToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.setChecked(newChecked)
  };

  const handleViewToggle = (value) => {
    const currentIndex = clickedViewList.indexOf(value);
    const newChecked = [...clickedViewList];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setView(newChecked);
  };

  function searchResults(searchValue){
    if(searchValue === ""){setDict(props.list); return;}
    const matches = {}
    const keys = Object.keys(dictionary)

    for(var i = 0; i < keys.length;i++){
      if(keys[i].includes(searchValue)){
        matches[keys[i]] = dictionary[keys[i]]
      }
    };
    const values = Object.values(dictionary)
    for(i = 0; i < values.length;i++){
      if(props.searchDictionaryValues){
        for(var j = 0;j < values[i].length;j++){
          if(values[i][j].includes(searchValue)){
            matches[keys[i]] = values[i]
            break
          }
        }
      }else if(values[i].rules.includes(searchValue)){
        matches[keys[i]] = values[i]
      }
    };  
    setDict(matches)
  };

  function parsePath(path){
    if(path === undefined) return ""
    var start = path.indexOf("\"")
    var end = path.indexOf("\"",start + 1)

    var newPath = "path: " + path.substring(start,Math.min(end - 1 - start, 30) + start) +"\"" +((end - 1 - start) > 30 ? "..." : "") + " permissions:" + (path.indexOf("create") !== -1 ? " Create": "") + (path.indexOf("update") !== -1 ? " Update" : "")+ (path.indexOf("delete") !== -1 ? " Delete" : "")+ (path.indexOf("read") !== -1 ? " Read": "")
    return newPath
  };

  return (
    <div className="App" style={{border:'1.5px solid gray',width:365}}>
  <SearchBar
    value={searchValue}
    placeholder={props.placeHolder}
    onChange={(newValue) => { setSearchValue(newValue)}}
    onRequestSearch={() => searchResults(searchValue)}
    onCancelSearch={() => {setDict(props.list);setSearchValue("")}}
  />
    {Object.keys(dictionary).length > 0 && <p style={{visibility:"hidden"}}>{Object.keys(dictionary)[0]}</p>}
    
    <List className={Object.keys(dictionary).length === 0 ? classes.noResults : classes.root} subheader={<li />}>
      {Object.keys(dictionary).length === 0 ?
      <ListItem style={{justifyContent:"center",textAlign:"center"}}>
      <ListItemText primary={"No Results"} />
      </ListItem> :
        Object.keys(dictionary).map((key) => {
        const labelId = `checkbox-list-secondary-label-${key}`;
        return (
          <ListItem key={key}  >
            <ListItemAvatar>
              <Avatar className={classes.blue}>{key.substring(0,1)}</Avatar>
            </ListItemAvatar>
            <ListItemText id={labelId} primary={
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    {key}       
                    {!props.searchDictionaryValues && 
                    <div style={{flexDirection:"row",display:"flex"}}>
                      {!props.noDelete && (clickedDeleteList.indexOf(key) === -1 ?
                      <u onClick={() => {const newClicked = [...clickedDeleteList];newClicked.push(key); setClick(newClicked)}} style={{marginRight:10}}>Delete</u>
                      : <div style={{flexDirection:"row",display:"flex"}}>
                          <div onClick={() => {props.handleDelete(key,props.searchDictionaryValues ? 0 : 1);const newClicked = [...clickedDeleteList];newClicked.splice(newClicked.indexOf(key), 1);setClick(newClicked)}}>
                            <CheckIcon style={{color:"green"}}/>
                          </div>
                          <div onClick={() => {const newClicked = [...clickedDeleteList];newClicked.splice(newClicked.indexOf(key), 1); setClick(newClicked)}}>
                            <CloseIcon style={{color:"red"}}/>
                          </div>
                        </div>)}
                      {props.onViewClick ? 
                        <div onClick={() => {handleViewToggle(key);if(props.onViewClick){props.onViewClick(key)}}}>
                        {props.viewedClick !== key ? <u>View</u> : <u>Hide</u>}
                        </div>
                        :
                        <div onClick={() => {handleViewToggle(key)}}>
                        {clickedViewList.indexOf(key) === -1 ? <u>View</u> : <u>Hide</u>}
                         </div>          
                      }
                    </div>}
                    </div>} secondary={(props.searchDictionaryValues ? "Policies: " + dictionary[key].toString() : (clickedViewList.indexOf(key) === -1 ? parsePath(dictionary[key].rules) : dictionary[key].rules))} />
            {!props.noCheckBoxes && <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleCheckToggle(key)}
                checked={checked.indexOf(key) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>}
          </ListItem>
        );
      })}
    </List>
    </div>
  );
}