import { useMemo, useState } from 'react'
import '../css/Cart.css'
import fetchWithAuth from '../helpers/Authorization';
import { useAuth } from '../context/AuthContext';

const Cart = ({
  order, setOrder, keepItem, 
  setKeepItem, setConfirmedOrder, 
  currentUser, supplier, 
  setIsLoading
}) => {
  
  const { accessToken, setAccessToken } = useAuth();
  const [isClicked, setIsClicked] = useState();
  
  const cartSummary = useMemo(() => {

    const safeCheck = Array.isArray(order) ? order : []

    const keptProducts = safeCheck.filter(item => {
      return keepItem[item.name] ?? true;
    });

    const totalCents = keptProducts.reduce((sum, item) => {
      return sum + Number(item.total || 0)
    }, 0)

    const subtotalCents = keptProducts.reduce((sum, item) => {
      return sum + Number(item.subtotal || 0);
    }, 0);

    const shippingDollars = subtotalCents < 5000 ? 15 : 0;

    const taxCents = totalCents - subtotalCents;

    return {
      subtotalCents,
      totalCents,
      shippingDollars,
      taxCents
    };

  }, [order, keepItem]);



  const sendData = async (URL, order) => {
    if(!Array.isArray(order) || order.length === 0) return;
    for(const obj of order){
      try {
        const res = await fetchWithAuth({
          URL:URL,
          accessToken: accessToken,
          setAccessToken: setAccessToken,
          endpoint: 'inventory',
          options: {
            method: "POST",
            headers: {
              "Content-Type" : "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
              date: obj.date,
              createdBy: currentUser.username,
              itemName: obj.name,
              qty: obj.qty,
              unitPriceCents: obj.unitPrice,
              supplier: obj.supplier
            })
          }
        })
  
        const json = await res.json().catch(() => null);
  
        if(!res.ok) {
          console.error("Server Error, ", json)
          return
        }

        setConfirmedOrder((prev) => {
          return prev + 1
        })
  
      } catch (error) {
        console.error(error.message);
        return;
      }

    }

  }


  const suppliers = [
    "Evergreen Wholesale Supply",
    "Summit Ridge Distributors",
    "Harborview Trade Co.",
    "Northstar Packaging & Goods",
    "Cedar Valley Supply Group"
  ];


  const subtotalDisplay = (cartSummary.subtotalCents / 100).toFixed(2)
  const taxDisplay = (cartSummary.taxCents / 100).toFixed(2)

  

  return (
    <div className='cart-main'>
      <div className="cart-main-header">

      </div>
      <div className="table-c">

        <table className='cart-table'>
          <thead className='cart-header'>
            <tr className='cart-header-row'>
              <th>item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody className='cart-body'>
            {Array.isArray(order) && order.length > 0 ? (
              order.filter((item) => {
                return keepItem[item.name] ?? true //unchecked means it goes away if the item in keepitem becomes false
              })
              .map((item) => {
                const itemName = item.name;
                const totalWTaxDisplay = (Number(item.total) / 100).toFixed(2);

                return (
                  <tr className='cart-body-row' key={item.name}>
                    <td>{itemName}</td>
                    <td>{item.qty}</td>
                    <td>{`$${Number(item.unitPrice / 100).toFixed(2)}`}</td>
                    <td className='total-check'>
                      <span className='total-check-inner'>
                        {`$${totalWTaxDisplay}`}
                        <input type="checkbox"
                          checked={keepItem[item.name] ?? true}
                          onChange={(e) => {
                            setKeepItem((prev) => {
                              return {...prev, [itemName] : e.target.checked}
                            })
                          }}
                        />

                      </span>
                    </td>
                  </tr>
                )
              })
            ): (
              <tr className='cart-body-row row2'></tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="subtotal-container">
        <table className='cart-sub-table'>
            <tbody className='cart-sub-body'> 
              <tr>
                <td>Subtotal: </td>
                <td>{`$${subtotalDisplay}`}</td>
              </tr>
              <tr>
                <td>Shipping: </td>
                <td>{cartSummary.totalCents !== 0 ? cartSummary.shippingDollars !== 0 ? `+ $${cartSummary.shippingDollars}.00` : "Free" : `$0.00`}</td>
              </tr>
              <tr>
                <td>Tax: </td>
                <td>{taxDisplay}</td>
              </tr>
            </tbody>
        </table>
        <div className="total-border"></div>
        <div className="total-bottom">
          <p className='first'>Total</p>
          <p>{Number(cartSummary.totalCents) !== 0 ? Number(((cartSummary.totalCents) / 100) + cartSummary.shippingDollars).toFixed(2) : 0}</p>
        </div>
      </div>
      <div className="cart-button-container">
        <div className={`cart-button ${order.length !== 0 ? "active" : ""}`}
          onClick={async () => {
            if(order.length === 0) return;
            if(isClicked) return;
            setIsClicked(true)
            setIsLoading(true)
            
            try{
                
                //for async call since variable work instanly
                let currentSupplier = supplier
                
                if(!currentSupplier || currentSupplier.trim() === "") {
                  const randSuppler = Math.floor(Math.random() * suppliers.length);
                  currentSupplier = suppliers[randSuppler]
                }

                const keptList = order
                  .filter((item) => {
                      return keepItem[item.name] ?? true // keep only the true items
                  })
                  .map((item) => {
                    return {
                      name: item.name,
                      date: item.date,
                      qty: Number(item.qty || 0),
                      unitPrice: Number(item.unitPrice || 0),
                      total: Number(item.total + cartSummary.shippingDollars || 0),
                      supplier: currentSupplier
                    }
                });

                await sendData('http://localhost:5500', keptList);
                
                setOrder([]);

            }catch(e) {
              console.error(e.message);
              return
            }
            finally {
              setIsLoading(false);
              setIsClicked(false);
            }
          }}
        >
          <p>Checkout</p>
        </div>
      </div>
    </div>
  )
}

export default Cart
