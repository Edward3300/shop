import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  makeStyles,
  Card,
  List,
  ListItem,
  ListItemText,
  CardContent,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  titleOrder: {
    margin: '15px'
  },
}));

const Profile = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  const handleFetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('access_token'),
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFindAllOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/order/all', {
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

      const ordersData = await response.json();
      if (ordersData) {
        setOrders(ordersData);
      } else {
        console.error('Ошибка: productsData.carts is undefined');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  }

  const handleUpdateUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setEditMode(false);
        handleFetchUserData();
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    handleFindAllOrders();
    handleFetchUserData();
  }, []);

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Профиль
          </Typography>
          {editMode ? (
            <div>
              <Button
                variant="outlined"
                onClick={() => setEditMode(false)}
                color="primary">
                  Назад
              </Button>
              <form className={classes.form}>
                <TextField
                  label="Имя"
                  value={updatedUser.name || ''}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                />
                <TextField
                  label="Электронная почта"
                  value={updatedUser.email || ''}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                />
                <TextField
                  label="Новый пароль"
                  type="password"
                  value={updatedUser.password || ''}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleUpdateUser}
                >
                  Сохранить изменения
                </Button>
              </form>
            </div>
          ) : (
            <div>
              <Typography variant="body1">Имя: {user.name}</Typography>
              <Typography variant="body1">Электронная почта: {user.email}</Typography>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => setEditMode(true)}
              >
                Редактировать профиль
              </Button>

              <Card>
                <CardContent>
                  <Typography className={classes.titleOrder} variant="h6" gutterBottom>
                    Ваши заказы
                  </Typography>
                  {orders.map((order) => (
                    <Card>
                      <CardContent>
                        <Typography className={classes.titleOrder} variant="h6" gutterBottom>
                          {`Адрес доставки: ${order.adress}`}
                        </Typography>
                        <Typography className={classes.titleOrder} variant="h6" gutterBottom>
                        {`Телефон для связи: ${order.telephone}`}
                        </Typography>
                        
                        <List>
                          {order.items.map((item) => (
                            <ListItem key={item.id}>
                              <ListItemText
                                secondary={`Название: ${item.name} руб.`}
                              /><br/>
                              <ListItemText
                                secondary={`Стоимость: ${item.price} руб.`}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Typography variant="h5" gutterBottom>
                          Сумма заказа: {order.totalAmount} руб.
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
