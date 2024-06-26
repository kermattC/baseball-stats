import { Button } from 'react-bootstrap';
import { fetchPlayersList, fetchPlayerStats } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';
import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons";

{/* <Select filterOption={createFilter({ignoreAccents: false})}></Select>  */}

const PlayersList = ({ onPlayerSelect }) => {
    const loggedIn = useSelector((state) => state.login.loggedIn);
    const usernameOrEmail = useSelector((state) => state.login.username);

    const players = useSelector((state) => state.players)

    const dispatch = useDispatch();

    const [playersList, setPlayersList] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const sortPlayers = (data) => {
        const newData = data.slice().sort((a,b) => a.longName.localeCompare(b.longName))
        return newData;
    }

    const handleSelectedPlayer = (option) => {
        setSelectedOption(option);
        // console.log(`Option selected:`, option);
        // console.log("Player id: ", option.value.playerID)
        onPlayerSelect(option.value.playerID)
    };

    const handleFavPlayer = (stuff) => {
        // console.log(stuff.props.children)
        const favPlayer = stuff.props.children
        const token = localStorage.getItem('access_token');

        axios.post('/user/addFavourite', {
            username: usernameOrEmail,
            favPlayer: favPlayer
        }, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const res = response.data
            console.log("response: ", res)
        })
        .catch(error => {
            console.log("Error: ", error, response);
        })
    }


    const SelectMenuButton = (props) => {
        const { children, ...rest } = props;

        const childrenWithButton = React.Children.map(children, (child) => {    // React.Children.map allows mapping over children (haha)
            const playerName = child
            // if (React.isValidElement(child)) {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: '1' }}>{playerName}</div>
                        {/* <button style={{ marginLeft: '8px' }} disabled={!loggedIn} onClick={() => handleFavPlayer(playerName)}>Add</button> */}
                        <Button style={{ marginLeft: '8px' }} disabled={!loggedIn} onClick={() => handleFavPlayer(playerName)}>
                            {/* <FontAwesomeIcon icon={faXmark}/> */}
                            <FontAwesomeIcon icon={faHeart} />                      
                        </Button>
                    </div>
                );
            // }
            // return child;
        }
    )
     return <components.MenuList {...rest}>{childrenWithButton}</components.MenuList>;
    }

    useEffect(() => {
        dispatch(fetchPlayersList())
        .then((response) => {
            if (response.payload) {
                const sortedData = sortPlayers(response.payload.body);

                setPlayersList(sortedData.map(player => ({
                    value: player,
                    label: player.longName
                })))
            }
        })
    }, []);


    return (
        <>
            {!players.loading ? ( 
                <>
                <h5>Select a player</h5>
                    {/* <CustomSelect
                        options={playersList}
                        onButtonClick={(e) => handleClick(e)}
                    /> */}
                    <Select
                        value={selectedOption}
                        onChange={handleSelectedPlayer}
                        options={playersList}
                        // components={{CustomButton: CustomButton}}
                        components={{ MenuList: SelectMenuButton }}

                    />
                </>
            ) : null}
        </>
    );
}

export default PlayersList;
