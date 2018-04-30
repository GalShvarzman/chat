function GroupsDb(){
    const groups = [];

    return{
        isGroupExists,
        deleteGroup,
        addGroup,
        getGroupsNamesArray,
        getGroupsArray,
        getGroup
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
    function getGroupsNamesArray(){
        return groups.map((group)=>{
            return group.name
        })
    }
    function getGroupsArray(){
        return groups;
    }
    function getGroup(groupName){
        return groups.find((group)=>{
            return group.name === groupName;
        })
    }
}

module.exports.GroupsDb = GroupsDb;