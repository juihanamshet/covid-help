import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, Avatar, Link, Button, IconButton } from '@material-ui/core';
import { MailOutline, Facebook, LinkedIn, Instagram } from '@material-ui/icons';
import { StaticGoogleMap as Map, Marker } from 'react-static-google-map';
import { withOktaAuth } from '@okta/okta-react';
import Carousel from 'react-material-ui-carousel'
import ModalImage from "react-modal-image";
import axios from 'axios'

const BASE_URL = 'http://localhost:8080'
const GOOGLE_MAPS = process.env.REACT_APP_GOOGLE_MAPS_API;

const MEDIA_ICONS = { Email: <MailOutline></MailOutline>, Facebook: <Facebook></Facebook>, LinkedIn: <LinkedIn></LinkedIn>, Instagram: <Instagram></Instagram> }

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 475,
    },
    listingDeets: {
        paddingTop: 10,
    },
    titleDiv: {
        paddingTop: 10,
        marginBottom: 10,
    },
    fieldsDiv: {
        paddingLeft: 15,
        paddingRight: 15,
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
    photoContainer: {
        width: 475,
        height: 300,
    },
    listingPhoto: {
        width: '100%',
        height: '300px!important',
        objectFit: 'cover'
    }
}));

function Item(props) {
    const classes = useStyles();
    return (
        <div className={classes.photoContainer}>
            <ModalImage
                className={classes.listingPhoto}
                small={props.photoURL}
                large={props.photoURL}
                hideDownload
            >
            </ModalImage>
        </div>
    )
}

// props: listingTitle, coordinates, location, livingSitch, houseRules, details (additional details), ownerName, ownerAvatar, ownerDeets, listingPhotos
function ListingDetails(props) {
    const accessToken = props.authState.accessToken;
    const classes = useStyles();
    const [clickedDelete, setClickedDelete] = useState(false);
    const [clickedDisable, setClickedDisable] = useState(false);
    const [clickedEnable, setClickedEnable] = useState(false);

    /* SET UP CAROUSEL OF USER IMAGES */
    var carouselItems = [];
    carouselItems.push(
        (<Map center={props.zipcode} zoom={13} size="475x300" apiKey={GOOGLE_MAPS} key="mapCarouselItem">
            <Marker location={props.zipcode}></Marker>
        </Map>)
    );
    var keyCount = 0;
    props.listingPhotos.forEach((photoURL) => {
        carouselItems.push(
            <Item photoURL={photoURL} key={keyCount} />
        );
        keyCount++;
    })

    /* SET UP CONTACT BUTTONS */
    var buttonList = [];
    const contacts = Object.entries(props.contacts);
    contacts.forEach((contact) => {
        // if the social media url isn't null or undefined
        if (contact[1]) {
            // key creation
            buttonList.push(<IconButton key={keyCount} target="_blank" href={contact[1]} color="primary" display='inline'>{MEDIA_ICONS[contact[0]]}</IconButton>);
            keyCount++;
        }
    });

    /* GENERAL INFO SET UP */

    // accesibility
    var accessibilityFriendly = props.accessibilityFriendly ? "Yes" : "No";
    var lgbtqpFriendly = props.lgbtqpFriendly ? "Yes" : "No";

    // location
    var location;
    location = props.neighborhood ? props.neighborhood + ', ' + props.city + ', ' + props.state + ' (' + props.zipcode + ')' : props.city + ', ' + props.state + ' (' + props.zipcode + ')'

    // form a default bio if the user is unavailable
    var aboutMe = '';
    var school = props.org.replace(/^\w/, c => c.toUpperCase());
    if (props.gradYear && props.gradYear === "faculty") { // if faculty
        aboutMe = props.bio ? props.bio : "Howdy! I'm a " + school + " " + props.gradYear + " member. I am best reached by " + props.preferredContactMethod + ". Can't wait to get to know you. "
    } else if (props.gradYear) { // if alumni or student
        aboutMe = props.bio ? props.bio : "Howdy! I'm " + school + " class of " + props.gradYear + ". I am best reached by " + props.preferredContactMethod + ". Can't wait to get to know you. "
    }

    /* LOGIC FOR ENABLE AND DISABLE BUTTONS */
    const submitDeleteReq = async () => {
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
                setClickedDelete(!clickedDelete)
                props.openSnackBar({ severity: 'success', message: 'Succesfully deleted listing!' });
                props.handleClose(false);
                props.refreshOffers();
            })
            .catch(function (error) {
                console.log(error);
                props.openSnackBar({ severity: 'error', message: 'Unable to delete listing, please try again.' });
            });
    }

    const submitDisableReq = async () => {
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
                setClickedDisable(!clickedDisable)
                props.handleClose();
                props.openSnackBar({ severity: 'success', message: 'Succesfully disabled listing!' });
                props.refreshOffers();
            })
            .catch(function (error) {
                console.log(error);
                props.openSnackBar({ severity: 'error', message: 'Unable to disable listing, please try again.' });
            });
    }

    const submitEnableReq = async () => {
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
                setClickedDisable(!clickedDisable)
                props.handleClose();
                props.openSnackBar({ severity: 'success', message: 'Succesfully enabled listing!' });
                props.refreshOffers();
            })
            .catch(function (error) {
                console.log(error);
                props.openSnackBar({ severity: 'error', message: 'Unable to enable listing, please try again.' });
            });
    }

    const cancelRequest = (e) => {
        e.preventDefault();
        setClickedDisable(false);
        setClickedDelete(false);
    }

     /* SET UP USER RIGHTS (enable, disable, delete) */
     var deleteButton = '';
     var disableButton = '';
     var cancelButton = '';
     if (props.isOwner) {
         cancelButton = (clickedDelete || clickedDisable || clickedEnable) ? <Button className={classes.cancelButton} onClick={cancelRequest}>Cancel</Button> : '';
         deleteButton = <Button onClick={clickedDelete ? submitDeleteReq : () => setClickedDelete(!clickedDelete)} variant={clickedDelete ? 'outlined' : 'text'} className={clickedDelete ? classes.confirmClick : classes.deleteButton} style={{ marginLeft: 10, float: 'right' }}>{clickedDelete ? 'Confirm' : 'Delete'}</Button>
 
         disableButton = props.disabledListing ? <Button onClick={clickedEnable ? submitEnableReq : () => setClickedEnable(!clickedEnable)} variant={clickedEnable ? 'outlined' : 'text'} className={clickedEnable ? classes.confirmClick : classes.enableButton} style={{ float: 'right' }}>{clickedEnable ? 'Confirm' : 'Enable'}</Button> :
             <Button onClick={clickedDisable ? submitDisableReq : () => setClickedDisable(!clickedDisable)} variant={clickedDisable ? 'outlined' : 'text'} className={clickedDisable ? classes.confirmClick : classes.disableButton} style={{ float: 'right' }}>{clickedDisable ? 'Confirm' : 'Disable'}</Button>
     }
 

    return (
        <div className={classes.root}>
            {props.listingPhotos.length ?
                <Carousel autoPlay={false}>
                    {
                        carouselItems.map(item => {
                            return item
                        })
                    }
                </Carousel>
                :
                <Map center={props.zipcode} zoom={13} size="475x300" apiKey={GOOGLE_MAPS}>
                    <Marker location={props.zipcode}></Marker>
                </Map>
            }
            <div className={classes.listingDeets} style={{ textAlign: 'center' }}>
                <Typography color="secondary" align="center" variant="overline"> Listing Details </Typography>
            </div>
            <div className={classes.titleDiv}>
                <Typography align="center" variant="h5">
                    <span role="img" aria-label="house emoji">🏠</span> {props.listingTitle}
                </Typography>
            </div>
            <div className={classes.fieldsDiv}>
                <Card elevation={3} style={{ paddingTop: 10 }} className={classes.fieldsDiv}>
                    <div className={classes.fieldDiv}>
                        <Typography variant="inherit">
                            <span role="img" aria-label="pin emoji">📍</span> Location:&nbsp;
                    </Typography>
                        <Typography className={classes.fieldInfo} variant="inherit">
                            {location}
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
                <Card elevation={3} style={{ paddingTop: 10 }} className={classes.fieldsDiv}>
                    <Grid container spacing={1}>
                        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar style={{ width: 60, height: 60 }} src={props.ownerPhoto}></Avatar>
                        </Grid>
                        <Grid item xs={10}>
                            <div>
                                <Typography variant="h6">
                                    {props.ownerName}
                                </Typography>
                                <div>
                                    <Typography variant="inherit">
                                        {aboutMe}&nbsp;
                                    <Link className={classes.viewProfile} style={{ color: "#2196f3" }} onClick={() => props.ownerDialogOnClick()}>
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
                <Card elevation={3} style={{ paddingBottom: 25, paddingTop: 25, display: 'flex', justifyContent: 'space-around' }} className={classes.fieldsDiv}>
                    {buttonList}
                </Card>
            </div>
            <div className={classes.fieldsDiv} style={{ paddingTop: 5, paddingBottom: 10, overflow: 'auto' }}>
                {cancelButton}
                {deleteButton}
                {disableButton}
            </div>
        </div>
    )
}

export default withOktaAuth(ListingDetails)
