import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import { Facebook, LinkedIn, Instagram } from '@material-ui/icons';

const MEDIA_ICONS = {Facebook: <Facebook></Facebook>, LinkedIn: <LinkedIn></LinkedIn>, Instagram: <Instagram></Instagram>}

const useStyles = makeStyles(theme => ({
    listItem: {
        display: 'block',
    },
    pp: {
        height: 150,
        width: 150,
    },
    body: {
        fontWeight: 300
    }

}));

function OwnerDialog(props) {
    const classes = useStyles();

    var buttonList = [];
    var keyCount = 0;
    var contacts = Object.entries(props.socialMedia);
    contacts.forEach(function (contact) {
        if(contact[1] !== null){
            buttonList.push(<IconButton key={keyCount} color="primary" display='inline'>{MEDIA_ICONS[contact[0]]}</IconButton>);
            keyCount++;
        }
    });
    var pronouns = (props.pronouns === null || props.pronouns === undefined) ? 'N/A' : props.pronouns;
    var gender = (props.gender === null || props.gender === undefined) ? 'N/A' : props.gender;

    var identity = pronouns + " | " + gender;
    var ethnicity = (props.gender === null || props.gender === undefined) ? "N/A" : props.ethnicity;
    var bio = (props.bio === null || props.bio === undefined) ? "User doesn't have a bio!" : props.bio;

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.handleClose()}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    <Grid container direction="column" alignItems="center">
                        <Grid item sm={12} style={{ textAlign: 'center' }}>
                            <Avatar className={classes.pp} sizes="large" src={props.avatarPhoto}></Avatar>
                        </Grid>
                        <Grid item sm={12}>
                            <Typography variant="h4">{props.name}</Typography>
                        </Grid>
                    </Grid>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                            <List>
                                <ListItem className={classes.listItem}>
                                    <Typography color="primary" variant="h5">
                                        Grad Year/Position
                                    </Typography>
                                    <Typography variant="body1" className={classes.body}>
                                        {props.gradYear}
                                    </Typography>
                                </ListItem>
                                <Divider/>
                                <ListItem className={classes.listItem}>
                                    <Typography color="primary" variant="h5">
                                        Gender & Preferred Pronouns
                                    </Typography>
                                    <Typography>
                                        {identity}
                                    </Typography>
                                </ListItem>
                                <Divider/>
                                <ListItem className={classes.listItem}>
                                    <Typography color="primary" variant="h5">
                                        Ethnicity
                                    </Typography>
                                    <Typography>
                                        {ethnicity}
                                    </Typography>
                                </ListItem>
                                <Divider/>
                                <ListItem className={classes.listItem}>
                                    <Typography color="primary" variant="h5">
                                        Bio
                                    </Typography>
                                    <Typography>
                                        {bio}
                                    </Typography>
                                </ListItem>
                                <Divider/>
                                <ListItem className={classes.listItem}>
                                    <Typography color="primary" variant="h5">
                                        Social Media
                                    </Typography>
                                    {buttonList}
                                </ListItem>
                            </List>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.handleClose()} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default OwnerDialog

