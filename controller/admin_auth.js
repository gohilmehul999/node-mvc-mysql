const { Knex } = require('knex');
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');
const knex = require('knex')(require('../helper/db'));

module.exports.register = async (req, res) => {
    try {
        if (req.body.email && req.body.password && req.body.name) {
            knex('user')
                .where({ email: req.body.email }).then((result) => {
                    if (result.length == 0) {
                        if ({ name: req.body.name }) {
                            knex('user')
                                .where({ name: req.body.name }).then((result) => {
                                    if (result.length == 0) {
                                        let user_data = {
                                            email: req.body.email,
                                            password: req.body.password,
                                            name: req.body.name
                                        }
                                        knex('user')
                                            .insert(user_data).then(async (result) => {
                                                res.send("save data in database pls check")
                                            }).catch((err) => {
                                                console.log(err);
                                            });
                                    } else {
                                        res.send('name already use')
                                    }
                                })
                        }
                    } else {
                        res.send('email already register');
                    }
                })
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports.login = async (req, res) => {
    try {
        knex('user')
            .where({ email: req.body.email }).then((result) => {
                if (result.length > 0) {
                    // console.log(result[0].password);
                    if (result[0].password === req.body.password) {
                        const token = jwt.sign({ data: result }, 'secretkey');
                        user_data = {
                            result: result[0],
                            token: token
                        }
                        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        data = {
                            message: "login succesfull",
                            status: 200,
                            data: user_data
                        }
                        user_device_data = {
                            user_id: result[0].id,
                            token: token,
                            ip_addres: ip
                        }
                        knex('user_device')
                            .where({id:result[0].id}).then((result) => {
                                if(result.length > 0){
                                    knex('user_device')
                                    .update(user_device_data)
                                    .where({id:result[0].id})
                                    .then((result) => { })
                                }else{
                                    knex('user_device')
                                    .insert(user_device_data).then((result) => { })
                                }
                             })
                   
                        res.send(data)

                    } else {
                        res.send('password not match')
                    }

                } else {
                    res.send('invalid credential');
                }
            })
    } catch (error) {

    }
}

module.exports.update_user = async (req, res) => {
    if (req.body.email && req.body.password) {
        update_data = {
            email: req.body.email,
            password: req.body.password
        }
        knex('user')
            .where({ id: req.body.id }).then((result) => {
                console.log(result);
                if (result.length > 0) {
                    knex('user')
                        .update(update_data)
                        .where({ id: req.body.id }).then((result) => {
                            console.log(result);
                            res.send('updated')
                        }
                        )
                } else {
                    res.send('not found');
                }
            })
    }
}

module.exports.getallusers = async (req, res) => {
    try {
        await knex('user_device')
        .where({user_id:req.body.id,is_active:'Y'}).then((data)=>{
            if(data.length > 0){
                knex('user')
                .select('*').then((result) => {
                    res.send(result)
                })
            }else{
                res.send('user not active');
            }
            
        })
      
    } catch (error) {
        console.log(error);
    }
}