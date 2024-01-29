const ResponseError = require('../errors/ResponseError');
const bcrypt = require('bcrypt');
const { User, Cart } = require('../models/Model');
const jwt = require('jsonwebtoken');

const generateJwt = (id, email, role) => {
    return jwt.sign({
        id, email, role
    },
        "asdafjqiuhr1239", { expiresIn: '24h' }
    );
}

class AuthController {
  async registration(req, res, next) {
    const { email, password, name, gender } = req.body;
    if (!email || !password || !name || !gender) {
        return next(ResponseError.badRequest('Некорректные данные'));
    }

    try {
        const candidate = await User.findOne({ email });
        if (candidate) {
            return next(ResponseError.badRequest('Email уже занят'));
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = new User({ email, password: hashedPassword, name, gender });

        const cart = new Cart({ userId: user._id });
        await cart.save();

        user.cart = cart;
        await user.save();

        const token = generateJwt(user._id, user.email, user.name, user.gender);
        return res.json({ token });
    } catch (e) {
        console.log(e);
        return next(ResponseError.internal('Ошибка при регистрации пользователя', e));
    }
  }

    async login(req, res, next) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return next(ResponseError.internal('Пользователь не найден'));
            }

            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return next(ResponseError.internal('Неверный пароль'));
            }

            const token = generateJwt(user._id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            return next(ResponseError.internal('Ошибка при входе'));
        }
    }
}

module.exports = new AuthController();