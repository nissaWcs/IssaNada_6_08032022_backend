require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const cryptJs = require('crypto-js');


const User = require('../models/User');

exports.singup = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message : "Utilisateur crée!"}))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }));
};

/*exports.signup = (req, res, next) => {
    const emailCrypt = cryptJs.SHA256(req.body.email, process.env.CRYPTOJS_SECRET_TOKEN).toString();
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email : emailCrypt,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};*/


exports.login = (req, res, next) =>{
    User.findOne({ email: req.body.email })
    .then((user) => {
        if(!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé!"})
        }
        bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
            if(!valid) {
                return res.status(401).json({ error: "Mot de passe incorrect!"})
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}
                )
            });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/*exports.login = (req, res, next) => {
    const emailCrypt = cryptJs.SHA256(req.body.email, process.env.CRYPTOJS_SECRET_TOKEN).toString();
    User.findOne({ email : emailCrypt })
        .then((user) => {
            if(!user) {
                return res.status(401).json({message : "Utilisateur non trouvé!"});
            } 
            else {
                bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if(!valid) {
                        return res.status(401).json({message : "Mot de passe incorrect !"});
                    }
                    else {
                    res.status(200).json({
                        userId : user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.CRYPTOJS_SECRET_TOKEN,
                            { expiresIn: '24h' }
                            )
                    });
                    }
                })
                .catch(error => res.status(501).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};*/
