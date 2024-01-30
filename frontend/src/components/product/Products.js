import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    width: 400,
    margin: theme.spacing(2),
    textDecoration: 'none',
  },
  media: {
    height: 400,
  },
}));

const Products = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleGetAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/product/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        console.error('Ошибка при получении товаров');
        return;
      }

      const productsData = await response.json();
      setProducts(productsData.products);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  const handleToggle = (id) => {
    setSelectedProduct(id);
  };

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div className={classes.root}>
      {products.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id} className={classes.card}>
          <Card
            className={`${classes.card} ${
              selectedProduct === product.id ? 'selected' : ''
            }`}
            onClick={() => handleToggle(product.id)}
          >
            <CardMedia
              className={classes.media}
              image={product.imageUrl}
              title={product.name}
            />
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Стоимость: {product.price} руб.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Products;
