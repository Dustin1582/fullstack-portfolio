import { useEffect, useRef, useState } from "react"
import { inventoryItems } from "../data/data"
import SelectInventory from "../components/SelectInventory";
import Cart from "../components/Cart";
import "../css/Purchase.css"

const Purchase = ({currentUser, setConfirmedOrder, order, setOrder, darkTheme}) => {
    const dropdownRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [date, setDate] = useState('');
    const [error, setError] = useState(false);
    const [qty, setQty] = useState(0);
    const [total, setTotal] = useState('');
    const [supplier, setSupplier] = useState('');

    const [keepItem, setKeepItem] = useState({});

    const [isLoading, setIsLoading ] = useState(false)


    useEffect(() => {
        if(!open) return;
        const handleOutsideClick = (event) => {
            const container = dropdownRef.current
            if(!container) return

            const clickedInside = container.contains(event.target);
            if(!clickedInside) {
                setIsOpen(false)
            }
        };

        window.addEventListener("click", handleOutsideClick);

        return () => {
            window.removeEventListener("click", handleOutsideClick)
        }
    }, [open]);

    const current = inventoryItems.find(item => item.name === selectedItem) || "";


    
    const handleQtyChange = (e) => {
        setError(false);
        const raw = e.target.value;
        
        const asNumber = Number(raw)
        if(!Number.isInteger(asNumber)) {
            setError(true)
            return
        }
        
        setQty(asNumber)
    }
    
    useEffect(() => {
        if (qty === 0) return
        const calculateTotalWTax = () => {
            const current = inventoryItems.find(item => item.name === selectedItem) || "";
            const priceCents = current ? current.priceCents : 0
            
            const totalBeforeTaxCents = qty * priceCents;
            const tax = Math.round(totalBeforeTaxCents * 0.0725 );
            const totalAfterTax = totalBeforeTaxCents + tax
            
            
        
            setTotal(totalAfterTax)
        }

        calculateTotalWTax();
    }, [qty, selectedItem])

  return (
    <div className='purchase'>
        {isLoading ? <div className="loading"></div> : <></>}
        <section className='purchase-order'>
            {/* Start of window display */}
            <SelectInventory 
                setQty={setQty} setIsOpen={setIsOpen} setSelectedItem={setSelectedItem}
                setSupplier={setSupplier} handleQtyChange={handleQtyChange} supplier={supplier}
                qty={qty} selectedItem={selectedItem} current={current} dropdownRef={dropdownRef}
                isOpen={isOpen} total={total} date={date} setDate={setDate} order={order} setOrder={setOrder}
                darkTheme={darkTheme}
            />
        </section>
        <section className='purchase-cart'>
            <Cart order={order} keepItem={keepItem} 
                setOrder={setOrder}
                setKeepItem={setKeepItem} 
                setConfirmedOrder={setConfirmedOrder}
                currentUser={currentUser}
                supplier={supplier}
                setSupplier={setSupplier}
                setIsLoading={setIsLoading}
                darkTheme={darkTheme}
            />
        </section>
    </div>
  )
}

export default Purchase
