import { Router } from "express";
import userModel from '../models/user.model.js';
import session from 'express-session';
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

//vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/sessions/failRegister'
}), async (req, res) => {
    //register no es un nombre reservado, es el nombre que le pusimos en el config de passport
    res.redirect('/sessions/login')
})

router.get('/failRegister', (req, res) => {
    res.send({ error: 'failed' })
})

//vista para registrar usuarios
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

//vista de login
router.post('/login', passport.authenticate('login', {
    failureRedirect: '/sessions/failLogin'
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }

    const user = req.user;
    if (user.role === 'admin') {
        req.session.user = {
            first_name: "Javier",
            last_name: "Piergentili",
            email: user.email,
            age: 35,
            role: user.role
        };
    } else {
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        };
    }
    
    //register no es un nombre reservado, es el nombre que le pusimos en el config de passport
    res.redirect('/products');
});

router.get('/failLogin', (req, res) => {
    res.send({ error: 'failed' })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).render('errors/base', {
            error: err
        })
        else res.redirect('/sessions/login')
    })
})

export default router;