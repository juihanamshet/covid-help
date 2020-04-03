import React, {useState, useRef} from 'react'
import NavBar from './NavBar.js'
import InlineEdit from './InlineEdit.js'
import axios from 'axios'
import { withOktaAuth } from '@okta/okta-react';
import { Grid, Paper, Avatar, Typography, Divider, List, ListItem, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Prompt } from 'react-router'
import _ from 'lodash';


const BASE_URL = 'http://localhost:8080'

const useStyles = makeStyles(theme => ({
    root: {
        padding: 30
    },
    section: {
        marginTop: 15,
    },
    text: {
        color: "gray",
        fontWeight: 300,
    },
    listItem: {
        padddingBottom: "20px!important",
    },
    divider: {
        height: 10
    },
    edit: {
        float: 'right',
        "&:hover": {
            color: 'gray!important',
            textDecoration: 'underline!important'
        }
    },
    save: {
        float: 'right',
        color: '#F08080!important',
        "&:hover": {
            color: 'LightGreen!important',
            textDecoration: 'underline!important'
        }
    }
}));

function User(props) {
    const classes = useStyles();
    // refs for the contact information
    const prefEmail = useRef('')
    const setPrefEmail = (newVal) => {
        prefEmail.current = newVal
        console.log("newPrefEmail: ", prefEmail.current)
    }
    const phoneNumber = useRef('')
    const setPhoneNumber = (newVal) => {
        phoneNumber.current = newVal
        console.log("newPhoneNumber: ", phoneNumber.current)
    }
    const preferredContactMethod = useRef('')
    const setPreferredContactMethod = (newVal) => {
        preferredContactMethod.current = newVal
        console.log("newContactMethod: ", preferredContactMethod.current)
    }

    // refs for the basic information
    const gender = useRef('')
    const setGender = (newVal) => {
        gender.current = newVal
        console.log('newGender: ', gender.current)
    }
    const ethnicity = useRef('')
    const setEthnicity = (newVal) => {
        ethnicity.current = newVal
        console.log('newEthnicity: ', ethnicity.current)
    }
    const pp = useRef('')
    const setPp = (newVal) => {
        pp.current = newVal
        console.log('newPp: ', pp.current)
    }

    // ref for bio
    const bio = useRef('')
    const setBio = (newVal) => {
        bio.current = newVal
        console.log('newBio: ', bio.current);
    }

    // refs for socials
    const fb = useRef('')
    const setFb = (newVal) => {
        fb.current = newVal
        console.log('newFB: ', fb.current)
    }
    const ig = useRef('')
    const setIg = (newVal) => {
        ig.current = newVal
        console.log('newIG: ', ig.current)
    }
    const li = useRef('')
    const setLi = (newVal) => {
        li.current = newVal
        console.log('newLI: ', li.current)
    }

    // state for disabling account: TODO
    const [disabledAct, setDisabledAct] = useState('')


    const [user, setUser] = React.useState({});
    const [contactDisabled, setContactDisabled] = React.useState(true);
    const [basicDisabled, setBasicDisabled] = React.useState(true);
    const [bioDisabled, setBioDisabled] = React.useState(true);
    const [socialDisabled, setSocialDisabled] = React.useState(true);


    const accessToken = props.authState.accessToken;
    React.useEffect(() => {
        let config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${accessToken}`,
            }
        };
        axios.get(BASE_URL + '/getUser', config)
            .then(function (response) {
                if(_.isEqual(response.data[0], user)){
                    return;
                }
                setUser({...response.data[0]});
                //set our refs
                setPrefEmail(response.data[0].prefEmail)
                setPhoneNumber(response.data[0].phoneNumber)
                setPreferredContactMethod(response.data[0].preferredContactMethod)
                setEthnicity(response.data[0].ethnicty)
                setGender(response.data[0].gender)
                setPp(response.data[0].preferred_pronouns)
                setBio(response.data[0].bio)
                setFb(response.data[0].Facebook)
                setIg(response.data[0].Instagram)
                setLi(response.data[0].LinkedIn)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [user]);

    var school = user.org ? user.org.toUpperCase() : '';

    return (
        <div>
            <Prompt
                when={!(contactDisabled & basicDisabled & bioDisabled & socialDisabled)}
                message='You have unsaved changes, are you sure you want to leave?'
            />
            <NavBar></NavBar>
            <Grid
                className={classes.root}
                container
                spacing={2}
                alignItems="center"
                justify="center" >
                <Grid item>
                    <Paper style={{ paddingRight: 50, paddingLeft: 50, paddingTop: 25, paddingBottom: 25 }}>
                        <Grid container direction="column" alignItems="center">
                            <Grid item sm={12} className={classes.section}>
                                <Avatar style={{ height: 150, width: 150 }} src={props.avatarPhoto}></Avatar>
                            </Grid>
                            <Grid item sm={12} className={classes.section}>
                                <Typography variant="h4">{user.firstName + " " + user.lastName}</Typography>
                            </Grid>
                            <Grid item sm={12} style={{ marginTop: 5 }}>
                                <Typography className={classes.text} variant="body1">{school + " // " + user.grad_year}</Typography>
                            </Grid>
                            <Divider />
                            <Grid item sm={12} className={classes.section} style={{ minWidth: 500 }}>
                                <List>
                                    <Divider />
                                    <ListItem className={classes.listItem} style={{ display: 'block' }}>
                                        <Link className={contactDisabled ? classes.edit : classes.save} onClick={() => setContactDisabled(!contactDisabled)}><Typography variant='inherit'>{contactDisabled ? 'Edit' : 'Save'}</Typography></Link>
                                        <Typography align="left" color="primary" variant="h5">Contact Information</Typography>
                                        <InlineEdit disabled={true} label="School Email:" defaultInput={user.orgEmail}></InlineEdit>
                                        <InlineEdit disabled={contactDisabled} label="Preferred Email:" defaultInput={user.prefEmail} onChange={setPrefEmail}></InlineEdit>
                                        <InlineEdit disabled={contactDisabled} label="Phone Number:" defaultInput={user.phoneNumber} onChange={setPhoneNumber}></InlineEdit>
                                        <InlineEdit disabled={contactDisabled} label="Preferred Contact Method:" defaultInput={user.preferredContactMethod} onChange={setPreferredContactMethod}></InlineEdit>
                                    </ListItem>
                                    <div className={classes.divider}></div>
                                    <Divider />
                                    <ListItem className={classes.listItem} style={{ display: 'block' }}>
                                        <Link className={basicDisabled ? classes.edit : classes.save} onClick={() => setBasicDisabled(!basicDisabled)}><Typography variant='inherit'>{basicDisabled ? 'Edit' : 'Save'}</Typography></Link>
                                        <Typography color="primary" variant="h5">Basic Information</Typography>
                                        <InlineEdit disabled={basicDisabled} label="Ethnicity:" defaultInput={user.ethnicity} onChange={setEthnicity}></InlineEdit>
                                        <InlineEdit disabled={basicDisabled} label="Gender:" defaultInput={user.gender} onChange={setGender}></InlineEdit>
                                        <InlineEdit disabled={basicDisabled} label="Preferred Pronouns:" defaultInput={user.preferred_pronouns} onChange={setPp}></InlineEdit>
                                    </ListItem>
                                    <div className={classes.divider}></div>
                                    <Divider />
                                    <ListItem className={classes.listItem} style={{ display: 'block' }}>
                                        <Link className={bioDisabled ? classes.edit : classes.save} onClick={() => setBioDisabled(!bioDisabled)}><Typography variant='inherit'>{bioDisabled ? 'Edit' : 'Save'}</Typography></Link>
                                        <Typography color="primary" variant="h5">Bio</Typography>
                                        <InlineEdit disabled={bioDisabled} defaultInput={user.bio} onChange={setBio}></InlineEdit>
                                    </ListItem>
                                    <div className={classes.divider}></div>
                                    <Divider />
                                    <ListItem className={classes.listItem} style={{ display: 'block' }}>
                                        <Link className={socialDisabled ? classes.edit : classes.save} onClick={() => setSocialDisabled(!socialDisabled)}><Typography variant='inherit'>{socialDisabled ? 'Edit' : 'Save'}</Typography></Link>
                                        <Typography color="primary" variant="h5">Social Media</Typography>
                                        <InlineEdit disabled={socialDisabled} label="Facebook:" defaultInput={user.Facebook} onChange={setFb}></InlineEdit>
                                        <InlineEdit disabled={socialDisabled} label="Instagram:" defaultInput={user.Instagram} onChange={setIg}></InlineEdit>
                                        <InlineEdit disabled={socialDisabled} label="LinkedIn:" defaultInput={user.LinkedIn} onChange={setLi}></InlineEdit>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

            </Grid>
        </div>
    )
}

export default withOktaAuth(User)
