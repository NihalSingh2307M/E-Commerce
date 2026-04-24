import { v2 as cloudinary } from 'cloudinary'
import productModel from "../models/productModel.js"
import connectDB from "../config/mongodb.js";
import { onProductAdded, onProductRemoved } from '../vector-search/services/productSearchHooks.js'

// function for add product
const addProduct = async (req, res) => {
    try {
        await connectDB();
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData)
        await product.save()

        onProductAdded(product).catch(err => console.warn('[search] index failed:', err.message))

        res.json({ success: true, message: "product added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProduct = async (req, res) => {
    try {
        await connectDB();
        const product = await productModel.find({});
        res.json({ success: true, products: product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        await connectDB();
        await productModel.findByIdAndDelete(req.body.id)

        onProductRemoved(req.body.id).catch(err => console.warn('[search] remove failed:', err.message))

        res.json({ success: true, message: "product removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product
const singleProduct = async (req, res) => {
    try {
        await connectDB();
        const { productId } = req.body;
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for update product — also re-indexes in Endee so vector search stays fresh
const updateProduct = async (req, res) => {
    try {
        await connectDB();
        const { id, name, description, price, category, subCategory, bestseller } = req.body;

        const updated = await productModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price: Number(price),
                category,
                subCategory,
                bestseller: bestseller === 'true',
            },
            { new: true }  // return the updated document
        );

        if (!updated) {
            return res.json({ success: false, message: 'Product not found' });
        }

        // Re-index updated product in Endee (fire-and-forget)
        onProductAdded(updated).catch(err => console.warn('[search] re-index failed:', err.message))

        res.json({ success: true, message: "product updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct }