const express = require('express');
const router = express.Router();

const { inputItem, getAllItems, getItemCount, searchItem, updateItem, deleteItem } = require('../controllers/inventoryController');

router.post('/inventory', inputItem)
router.get('/inventory/all-items', getAllItems)
router.get('/inventory/item-count', getItemCount)
router.get('/inventory/item-search', searchItem)
router.patch('/inventory/:id', updateItem)
router.delete('/inventory/:id', deleteItem)

module.exports = router;