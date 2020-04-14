import React from 'react'
import { Typography } from '@material-ui/core'
import ContentEditable from 'react-contenteditable'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    enabled: {
        minHeight: 20,
        minWidth: 200,
        border: '1px solid #aaa',
        borderRadius: 5,
        paddingRight: 15,
        paddingLeft: 5,
    },
    disabled: {
        border: 'none'
    }
}));
 

export default function InlineEdit(props) {
    const classes = useStyles();
    const defaultInput = props.defaultInput ? props.defaultInput : "";
    const label = props.label ? <Typography>{props.label}&nbsp;</Typography> : <Typography></Typography>;

    const onChange = (e) => {
        let curVal = e.target.value;
        console.log(typeof curVal);
        if(curVal){
            console.log(curVal);
            props.onChange(curVal);
        }else{
            console.log("not a value: ", curVal);
            props.onChange("");
        }
        
    }

    return (
        <div style={{ display: "flex", paddingTop: 5, paddingBottom: 5 }}>
            {label}
            <ContentEditable
                html={defaultInput}
                disabled={props.disabled}
                onChange={onChange}
                className={props.disabled ? classes.disabled : classes.enabled}
            />
        </div>
    )
}
