import React, { Component } from 'react';
import Listing from './Listing.js';
import ListingDetails from './ListingDetails.js';

import { withStyles } from '@material-ui/styles';
import Button from 'react-bootstrap/Button';
import { Grid, Typography, SwipeableDrawer } from '@material-ui/core'

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
            listings: [],
            
            drawerOpen: false,
            find: true,
        }
    };

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
            tempListings.push(<Listing onClick={this.toggleDrawer} listingName={listing} listingDetail={listing}></Listing>);
        });

        if (tempListings.length < 1) {
            console.log("no listings")
            tempListings.push(<Typography variant="subtitle1" color="error"> No Current Listings</Typography>)
        } else {
            console.log(tempListings.length)
        }

        /* LOGIC FOR ACTIVE PAGE */
        
        // for offer page
        var offerIsActive = this.state.find ? '' : 'linkIsActive';
        var listingButton = this.state.find ? '' : (<div className={classes.sidebar}><Button id='addListing' variant="link">+ Add Listing&nbsp;&nbsp;</Button></div>);

        // for find page
        var findIsActive = this.state.find ? 'linkIsActive' : '';
        
        return (
            <div className={classes.root}>
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