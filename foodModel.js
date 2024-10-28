const mongoose=require('mongoose')


const food=mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    price:{type:Object,required:true},
})
const Food=mongoose.model('Food',food)
module.exports=Food;