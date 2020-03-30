import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, Paper, Grid, TextField, Button, Typography, FormControlLabel, FormGroup, FormHelperText, Checkbox, Link } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
        padding: 25,
        minWidth: 400,
    },
    closeDialog: {
        color: "gray!important",
        "&:hover": {
            textDecoration: "underline!important",
            color: "#42a5f5!important"
        }
    }
}));
 
function CreateOffer(props) {
    const classes = useStyles();

    const handleSubmit = async(e) => {
        e.preventDefault()
        
    };

    return (
        <React.Fragment>
            <Dialog
                open={props.open}
                onClose={() => props.handleClose()}
                aria-labelledby="alert-dialog-title" 
                style={{ minWidth:450 }}
            >
            <Paper className={classes.root} >
            <Link onClick={() => props.handleClose()} style={{float:"right"}} className={classes.closeDialog}>
                close
            </Link>
            <DialogTitle disableTypography={true} id="alert-dialog-title">
                <Typography variant="h5">
                    Add Listing
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} style={{ paddingBottom:20 }}>
                        <Grid item xs={12}>
                            <TextField
                                name="listingName"
                                variant="outlined"
                                required
                                fullWidth
                                id="listingName"
                                label="Listing Name"
                                autoFocus
                                helperText="Please provide a short description name for your listing. (i.e. 'My Couch')"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="street-address"
                                name="addyOne"
                                variant="outlined"
                                required
                                fullWidth
                                id="addyOne"
                                label="Address 1"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="addyTwo"
                                required
                                fullWidth
                                id="addyTwo"
                                label="Address 2"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="neighborhood"
                                fullWidth
                                id="neighborhood"
                                label="Neighborhood"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="city"
                                required
                                fullWidth
                                id="city"
                                label="City"
                                autoComplete="address-level2"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                variant="outlined"
                                name="password"
                                required
                                fullWidth
                                label="State"
                                autoComplete="state"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                variant="outlined"
                                name="zipcode"
                                required
                                fullWidth
                                label="Zipcode"
                                id="zipcode"
                                autoComplete="postal-code"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="lgbtqFriendly" color="primary" />}
                                label="LGBTQ Friendly 🏳️‍🌈"
                            />
                            <FormControlLabel
                                control={<Checkbox value="accesibilityFriendly" color="primary" />}
                                label="Accesibility Friendly ♿"
                            />
                            <FormHelperText>Find out if your space is <Link target="_blank" href="https://www.tripadvisor.com/ShowTopic-g1-i12336-k4150249-Accessibility_Checklist_for_Hotel_Accommodation-Traveling_With_Disabilities.html"> accessibility friendly here.</Link></FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="accessibilityInfo"
                                required
                                fullWidth
                                multiline
                                rows="4"
                                label="Accessibility Info"
                                id="accessibilityInfo"
                                helperText="Is the room on the first floor? stairway access?"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="livingSituation"
                                required
                                fullWidth
                                label="Living Situation"
                                id="livingSituation"
                                helperText="I.e. 'Living with my mom, 4 cats.'"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="description"
                                fullWidth
                                multiline
                                rows="4"
                                label="Description"
                                id="description"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="housingRules"
                                fullWidth
                                multiline
                                rows="4"
                                label="Housing Rules"
                                id="housingRules"
                                helper="I.e. 'Quiet hours @10pm, please do not eat the cat's filet mignon.'"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Create Listing
                    </Button>
                    </Grid>
                </form>
            </DialogContent>
            </Paper>
            </Dialog>
        </React.Fragment>
    )
}

export default CreateOffer