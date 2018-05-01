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

    function init(){
        mainMenu();
    }

    function mainMenu (){
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
                    mainMenu();
                    break;
            }
        }, mainQuestion);
    }

    function createNewUser() {
        let username, age, password;
        MenuView.RootMenu((name) => {
            if (usersDb.isUserExists(name)) {
                sendMessage("username already exist. enter a different username");
                createNewUser();
            }
            else{
                username = name;
                getUserAge();
            }
        }, "Enter a username");
        function getUserAge(){
            MenuView.RootMenu((userAge)=>{
                age = userAge;
                getUserPassword();
            }, "What is your age?")
        }
        function getUserPassword(){
            MenuView.RootMenu((userPassword)=>{
                password = userPassword;
                usersDb.addUser(new User(username, age, password));
                sendMessage("User created successfully!");
                mainMenu();
            }, "Select a password")
        }
    }

    function deleteGroup(){
        MenuView.RootMenu((groupName)=>{
            if(groupsDb.isGroupExists(groupName)){
                if(groupsDb.deleteGroup(groupName)){
                    sendMessage("Group deleted successfully");
                    mainMenu();
                }
                else {
                    sendMessage("Group does not exist");
                    mainMenu();
                }
            }
        }, "Enter the name of the group you want to delete")
    }

    function createNewGroup(){
        MenuView.RootMenu((groupName)=>{
            if(groupsDb.isGroupExists(groupName)){
                sendMessage("This name already exists, choose a different name");
                createNewGroup();
                return;
            }
            groupsDb.addGroup(new Group(groupName));
            sendMessage("Group created successfully");
            mainMenu();
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
           mainMenu();
       }
       else{
           sendMessage("Groups list is empty");
           mainMenu();
       }
   }

    function printGroupsList(){
        const groupsNamesList = groupsDb.getGroupsNamesList();
        if(groupsNamesList.length){
            groupsNamesList.forEach((groupName, i)=>{
                sendMessage(`#${i+1} ${groupName}`);
            });
            mainMenu();
            return;
        }
        sendMessage("The list is empty");
        mainMenu();
    }

    function printUsersList() {
        const userNamesList = usersDb.getUserNamesList();
        if(userNamesList.length){
            userNamesList.forEach((username, i)=>{
                sendMessage(`#${i+1} ${username}`);
            });
            mainMenu();
            return;
        }
        sendMessage("The list is empty");
        mainMenu();
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
                    mainMenu();
                }
            }
            else{
                sendMessage("User does not exist");
                mainMenu();
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
                mainMenu();
            }
        }, "Are you sure you want to exit? [y]es / [n]o");
    }

    function getUsernameAndGroupName(action) {
        let username, groupName;
        MenuView.RootMenu((name)=>{
            username = name;
            MenuView.RootMenu((name)=>{
                groupName = name;
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
                mainMenu();
                return;
            }
            const selectedUser = usersDb.getUser(username);
            selectedGroup.addUserToGroup(selectedUser);
            sendMessage(`${username} added successfully to group ${groupName}`);
            mainMenu();
        }
        else{
            sendMessage("User or group does not exist");
            mainMenu();
        }
    }

    function deleteUserFromGroup(username, groupName){
        if(usersDb.isUserExists(username) && groupsDb.isGroupExists(groupName)) {
            const selectedGroup = groupsDb.getGroup(groupName);
            if(!selectedGroup.isUserExistsInGroup(username)){
                sendMessage('User do not exists in this group');
                mainMenu();
                return;
            }
            else if(selectedGroup.deleteUserFromGroup(username)){
                sendMessage(`${username} deleted successfully from group ${groupName}`);
                mainMenu();
                return
            }
            sendMessage("Something went wrong, try again");
            mainMenu();
        }
        else{
            sendMessage("User or group does not exist");
            mainMenu();
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
                mainMenu();
            }
        }, "Enter the name of the user you want to edit");

        function updateAge(newAge){
            if(newAge !== age){
                selectedUser.setAge(newAge);
                sendMessage(`${selectedUser.username} age updated from ${age} to ${newAge}`);
                mainMenu();
            }
            else{
                sendMessage(`The age is already set to ${newAge}`);
                mainMenu();
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
                mainMenu();
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
                mainMenu();
            }
        }

        function updatePassword(newPassword){
            selectedUser.setPassword(newPassword);
            sendMessage(`${selectedUser.username}'s password was updated successfully`);
            mainMenu();
        }
    }

    function sendMessage(message){
        MenuView.sendMessage(message);
    }
}

module.exports.ChatController = ChatController;