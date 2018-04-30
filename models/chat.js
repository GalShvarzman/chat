const {UsersDb} = require('./users');
const {GroupsDb} = require('./groups');

function Chat(){
    const groupsDb = new GroupsDb();
    const usersDb = new UsersDb();

    return{
        groupsDb,
        usersDb
    }
}

module.exports.Chat = Chat;