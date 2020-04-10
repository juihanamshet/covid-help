import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, Avatar, Link, Button, IconButton } from '@material-ui/core';
import { MailOutline, Facebook, LinkedIn, Instagram } from '@material-ui/icons';
import {  StaticGoogleMap as Map, Marker } from 'react-static-google-map';
import { withOktaAuth } from '@okta/okta-react';
import axios from 'axios'
//temp import
import jordad from '../img/jordad.png';

const BASE_URL = 'http://localhost:8080'
const GOOGLE_MAPS = process.env.REACT_APP_GOOGLE_MAPS_API;

const GREETINGS = ["Hey!", "Hello!", "Bonjour!", "Howdy!", "Nice to meet you!"]
const MEDIA_ICONS = {Email: <MailOutline></MailOutline>, Facebook: <Facebook></Facebook>, LinkedIn: <LinkedIn></LinkedIn>, Instagram: <Instagram></Instagram>}

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 475
    },
    listingDeets: {
        paddingTop: 10,
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
    },
    viewProfile: {
        "&:hover": {
            textDecoration: "underline!important"
        }
    },
    deleteButton: {
        color: "#DC143C",
        "&:hover": {
            backgroundColor: "rgba(220,20,60,0.04)"
        }
    },
    disableButton: {
        color: "#FFC400",
        "&:hover": {
            backgroundColor: "rgba(255, 196, 0, 0.04)"
        }
    },
    enableButton: {
        color: "#32CD32",
        "&:hover": {
            backgroundColor: "rgba(50,205,50,0.04)"
        }
    },
    confirmClick: {
        borderColor: "#32CD32",
        color: "#32CD32",
        "&:hover": {
            backgroundColor: "rgba(50,205,50,0.04)"
        }
    },
    cancelButton: {
        "&:hover": {
            textDecoration: "underline"
        }
    },
}));

// props: listingTitle, coordinates, location, livingSitch, houseRules, details (additional details), ownerName, ownerAvatar, ownerDeets
function ListingDetails(props) {
    const accessToken = props.authState.accessToken;
    const classes = useStyles();
    const [clickedDelete, setClickedDelete] = useState(false);
    const [clickedDisable, setClickedDisable] = useState(false);
    const [clickedEnable, setClickedEnable] = useState(false);

    // accesibility
    var accessibilityFriendly = props.accessibilityFriendly ? "Yes" : "No";
    var lgbtqpFriendly = props.lgbtqpFriendly ? "Yes" : "No";

    // form a default bio if the user is unavailable
    var school = props.org.replace(/^\w/, c => c.toUpperCase());
    var aboutMeDefault = props.bio ? props.bio : GREETINGS[Math.floor(Math.random() * 5)] + " I'm " + school + " " + props.gradYear + ". I am best reached by " + props.preferredContactMethod + ". Can't wait to get to know you. " 
    // TODO: once user has personalBio, provide option to switch between the two
    var aboutMe = aboutMeDefault;

    // set up list of buttons that can be used for contact
    var buttonList = [];
    var keyCount = 0;
    const contacts = Object.entries(props.contacts);
    contacts.forEach(function (contact) {
        // if the social media url isn't null or undefined
        if(contact[1]){
            // key creation
            buttonList.push(<IconButton key={keyCount} target="_blank" href={contact[1]} color="primary" display='inline'>{MEDIA_ICONS[contact[0]]}</IconButton>);
            keyCount++;
        }
    });

    const submitDeleteReq = async() => {
        console.log('submitted delete request')
        var config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                listingID: props.listingId
            }
        };
        axios.delete(BASE_URL + '/deleteListing', config)
            .then(function (response) {
                console.log("deleted the listing");
                setClickedDelete(!clickedDelete)
                props.openSnackBar({severity: 'success', message: 'Succesfully deleted listing!'});
                props.handleClose(false);
                props.refreshOffers();
            })
            .catch(function (error) {
                console.log(error);
                props.openSnackBar({severity: 'error', message: 'Unable to delete listing, please try again.'});                
            });
    }

    const submitDisableReq = async() => {
        console.log('submitted disable request')
        var data = {
            listingID: props.listingId
        };
        var config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            },
        };
        axios.put(BASE_URL + '/disableListing', data, config)
            .then(function (response) {
                console.log("disabled the listing");
                setClickedDisable(!clickedDisable)
                props.handleClose();
                props.openSnackBar({severity: 'success', message: 'Succesfully disabled listing!'});
                props.refreshOffers();
            })
            .catch(function (error) {
                console.log(error);
                props.openSnackBar({severity: 'error', message: 'Unable to disable listing, please try again.'});                
            });
    }

    const submitEnableReq = async() => {
        console.log('submitted disable request')
        var data = {
            listingID: props.listingId
        };
        var config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            },
        };
        axios.put(BASE_URL + '/enableListing', data, config)
            .then(function (response) {
                console.log("disabled the listing");
                setClickedDisable(!clickedDisable)
                props.handleClose();
                props.openSnackBar({severity: 'success', message: 'Succesfully enabled listing!'});
                props.refreshOffers();
            })
            .catch(function (error) {
                console.log(error);
                props.openSnackBar({severity: 'error', message: 'Unable to enable listing, please try again.'});                
            });
    }

    const clearClicks = (e) => {
        e.preventDefault();
        setClickedDisable(false);
        setClickedDelete(false);
    }

    // if listing is owned by user, provide delete and disable options
    var deleteButton = '';
    var disableButton = '';
    var cancelButton = '';
    if(props.isOwner){
        cancelButton = (clickedDelete || clickedDisable) ? <Button className={classes.cancelButton} onClick={clearClicks}>Cancel</Button> : '';
        deleteButton = <Button onClick={clickedDelete ? submitDeleteReq : () => setClickedDelete(!clickedDelete)} variant={clickedDelete ? 'outlined': 'text'} className={clickedDelete ? classes.confirmClick : classes.deleteButton} style={{marginLeft:10, float:'right'}}>{clickedDelete ? 'Confirm' : 'Delete'}</Button>
        
        disableButton = props.disabledListing ? <Button onClick={clickedEnable ? submitEnableReq : () => setClickedEnable(!clickedEnable)} variant={clickedEnable ? 'outlined': 'text'} className={clickedEnable ? classes.confirmClick : classes.enableButton} style={{float:'right'}}>{clickedEnable? 'Confirm' : 'Enable'}</Button>        : 
        <Button onClick={clickedDisable ? submitDisableReq : () => setClickedDisable(!clickedDisable)} variant={clickedDisable ? 'outlined': 'text'} className={clickedDisable ? classes.confirmClick : classes.disableButton} style={{float:'right'}}>{clickedDisable? 'Confirm' : 'Disable'}</Button>
    }


    // avatar profile photos


    return (
        <div className={classes.root}>
            <Map center={props.zipcode} zoom={13} size="475x300" apiKey={GOOGLE_MAPS}>
                <Marker location={props.zipcode}></Marker>
            </Map>
            <div className={classes.listingDeets} style={{textAlign:'center'}}>
                <Typography color="secondary" align="center" variant="overline"> Listing Details </Typography>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    <span role="img" aria-label="house emoji">🏠</span> {props.listingTitle}
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
            <Card elevation={3} style={{paddingTop: 10}} className={classes.fieldsDiv}>
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
                <div className={classes.fieldDiv}>
                    <Typography variant='inherit'>
                    <span role="img" aria-label="bed">🛌</span> Description:&nbsp;
                    </Typography>
                    <Typography className={classes.fieldInfo} variant="inherit">
                        {props.housingInfo}
                    </Typography>
                </div>
                </Card>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    <span role="img" aria-label="handshake emoji">🤝</span> Your Housemate
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <Card elevation={3} style={{paddingTop: 10}} className={classes.fieldsDiv}>
                    <Grid container spacing={1}>
                        <Grid item xs={2} style={{display: 'flex', alignItems:'center'}}>
                            <Avatar style={{ width: 60, height: 60}} src={jordad}></Avatar>
                            {/* <Avatar style={{ width: 60, height: 60}} src={props.avatarPhoto} src={jordad}></Avatar> */}
                        </Grid>
                        <Grid item xs={10}>
                        <div>
                            <Typography variant="h6">
                                {props.ownerName}
                            </Typography>
                            <div>
                                <Typography variant="inherit">
                                    {aboutMe}&nbsp; 
                                    <Link className={classes.viewProfile} style={{color: "#2196f3"}} onClick={() => props.ownerDialogOnClick()}>
                                        View Profile
                                    </Link>
                                </Typography>    
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
                <Card elevation={3} style={{paddingBottom: 25, paddingTop: 25, display: 'flex', justifyContent: 'space-around'}} className={classes.fieldsDiv}>
                    {buttonList}
                </Card>
            </div>
            <div className={classes.fieldsDiv} style={{paddingTop:5, paddingBottom: 10, overflow: 'auto'}}>
                {cancelButton}
                {deleteButton}
                {disableButton}
            </div>
        </div>
    )
}

export default withOktaAuth(ListingDetails)
