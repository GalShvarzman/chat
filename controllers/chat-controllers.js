const {UsersDb} = require('./../controllers/../models/users');
const {GroupsDb} = require('./../controllers/../models/groups');
const {Group} = require('./../controllers/../models/group');
const {User} = require('./../controllers/../models/user');
const {Chat} = require('./../controllers/../models/chat');
const MenuView = require('../views/menu-view');

function ChatController(){
    const id = 'Chat Controller';
    const chat = new Chat();

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
                    console.log('We did not understand your request');
                    init();
                    break;
            }
        });
    }

    function createNewUser() {
        let username, age, password;
        MenuView.GetUserName((answer) => {
            username = answer
        });
        if (chat.usersDb.isUserExists(username)) {

        }
    }
    //         if(usersDb.isUserExists(name)){
    //             console.log("username already exist. enter a different username");
    //             createNewUser();
    //             return;
    //         }
    //         username = name;
    //         rl.question('what is your age?\n', passwordQuestion)
    //     }
    //     function passwordQuestion(userAge){
    //         age = userAge;
    //         rl.question('Select a password?\n', finish)
    //     }
    //     function finish(userPassword){
    //         password = userPassword;
    //         usersDb.addUser(new User(username, age, password));
    //         console.log("User created successfully!");
    //         whatDoYouWantToDoNext();
    //     }
    // }
}

module.exports.ChatController = ChatController;
