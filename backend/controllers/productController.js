const ResponseError = require('../errors/ResponseError');
const {Cart, CartItem, User} = require('../models/Model');

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

class ProductController {
  async getAll(req, res, next) {
        try {
          const productsWithShortDescription = products.map(product => ({
            ...product,
            description: product.description.slice(0, 100) + "...",
          }));

          return res.json({ products: productsWithShortDescription });
        } catch (error) {
            return next(ResponseError.internal('Ошибка при получении товаров'));
        }
    }

    async getOne(req, res, next) {
      const userId = extractUserIdFromToken(req);
      const { id } = req.params;

      try {
        const productId = parseInt(id, 10);
        const item = products.find(product => product.id === productId);
        const user = await User.findById(userId).populate({ path: 'cart.items' });

        if (!user) {
          return next(ResponseError.notFound('User not found'));
        }
        if (!user.cart) {
          return res.json(item);
        }
        const cartItem = await CartItem.find({ cart: user.cart._id });
    
        const itemInTheCart = cartItem && cartItem.find(
          (item) => item.productId.toString() == productId
        );
        if(itemInTheCart){
          item.isCart = true;
        }
        return res.json(item);
      } catch (error) {
        return next(ResponseError.internal('Ошибка при получении товара'));
      }
  }
}

module.exports = new ProductController();
