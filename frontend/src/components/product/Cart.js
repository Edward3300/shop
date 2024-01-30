import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  Button,
  Card,
  CardContent, CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
}));

const Cart = () => {
  const classes = useStyles();
  const [carts, setCarts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/id`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify({ itemId: id }),
      });

      if (!response.ok) {
        console.error('Ошибка при получении корзины');
        return;
      }

      const productsData = await response.json();
      console.log("productsData", productsData);
      if (productsData) {
        setCarts(productsData);
      } else {
        console.error('Ошибка: productsData.carts is undefined');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  const handleFindAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        console.error('Ошибка при получении корзины');
        return;
      }

      const productsData = await response.json();
      console.log("productsData", productsData);
      if (productsData) {
        setCarts(productsData);
      } else {
        console.error('Ошибка: productsData.carts is undefined');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  }

  const handleConfirmOrder = async () => {
    console.log("BODY", { adress: deliveryAddress, telephone: phoneNumber, items: carts.map(cart => cart.product.id), totalAmount: outSumOrder() });
    const response = await fetch(`http://localhost:5000/api/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('access_token'),
      },
      body: JSON.stringify({ adress: deliveryAddress, telephone: phoneNumber, items: carts.map(cart => cart.product.id), totalAmount: outSumOrder() }),
    });
    setOpenDialog(false);
    // window.location = "/profile";
  };

  const outSumOrder = () => {
    let sum = 0;
    if(carts){
      for(let i = 0; i < carts.length; i++){
        sum += carts[i].product.price;
      }
    }

    return sum;
  }

  useEffect(() => {
    handleFindAll();
    outSumOrder();
    handleDeleteItem();
  }, []);

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Ваша корзина
          </Typography>
          <List>
            {carts.map((cart) => (
              <ListItem key={cart.id}>
                <ListItemText
                  primary={cart.product.name}
                  secondary={`Стоимость: ${cart.product.price} руб.`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteItem(cart.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Typography variant="h5" gutterBottom>
            Сумма заказа: {outSumOrder()} руб.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => setOpenDialog(true)}
          >
            Оформить заказ
          </Button>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Оформление заказа</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Адрес доставки"
            type="text"
            fullWidth
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Номер телефона"
            type="tel"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmOrder} color="primary">
            Подтвердить заказ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cart;
