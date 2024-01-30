import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, CardContent, makeStyles, CardMedia, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';

const productInfo = {
  id: 1,
  name: 'Product 1',
  description: 'Description for Product 1',
  price: 19.99,
  imageUrl: 'img/рюкзак.jpg',
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 800,
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
  media: {
    height: 600,
  },
  content: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const Product = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [product, setProduct] = useState([]);

  const handleGetByIdProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/product/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('access_token'),
        },
      });
  
      if (!response.ok) {
        console.error('Ошибка при получении товара');
        return;
      }
  
      const productData = await response.json();
      console.log('product', productData);
  
      setProduct(productData);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  const handleAddToCart = async () => {
    const itemId = id;
    try {
      const response = await fetch(`http://localhost:5000/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify({ itemId }),
      });
  
      if (!response.ok) {
        console.error('Ошибка добавления товара в корзину');
        return;
      }
  
      const productData = await response.json();
      console.log('product', productData);
  
      setProduct(productData);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  useEffect(() => {
    handleGetByIdProduct();
  }, []);

  return (
    <Card className={classes.card}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CardMedia
            className={classes.media}
            image={process.env.PUBLIC_URL + '/' + product.imageUrl}
            title={product.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="div" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {product.description}
            </Typography>
            <Typography variant="h6" component="div">
              Стоимость: {product.price} руб.
            </Typography>
            <div>
              {product.isCart ? (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleAddToCart}
                >
                  Перейти в корзину
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleAddToCart}
                >
                  Добавить в корзину
                </Button>
              )}
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Product;
