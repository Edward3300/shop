const {Cart, CartItem, User, Order} = require('../models/Model');
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

class OrderController {
  async addOrder(req, res, next) {
    try {
      const userId = extractUserIdFromToken(req);
      if(userId){
        const { items, totalAmount, adress, telephone } = req.body;
      
        const order = new Order({
          adress, 
          telephone,
          items,
          totalAmount,
        });

        await order.save();
        await CartItem.deleteMany({ userId });

        res.json(order);
      } else {
        res.status(500).json({ success: false, message: 'Failed to create order' });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, message: 'Failed to create order' });
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const userId = req.params.userId;
      const orders = await Order.find({ userId });
      let result = [];

      for(let i = 0; i < orders.length; i++){
        let itemsOrder = [];
        for(let j = 0; j < orders[i].items.length; j++){
          for(let k = 0; k < products.length; k++){
            if(orders[i].items[j] == products[k].id){
              itemsOrder.push(products[k]);
            }
          }
        }
        orders[i].items = itemsOrder;

        result.push({ adress: orders[i].adress, telephone: orders[i].telephone, items: itemsOrder, totalAmount: orders[i].totalAmount });
      }
      res.json(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
  }
}

module.exports = new OrderController();
