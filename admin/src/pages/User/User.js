import { Box, Paper, Snackbar, Stack, Typography } from '@mui/material'
import Page from 'material-ui-shell/lib/containers/Page'
import { io } from "socket.io-client";

import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'

//icons

import HttpService from 'services/HttpService';
import UserCard from 'components/User/UserCard';
const httpService = new HttpService()

const User = () => {

    const [users, setUsers] = useState([]);

    const intl = useIntl()
    const hostname = window.location.href.split(":")[1]
    const socket = io(`http:${hostname}:3001/userns`, {
        
    });

  useEffect(() => {

    async function getAllUsers() {
        httpService.getAllUsers().then(users => {
          if (users.length) setUsers(users.reverse())
        });
      }
  
      const state = document.visibilityState;
      console.log(state);

    document.addEventListener('visibilitychange', () => {
        console.log(document.visibilityState);
        socket.emit("visibleChanged", {
            id: socket.id,
            visible: document.visibilityState
        });
    });

      if (!users.length) getAllUsers()

    socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        // socket.emit("joinRoom", { id: socket.id });
        
      });

    const insertUserHandler = (user) => setUsers((users) => ([user, ...users]))
    socket.on("user:insert", insertUserHandler);

    const updateUserHandler = (change) => {}
    socket.on("user:update", updateUserHandler);


    return () => {
        socket.off("user:insert")
        socket.off("user:update")
        // socket.removeAllListeners();
        // socket.close()
    };

  }, []);
  

  return (
    <Page pageTitle={intl.formatMessage({ id: 'user' })}>
      <Stack>
        <Typography variant='h6'>{'Total Users: ' + users.length}</Typography>

        <Box 
            sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,            
            justifyContent: 'space-evenly' }} >
                {users.map(user => <UserCard  user={user} />)}
            
        </Box>
          
    </Stack>


    </Page>
  )
}
export default User
