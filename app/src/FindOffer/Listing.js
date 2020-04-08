import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  base: {
    margin: 15,
  },
  root: {
    minWidth: 325,
    maxWidth: 350,
  },
  media: {
    height: 200,
  },
}));

// props: onClick, 
function Listing(props) {
  const classes = useStyles();

  var listingName = "default"
  listingName = props.listingName.length > 16 ? props.listingName.substring(0, 15)+ "..." : props.listingName;

  var listingDetail = "default";
  listingDetail = props.listingLocation;

  var lgbtqpFriendly = props.lgbtqpFriendly ? "🏳️‍🌈" : "";
  var accessFriendly = props.accessibilityFriendly ? "♿" : "";

  return (
    <div className={classes.base}>
      <Card elevation={3} className={classes.root}>
        <CardActionArea onClick={() => props.onClick(props.listingId)}>
          <CardMedia
            className={classes.media}
            image={require("../img/noListingImages.jpg")}
            title="Location Not Found"
          />
          <CardContent>
            <Grid
              container
              justify="space-between">
              <Grid item>
                <Typography align='right' display='inline' gutterBottom variant="h5">
                  {listingName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='right' display='inline' variant="h6">
                  {lgbtqpFriendly + " " + accessFriendly}
                </Typography >
              </Grid>
            </Grid>
            <Typography variant="body2" color="textSecondary" component="p">
              {listingDetail}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button component="a" target="_blank" href={`mailto:${props.listingEmail}`} size="small" color="primary">
            Contact
          </Button>
          <Button size="small" color="primary" onClick={() => props.onClick(props.listingId)}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default Listing
