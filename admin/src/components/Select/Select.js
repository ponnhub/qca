import { MenuItem, Select } from '@mui/material'
import React from 'react'

const CustomSelect = (props) => {

  return (
    <Select
        size="small"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.value}
        label="User"
        onChange={props.changeHandler}
        // onChange={e => setValue(e.currentTarget.value)}
      >
        {props.data.map(item => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}

  </Select>
  )
}
export default CustomSelect
