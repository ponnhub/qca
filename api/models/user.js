const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = mongoose.Schema.Types.ObjectId

const User = new Schema({
    userId: String,
    displayName: String,
    title: String,
    name: String,
    surname: String,
    pictureUrl: {type: String, default: 'logo192.png'},
    unit: ObjectId,
    groups: [{ type: ObjectId, ref: 'Group' }],
    reports: [{ type: ObjectId, ref: 'Report' }],
    joined: Date,
    modified: Date,
    lastLoggedIn: Date
})

module.exports = mongoose.model('User', User)