const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const {UsersDb} = require('./models/users');
const {GroupsDb} = require('./models/groups');
const {Group} = require('./models/group');
const {User} = require('./models/user');

const usersDb = new UsersDb();
const groupsDb = new GroupsDb();

whatDoYouWantToDoNext();

function whatDoYouWantToDoNext(){
    rl.question(
        `What do you want to do next?
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
` , main);

    function main(answer){
        switch (answer) {
            case 'NU':
                createNewUser();
                break;
            case 'DU':
                deleteUser();
                break;
            case 'PU':
                printUsersList();
                break;
            case 'UA':
                updateUserAge();
                break;
            case 'UP':
                updateUserPassword();
                break;
            case 'NG':
                createNewGroup();
                break;
            case 'DG':
                deleteGroup();
                break;
            case 'PG':
                printGroupsList();
                break;
            case 'AUG':
                getUsernameAndGroupName("add");
                break;
            case 'DUG':
                getUsernameAndGroupName("delete");
                break;
            case 'PGU':
                printListOfGroupsAndUsersUnderEachGroup();
                break;
            case 'E':
                exitChat();
                break;
            default:
                console.log('We did not understand your request');
                whatDoYouWantToDoNext();
                break;
        }
    }
}

function updateUserPassword(){
    let username, selectedUser, passwordInDb;
    rl.question("Enter the name of the user you want to update\n", userPassword);

    function userPassword(name){
        username = name;
        if(usersDb.isUserExists(username)){
            selectedUser = usersDb.getUser(username);
            passwordInDb = selectedUser.password;
            rl.question("Enter the user old password\n", verifyOldPassword)
        }
        else{
            console.log(`${username} do not exists`);
            whatDoYouWantToDoNext();
        }
    }
    function verifyOldPassword(oldPassword){
        if(oldPassword === passwordInDb){
            rl.question("Enter the user new password\n", updatePassword)
        }
        else{
            console.log("The password does not match the previous password");
            whatDoYouWantToDoNext();
        }
    }
    function updatePassword(newPassword){
        selectedUser.setPassword(newPassword);
        console.log(`${selectedUser.username}'s password was updated successfully`);
        whatDoYouWantToDoNext();
    }
}

function updateUserAge(){
    let username, selectedUser, age;
    rl.question("Enter the name of the user you want to update\n", userAge);

    function userAge(name) {
        username = name;
        if(usersDb.isUserExists(username)){
            selectedUser = usersDb.getUser(username);
            age = selectedUser.age;
            rl.question("Enter the user new age\n", updateAge)
        }
        else{
            console.log(`${username} do not exists`);
            whatDoYouWantToDoNext();
        }
    }
    function updateAge(newAge){
        if(newAge !== age){
            selectedUser.setAge(newAge);
            console.log(`${selectedUser.username} age updated from ${age} to ${newAge}`);
            whatDoYouWantToDoNext();
        }
        else{
            console.log(`The age is already set to ${newAge}`);
            whatDoYouWantToDoNext();
        }
    }
}

function deleteUserFromGroup(username, groupName){
    if(usersDb.isUserExists(username) && groupsDb.isGroupExists(groupName)) {
        const selectedGroup = groupsDb.getGroup(groupName);
        if(!selectedGroup.isUserExistsInGroup(username)){
            console.log('User do not exists in this group');
            whatDoYouWantToDoNext();
            return;
        }
        else if(selectedGroup.deleteUserFromGroup(username)){
            console.log(`${username} deleted successfully from group ${groupName}`);
            whatDoYouWantToDoNext();
            return
        }
        console.log("Something went wrong, try again");
        whatDoYouWantToDoNext();
    }
    else{
        console.log("User or group does not exist");
        whatDoYouWantToDoNext();
    }
}

function addUserToGroup(username, groupName){
    if(usersDb.isUserExists(username) && groupsDb.isGroupExists(groupName)){
        const selectedGroup = groupsDb.getGroup(groupName);
        if(selectedGroup.isUserExistsInGroup(username)){
            console.log('User already exists in this group');
            whatDoYouWantToDoNext();
            return;
        }
        const selectedUser = usersDb.getUser(username);
        selectedGroup.addUserToGroup(selectedUser);
        console.log(`${username} added successfully to group ${groupName}`);
        whatDoYouWantToDoNext();
    }
    else{
        console.log("User or group does not exist");
        whatDoYouWantToDoNext();
    }
}

function getUsernameAndGroupName(action){
    let username, groupName;
    rl.question('Enter a username\n', whichGroup);
    function whichGroup(name){
        username = name;
        rl.question('Enter a group name\n', onFinnish);
    }
    function onFinnish(group){
        groupName = group;
        if(action === "add") {
            addUserToGroup(username, groupName);
        }
        else if(action === "delete"){
            deleteUserFromGroup(username, groupName);
        }
    }
}


function exitChat(){
    rl.question('Are you sure you want to exit? [y]es / [n]o\n', (answer)=>{
        if(answer === 'y'){
            rl.close();
        }
        else if(answer === 'n'){
            console.log("We're glad you stayed with us");
            whatDoYouWantToDoNext();
        }
    });
}

function deleteUser(){
    rl.question('enter the username you want to delete\n', (name)=>{
        const usersArray = usersDb.getUsersArray();
        if(usersArray.length){
            if(usersDb.isUserExists(name)){
                const groupsArray = groupsDb.getGroupsArray();
                groupsArray.forEach((group)=>{
                    if(group.isUserExistsInGroup(name)){
                        group.deleteUserFromGroup(name);
                    }
                });
                if(usersDb.deleteUser(name)){
                    console.log("User deleted successfully");
                    whatDoYouWantToDoNext();
                }
            }
            else{
                console.log("User does not exist");
                whatDoYouWantToDoNext();
            }
        }
        console.log("The list is empty");
        whatDoYouWantToDoNext();
    });
}

function printUsersList(){
    const userNamesArray = usersDb.getUserNamesArray();
    if(userNamesArray.length){
        userNamesArray.forEach((username, i)=>{
            console.log(`#${i+1} ${username}`);
        });
        whatDoYouWantToDoNext();
        return;
    }
    console.log("The list is empty");
    whatDoYouWantToDoNext();
}

function printGroupsList(){
    const groupsArray = groupsDb.getGroupsArray();
    if(groupsArray.length){
        const groupsNamesArray = groupsDb.getGroupsNamesArray();
        groupsNamesArray.forEach((groupName, i)=>{
            console.log(`#${i+1} ${groupName}`);
        });
        whatDoYouWantToDoNext();
        return;
    }
    console.log("The list is empty");
    whatDoYouWantToDoNext();
}

function printListOfGroupsAndUsersUnderEachGroup(){
    let groupsArray = groupsDb.getGroupsArray();
    groupsArray.forEach((group)=>{
        console.log(group.name);
        const groupUsers = group.getGroupUsersArray();
        groupUsers.forEach((user)=>{
            console.log(`\t${user.username}(${user.age})`);
        })
    });
    whatDoYouWantToDoNext();
}

function createNewGroup(){
    rl.question('Enter a name for the group\n', groupName);
    function groupName(name){
        if(groupsDb.isGroupExists(name)){
            console.log("This name already exists, choose a different name");
            createNewGroup();
            return;
        }
        groupsDb.addGroup(new Group(name));
        console.log("Group created successfully");
        whatDoYouWantToDoNext();
    }
}

function deleteGroup(){
    rl.question('enter the name of the group you want to delete\n', (name)=>{
        let groupsArray = groupsDb.getGroupsArray();
        if(groupsArray.length){
            if(groupsDb.deleteGroup(name)){
                console.log("Group deleted successfully");
                whatDoYouWantToDoNext();
                return;
            }
            console.log("Group does not exist");
            whatDoYouWantToDoNext();
        }
        console.log("The list is empty");
        whatDoYouWantToDoNext();
    });
}

function createNewUser(){
    let username, age, password;
    rl.question('Enter a username\n', ageQuestion);
    function ageQuestion(name){
        if(usersDb.isUserExists(name)){
            console.log("username already exist. enter a different username");
            createNewUser();
            return;
        }
        username = name;
        rl.question('what is your age?\n', passwordQuestion)
    }
    function passwordQuestion(userAge){
        age = userAge;
        rl.question('Select a password?\n', finish)
    }
    function finish(userPassword){
        password = userPassword;
        usersDb.addUser(new User(username, age, password));
        console.log("User created successfully!");
        whatDoYouWantToDoNext();
    }
}