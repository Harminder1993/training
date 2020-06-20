const Product = require('../models/product');
const Order = require('../models/order');

const getProducts = (req, res, next) => {

  let log = false;

  if (req.session.isLoggedIn) {
    log = true;
  }

  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: log
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const getProduct = (req, res, next) => {

  let log = false;

  if (req.session.isLoggedIn) {
    log = true;
  }

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: log
      });
    })
    .catch(err => console.log(err));
};

const getIndex = async (req, res, next) => {

  let log = false;

  if (req.session.isLoggedIn) {
    log = true;
  }


  const products = await Product.find();
  if (products) {
    const shopRender = {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: log
    };

    console.log('----- shop Render ----------', shopRender);

    res.render('shop/index', shopRender);
  }

};

const getCart = (req, res, next) => {

  let log = false;

  if (req.session.isLoggedIn) {
    log = true;
  }

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: log
      });
    })
    .catch(err => console.log(err));
};

const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

const postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

const getOrders = (req, res, next) => {

  let log = false;

  if (req.session.isLoggedIn) {
    log = true;
  }

  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: log
      });
    })
    .catch(err => console.log(err));
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getOrders
}
