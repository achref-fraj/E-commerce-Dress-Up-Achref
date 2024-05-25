import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
  title: {type:String, required:true},
  description: {type:String, required:true},
  price: {type: Number, required: true},
  colors :{type:String,required:true},
  sizes :{type:String,required:true},
  images: [{type: String}],
  gender:{type:String,required:true},
  category: {type:mongoose.Types.ObjectId, ref:'Category'},
});

export const Product = models.Product || model('Product', ProductSchema);