import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ButtonBase from '@material-ui/core/ButtonBase'

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

  var listingDetail = "default";
  listingDetail = props.listingLocation;

  var mailTo = "mailto:" + props.listingEmail;

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
              {listingDetail}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <ButtonBase>
            <Link target="_blank" href={mailTo} size="small" color="primary">
              Contact
            </Link>
          </ButtonBase>
          <Button size="small" color="primary" onClick={props.onClick(true)}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default Listing
