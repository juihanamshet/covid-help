import React, { Component, Suspense } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/styles';
import Button from 'react-bootstrap/Button';
import { Grid, Typography, SwipeableDrawer, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import NavBar from '../NavBar.js'
import { withOktaAuth } from '@okta/okta-react';

// lazy loading
const Listing = React.lazy(() => import('./Listing.js'));
const ListingDetails = React.lazy(() => import('./ListingDetails.js'));
const OwnerDialog = React.lazy(() => import('./OwnerDialog.js'));
const CreateOffer = React.lazy(() => import('./CreateOffer.js'));


const BASE_URL = 'http://localhost:8080'

const styles = theme => ({
    root: { 
        
    },
    sidebar: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexWrap: 'wrap',
    },
    spacer: {
        width: '5%'
    },
    labels: {
        fontWeight: '300!important'
    }
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class FindOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            find: true,
            drawerOpen: false,
            ownerDialogOpen: false,
            createOfferOpen: false,
            findListings: null,
            offerListings: null,
            currListings: [],
            currListing: {},
            currListingID: -1,
            // SNACKBAR severity: error, warning, success
            snackBarOpen: false,
            snackBar: {severity:'success', message:'action was a success!'},
        }
    };

    // opening the various create offers
    openOwnerDialog = () => {
        this.setState({ ownerDialogOpen: true });
    }

    closeOwnerDialog = () => {
        this.setState({ ownerDialogOpen: false });
    }

    openCreateOffer = () => {
        this.setState({ createOfferOpen: true });
    }

    closeCreateOffer = () => {
        this.setState({ createOfferOpen: false });
    }

    //given an object {severity: '', message: ''}
    openSnackBar = (newSnackBar) => {
        this.setState({ snackBarOpen: true, snackBar: newSnackBar});
    }

    closeSnackBar = () => {
        this.setState({ snackBarOpen: false });
    }

    toggleDrawer = (open) => e => {
        this.setState({ drawerOpen: open });
    };

    closeDrawer = () => {
        this.setState({ drawerOpen: false });
    }

    componentDidMount() {
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
                console.log(response.data[0])
                self.setState({ currListing : response.data[0],
                                drawerOpen: true });
            })
            .catch(function (error) {
                console.log(error);
        });
    }

    render() {
        // for styling
        const { classes } = this.props;

        // if on find tab we'll set listings to be this.state.findListings
        var listings = this.state.find ? this.state.findListings : this.state.offerListings;
        var currListings = [];
        var disabledListings = []; // we only populate this on the offers page

        if(listings){
            listings.forEach(listing => {
                var name = listing.listingName ? listing.listingName : "Unnamed Listing"
                var location = listing.city + ", " + listing.state + " " + listing.zipCode;
                // TODO: add props.ListingImage (for both disabled and curr)
                if(listing.disabledListing){ // if the listing is disabled we add to disabled listing, all else (undefined, null, false) go in currListings
                    disabledListings.push(<Listing key={listing.listingID} lgbtqpFriendly={listing.lgbtqpFriendly} accessibilityFriendly= {listing.accessibilityFriendly} listingId={listing.listingID} listingName={name} listingLocation={location} listingEmail={listing.prefEmail} onClick={this.getCurrentListing}></Listing>)
                }else{
                    currListings.push(<Listing key={listing.listingID} lgbtqpFriendly={listing.lgbtqpFriendly} accessibilityFriendly= {listing.accessibilityFriendly} listingId={listing.listingID} listingName={name} listingLocation={location} listingEmail={listing.prefEmail} onClick={this.getCurrentListing}></Listing>);
                }
            });
    
            if(currListings < 1){
                currListings.push(<Typography key="error" color="error" style={{margin: 25}}>No Current Listings!</Typography>);
            };
        }
        
        /* LOGIC FOR ACTIVE PAGE */

        // styling and components for offer page
        var offerIsActive = this.state.find ? '' : 'linkIsActive';
        var listingButton = this.state.find ? '' : <div className={classes.sidebar}><Button id='addListing' variant="link" onClick={this.openCreateOffer}>+ Add Listing&nbsp;&nbsp;</Button></div>;

        // styling for find page
        var findIsActive = this.state.find ? 'linkIsActive' : '';

        var prefEmail = this.state.currListing.prefEmail ?  this.state.currListing.prefEmail : this.state.currListing.orgEmail;

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
                        color: #aaa9ad;
                    }
                    #addListing {
                        color: #6699ff;
                        font-weight: 400;
                        font-size: 25px;
                    }
                    #linkIsActive {
                        color: #6699ff;
                        text-decoration: underline;
                    }
                    #linkIsActive:hover {
                        color: #99bbff;
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
                    <Grid item lg={12}>
                        {listings && listings.length ? listingButton : ''}
                    </Grid> 
                    <Grid item xs={12}>
                        { listings  ? 
                        <Suspense fallback={(<div className={classes.sidebar}>Loading...</div>)}>
                            { this.state.find || !listings.length ? '' : <div><hr/></div> }
                            { this.state.find || !listings.length ? '' : <div className={classes.sidebar}><Typography className={classes.labels} color="secondary" variant="h4">Active</Typography></div>}
                            <div className={classes.sidebar}>{currListings}</div>
                            { this.state.find || !listings.length ? '' : <div><hr/></div> }
                            { this.state.find || !disabledListings.length ? '' : <div className={classes.sidebar}><Typography className={classes.labels} color="secondary" variant="h4">Disabled</Typography></div>}
                            <div className={classes.sidebar}>{disabledListings}</div>
                            { this.state.find || !disabledListings.length ? '' : <div><hr/></div> }
                        </Suspense>: 
                        <div className={classes.sidebar}><CircularProgress size={50}/></div>
                        }
                    </Grid>
                    <Grid item lg={12} style={{ marginBottom:15 }}>
                        {listingButton}
                    </Grid>
                </Grid>
                <SwipeableDrawer
                    anchor='right'
                    open={this.state.drawerOpen}
                    onClose={this.toggleDrawer(false)}
                    onOpen={this.toggleDrawer(true)}>
                    <Suspense fallback={<CircularProgress />}>
                        <ListingDetails
                            // if this is user owned listing
                            isOwner={!this.state.find}
                            disabledListing={this.state.currListing.disabledListing}
                            // info for the housing
                            listingId = {this.state.currListing.listingID}
                            key={this.state.currListing.listingID + Math.random()}
                            zipcode={this.state.currListing.zipCode}
                            listingTitle={this.state.currListing.listingName}
                            location={this.state.currListing.neighborhood + ", " + this.state.currListing.city + ", " + this.state.currListing.state + " (" + this.state.currListing.zipCode + ")"}
                            lgbtqpFriendly={this.state.currListing.lgbtqpFriendly}
                            accessibilityFriendly={this.state.currListing.accessibilityFriendly}
                            livingSitch={this.state.currListing.livingSituation}
                            houseRules={this.state.currListing.housingRules}
                            access={this.state.currListing.accessbilityInfo}
                            housingInfo={this.state.currListing.housingInfo}
                            //TODO: add props.listingImages

                            // info for the owner
                            ownerName={this.state.currListing.firstName + " " + this.state.currListing.lastName}
                            org={this.state.currListing.org}
                            gradYear={this.state.currListing.grad_year}
                            preferredContactMethod={this.state.currListing.preferredContactMethod}
                            bio={this.state.currListing.bio}
                            
                            // contact info
                            contacts={{'Email': "mailto:"+ prefEmail, 'Facebook': this.state.currListing.Facebook, 'LinkedIn': this.state.currListing.LinkedIn, 'Instagram': this.state.currListing.Instagram}}

                            //learn more about owner button
                            ownerDialogOnClick={this.openOwnerDialog}

                            // for snackbar and reload
                            openSnackBar={this.openSnackBar}
                            refreshOffers={this.getUserListings}
                            handleClose={this.closeDrawer}
                        >
                        </ListingDetails>
                    </Suspense>
                </SwipeableDrawer>
                <Suspense fallback={<CircularProgress />}>
                    <OwnerDialog
                        open={this.state.ownerDialogOpen}
                        handleClose={this.closeOwnerDialog}
                        name={this.state.currListing.firstName + " " + this.state.currListing.lastName}
                        gradYear={this.state.currListing.grad_year}
                        gender={this.state.currListing.gender}
                        pronouns={this.state.currListing.preferred_pronouns}
                        ethnicity={this.state.currListing.ethnicity}
                        bio={this.state.currListing.bio}
                        socialMedia={{'Facebook': this.state.currListing.Facebook, 'LinkedIn': this.state.currListing.LinkedIn, 'Instagram': this.state.currListing.Instagram}}
                    >
                    </OwnerDialog>
                </Suspense>
                <Suspense fallback={<CircularProgress />}>
                    <CreateOffer
                        open={this.state.createOfferOpen}
                        handleClose={this.closeCreateOffer}
                        openSnackBar={this.openSnackBar}
                        refreshOffers={this.getUserListings}
                    >
                    </CreateOffer>
                </Suspense>
                <Snackbar open={this.state.snackBarOpen} autoHideDuration={6000} onClose={() => this.closeSnackBar()}>
                    <Alert onClose={() => this.closeSnackBar()} severity={this.state.snackBar.severity}>
                        {this.state.snackBar.message}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

export default withOktaAuth(withStyles(styles)(FindOffer));