const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  let log = false;

  if (req.session.isLoggedIn) {
    log = true;
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: log
  });
};

const postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  let prodDetail = {
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  };

  const product = await Product(prodDetail).save();

  if (product) {
    console.log('Created Product');
    res.redirect('/admin/products');
  }
};

const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  let log = false;

  if (req.session.isLoggedIn){
    log = true;
  }
  
  const prodId = req.params.productId;
  const product = await Product.findById(prodId)
    if(product) {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: log
      });   
    }
    else {
      return res.redirect('/');
    }    
};

const postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = await Product.findById(prodId);
    if (product){
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      product.save();
      res.redirect('/admin/products');
    }
};

const getProducts = (req, res, next) => {

  let log = false;

  if (req.session.isLoggedIn){
    log = true;
  }

  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: log
      });
    })
    .catch(err => console.log(err));
};

const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getProducts,
  postDeleteProduct
}
