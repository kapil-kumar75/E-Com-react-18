import express from 'express'
import {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  deleteCategoryController,
  singleCategoryController,
} from '../controller/categoryController.js'
import {isAdmin, requireSignIn} from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)
router.get('/get-category', getCategoryController)
router.get('/single-category/:slug', singleCategoryController)
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)

export default router
