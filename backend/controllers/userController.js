const ResponseError = require('../errors/ResponseError');
const bcrypt = require('bcrypt');
const { User } = require('../models/Model');
const jwt = require('jsonwebtoken');

const extractUserIdFromToken = (req) => {
  const token = req.headers['authorization'];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, 'asdafjqiuhr1239'); 
    return decoded.id; 
  } catch (error) {
    return null;
  }
};

class UserController {
  async infoProfile(req, res, next) {
    try {
        const userId = extractUserIdFromToken(req);
        const user = await User.findById(userId);
    
        if (!user) {
          return next(ResponseError.notFound('Пользователь не найден'));
        }
        
        return res.json(user);
    } catch (e) {
        return next(ResponseError.internal('Ошибка при регистрации пользователя', e));
    }
  }

  async updateProfile(req, res, next) {
    const { name, email, password } = req.body;
    try {
      const userId = extractUserIdFromToken(req);
      const user = await User.findById(userId);
  
      if (!user) {
        return next(ResponseError.notFound('Пользователь не найден'));
      }
  
      const updateData = {};
      updateData.name = name;
      updateData.email = email;
      const hashedPassword = await bcrypt.hash(password, 5);

      updateData.password = hashedPassword;

      const result = await User.updateOne({ _id: userId }, { $set: updateData });
  
      return res.json(result);
    } catch (e) {
      return next(ResponseError.internal('Ошибка при обновлении информации о пользователе'));
    }
  }
  
}

module.exports = new UserController();