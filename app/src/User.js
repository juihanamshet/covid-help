import React from 'react'
import NavBar from './NavBar.js'
import axios from 'axios'
import { withOktaAuth } from '@okta/okta-react';

const BASE_URL = 'http://localhost:8080'

function User(props) {
    const [user, setUser] = React.useState({});
    const accessToken = props.authState.accessToken;

    React.useEffect(() => {
        let mounted = true;
        const loadData = async() => {
            let config = {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
    
            axios.get(BASE_URL + '/getUser', config)
            .then(function (response) {
                if(mounted){
                    console.log(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        };
        loadData();

        return () => {
            // When cleanup is called, toggle the mounted variable to false
            mounted = false;
      };
    });

    return (
        <div>
            <NavBar></NavBar>
            howdy
        </div>
    )
}

export default withOktaAuth(User)
