
                const bcrypt = require("bcryptjs");
                const Messages = require("../constants/Messages");
                const TryCatch = require("../helper/TryCatch");
                const { ObjectId } = require('mongodb');
                const booksCollection = require("../db").db().collection("book");
                
                let Book = function (data) {
                  this.data = data;
                  this.errors = [];
                };
                
                Book.prototype.cleanUp = function () {
                  // get rid of any bogus properties
                  this.data = {
                      
                
                //predfined start
                    createdAt: new Date(),
                //predefined end
                  };
                };
                              
                Book.prototype.getById = async function (id){
                  let bookDoc = await booksCollection.findOne({_id: new ObjectId(id)})
                  return bookDoc
                }
                
                Book.prototype.getAllBooks = async function (){
                  let bookDoc = await booksCollection.find({}).toArray()
                  return bookDoc
                }
                
                Book.prototype.deleteById = async function (id){
                 await booksCollection.deleteOne({_id: new ObjectId(id)})
                  return 
                }
                
                module.exports = Book;             
            