import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

const MAPTILER_ACCESS_TOKEN = 'prxcBM7GNRKVr9ucT9no';
const MAP_ID = '9ddbdaa1-4ce7-48c2-a288-d73cddca9aac';

const useStyles = makeStyles(theme => ({
    root: {

    },
    spacer: {
        height: 15
    },
}));

// props: map coordinates, 
function ListingDetails(props) {
    const classes = useStyles();

    const [coor, setCoor] = useState(props.coordinates);

    function mapTilerProvider(x, y, z, dpr) {
        return `https://api.maptiler.com/maps/${MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`
    }


    return (
        <div>
            <Map mouseEvents={false} touchEvents={false} center={coor} zoom={12} width={400} height={300}>
                <Marker anchor={coor} payload={4}></Marker>
            </Map>
            <div className={classes.spacer}></div>
        </div>
    )
}

export default ListingDetails
