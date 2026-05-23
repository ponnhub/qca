import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'

const UserCard = (props) => {

let user = props.user
  return (
    <Box
    sx={{
      p: 1,
      m: 1 }} >
        <Card sx={{ maxWidth: 160 }}  >
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="160"
                    image={user.pictureUrl}          
                    alt={user.displayName}
                    />
                <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {user.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user.joined}
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                Share
                </Button>
            </CardActions>
        </Card>

      </Box>
  )
}
export default UserCard
