import { UserModel as users } from "../model/UserModel.js"

export const getEmployees = async (req, res) => {

    const results = await users.getAllUsers()
    res.json(results)
}

export const findEmployee = async (req, res) => {
    const results = await users.findById(req.params.id)
    res.json(results)
}

export const updateEmployee = async (req, res) => {
    const {id} = req.params
    try {
        console.log('update employee')
        await users.updateUser(req.body, id)
        res.status(200).json({'message': 'user updated'})
    } catch(e) {
        console.log(e)
    }   
}

export const createEmployee = async (req, res) => {
    try {
     
        await users.addUser(req.body)
        res.status(200).json({'message': 'user created'})
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error creating" });  
    }
}

export const deleteEmployee = async (req, res) => {
    const {id} = req.params

    try {
        console.log('delete employee')
        await users.deleteUser(id)
        res.status(200).json({'message': 'user deleted'})
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error creating" }); 
    }
}

export const getDesignatedProject = async (req, res) => {
    const { id } = req.params
    const { role } = req.query
    try{
        const results = await users.getDesignatedProject(Number(id), role)
    
        if (results.length === 0) return res.status(404).json({"message": "not found"})
        res.status(200).json(results)
    } catch(e) {
        console.log(e)
    }
    
}



