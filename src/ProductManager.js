import express from 'express'
import { Router } from "express";
import productModel from './models/products.models.js'

const router = Router()

class ProductManager{
  constructor() {
  }
  
  async getProducts(page){
    try{
      const products = await productModel.paginate({}, {page, lean: true})
      return products;
    } catch (error){
      console.log('error al cargar los productos!')
    }
  }  

} 

export default ProductManager