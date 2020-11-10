const bcrypt = require('bcrypt');

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db');
        const { email, username, password } = req.body;
        const user = await db.check_user(email);
        if(user[0]) {
            return res.status(409).send("User already exists")
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const [newUser] = await db.add_user([username, email, hash]);
        req.session.user = {
            userId: newUser.user_id,
            email: newUser.email,
            username: newUser.username
        };
        res.status(200).send(req.session.user);
    },
    login: async (req, res) => {
        const db = req.app.get('db');
        const {email, password} = req.body;
        const user = await db.check_user(email);
        if (!user[0]){
            res.status(401).send('Incorrect credentials')
        } 
        const authenticated = bcrypt.compareSync(password, user[0].password);
        if(authenticated){
            req.session.user = {
                userId: user[0].user_id,
                email: user[0].email,
                username: user[0].username
            }
            res.status(200).send(req.session.user)
        } else {
            res.status(401).send('Incorrect credentials')
        }

    },
    logout: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    },
    getUser: (req, res) => {
        if(req.session.user){
            res.status(200).send(req.session.user)
        } else {
            res.sendStatus(404);
        }
    }
}