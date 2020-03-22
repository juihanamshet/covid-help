import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, Avatar, Link } from '@material-ui/core';

import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import { grey } from '@material-ui/core/colors';

//temp import
import jordad from '../img/jordad.png';

const MAPTILER_ACCESS_TOKEN = 'prxcBM7GNRKVr9ucT9no';
const MAP_ID = '9ddbdaa1-4ce7-48c2-a288-d73cddca9aac';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 400
    },
    titleDiv: {
        paddingTop: 10,
        marginBottom: 10,
    },
    fieldsDiv: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15
    },
    fieldDiv: {
        marginBottom: 5,
    },
    fieldInfo: {
        color: 'grey',
        fontSize: 14
    }

}));

// props: listingTitle, coordinates, location, livingSitch, houseRules, details (additional details), ownerName, ownerAvatar, ownerDeets
function ListingDetails(props) {
    const classes = useStyles();

    const [coor, setCoor] = useState(props.coordinates);

    function mapTilerProvider(x, y, z, dpr) {
        return `https://api.maptiler.com/maps/${MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`
    }

    // set up list of buttons that can be used for contact
    // avatar profile photos

    return (
        <div className={classes.root}>
            <Map mouseEvents={true} touchEvents={false} center={coor} zoom={12} width={400} height={300}>
                <Marker anchor={coor} payload={4}></Marker>
            </Map>
            <div className={classes.titleDiv} style={{color:'grey'}}>
                <Typography align="center" variant="h4"> Listing Details </Typography>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    🏠 {props.listingTitle} listingTitle
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <div className={classes.fieldDiv}>
                    <Typography variant="inherit">
                        📍 Location:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.location} location
                    </Typography>
                </div>
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                        👪 Living Situation:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.livingSitch} livingSitch
                    </Typography>
                </div>
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                        🚦 House Rules:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.houseRules} houseRules
                    </Typography>
                </div>
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                        📝 Additional Details:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.details} details
                    </Typography>
                </div>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    🤝 Your Housemate
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <Card className={classes.fieldsDiv}>
                    <Grid container spacing={1}>
                        <Grid item xs={2} style={{display: 'flex', alignItems:'center'}}>
                            <Avatar src={props.avatarPhoto} src={jordad}></Avatar>
                        </Grid>
                        <Grid item xs={10}>
                        <div>
                            <Typography variant="h6">
                                {props.ownerName} ownerName
                            </Typography>
                            <div>
                                <Typography variant="inherit">
                                    {props.ownerDeets} ownerDeets.
                                </Typography>
                                <Link href="#" color="primary">
                                    <Typography variant="inherit">&nbsp;Learn More</Typography>
                                </Link>
                            </div>
                        </div>
                        </Grid>
                    </Grid>
                </Card>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    📇 Get in Contact
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <Card className={classes.fieldsDiv}>
                    [There will be a list of buttons here in the future]
            </Card>
            </div>
        </div>
    )
}

export default ListingDetails
