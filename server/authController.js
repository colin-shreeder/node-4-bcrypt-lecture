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
    login: (req, res) => {

    },
    logout: (req, res) => {

    },
    getUser: (req, res) => {
        
    }
}