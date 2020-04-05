import React, { Component } from 'react';
import Explainer from './Explainer.js';

import { withStyles } from '@material-ui/styles';
import { Paper, Typography, Grid, Card, CardContent, CardActions, Button } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import bgImage from '../img/neighborhood-lizSanchez.jpg';
import NavBar from '../NavBar.js'

const styling = {
    paperContainer: {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
    }
};

const styles = theme => ({
    banner: {
        boxShadow: 'none'
    },
    bannerTitle: {
        color: 'white',
        fontWeight: '300'
    },
    titleDiv: {
        paddingTop: '10%',
        paddingLeft: 20
    },
    descriptionDiv: {
        paddingBottom: '10%',
        paddingLeft: 20
    },
    bannerDescription: {
        fontStyle: 'italic'
    },
    cardActions: {
        justifyContent: 'center'
    },
    details: {
        padding: 25
    }
});

class AboutUs extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { classes } = this.props;

        return (

            <div>
                <NavBar></NavBar>
                <Paper square className={classes.banner} style={styling.paperContainer}>
                    <Grid container spacing={3}>
                        <Grid item sm={12}>
                            <div className={classes.titleDiv}>
                                <Typography className={classes.bannerTitle} variant='h1'>
                                    Project Student Relief
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item sm={12}>
                            <div className={classes.descriptionDiv}>
                                <Typography className={classes.bannerDescription} color="secondary" variant='h4'>
                                    Connecting open doors with students in need.
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <div></div>
                <Grid container spacing={2} className={classes.details}>
                    <Grid item xs={12} sm={6}>
                        <div>
                            <Card >
                                <CardContent>
                                    <Typography align='center' variant="h4">
                                        - Our Goal -
                                    </Typography>
                                    <br />
                                    <Typography variant='inherit'>
                                        In response to the recent outbreak of COVID-19, many universities in the United States have closed indefintely to help mitigate the spread of the disease. While for some, this period marks an opportunity to return home to friends and family, for others, the closing of school represents a period of housing uncertainty. <br /> <br /> International students barred from returning home or local students without the resources to return home are put in a very difficult situation with no clear end in sight. COVID-19 exposes a very clear need for a network of good samaritans to help support college students in times of emergency when going home is not an option. Our goal is simple: we want to connect faculty, alumni, and fellow students with empty bedrooms or open floor space with students in need of emergency housing. <br /><br /> We hope you will join us.
                                        </Typography>
                                </CardContent>
                                <CardActions className={classes.cardActions}>
                                    <Button color="primary" variant="contained" endIcon={<ArrowForwardIcon></ArrowForwardIcon>}> Sign Me Up</Button>
                                </CardActions>
                            </Card>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Explainer></Explainer>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(AboutUs);