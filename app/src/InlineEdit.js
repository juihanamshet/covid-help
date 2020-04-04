import React from 'react'
import { Typography } from '@material-ui/core'
import ContentEditable from 'react-contenteditable'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    enabled: {
        minHeight: 20,
        minWidth: 175,
        border: '1px solid #aaa',
        borderRadius: 10,
        paddingRight: 15,
        paddingLeft: 5,
    },
    disabled: {
        border: 'none'
    }
}));
 

export default function InlineEdit(props) {
    const classes = useStyles();
    const defaultInput = props.defaultInput ? props.defaultInput : 'no information provided';
    const text = React.useRef('')
    const label = props.label ? <Typography>{props.label}&nbsp;</Typography> : <Typography></Typography>;

    return (
        <div style={{ display: "flex", paddingTop: 5, paddingBottom: 5 }}>
            {label}
            <ContentEditable text={defaultInput}
                html={defaultInput}
                disabled={props.disabled}
                onChange={(e) => props.onChange(e.target.value)}
                className={props.disabled ? classes.disabled : classes.enabled}
            />
        </div>
    )
}
