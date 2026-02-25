const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    date: {
        type: Date, 
        default: Date.now,
        required: true
    },
    createdBy: {
        type: String,
        required: true,
        unique: false
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    itemNameLowered: {
        type: String,
        required: true,
        trim: true
    },
    qty: {
        type: Number,
        required: true,
        min: 0
    },
    unitPriceCents: {
        type: Number,
        required: true,
        min: 0
    },
    supplier: {
        type:String,
        required: true,
        trim: true
    }

}, {timestamps: true})


inventorySchema.pre("validate", function() {
    if(this.itemName){
        this.itemNameLowered = this.itemName.trim().toLowerCase();
    }
});

inventorySchema.index({createdBy: 1, itemNameLowered: 1});

module.exports = mongoose.model('Order-Inventory', inventorySchema)