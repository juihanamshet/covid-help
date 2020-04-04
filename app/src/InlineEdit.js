import React from 'react'
import { Typography } from '@material-ui/core'
import ContentEditable from 'react-contenteditable'

export default function InlineEdit(props) {
    const defaultInput = props.defaultInput ? props.defaultInput : 'no information provided';
    const text = React.useRef('')
    const label = props.label ? <Typography>{props.label}&nbsp;</Typography> : <Typography></Typography>;

    return (
        <div style={{ display: "flex", paddingTop: 2.5, paddingBottom: 2.5 }}>
            {label}
            <ContentEditable text={defaultInput}
                html={defaultInput}
                disabled={props.disabled}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    )
}
