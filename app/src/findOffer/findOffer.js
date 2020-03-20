import React, { Component } from 'react';
import Listing from './Listing.js';

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
    }
})

class findOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listings: [1, 2, 3, 4, 5, 6],
            drawerOpen: false,
        }
    }
    render() {
        // for styling
        const { classes } = this.props;

        var tempListings = [];
        this.state.listings.forEach(listing => {
            // tempListings.push(<Listing listingName={listing} listingDetail={listing}></Listing>);
        })
        if (tempListings.length < 1){
            console.log("no listings")
            tempListings.push(<Typography variant="subtitle1" color="error"> No Current Listings</Typography>)
        }else{
            console.log(tempListings.length)
        }
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
                        color: #a9a9a9;
                    }
                    `}
                </style>
                <Grid
                container 
                spacing={2}
                alignItems="center"
                justify="center"
                >
                    <Grid item lg={12}>
                        <div className={classes.sidebar}>
                            <div className={classes.sidebarChild}>
                                <Button variant="link" size="lg" >Find</Button>
                            </div>
                            <div className={classes.spacer}></div>
                            <div className={classes.sidebarChild}>
                                <Button variant="link" size="lg">Offer</Button>
                            </div>
                        </div>
                    </Grid>
                    <Grid item lg={12}>
                        <div className={classes.sidebar}>
                            {tempListings}
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(findOffer);