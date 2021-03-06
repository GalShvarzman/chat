function Group(name){
    const users = [];

    return{
        name,
        setName,
        isUserExistsInGroup,
        addUserToGroup,
        deleteUserFromGroup,
        getGroupUsersList
    };

    function setName(otherName){
        this.name = otherName;
    }
    function findUserInGroupIndex(username){
        return users.findIndex((user)=>{
            return username === user.username;
        })
    }
    function isUserExistsInGroup(username){
        let i = findUserInGroupIndex(username);
        if(i !== -1){
            return true;
        }
        return false;
    }
    function addUserToGroup(user) {
        users.push(user);
    }
    function deleteUserFromGroup(user) {
        let i = findUserInGroupIndex(user);
        if(i !== -1){
            users.splice(i, 1);
            return true;
        }
        return false;
    }
    function getGroupUsersList(){
        return users.map((user)=>{
            return user
        });
    }
}

module.exports.Group = Group;