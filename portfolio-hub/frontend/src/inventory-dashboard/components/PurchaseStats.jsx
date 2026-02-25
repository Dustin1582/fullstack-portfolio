import React, { useEffect, useState, useMemo } from 'react'
import fetchWithAuth from '../helpers/Authorization'
import { useAuth } from '../context/AuthContext'
import "../css/PurchaseStats.css"

const PurchaseStats = ({confirmedOrder, setTotalOrder}) => {
    const { accessToken, setAccessToken, URL } = useAuth();
    const [ orderData, setOrderData] = useState([]);
    const [ orderCount, setOrderCount] = useState([]);

    const tabs = [
        {id: 1, name: "Spending", icon: "svg-purchasing/Calendar-Coin.svg", bgColor: "#5ecc48"}, 
        {id: 2, name: "Orders", icon: "svg-purchasing/Calendar-Box.svg", bgColor: "#ffd58e"}, 
        {id: 3, name: "Top Supplier", icon: "svg-purchasing/Medal.svg", bgColor: "#8bbfdd"}
    ];

    // filter by month and year
    const filteredOrderData = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return orderData.filter((obj) => {
            const d = new Date(obj.date);
            if (Number.isNaN(d.getTime())) return false;
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

    }, [orderData]);

    const filteredOrderDataQty = useMemo(() => {
        return filteredOrderData.reduce((sum, item) => {
            return sum + Number(item.qty || 0);
        }, 0)
    })

    // const topSupplierThisMonth = useMemo(() => {
    //     const supplier = filteredOrderData.map(item => item.supplier);

    //     const supplierCount = supplier.reduce((obj, name) => {
    //         const currentCount = obj[name] || 0 //how many times the name appears
    //         const next = currentCount + 1;

    //         obj[name] = next;
    //         return obj
    //     }, {});

    //     let topSupplier = ""
    //     let topCount = 0;

    //     for(const name in supplierCount) {
    //         const count = supplierCount[name];

    //         if(count > topCount) {
    //             topSupplier = name;
    //             topCount = count;
    //         }
    //     }
    //     return {supplier: topSupplier, count: topCount}
    // });


    const supplierTotal = useMemo(() => {
       const totalsSoFarWTax = filteredOrderData.reduce((totals, order) => {
            const supplierName = order.supplier;
            const tax = (Number(order.unitPriceCents) * Number(order.qty)) * 0.07;
            const totalWTax = Math.round((Number(order.unitPriceCents) * Number(order.qty)) + tax);

            if(!totals[supplierName]){
                totals[supplierName] = { supplier: supplierName, qty: 0, total: 0};
            }

            totals[supplierName].qty += Number(order.qty || 0);
            totals[supplierName].total += Number(totalWTax);

            return totals
       }, {});

       return totalsSoFarWTax
    }, [filteredOrderData])
    const supplierTotalArray = Object.values(supplierTotal)
    console.log(supplierTotalArray)
    
    const getHeighestTotals = (array) => {
        let max = 0;
        let secondMax = 0

        for(const item of array) {
            if(item.total >= max) {
                secondMax = max
                max = item.total
            }

            else if(item.total > secondMax) {
                secondMax = item.total;
            }
        }

        return {
            max: max === -Infinity ? null : max, 
            secondMax: secondMax === -Infinity ? null : secondMax
        }
    }


  useEffect(() => {
    const controller = new AbortController();

      const load = async () => {
        try {
          const results = await Promise.all([
            fetchWithAuth({
              URL: URL,
              endpoint: 'inventory/all-items',
              accessToken: accessToken,
              setAccessToken: setAccessToken,
              options: {
                method: "GET",
                credentials: 'include'
              },
            }),
            fetchWithAuth({
              URL: URL,
              endpoint:'inventory/item-count',
              accessToken:accessToken,
              setAccessToken:setAccessToken,
              options: {
                method: 'GET',
                credentials: 'include'
              }
            })

          ]);

          const itemsResult = results[0];
          const itemsCountResult = results[1]; 

          const itemsJson = await itemsResult.json().catch(() => null);
          const itemsCountJson = await itemsCountResult.json().catch(() => null);
          
          if(itemsResult.ok) setOrderData(itemsJson);
          if(itemsCountResult.ok) setOrderCount(itemsCountJson.count);
          
          if(!itemsResult.ok) console.error('(Home) Items Failed to fetch data: ', itemsJson);
          if(!itemsCountResult.ok) console.error('(Home) Items-Count Failed to fetch data: ', itemsCountJson);
          
        } catch (error) {
          if(error.message === "AbortError") return;
          console.error("Purchase Stats Get-all/count", error.message);
        }
      }

      load();

      return () => controller.abort();
  }, [confirmedOrder]);

  return (
    <div className='outter-mr-container'>
        <div className="inner-mr-container">

            <div className="mr-h-c stats">
                <div className="mr-h">
                    <h5 className='stats'>Monthly Statistics</h5>
                </div>
            </div>
            <div className="border-width"></div>
            <div className="header-tabs">
                {tabs.map(tab => {
                    const firstName = tab.name.split(" ")[0]

                    let unitPrice = 0;
                    let qty = 0;
                    let subtotal = 0;
                    let shipping = 0;
                    let tax = 0;
                    let total = 0;
                    let fulltotal = 0;
                    let fullTotalDisplay = ""
                    let company = "";

                    for(const items of filteredOrderData) {
                        unitPrice = Number(items.unitPriceCents || 0);
                        qty = Number(items.qty || 0);
                        subtotal = unitPrice * qty;
                        shipping = subtotal < 5000 ? 15 : 0
                        tax = Math.round(subtotal * 0.07)
                        total = subtotal + shipping + tax;

                        fulltotal += total
                        fullTotalDisplay = (fulltotal / 100).toFixed(2)

                        company = items.supplier.split(" ")[0]
                    }

                    return (
                        <div 
                            className={`tab ${firstName}`} 
                            key={tab.id}
                                
                        >
                            <div className="tab-img" style={{backgroundColor : tab.bgColor}}>
                                <img src={tab.icon} alt={tab.name} />
                            </div>
                            <div className="column-tab-info">
                                <div className="tab-name">
                                    <p>{tab.name}</p>
                                </div>
                                <div className="tab-total">
                                    {firstName === "Spending" ? <h6>{`$ ${fullTotalDisplay}`}</h6> 
                                        : firstName === "Orders" ? <h6>{filteredOrderDataQty}</h6> 
                                            : <p>{company}</p>}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="border-width ps-bw"></div>
            <div className="suppliers-container">
                <div className="s-header">
                    <h4>Suppliers</h4>
                </div>
                <div className="s-table-c">
                    {(() => {
                        const {max, secondMax} = getHeighestTotals(supplierTotalArray)
                        const top = supplierTotalArray.find(x => Number(x.total) === max);
                        const bottom = supplierTotalArray.find(x => Number(x.total) === secondMax)

                        return (
                            <>
                                {top ? (
                                    <div className="max-tbl">
                                        <table className='max-table'>
                                            <thead className='max-tbl-head'>
                                                <tr>
                                                    <th>Top Supplier</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className='max-tbl-body'>
                                                <tr>
                                                    <td>{top.supplier}</td>
                                                    <td style={{color: "green"}}>{(Number(top.total) / 100).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <h4 className='no-info'>No information to display</h4>
                                
                                )}
                                {bottom ? (
                                    <div className="max-tbl bottom">
                                        <table className='max-table bottom'>
                                            <thead className='max-tbl-head bottom'>
                                                <tr>
                                                    <th>Runner up</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className='max-tbl-body bottom'>
                                                <tr>
                                                    <td>{top.supplier}</td>
                                                    <td>{(Number(bottom.total) / 100).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )
                    })()}
                </div>
            </div>           
        </div>
    </div>
  )
}

export default PurchaseStats
