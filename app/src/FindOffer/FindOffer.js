import React, { Component } from 'react';
import axios from 'axios';
import Listing from './Listing.js';
import ListingDetails from './ListingDetails.js';

import { withStyles } from '@material-ui/styles';
import Button from 'react-bootstrap/Button';
import { Grid, Typography, SwipeableDrawer } from '@material-ui/core'
import NavBar from '../NavBar.js'


const BASE_URL = 'http://localhost:8080'

const styles = theme => ({
    root: {
        margin: 15,
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
            listings: [{}],
            drawerOpen: false,
            find: true,
        }
    };

    async componentDidMount() {
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        var self = this;
        axios.get(BASE_URL + '/getListings', [config])
            .then(function (response) {
                self.setState({listings: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    toggleDrawer = (open) => e => {
        var currState = this.state.drawerOpen;
        if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return;
        }
        this.setState({ drawerOpen: open })
    };

    render() {
        // for styling
        const { classes } = this.props;

        var tempListings = [];
        this.state.listings.forEach(listing => {
            var name = listing.listingName !== null ? listing.listingName : "Unnamed Listing"
            var location = listing.city + ", " + listing.state + " (" + listing.zipCode + ")";
            tempListings.push(<Listing key={listing.listingID} listingName={name} listingLocation={location} listingEmail={listing.prefEmail} onClick={this.toggleDrawer}></Listing>);
        });

        if (tempListings.length < 1) {
            tempListings.push(<Typography variant="subtitle1" color="error"> No Current Listings</Typography>)
        }

        /* LOGIC FOR ACTIVE PAGE */

        // for offer page
        var offerIsActive = this.state.find ? '' : 'linkIsActive';
        var listingButton = this.state.find ? '' : (<div className={classes.sidebar}><Button id='addListing' variant="link">+ Add Listing&nbsp;&nbsp;</Button></div>);

        // for find page
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
                                <Button id={findIsActive} variant="link" size="lg" onClick={(e) => this.setState({ find: true })}>Find</Button>
                            </div>
                            <div className={classes.spacer}></div>
                            <div className={classes.sidebarChild}>
                                <Button id={offerIsActive} variant="link" size="lg" onClick={(e) => this.setState({ find: false })}>Offer</Button>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.sidebar}>
                            {tempListings}
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
                    <ListingDetails coordinates={[37.338207, -121.886330]}></ListingDetails>
                </SwipeableDrawer>
            </div>
        )
    }
}

export default withStyles(styles)(FindOffer);