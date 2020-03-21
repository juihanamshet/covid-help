import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  base:{
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
  listingName = props.listingName;

  var listingDetail = "For details about this listing, click 'Learn More'";
  listingDetail = props.listingDetail;

  return (
    <div className={classes.base}>
      <Card className={classes.root}>
        <CardActionArea onClick={props.onClick(true)}>
          <CardMedia
            className={classes.media}
            image={require("../img/location_not_found-claraMacDonell.png")}
            title="Location Not Found"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {listingName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {props.listingDetail}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Contact
          </Button>
          <Button size="small" color="primary" onClick={props.onClick(true)}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default Listing
