import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function OwnerDialog(props) {
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.handleClose()}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    <Grid container direction="column" alignItems="center">
                        <Grid item sm={12} style={{textAlign:'center'}}>
                            <Avatar style={{}} sizes="large" src={props.avatarPhoto}></Avatar>
                        </Grid>
                        <Grid item sm={12}>
                            {props.name}
                        </Grid>
                    </Grid>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container direction="column" alignItems="center">
                            [USER INFO: subtitle GRAD YEAR, rows BIO, SOCIAL MEDIA LINKS]
                        </Grid>
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

