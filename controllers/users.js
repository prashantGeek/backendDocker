import { v4 as uuidv4 } from 'uuid';


let users = []
export const getUsers = (req,res) =>{
    res.send(users);
 }

 export const createNewUsers = (req, res) =>{

    const newUsers = req.body;

    
    const usersWithIds = newUsers.map(user => ({ ...user, id: uuidv4() }));
    users.push(...usersWithIds);

    res.send(`${usersWithIds.length} user(s) added to the database`);

 }

 export const getUserById = (req,res)=>{
    const { id } = req.params;
    const foundUser = users.find((user) => user.id === id);
    res.send(foundUser)
 }

 export const deleteUser = (req,res)=>{
    const {id} = req.params;
    users = users.filter((user) => user.id !== id);
    res.send(`User with the id ${id} deleted from the database`);
 }

 export const updateUser = (req, res) =>{
    const {id} =req.params;
    const {name,age} = req.body
    const user= users.find((user) => user.id === id)

    if(name){
        user.name = name;
    }
    if(age){
        user.age = age;
    }
    res.send(`User with the id ${id} updated in the database`);
 }