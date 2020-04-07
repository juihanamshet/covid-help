import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, List } from '@material-ui/core';
import { Search, SportsKabaddi } from '@material-ui/icons';
import ReactCardFlip from 'react-card-flip';


const useStyles = makeStyles(theme => ({
    root: {
        height: '90%',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    button: {
        color: 'white',
        width: 200,
        margin: 25,
        "&:hover": {
            backgroundColor: 'rgba(255, 166, 102, 0.85)'
        }
    },
    buttons: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

function Explainer(props) {
    const classes = useStyles();
    const [flipped, setFlipped] = useState(false);

    return (
        <div className={classes.root}>
            <ReactCardFlip isFlipped={flipped}>
            <div className={classes.buttons}>
                <Button className={classes.button} color="secondary" variant="contained" onClick={() => setFlipped(!flipped)} disableElevation>
                    <div>
                        <Search style={{ fontSize: 25 }}></Search>
                        <Typography variant="subtitle1">Find Housing</Typography>
                    </div>
                </Button>
                <Button className={classes.button} color="secondary" variant="contained" onClick={() => setFlipped(!flipped)} disableElevation>
                    <div>
                        <SportsKabaddi style={{ fontSize: 25 }}></SportsKabaddi>
                        <Typography variant="subtitle1"> Offer Housing</Typography>
                    </div>
                </Button>
            </div>
            <div>
                <List>

                </List>
                <Button onClick={() => setFlipped(!flipped)}>Back</Button>
            </div>
            </ReactCardFlip>
        </div>
    );
}

export default Explainer
