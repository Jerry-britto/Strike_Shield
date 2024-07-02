import mongoose,{Schema} from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        stock:{
            type:Number,
            default:0
        },
        price:{
            type:Number,
            required:[true,"Price is mandatory"]
        },
        category:{
            type:String 
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        coverImage:{
            type:String,
        }
    },
    {timestamps:true}
)

export const Product = mongoose.model("Product",productSchema)