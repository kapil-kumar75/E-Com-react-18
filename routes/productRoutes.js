import express from 'express'
import {
  createProductController,
  deleteProductController,
  getProductController,
  singleProductController,
  updateProductController,
  productPhotoController,
  productFilterController,
  productCountController,
  productListController,
  productSearchController,
  productRelatedController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,

} from '../controller/productController.js'
import {isAdmin, requireSignIn} from '../middleware/authMiddleware.js'
import formidableMiddleware from 'express-formidable'

const router = express.Router()

router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createProductController
)
router.get('/get-product', getProductController)
router.get('/single-product/:id', singleProductController)
router.delete('/delete-product/:id', requireSignIn, isAdmin, deleteProductController)
router.get('/product-photo/:id', productPhotoController)
router.put(
  '/update-product/:id',
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updateProductController
)
// filter product
router.post('/product-filter', productFilterController)
// pagination

router.get('/product-count', productCountController)
router.get('/product-list/:page', productListController)

// search product

router.get('/product-search/:search', productSearchController)
//similar product

router.get('/related-product/:pid/:cid', productRelatedController)

// category wise product

router.get('/product-category/:slug', productCategoryController)

// payment routes

router.get('/braintree/token', braintreeTokenController)
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default router
