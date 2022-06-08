const mongoose=require('mongoose')
const SchemaVariable=mongoose.Schema

const AuthSchema=new SchemaVariable({
    fname:{
        type:String,
        required:true

    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
      items: [
        {
          productId: {
            type: SchemaVariable.Types.ObjectId,
            ref: "Products",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            // min: [1, "Quantity can not be less than 1."],
          },
        },
      ],
    },
  });
  
  AuthSchema.methods.addToCart = function (product) {
    // 'this' keyword still refers to the schema
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
  
    this.cart = updatedCart;
    return this.save();
  };
  
  AuthSchema.methods.removeOne = function (product) {
    // 'this' keyword still refers to the schema
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
  
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity - 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    const updatedCart = {
      items: updatedCartItems,
    };
  
    this.cart = updatedCart;
    return this.save();
  };
  
  AuthSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  };
  
  AuthSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
  };


module.exports=mongoose.model('AuthData',AuthSchema)

//mongoose.model('collection name',Schema name)