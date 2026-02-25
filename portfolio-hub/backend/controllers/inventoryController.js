const inventorySchema = require('../models/inventory');
const normalizeText = require('../middleware/normalizeText');
const leoProfanity = require('leo-profanity');

const inputItem = async (req, res) => {
    try {
        const {date, createdBy, itemName, qty, unitPriceCents, supplier} = req.body;
        console.log("Supplier: ", supplier)
        const supplierNormalized = normalizeText(supplier);
        if(leoProfanity.check(supplierNormalized)) {
            return res.status(400).json({message: "Supplier name contains blocked language."})
        }

        if(!createdBy) {
            console.error('Missing createdBy')
            return res.status(400).json({message: 'Must fill out createdBy field to continue'})
        }

        if(!itemName ) {
            console.error('Missing itemName')
            return res.status(400).json({message: 'Must fill out itemName field to continue'})
        }
        if( !supplier ) {
            console.error('Missing supplier')
            return res.status(400).json({message: 'Must fill out supplier field to continue'})
        }
        
        const itemNameLowered = itemName.trim().toLowerCase()
        const qtyNumber = Number(qty);
        const unitPriceNumber = Number(unitPriceCents)
        
        if(Number.isNaN(qtyNumber) || qtyNumber < 0) {
            console.error("Invalid Qty", qtyNumber);
            return res.status(400).json({message: 'Qty must be greater than 0'})
            
        }
        
        if(Number.isNaN(unitPriceNumber) || unitPriceNumber <= 0) {
            console.error("Invalid Price", unitPriceNumber);
            return res.status(400).json({message: 'priceCents must be greater than 0'})

        }

        const createdOrder = await inventorySchema.create({
            date: date,
            createdBy: createdBy,
            itemName: itemName,
            itemNameLowered:itemNameLowered,
            qty: qtyNumber,
            unitPriceCents: unitPriceNumber,
            supplier: supplier
        })


        console.log('Created Item')
        
        return res.status(200).json(createdOrder);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({message: error.message})
    }
    
}

const updateItem = async (req, res) => {
    try {
        const id = req.params.id;
        
        const updates = {}

        if(req.body.itemName !== undefined) {
            updates.itemName = String(req.body.itemName)
        }

        if(req.body.desc !== undefined) {
            updates.desc = String(req.body.desc)
        }

        if(req.body.priceCents !== undefined) {
            const priceNumber = Number(req.body.priceCents);

            if(Number.isNaN(priceNumber) || priceNumber <= 0) {
                return res.status(400).json({ message: "priceCents must be greater than 0" });
            }
            updates.priceCents = priceNumber;
        }

            // If they sent nothing usable
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update" });
        }

        const updated = await inventorySchema.findByIdAndUpdate(
            id,
            {$set: updates},
            {new: true}
        );

        if (!updated) {
            return res.status(404).json({ message: "Item not found" });
        }

        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAllItems = async (req, res) => {
    try {
        const items = await inventorySchema.find().sort({itemNameLowered: 1})
        return res.status(200).json(items)
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: `Server Error: ${error.message}`})
    }
}

const getItemCount = async (req, res) => {
    try {
        const count = await inventorySchema.countDocuments({ qty: {$gt: 0}});
        return res.status(200).json({count: count})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message})
    }
}

const searchItem = async (req, res) => {
    try {
        const query = String(req.query.query || "" ).trim().toLowerCase();

        if(!query){
            res.status(400).json({message: "query is required"});
        }

        const results = await inventorySchema.find({
            itemNameLowered: {$regex: query, $options: "i"},
        }).sort({itemNameLowered: 1});

        return res.status(200).json(results)
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message})
    }
}


const deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await inventorySchema.findByIdAndDelete(id);

        if(!deleted) {
            return res.status(404).json({message: "Items not found."})
        }

        return res.status(200).json({message: "Deleted item.", deletedId: deleted._id})
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }


}

module.exports = { inputItem,  getAllItems, getItemCount, searchItem, updateItem, deleteItem }