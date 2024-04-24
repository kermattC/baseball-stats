import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Favourites = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [favPlayers, setFavPlayers] = useState([])

    // getting players
    // write a function that makes an axios fetch to the backend to get the player's favourite players
    // axios fetch with username -> get user's favourite players from mongo db -> display them here for starters
    const getFavPlayers = () => {
        
        // const allCookies = document.cookie;
        // console.log(allCookies)

        axios.get('/user/getFavourites')
        .then(response => {
            console.log("Authentication successful. User is logged in. Response: ", response)
            setUsername(response.data.username)
            setAuthenticated(true)
            // console.log("Pulling up favourite players. response: ", response)

        })
        .catch(function (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    console.log("Authentication failed. Is the user logged in?")

                    setAuthenticated(false)
                }
            }
            // if (error.response.status === 403) {
            //     // console.log('err data: ', error.response.data);
            //     // console.log('err status: ', error.response.status);
            //     // console.log('err headers: ', error.response.headers);

            // }
        })
    }

    useEffect(() => {
        getFavPlayers();
        // if (document.cookie) {
        //     setAuthenticated(true);
        // }
    }, []);


    // CRUD operations
    // here the user can make changes to their favourite players
    // Add new ones, update and delete
    return (
        <>
            { authenticated ? 
                <h2>Welcome {username}, here are your favourite players.</h2>
            
            : <h2>Error 403 - Are you logged in?</h2>}
        </>
    )
}

export default Favourites;