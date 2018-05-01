function GroupsDb(){
    const groups = [];

    return{
        isGroupExists,
        deleteGroup,
        addGroup,
        getGroupsNamesList,
        getGroupsListForPrint,
        getGroup,
        getGroups
    };

    function findGroupIndex(groupName){
        return groups.findIndex((group)=>{
            return groupName === group.name;
        })
    }
    function isGroupExists(groupName){
        let i = findGroupIndex(groupName);
        if(i !== -1){
            return true
        }
        return false;
    }
    function deleteGroup(groupName){
        let i = findGroupIndex(groupName);
        if(i !== -1){
            groups.splice(i, 1);
            return true;
        }
        return false;
    }
    function addGroup(group){
        groups.push(group);
    }
    function getGroupsNamesList(){
        return groups.map((group)=>{
            return group.name
        })
    }
    function getGroupsListForPrint(){
        return groups.map((group)=>{
            return {
                name : group.name,
                users : group.getGroupUsersList()
            };
        });
    }
    function getGroup(groupName){
        return groups.find((group)=>{
            return group.name === groupName;
        })
    }
    function getGroups() {
        return groups.map((group)=>{
            return group
        })
    }
}

module.exports.GroupsDb = GroupsDb;