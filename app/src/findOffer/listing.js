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
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
}));

function Listing(props) {
  const classes = useStyles();

  var listingName = "default"
  listingName = props.listingName;

  var listingDetail = "For details about this listing, click 'Learn More'"
  listingDetail = props.listingDetail;

  return (
    <Card className={classes.root}>
      <CardActionArea>
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
          Apply
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

export default Listing
