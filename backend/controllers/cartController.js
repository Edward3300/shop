const {Cart, CartItem, User} = require('../models/Model');
const ResponseError = require('../errors/ResponseError');
const jwt = require('jsonwebtoken');

const products = [
  {
    id: 1,
    name: 'Кроссовки Gucci',
    description:
      'Описание кроссовок Gucci. Высококачественные кроссовки от известного бренда Gucci. Изготовлены из прочных и комфортных материалов. Идеальны для активного образа жизни. Отлично подходят для занятий спортом, прогулок и повседневного использования. Доступны в различных размерах и цветах. Приобретите стильные кроссовки Gucci и почувствуйте комбинацию удобства и стиля!',
    price: 19.99,
    imageUrl: 'img/кроссовки.jpg',
  },
  {
    id: 2,
    name: 'Футболка',
    description:
      'Описание футболки. Современная футболка для стильного и удобного образа. Изготовлена из мягкого и приятного к телу материала. Подходит для любого времени года. С уникальным дизайном и разнообразием цветов. Отличный выбор для повседневного использования. Носите с удовольствием!',
    price: 29.99,
    imageUrl: 'img/футболка.jpg',
  },
  {
    id: 3,
    name: 'Шорты',
    description:
      'Описание шортов. Стильные и комфортные шорты для активного отдыха. Идеальны для пляжа, спорта и прогулок. Изготовлены из легких и дышащих материалов. Эластичный пояс для удобной посадки. Практичные и модные. Выберите шорты для своего идеального летнего образа!',
    price: 39.99,
    imageUrl: 'img/шорты.jpg',
  },
  {
    id: 4,
    name: 'Рюкзак',
    description:
      'Описание рюкзака. Прочный и стильный рюкзак для повседневных приключений. С множеством отделений для удобства хранения. Удобные регулируемые лямки. Изготовлен из водонепроницаемого материала. Идеальный выбор для школы, работы или путешествий. Переносите свои вещи с комфортом и стилем!',
    price: 39.99,
    imageUrl: 'img/рюкзак.jpg',
  },
];

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

class CartController {
  async addItem(req, res, next) {
    try {
      const userId = extractUserIdFromToken(req);
      const { itemId } = req.body;
      const user = await User.findById(userId).populate({ path: 'cart.items'});
  
      if (!user) {
        return next(ResponseError.notFound('Пользователь не найден'));
      }
      
      if (!user.cart) {
        const cart = await Cart.create({ userId: user._id });
        user.cart = cart._id;
        await user.save();
      }

      if(!user.cart.items){
        user.cart.items = [];
        await user.save();
      }

      const cartItemSchema = await CartItem.findOne({productId: itemId});

      if(cartItemSchema){
        let product = products.find(product => product.id == itemId);
        if (product) {
          product.isCart = true;
          return res.json(product);
        }
      }

      const itemInTheCart = user.cart.items && user.cart.items.find(
        (item) => item.productId.toString() === itemId
      );
      if (!itemInTheCart) {
        const productId = itemId;
        const newCartItem = await CartItem.create({ productId, cart: user.cart, userId: user._id });
        user.cart.items.push(newCartItem._id);

        await Cart.updateOne({ _id: user.cart._id }, { $set: { items: user.cart.items } });
  
        let product = products.find(product => product.id == itemId);
        if (product) {
          product.isCart = true;
          return res.json(product);
        } else {
          return next(ResponseError.notFound('Товар не найден'));
        }
      } else {
        return next(ResponseError.badRequest('Товар уже добавлен в корзину'));
      }
    } catch (error) {
      next(ResponseError.badRequest(error.message));
    }
  }

  async removeOneItems(req, res, next) {
    try {
      const userId = extractUserIdFromToken(req);
      const { itemId } = req.body;

      if (!userId) {
        return next(ResponseError.notFound('Пользователь не найден'));
      }
      const userBasket = await CartItem.deleteOne({ _id: itemId });

      const cartItems = await CartItem.find({ userId: userId });
      let result = [];
      for (let i = 0; i < cartItems.length; i++) {
        const productId = cartItems[i].productId;
        const product = products.find(product => product.id == productId);
        cartItems[i].product = product;
        result.push({id: cartItems[i]._id, productId: cartItems[i].productId, product: product});
      }

      return res.json(result);
    } catch (error) {
      next(ResponseError.badRequest(error.message));
    }
  }

  async getAllItems(req, res, next) {
    try {
      const userId = extractUserIdFromToken(req);
      const cartItems = await CartItem.find({ userId: userId });
      let result = [];
      if (!userId) {
        return next(ResponseError.notFound('Пользователь не найден'));
      }
      for (let i = 0; i < cartItems.length; i++) {
        const productId = cartItems[i].productId;
        const product = products.find(product => product.id == productId);
        cartItems[i].product = product;
        result.push({id: cartItems[i]._id, productId: cartItems[i].productId, product: product});

      }

      return res.json(result);
    } catch (e) {
      next(ResponseError.badRequest(e.message));
    }
  }
}    

module.exports = new CartController();