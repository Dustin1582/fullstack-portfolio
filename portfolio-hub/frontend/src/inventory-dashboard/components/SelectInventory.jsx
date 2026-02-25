
import { useState } from 'react'
import { inventoryItems } from '../data/data'

const SelectInventory = ({
    setQty, 
    setIsOpen, 
    setSelectedItem, 
    setSupplier, handleQtyChange,
    supplier,selectedItem, 
    current, qty, dropdownRef,
    isOpen, total, date, setDate, setOrder
}) => {
        const [errType, setErrType] = useState("")
        const priceCents = current ? current.priceCents : 0
        const price = (priceCents / 100)
        const priceString = price.toString();
        const qtyData = current ? current.stock : 0;
        const qtyString = qtyData.toString()

        const handlePOClick = () => {
            if(selectedItem === "" ){
                setErrType("inventory")
                return;
            }
            if(date === "") {
                setErrType("date")
                return;
            } 
            
            const priceCents = current ? Number(current.priceCents) : 0;
            const lineTotal = Number(total) || 0
            const addedQty = Number(qty) || 0
            setOrder((previousOrder) => {
                const existingIndex = previousOrder.findIndex((line) => line.name === selectedItem);
                if(existingIndex !== -1) {
                    const updated = [...previousOrder];
                    
                    const existing = updated[existingIndex];
                    const newQty = Number(existing.qty) + addedQty
                    const newLineTotal = Number(existing.total) + lineTotal
                    const subtotal = priceCents * newQty;

                    updated[existingIndex] = {
                        ...existing,
                        qty: newQty,
                        unitPrice: priceCents,
                        subtotal: subtotal,
                        total: newLineTotal,
                    };
                    
                    return updated;
                }
                
                return [
                    ...previousOrder,
                    {
                        name: selectedItem,
                        supplier: supplier,
                        date: date,
                        qty: Number(qty),
                        unitPrice: priceCents,
                        subtotal: priceCents * addedQty,
                        total: lineTotal
                    }
                ]
            })
        }

  return (
    <div className="po-box-light">
        <div className="po-title">
            <h5>Select Inventory</h5>
        </div>


        <div className="po-select-container">
            <div className="po-select-item">
                <div className="po-ddc">
                    
                    {/** Dropdown container */}
                    <div className={`ddc-main`} ref={dropdownRef}>
                        <label htmlFor="select-item" className={`si-label ${errType === "inventory" ? "err" : ""}`}>Select Item *</label>
                        <div className={`ddc-title ${errType === "inventory" ? "err-b" : ""}`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className={`ddc-title-container`}>
                                {selectedItem === "" ? 
                                    <div className="ddc-title-p-container">
                                        <p>-- Select Item --</p> 
                                        <p>{!isOpen ? "▼" : "▲"}</p> 
                                    </div>
                                    : 
                                    <div className="ddc-title-p-container">
                                        <p>{selectedItem}</p>
                                        <p>{!isOpen ? "▼" : "▲"}</p> 

                                    </div>}
                            </div>

                        </div>
                        {isOpen && <div className="ddc-body">
                            <div className="ddc-body-c">
                                {inventoryItems.map(item => (
                                    <div className="si-c" key={item.name}
                                        onClick={
                                            () => {
                                                setSelectedItem(item.name)
                                                setErrType("")
                                                setIsOpen(false)
                                                setQty(1)
                                            }
                                        }
                                    >
                                        <img src={item.img} alt={item.name} className="si-img"/>
                                        <p className="si-name">{item.name}</p>
                                    </div>
                                ))}

                            </div>
                        </div>}
                    </div>

                    {/** Supplier input container */}
                    <div className="po-supplier-c">
                        <label htmlFor="si" className="si-label">Supplier</label>
                        <input 
                            type="text" 
                            id="si"
                            className="po-s-input"
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            placeholder="Enter Supplier (optional)"
                        />
                    </div>

                    {/** Date */}
                    <div className="po-date-container">
                        <label htmlFor="po-date" className={`si-label ${errType === "date" ? "err" : ""}`}>Date *</label>
                        <input 
                            type="date" 
                            id="po-date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value)
                                setErrType("")
                            }}
                            required
                            className={`po-d-input ${errType === "date" ? "err-b" : ""}`}/>
                    </div>
                </div>
            </div>
        </div>

        
        <div className="display-container">
            <div className="outter-display">

                <div className="img-stock">
                    <section className="item-icon">
                            {selectedItem ? <img src={current.img} alt={current.name} className="item-img"/> :  <div className='item-img'></div>}
                        
                    </section>
                    <section className="item-name"><p>{current.name}</p></section>
                    <section className="item-stock"><p>In Stock: {qtyString}</p></section>
                    {/** border right */}
                    <div className="border-height"></div>
                </div>
                <div className="price-qty">
                    <div className="q-container">
                        <label htmlFor="qty">Quantity:</label>
                        <input type="number"
                            id="qty"
                            inputMode="numeric"
                            step={1}
                            min={0}
                            className="pur-qty-input"
                            value={selectedItem ? qty : 0} 
                            onChange={(e) => handleQtyChange(e)}
                        />
                    </div>
                    <div className="p-container">
                        <label htmlFor="price">Unit Cost:</label>
                        <input type="text"
                            id="price"
                            className="pur-qty-input"
                            value={priceString} 
                            disabled
                            />
                    </div>
                </div>
            </div>
        </div>
        {/** border bottom */}

        <div className="purchase-btn-container">
            <div className="total-cost-c">
                <p>Total Cost: <span className="total-c">{total ? Number(total) / 100 : "0"}</span></p>
            </div>
            <div className="btn-c">
                <div className={`po-button ${selectedItem !== "" && date !== "" ? "active" : ""}`}
                onClick={() => handlePOClick()}
                >Purchase</div>
            </div>
        </div>
    </div>
  )
}

export default SelectInventory
