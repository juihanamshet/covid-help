import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import { Search, SportsKabaddi } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    button:{
        width: 250,
        height: 250,
        margin: 25
    }
}));

function Explainer(props) {
    const classes = useStyles();

    return (
        <div>
            <Card style={{height:450, maxHeight:600, overflow:'auto'}}>
                <CardContent>
                    <Typography align='center' variant="h4">
                        - How It Works -
                     </Typography>
                </CardContent>
                <CardActions>
                    <div className={classes.root}>
                        <Button className={classes.button} color="primary" variant="outlined">
                            <div>
                                <Search style={{fontSize: 100}}></Search>
                                <div></div>
                                <Typography variant="subtitle1"> I'm Looking For Resources</Typography>
                            </div>
                        </Button>
                        <Button className={classes.button} color="primary" variant="outlined">
                            <div>
                                <SportsKabaddi style={{fontSize: 100}}></SportsKabaddi>
                                <div></div>
                                <Typography variant="subtitle1"> I Want To Help</Typography>
                            </div>
                        </Button>
                    </div>
                </CardActions>
            </Card>
        </div>
    );
}

export default Explainer
