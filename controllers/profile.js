const handleProfile = (req,res, db)=>{
        const {id} = req.params;
        db.select().from('users').where({id})
        .then(user => {
            if(user.length === 0){
                res.status(400).json('User Not Found')
            } else{
                res.json(user[0]);
            }
        })
        .catch(err => res.status(400).json('Error Getting User'))    
}

module.exports = {
    handleProfile : handleProfile
}