import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../db/users.js';
import ApiError from '../error/ApiError.js';
export default (router) => {

    router.post('/login', async (req, res) => {
        const {
            email,
            password
        } = req.body;
        const user = await Users.findOne({
            email: email
        });
        if (!user) {
            throw new ApiError('Incorrect password or email', 401, 'userOrPasswordIncorrect');
        }
        const passwordConfirmed = await bcrypt.compare(password, user.password);
        if(passwordConfirmed){
            const UserJson = user.toJSON();
            const token = jwt.sign(UserJson, process.env.JWT_SECRET)
            res.json({
                user: UserJson,
                token: `Bearer ${token}`
            });
        }else{
            throw new ApiError('Incorrect password or email', 401, 'userOrPasswordIncorrect');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
    })
}