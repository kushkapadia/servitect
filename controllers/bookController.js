 
const Messages = require("../constants/Messages");
const JsonResponse = require("../helper/JsonResponse");
const TryCatch = require("../helper/TryCatch");
const Book = require("../models/Book");
const jwt = require("jsonwebtoken");


exports.getById = async function(req, res){
  let book = new Book()
  let bookDoc = await book.getById(req.params.id)
  new JsonResponse(req, res).jsonSuccess(bookDoc, new Messages().SUCCESSFULLY_RECEIVED)

}


exports.getAllBooks = async function(req, res){
  let book = new Book()
  let books = await book.getAllBooks()
  new JsonResponse(req, res).jsonSuccess(books, new Messages().SUCCESSFULLY_RECEIVED)
  return books
}

exports.deleteById= async function(req, res){
 let book = new Book();
 await book.deleteById()
 new JsonResponse(req, res).jsonSuccess(true, new Messages().SUCCESSFULLY_DELETED)
}
    