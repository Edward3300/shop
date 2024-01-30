import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles, IconButton, Menu, MenuItem, Badge } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  headerMain: {
    textDecoration: 'none',
    color: 'white',
  }
}));

const MainMenu = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Link to={`/products`}  className={classes.headerMain}>
                Главная
              </Link>
            </Typography>
          <div>
            <Link to={`/cart`} className={classes.card}>
              <IconButton
                size="large"
                color="inherit"
                aria-label="shopping cart"
              >
                <ShoppingCartIcon />
              </IconButton>
            </Link>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <Link to={`/profile`}  className={classes.headerMain}>
                  Профиль
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>Выйти</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default MainMenu;
