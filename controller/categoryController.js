import categoryModel from '../models/categoryModel.js'
import slugify from 'slugify'

export const createCategoryController = async (req, res) => {
  try {
    const {name} = req.body
    if (!name) {
      return res.status(401).send({
        message: 'Name is required',
      })
    }
    const existingCategory = await categoryModel.findOne({name})
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: 'Category Already Exists',
      })
    }

    const category = await new categoryModel({name, slug: slugify(name)}).save()
    res.status(201).send({
      success: true,
      message: 'new category created',
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: 'Error in category',
    })
  }
}

// update category

export const updateCategoryController = async (req, res) => {
  try {
    const {name} = req.body
    const {id} = req.params
    console.log(name)
    const category = await categoryModel.findByIdAndUpdate(
      id,
      {name, slug: slugify(name)},
      {new: true}
    )
    res.status(200).send({
      success: true,
      message: 'Category updated successfully',
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in update recipe',
      error,
    })
  }
}

// get all category

export const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find()
    res.status(200).send({
      success: true,
      message: 'Get all category successfully',
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in get all category',
      error,
    })
  }
}

export const deleteCategoryController = async (req, res) => {
  try {
    const {id} = req.params
    const category = await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: 'Category is delete successfully',
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in delete category',
      error,
    })
  }
}

export const singleCategoryController = async (req, res) => {
  try {
    const singleCategory = await categoryModel.findOne({slug: req.params.slug})
    res.status(200).send({
      success: true,
      message: 'get single category successfully',
      singleCategory,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'error in single category',
      error,
    })
  }
}
