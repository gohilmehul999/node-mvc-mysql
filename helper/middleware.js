const knex = require('knex')(require('./db'));
const jwt = require('jsonwebtoken');

module.exports.routing_checker = async(req,res,next)=>{
const Authorization = req.headers['authorization'];
// console.log(Authorization);
// console.log(token);
if(typeof Authorization !== 'undefined'){
    const token = Authorization.split(' ')[1]
    return jwt.verify(token,'secretkey',(err,result)=>{
        if(err){
            console.log(err);
        }
        if (result) {
            // console.log(result.data[0].id);
            knex('user')
            .where({id:result.data[0].id}).then((data)=>{
                console.log(data);
                if(data.length > 0){
                    console.log('done verify token');
                    req.user = result.data[0];
                    next();
                }
            })
        } else {
            res.send('token not match');
        }
    })
}else{
    res.send('token miss ')
}
// next();
}