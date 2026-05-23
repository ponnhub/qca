import { Snackbar, Stack, Typography } from '@mui/material'
import Page from 'material-ui-shell/lib/containers/Page'
import LoadingButton from '@mui/lab/LoadingButton';


import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'

//icons
import AddIcon from '@mui/icons-material/Add';
import {
  SyncAlt as UpdateIcon,
  Delete as DeleteIcon} from '@mui/icons-material';
import CustomSelect from 'components/Select/Select';

import HttpService from 'services/HttpService';
const httpService = new HttpService()

const Api = () => {
  const intl = useIntl()
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('user');

  const [units, setunits] = useState([]);
  const [unitId, setUnitId] = useState('unit');


  const [open, setopen] = useState(false);
  const [message, setmessage] = useState('');

  const snackbar = () => {
    return (<Snackbar
      open={open}
      autoHideDuration={1000}
      message={message}
      onClose={()=> { setopen(false)}}
    />)
  }

  useEffect(() => {

    async function getAllUsers() {
      httpService.getAllUsers().then(users => {
        if (users.length) {
          setUsers(users) //.map((user) => ({ label: name, value: name })));
          let user = users[0]
          if (user) setUserId(user.userId)
        }
      });

    }

    if (!users.length) getAllUsers()

    if (!units.length) httpService.getAllUnits().then(array => {
      if (array.length) {
        setunits(array) //.map((user) => ({ label: name, value: name })));
        let unit = array[0]
        if (unit) setUnitId(unit._id)
      }
    })

    return () => {
      setUsers([])
      setunits([])
    };
  }, []);

  const userChanged = (event) => {

    setUserId(event.target.value)

  }


  const addUser = () => {


    let user = {
      userId: crypto.randomUUID(),
      displayName: 'User ' + Date.now(),
      joined: Date.now()
    }

    httpService.upsertUser(user)
    .then(async user => {

      httpService.getAllUsers()
      .then(array => {
        setUsers(array)
        if (user) setUserId(user.userId)
      })
    })

  }

  const updateUser = () => {


    let body = {
      userId: userId,
      unit: unitId,
      modified: Date.now()
    }
    // console.log(body);

    httpService.upsertUser(body)
    .then(async user => {
      console.log(user);      
    })

  }

  const deleteUser = () => {

  }


  const unitChanged = () => {

  }

  const updateUserUnit = () => {


    httpService.updateUserUnit(userId, unitId)
    .then(async result => {

      // console.log(result);
      setmessage('done updating')
      setopen(result.ok)    

  
      
    })

  }

  const addUnit = () => {


    let unit = {
      // id: crypto.randomUUID(),
      unitName: 'Unit ' + Date.now(),
      created: Date.now()
    }

    httpService.upsertUnit(unit)
    .then(async unit => {

      httpService.getAllUnits()
      .then(array => {
        setunits(array)
        if (unit) setUnitId(unit._id)
      })
    })

  }

  const updateUnit = () => {

  }

  const deleteUnit = () => {

  }


  return (
    <Page pageTitle={intl.formatMessage({ id: 'api' })}>
      <Stack>
        <Typography variant='h6'>Unit</Typography>
          <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
            {units.length ? <CustomSelect value={unitId} changeHandler={unitChanged} data={units.map(unit => ({id: unit._id, label: unit.unitName}))} />
          : <></>}
          <Stack direction='row' spacing={{ xs: 1, sm: 2, md: 4 }} >
              <LoadingButton
                size="small"
                onClick={addUnit}
                loading={false}
                endIcon={<AddIcon />}
                loadingPosition="end"
                variant="contained"
              >Add</LoadingButton>
          <LoadingButton
                size="small"
                onClick={updateUnit}
                loading={false}
                endIcon={<UpdateIcon />}
                loadingPosition="end"
                variant="contained"
              >Update</LoadingButton>
          <LoadingButton
                size="small"
                onClick={deleteUnit}
                loading={false}
                endIcon={<DeleteIcon />}
                loadingPosition="end"
                variant="contained"
              >Delete</LoadingButton>
              </Stack>
              
          
      </Stack>
    </Stack>

    <Stack>
        <Typography variant='h6'>User</Typography>
          <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
            {users.length ? <CustomSelect value={userId} changeHandler={userChanged} data={users.map(user => ({id: user.userId, label: user.displayName}))} />
          : <></>}
          <Stack direction='row' spacing={{ xs: 1, sm: 2, md: 4 }} >
              <LoadingButton
                size="small"
                onClick={addUser}
                loading={false}
                endIcon={<AddIcon />}
                loadingPosition="end"
                variant="contained"
              >Add</LoadingButton>
          <LoadingButton
                size="small"
                onClick={updateUserUnit}
                loading={false}
                endIcon={<UpdateIcon />}
                loadingPosition="end"
                variant="contained"
              >Update</LoadingButton>
          <LoadingButton
                size="small"
                onClick={deleteUser}
                loading={false}
                endIcon={<DeleteIcon />}
                loadingPosition="end"
                variant="contained"
              >Delete</LoadingButton>
              </Stack>
              
          
      </Stack>
    </Stack>
    {snackbar()}


    </Page>
  )
}
export default Api
