import productModel from '../models/productModel.js'
import orderModel from '../models/orderModel.js'
import slugify from 'slugify'
import fs from 'fs'
import categoryModel from '../models/categoryModel.js'
import braintree from 'braintree'
import dotenv from 'dotenv'
dotenv.config()

// payment gatway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

export const createProductController = async (req, res) => {
  try {
    const {name, slug, description, price, category, quantity, shipping} = req.fields
    const {photo} = req.files

    switch (true) {
      case !name:
        return res.status(500).send({message: 'Name is required'})

      case !description:
        return res.status(500).send({message: 'description is required'})

      case !price:
        return res.status(500).send({message: 'price is required'})

      case !quantity:
        return res.status(500).send({message: 'quantity is required'})

      case !category:
        return res.status(500).send({message: 'category is required'})
      case !photo && photo.size > 100000:
        return res.status(500).send({message: 'photo is required and should be less then 1mb'})
    }

    const product = await new productModel({...req.fields, slug: slugify(name)})
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path)
      product.photo.contentType = photo.type
    }
    await product.save()
    res.status(201).send({
      success: true,
      message: 'Product created successfully',
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in create product',
      error,
    })
  }
}

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .select('-photo')
      .limit(12)
      .sort({createdAt: -1})
    res.status(200).send({
      success: true,
      message: 'Get all products successfully',
      total: products.length,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error is get all product',
      error,
    })
  }
}

export const singleProductController = async (req, res) => {
  try {
    const {id} = req.params
    const product = await productModel.findById(id).select('-photo').populate('category')
    res.status(200).send({
      success: true,
      message: 'get single product successfully',
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in single product',
      error,
    })
  }
}

export const deleteProductController = async (req, res) => {
  try {
    const {id} = req.params
    await productModel.findByIdAndDelete(id).select('-photo')
    res.status(200).send({
      success: true,
      message: 'delete product successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in delete product',
      error,
    })
  }
}

export const updateProductController = async (req, res) => {
  try {
    const {name, slug, description, price, category, quantity, shipping} = req.fields
    const {photo} = req.files

    switch (true) {
      case !name:
        return res.status(500).send({message: 'Name is required'})

      case !description:
        return res.status(500).send({message: 'description is required'})

      case !price:
        return res.status(500).send({message: 'price is required'})

      case !quantity:
        return res.status(500).send({message: 'quantity is required'})

      case !category:
        return res.status(500).send({message: 'category is required'})
      case !photo && photo?.size > 100000:
        return res.status(500).send({message: 'photo is required and should be less then 1mb'})
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        slug: slugify(name),
      },
      {new: true}
    )
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path)
      product.photo.contentType = photo.type
    }
    await product.save()
    res.status(201).send({
      success: true,
      message: 'Product update successfully',
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in update product',
      error,
    })
  }
}

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select('photo')
    if (product.photo.data) {
      res.set('Content-type', product.photo.contentType)
      return res.status(200).send(product.photo.data)
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while getting product photo',
      error,
    })
  }
}

export const productFilterController = async (req, res) => {
  try {
    const {checked, radio} = req.body
    let args = {}
    if (checked.length > 0) {
      args.category = checked
    }
    if (radio.length) args.price = {$gte: radio[0], $lte: radio[1]}
    const product = await productModel.find(args)
    res.status(200).send({
      success: true,
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: 'Error in product filter',
      error,
    })
  }
}

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      message: 'Product count success',
      total,
    })
  } catch (error) {
    console.log(error)
    res.status(500),
      send({
        success: false,
        message: 'Error in product pagination',
        error,
      })
  }
}

export const productListController = async (req, res) => {
  try {
    const perPage = 6
    const page = req.params.page ? req.params.page : 1
    const product = await productModel
      .find({})
      .select('-photo')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({createdAt: -1})
    res.status(200).send({
      success: true,
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in Product list',
      error,
    })
  }
}

export const productSearchController = async (req, res) => {
  try {
    const search = req.params.search
    const product = await productModel
      .find({
        $or: [
          {name: {$regex: search, $options: 'i'}},
          {description: {$regex: search, $options: 'i'}},
        ],
      })
      .select('-photo')
    res.json(product)
    // res.status(200).send({
    //   success: true,
    //   product,
    // })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: true,
      message: 'Error is search product',
      error,
    })
  }
}

export const productRelatedController = async (req, res) => {
  try {
    const {pid, cid} = req.params
    const product = await productModel
      .find({
        category: cid,
        _id: {$ne: pid},
      })
      .select('-photo')
      .limit(3)
      .populate('category')
    res.status(200).send({
      success: false,
      message: 'success full ',
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: true,
      message: 'Error in related product API',
    })
  }
}

export const productCategoryController = async (req, res) => {
  try {
    const {slug} = req.params
    const category = await categoryModel.find({slug})
    const product = await productModel.find({category}).populate('category').select('-photo')
    res.status(200).send({
      success: true,
      category,
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in get product by category',
      error,
    })
  }
}

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, response) {
      if (error) {
        res.status(500).send(error)
      } else {
        res.send(response)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const braintreePaymentController = async (req, res) => {
  try {
    const {card, nonce} = req.body
    let total = 0
    card.map((item) => (total += item.price))
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: card,
            payment: result,
            buyer: req.user._id,
          }).save()
          res.json({ok: true})
        } else {
          res.status(500).send(error)
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}
