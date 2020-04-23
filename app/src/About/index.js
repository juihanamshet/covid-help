import React, { Component } from 'react';
import Explainer from './Explainer.js';
import { withStyles } from '@material-ui/styles';
import { Typography, Grid, Card, Button } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel'
import bgImage from '../img/bedroom.jpg';
import NavBar from '../NavBar.js'
import CarouselItem from './CarouselItem.js';
import Text  from './Text.js';

const styles = theme => ({
    root: {
        background: `url(${bgImage}) no-repeat center center fixed`,
        opacity: 1,
        backgroundSize: 'cover',
        minHeight: '100vh',
    },
    infoGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleGrid: {
        marginTop: 20,
    },
    titleDiv: {
        [theme.breakpoints.up('md')]: {
            float: 'right',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        float: 'left',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'rgba(255, 166, 102, 0.9)',
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 30,

    },
    bannerTitle: {
        color: 'white',
    },
    introCard: {
        maxHeight: '75vh',
        width: '80%',
        maxWidth: '80%',
        padding: 25,
        marginLeft: 25,
        marginBottom: 50,
        marginRight: 25,
        marginTop: 50,
        overflow: 'auto',
    }
    
});

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <NavBar alt={true}></NavBar>
                    <Grid alignItems='center' wrap='wrap-reverse' container spacing={1}>
                        <Grid className={classes.infoGrid} item sm={12} md={6}>
                            <Card className={classes.introCard}>
                                <Carousel autoPlay={false} animation="slide">
                                    <CarouselItem title="About Us">
                                        <Text></Text>
                                    </CarouselItem>
                                    <CarouselItem title="How it Works">
                                        <Explainer></Explainer>
                                    </CarouselItem>
                                    <CarouselItem title="FAQ">
                                    </CarouselItem>
                                </Carousel>
                                <hr/>
                                <div style={{width: '100%', textAlign:'center'}}>
                                    <Button href="/login" variant="contained" color="primary" style={{color:'white', paddingLeft: 20, paddingRight: 20,}}> Sign Up </Button>
                                </div>
                            </Card>
                        </Grid>
                        <Grid className={classes.titleGrid} item sm={12} md={6}>
                            <div className={classes.titleDiv}>
                                <Typography className={classes.bannerTitle} variant='h2'>
                                    Aiso
                                </Typography>
                                <Typography className={classes.bannerDescription} variant='h5'>
                                    A faculty, alumni, and student housing search network.
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(About);