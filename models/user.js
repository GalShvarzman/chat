function User(username, age, password){

    return{
        username,
        age,
        password,
        setAge,
        setPassword
    };
    function setPassword(otherPassword){
        this.password = otherPassword;
    }
    function setAge(otherAge){
        this.age = otherAge;
    }
}

module.exports.User = User;