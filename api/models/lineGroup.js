var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var lineGroup = new Schema({
    groupId: String,
    authorized: Boolean,
    joined: String,
    demo: Boolean,
    name: {type: String,
        default: 'กลุ่มผู้ใช้งาน'},
    members: [{
        type: ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('LineGroup', lineGroup);