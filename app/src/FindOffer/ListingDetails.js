import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, Avatar, Link, Button } from '@material-ui/core';

import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

//temp import
import jordad from '../img/jordad.png';

const MAPTILER_ACCESS_TOKEN = 'prxcBM7GNRKVr9ucT9no';
const MAP_ID = '9ddbdaa1-4ce7-48c2-a288-d73cddca9aac';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 500
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
        color: '#595959',
    }

}));

// props: listingTitle, coordinates, location, livingSitch, houseRules, details (additional details), ownerName, ownerAvatar, ownerDeets
function ListingDetails(props) {
    const classes = useStyles();

    const [coor, setCoor] = useState(props.coordinates);


    function mapTilerProvider(x, y, z, dpr) {
        return `https://api.maptiler.com/maps/${MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`
    }

    var accessibilityFriendly = props.accessibilityFriendly ? "Yes" : "No";
    var lgbtqpFriendly = props.lgbtqpFriendly ? "Yes" : "No";

    // form a default bio if the user is unavailable
    var basicGreeting = ["Hey!", "Hello!", "Bonjour!", "Howdy!", "Nice to meet you!"]
    var aboutMeDefault = basicGreeting[Math.floor(Math.random() * 5)] + " I'm " + props.org + " " + props.gradYear + ". I am best reached by " + props.preferredContactMethod + ". Can't wait to get to know you."
    // TODO: once user has personalBio, provide option to switch between the two
    var aboutMe = aboutMeDefault;

    // set up list of buttons that can be used for contact
    var buttonList = [];
    var contacts = Object.entries(props.contacts);
    console.log(contacts);
    contacts.forEach(function (contact) {
        console.log(contact);
        if(contact[1] !== null){
            buttonList.push(<Button variant="outlined" color="primary" display='inline'>{contact[0]}</Button>);
        }
    });
    // avatar profile photos

    return (
        <div className={classes.root}>
            <Map mouseEvents={true} touchEvents={false} center={coor} zoom={12} width={500} height={300}>
                <Marker anchor={coor} payload={4}></Marker>
            </Map>
            <div className={classes.titleDiv} style={{color:'grey'}}>
                <Typography align="center" variant="h4"> Listing Details </Typography>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    <span role="img" aria-label="house emoji">🏠</span> {props.listingTitle}
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <div className={classes.fieldDiv}>
                    <Typography variant="inherit">
                    <span role="img" aria-label="pin emoji">📍</span> Location:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.location}
                    </Typography>
                </div>
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                        <span role="img" aria-label="accessibility emoji"> ♿ </span> Accessibility Friendly:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {accessibilityFriendly}
                    </Typography>
                </div>
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                    <span role="img" aria-label="rainbow flag emoji">🏳️‍🌈</span> LGBTQP Friendly:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {lgbtqpFriendly}
                    </Typography>
                </div>
                
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                        <span role="img" aria-label="family emoji">👪</span> Living Situation:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.livingSitch}
                    </Typography>
                </div>
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                        <span role="img" aria-label="vertical traffic light emoji">🚦</span> House Rules:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.houseRules}
                    </Typography>
                </div>
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                    <span role="img" aria-label="pencil and paper emoji">📝</span> Accessibility Info:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.access}
                    </Typography>
                </div>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    <span role="img" aria-label="handshake emoji">🤝</span> Your Housemate
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <Card style={{paddingTop: 10}} className={classes.fieldsDiv}>
                    <Grid container spacing={1}>
                        <Grid item xs={2} style={{display: 'flex', alignItems:'center'}}>
                            <Avatar src={props.avatarPhoto} src={jordad}></Avatar>
                        </Grid>
                        <Grid item xs={10}>
                        <div>
                            <Typography variant="h6">
                                {props.ownerName}
                            </Typography>
                            <div>
                                <Typography variant="inherit">
                                    {aboutMe}
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
                    <span role="img" aria-label="rolodex emoji">📇</span> Get in Touch
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <Card style={{paddingBottom: 25, paddingTop: 25, display: 'flex', justifyContent: 'space-around'}} className={classes.fieldsDiv}>
                    {buttonList}
                </Card>
            </div>
        </div>
    )
}

export default ListingDetails
