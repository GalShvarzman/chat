const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function RootMenu(callback) {
    rl.question(`What do you want to do next?
[NU] Create new user,
[DU] delete user,
[PU] print users list
[UA] update user age,
[UP] update user password,
[NG] create new group,
[DG] delete group,
[PG] print groups list,
[AUG] add user to group,
[DUG] delete user from group,
[PGU] Print a list of groups and users under each group,
[E] exit
`, function (answer) {
        waitForAnAnswer(answer, callback, RootMenu)
        //     if (!answer) {
        //         console.log('Well, I need an answer..');
        //         return RootMenu(callback);
        //     }
        //     callback(answer);
        // });
    })
}

function GetUserName(callback){
    rl.question(`Enter a username\n`, function(answer){
        waitForAnAnswer(answer, callback, GetUserName);
    })
}

function waitForAnAnswer(answer, callback, func){
    if (!answer) {
        console.log('Well, I need an answer..');
        return func(callback);
    }
    callback(answer);
}

module.exports = {
    RootMenu,
    GetUserName
};