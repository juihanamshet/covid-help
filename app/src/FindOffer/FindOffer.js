import React, { Component } from 'react';
import axios from 'axios';
import Listing from './Listing.js';
import ListingDetails from './ListingDetails.js';
import OwnerDialog from './OwnerDialog.js';

import { withStyles } from '@material-ui/styles';
import Button from 'react-bootstrap/Button';
import { Grid, Typography, SwipeableDrawer } from '@material-ui/core'
import NavBar from '../NavBar.js'
import { withOktaAuth } from '@okta/okta-react';

const BASE_URL = 'http://localhost:8080'

const styles = theme => ({
    root: { 
    },
    sidebar: {
        position: 'relative',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    spacer: {
        width: '5%'
    },
    addListing: {
        fontSize: "14!important"
    }
})

class FindOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            find: true,
            drawerOpen: false,
            findListings: [],
            offerListings: [],
            // we want curr listing to hold the various components of getListing
            currListing: {},
            currListingID: -1,
            ownerDialogOpen: false,
        }
    };

    openOwnerDialog = () => {
        this.setState({ ownerDialogOpen: true });
    }

    closeOwnerDialog = () => {
        this.setState({ ownerDialogOpen: false });
    }

    async componentDidMount() {
        console.log("compomentMounted");
        const accessToken = this.props.authState.accessToken;
        var config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            }
        };
        var self = this;
        axios.get(BASE_URL + '/getListings', config)
            .then(function (response) {
                if(self.state.find){
                    self.setState({ findListings: response.data });
                }else{
                    self.setState({ offerListings: response.data });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getListings = async() => {
        const accessToken = this.props.authState.accessToken;
        var config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            }
        };
        var self = this;
        axios.get(BASE_URL + '/getListings', config)
            .then(function (response) {
                self.setState({ findListings: response.data, find: true });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getUserListings = async() => {
        const accessToken = this.props.authState.accessToken;
        var config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            }
        };
        var self = this;
        axios.get(BASE_URL + '/getUsersListings', config)
            .then(function (response) {
                self.setState({ offerListings: response.data, find: false});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getCurrentListing = async(listingId) => {
        const accessToken = this.props.authState.accessToken;
        var config = {
            params: {
                listingID: listingId
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            }
        };
        var self = this;
        axios.get(BASE_URL + '/getListing', config)
            .then(function (response) {
                self.setState({ currListing : response.data[0],
                                drawerOpen: true });
            })
            .catch(function (error) {
                console.log(error);
        });
    }

    toggleDrawer = (open) => e => {
        if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return;
        }
        this.setState({ drawerOpen: open });
    };

    render() {
        console.log("render");
        // for styling
        const { classes } = this.props;

        // if on find tab we'll set listings to be this.state.findListings
        var listings = this.state.find ? this.state.findListings : this.state.offerListings;
        
        var currListings = [];
        listings.forEach(listing => {
            var name = listing.listingName !== null ? listing.listingName : "Unnamed Listing"
            var location = listing.city + ", " + listing.state + " " + listing.zipCode;
            currListings.push(<Listing key={listing.listingID} lgbtqpFriendly={listing.lgbtqpFriendly} accessibilityFriendly= {listing.accessibilityFriendly} listingId={listing.listingID} listingName={name} listingLocation={location} listingEmail={listing.prefEmail} onClick={this.getCurrentListing}></Listing>);
        });

        if (currListings.length < 1) {
            currListings.push(<Typography key='default' variant="subtitle1" color="error"> No Current Listings</Typography>)
        }

        /* LOGIC FOR ACTIVE PAGE */

        // styling and components for offer page
        var offerIsActive = this.state.find ? '' : 'linkIsActive';
        var listingButton = this.state.find ? '' : (<div className={classes.sidebar}><Button id='addListing' variant="link">+ Add Listing&nbsp;&nbsp;</Button></div>);

        // styling for find page
        var findIsActive = this.state.find ? 'linkIsActive' : '';

        return (
            <div className={classes.root}>
                <NavBar></NavBar>
                <style type="text/css">
                    {`
                    .btn-link {
                        color: black;
                        font-size: 50px;
                        font-weight: 300;
                    }
                    .btn-link:hover{
                        color: #90caf9;
                    }
                    #addListing {
                        color: #42a5f5;
                        font-weight: 400;
                        font-size: 25px;
                    }
                    #linkIsActive {
                        color: #42a5f5;
                        text-decoration: underline;
                    }
                    #linkIsActive:hover {
                        color: grey;
                    }
                    `}
                </style>
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justify="center"
                >
                    <Grid item xs={12}>
                        <div className={classes.sidebar}>
                            <div className={classes.sidebarChild}>
                                <Button id={findIsActive} variant="link" size="lg" onClick={(e) => this.getListings()}>Find</Button>
                            </div>
                            <div className={classes.spacer}></div>
                            <div className={classes.sidebarChild}>
                                <Button id={offerIsActive} variant="link" size="lg" onClick={(e) => this.getUserListings()}>Offer</Button>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.sidebar}>
                            {currListings}
                        </div>
                    </Grid>
                    <Grid item lg={12}>
                        {listingButton}
                    </Grid>
                </Grid>
                <SwipeableDrawer
                    anchor='right'
                    open={this.state.drawerOpen}
                    onClose={this.toggleDrawer(false)}
                    onOpen={this.toggleDrawer(true)}>
                    <ListingDetails
                        // info for the housing
                        key={this.state.currListing.listingID + Math.random()}
                        zipcode={this.state.currListing.zipCode}
                        listingTitle={this.state.currListing.listingName}
                        location={this.state.currListing.neighborhood + ", " + this.state.currListing.city + ", " + this.state.currListing.state + " (" + this.state.currListing.zipCode + ")"}
                        lgbtqpFriendly={this.state.currListing.lgbtqpFriendly}
                        accessibilityFriendly={this.state.currListing.accessibilityFriendly}
                        livingSitch={this.state.currListing.livingSituation}
                        houseRules={this.state.currListing.housingRules}
                        access={this.state.currListing.accessbilityInfo}

                        // info for the owner
                        ownerName={this.state.currListing.firstName + " " + this.state.currListing.lastName}
                        org={this.state.currListing.org}
                        gradYear={this.state.currListing.grad_year}
                        preferredContactMethod={this.state.currListing.preferredContactMethod}
                        
                        // contact info
                        contacts={{'Email': this.state.currListing.prefEmail, 'Facebook': this.state.currListing.Facebook, 'LinkedIn': this.state.currListing.LinkedIn, 'Instagram': this.state.currListing.Instagram}}

                        //learn more about owner button
                        ownerDialogOnClick={this.openOwnerDialog}
                    >
                    </ListingDetails>
                </SwipeableDrawer>
                <OwnerDialog
                    open={this.state.ownerDialogOpen}
                    handleClose={this.closeOwnerDialog}
                    name={this.state.currListing.firstName + " " + this.state.currListing.lastName}
                    gradYear={this.state.currListing.grad_year}
                    gender={this.state.currListing.gender}
                    //pronouns={this.state.currListing.pronouns}
                    ethnicity={this.state.currListing.ethnicity}
                    //bio={this.state.currListing.bio}
                    socialMedia={{'Facebook': this.state.currListing.Facebook, 'LinkedIn': this.state.currListing.LinkedIn, 'Instagram': this.state.currListing.Instagram}}
                >
                </OwnerDialog>
            </div>
        )
    }
}

export default withOktaAuth(withStyles(styles)(FindOffer));