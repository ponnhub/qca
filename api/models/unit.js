const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = mongoose.Schema.Types.ObjectId

const Unit = new Schema({
    mainGroupId:  { type: ObjectId, ref: 'Group' },
    unitName: String,
    unitNameEn: String,
    upperUnit:  { type: ObjectId, ref: 'Unit' },
    pictureUrl: String,
    groups: [{ type: ObjectId, ref: 'Group' }],
    members: [{ type: ObjectId, ref: 'User' }],
    created: Date,
    modified: Date
})

module.exports = mongoose.model('Unit', Unit)