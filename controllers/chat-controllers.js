const {UsersDb} = require('./../controllers/../models/users');
const {GroupsDb} = require('./../controllers/../models/groups');
const {Group} = require('./../controllers/../models/group');
const {User} = require('./../controllers/../models/user');
const MenuView = require('../views/menu-view');
const mainQuestion = `What do you want to do next?
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
[E] exit`;

function ChatController(){
    const id = 'Chat Controller';
    const groupsDb = new GroupsDb();
    const usersDb = new UsersDb();
    return{
        init
    };

    function init (){
        MenuView.RootMenu((answer)=>{
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
                    sendMessage('We did not understand your request');
                    init();
                    break;
            }
        }, mainQuestion);
    }

    function createNewUser() {
        let username, age, password;
        MenuView.RootMenu((answer) => {
            if (usersDb.isUserExists(answer)) {
                sendMessage("username already exist. enter a different username");
                createNewUser();
            }
            else{
                username = answer;
                getUserAge();
            }
        }, "Enter a username");
        function getUserAge(){
            MenuView.RootMenu((answer)=>{
                age = answer;
                getUserPassword();
            }, "What is your age?")
        }
        function getUserPassword(){
            MenuView.RootMenu((answer)=>{
                password = answer;
                usersDb.addUser(new User(username, age, password));
                sendMessage("User created successfully!");
                init();
            }, "Select a password")
        }
    }

    function deleteGroup(){
        MenuView.RootMenu((answer)=>{
            if(groupsDb.isGroupExists(answer)){
                if(groupsDb.deleteGroup(answer)){
                    sendMessage("Group deleted successfully");
                    init();
                }
                else {
                    sendMessage("Group does not exist");
                    init();
                }
            }
        }, "Enter the name of the group you want to delete")
    }

    function createNewGroup(){
        MenuView.RootMenu((answer)=>{
            if(groupsDb.isGroupExists(answer)){
                sendMessage("This name already exists, choose a different name");
                createNewGroup();
                return;
            }
            groupsDb.addGroup(new Group(answer));
            sendMessage("Group created successfully");
            init();
        }, "Enter a name for the group")
    }

   function printListOfGroupsAndUsersUnderEachGroup(){
       let groupsList = groupsDb.getGroupsListForPrint();
       if(groupsList.length){
           groupsList.forEach((group)=>{
               sendMessage(group.name);
               group.users.forEach((user)=>{
                   sendMessage(`\t${user.username}(${user.age})`);
               });
           });
           init();
       }
       else{
           sendMessage("Groups list is empty");
           init();
       }
   }

    function printGroupsList(){
        const groupsNamesList = groupsDb.getGroupsNamesList();
        if(groupsNamesList.length){
            groupsNamesList.forEach((groupName, i)=>{
                sendMessage(`#${i+1} ${groupName}`);
            });
            init();
            return;
        }
        sendMessage("The list is empty");
        init();
    }

    function printUsersList() {
        const userNamesList = usersDb.getUserNamesList();
        if(userNamesList.length){
            userNamesList.forEach((username, i)=>{
                sendMessage(`#${i+1} ${username}`);
            });
            init();
            return;
        }
        sendMessage("The list is empty");
        init();
    }

    function deleteUser(){
        MenuView.RootMenu((name)=>{
            if(usersDb.isUserExists(name)){
                const groupsList = groupsDb.getGroups();
                groupsList.forEach((group)=>{
                    if(group.isUserExistsInGroup(name)){
                        group.deleteUserFromGroup(name);
                    }
                });
                if(usersDb.deleteUser(name)){
                    sendMessage("User deleted successfully");
                    init();
                }
            }
            else{
                sendMessage("User does not exist");
                init();
            }
        }, "Enter the name of the user you want to delete")
    }

    function exitChat(){
        MenuView.RootMenu((answer)=>{
            if(answer === 'y'){
                rl.close();
            }
            else if(answer === 'n'){
                sendMessage("We're glad you stayed with us");
                init();
            }
        }, "Are you sure you want to exit? [y]es / [n]o");
    }

    function getUsernameAndGroupName(action) {
        let username, groupName;
        MenuView.RootMenu((answer)=>{
            username = answer;
            MenuView.RootMenu((answer)=>{
                groupName = answer;
                if(action === "add") {
                    addUserToGroup(username, groupName);
                }
                else if(action === "delete"){
                    deleteUserFromGroup(username, groupName);
                }
            }, "Enter a group name");
        }, "Enter a username");
    }

    function addUserToGroup(username, groupName){
        if(usersDb.isUserExists(username) && groupsDb.isGroupExists(groupName)){
            const selectedGroup = groupsDb.getGroup(groupName);
            if(selectedGroup.isUserExistsInGroup(username)){
                sendMessage('User already exists in this group');
                init();
                return;
            }
            const selectedUser = usersDb.getUser(username);
            selectedGroup.addUserToGroup(selectedUser);
            sendMessage(`${username} added successfully to group ${groupName}`);
            init();
        }
        else{
            sendMessage("User or group does not exist");
            init();
        }
    }

    function deleteUserFromGroup(username, groupName){
        if(usersDb.isUserExists(username) && groupsDb.isGroupExists(groupName)) {
            const selectedGroup = groupsDb.getGroup(groupName);
            if(!selectedGroup.isUserExistsInGroup(username)){
                sendMessage('User do not exists in this group');
                init();
                return;
            }
            else if(selectedGroup.deleteUserFromGroup(username)){
                sendMessage(`${username} deleted successfully from group ${groupName}`);
                init();
                return
            }
            sendMessage("Something went wrong, try again");
            init();
        }
        else{
            sendMessage("User or group does not exist");
            init();
        }
    }

    function updateUserAge(){
        let username, selectedUser, age;
        MenuView.RootMenu((name)=>{
            username = name;
            if(usersDb.isUserExists(username)){
                selectedUser = usersDb.getUser(username);
                age = selectedUser.age;
                MenuView.RootMenu((newAge)=>{
                    updateAge(newAge);
                }, "Enter the user new age");
            }
            else{
                sendMessage(`${username} do not exists`);
                init();
            }
        }, "Enter the name of the user you want to edit");

        function updateAge(newAge){
            if(newAge !== age){
                selectedUser.setAge(newAge);
                sendMessage(`${selectedUser.username} age updated from ${age} to ${newAge}`);
                init();
            }
            else{
                sendMessage(`The age is already set to ${newAge}`);
                init();
            }
        }
    }

    function updateUserPassword(){
        let username, selectedUser, passwordInDb;
        MenuView.RootMenu((name)=>{
            username = name;
            if(usersDb.isUserExists(username)){
                selectedUser = usersDb.getUser(username);
                passwordInDb = selectedUser.password;
                MenuView.RootMenu((oldPassword)=>{
                    verifyOldPassword(oldPassword);
                }, "Enter the user old password");
            }
            else{
                sendMessage(`${username} do not exists`);
                init();
            }
        }, "Enter the name of the user you want to edit");

        function verifyOldPassword(oldPassword){
            if(oldPassword === passwordInDb){
                MenuView.RootMenu((newPassword)=>{
                    updatePassword(newPassword);
                }, "Enter the user new password");
            }
            else{
                sendMessage("The password does not match the previous password");
                init();
            }
        }

        function updatePassword(newPassword){
            selectedUser.setPassword(newPassword);
            sendMessage(`${selectedUser.username}'s password was updated successfully`);
            init();
        }
    }

    function sendMessage(message){
        MenuView.sendMessage(message);
    }
}

module.exports.ChatController = ChatController;