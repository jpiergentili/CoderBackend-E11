import { Router } from "express";
import userModel from '../models/user.model.js';
import session from 'express-session';

const router = Router();

//vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

router.post('/register', async (req, res) => {
    const userNew = req.body
    if (userNew.email === "adminCoder@coder.com") {
        return res.status(401).render('errors/base', {
            error: ' No se puede registrar el usuario adminCoder@coder.com'
        })
    }
    userNew.role = "user"
    const user = new userModel(userNew)
    await user.save()
    res.redirect('/sessions/login')
})

//vista de login
router.get('/login', async (req, res) => {
    res.render('sessions/login')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com") {
        if (password !== "adminCod3r123") {
            return res.status(401).render('errors/base', {
                error: 'Error en email y/o contraseña'
            });
        }

        const admin = {
            first_name: 'Javier',
            last_name: 'Piergentili',
            email: 'adminCoder@coder.com',
            age: 35,
            password: 'adminCod3r123',
            role: 'admin'
        };

        req.session.user = admin;
    } else {
        const user = await userModel.findOne({ email, password }).lean().exec();

        if (!user) {
            return res.status(401).render('errors/base', {
                error: 'Error en email y/o contraseña'
            });
        }

        req.session.user = user;
    }

    res.redirect('/products');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).render('errors/base', {
            error: err
        })
        else res.redirect('/sessions/login')
    })
})

export default router;