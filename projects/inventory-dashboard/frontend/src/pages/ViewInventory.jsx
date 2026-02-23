import { useEffect, useMemo, useState } from 'react'
import '../css/CreateInventory.css'
import { useAuth } from '../context/AuthContext'
import fetchWithAuth from '../helpers/Authorization';
const ViewInventory = ({confirmedOrder, dbFiles, setDbFiles}) => {
    const { accessToken, setAccessToken, URL } = useAuth();
    
    const [ search, setSearch ] = useState('');

    useEffect(() => {
        let isMounted = true;
        const allFiles = async () => {
            try {
                const res = await fetchWithAuth({
                    URL: URL,
                    endpoint:"inventory/all-items",
                    accessToken: accessToken,
                    setAccessToken: setAccessToken,
                    options: {
                        method: "GET",
                        credentials: "include"
                    }
                });

                const json = await res.json().catch(() => null)

                if(!res.ok) {
                    console.error("Create Inventory Fetch Error");
                    return
                }

                if(isMounted) setDbFiles(json);

            } catch (error) {
                console.error("Create Inventory Error: ", error.message)
                return
            }
        }

        allFiles();

        return () => {
            isMounted = false
        }

    }, [confirmedOrder, accessToken, URL, setAccessToken])


    const searchResults = useMemo(() => {
        const query = search.trim().toLowerCase();
        if(query === "") return dbFiles

        return dbFiles.filter((order) => {
            const itemName = order.itemNameLowered;
            const createdBy = order.createdBy.toLowerCase();
            const supplier = order.supplier.toLowerCase();
            const date = new Date(order.date);
            const year = String(date.getFullYear());
            const month = date.toLocaleString("en-us", {month: "short"}).toLowerCase();
            const day = String(date.getDate())


            return itemName.includes(query) || createdBy.includes(query) || supplier.includes(query) ||
                year.includes(query) || month.includes(query) || day.includes(query)
        });

  }, [search, dbFiles]);

    return (
    <div className='CI-Container'>
        <div className='form-container'>
            <div className="input-container">
                <label htmlFor="search">Search Product</label>
                <input 
                    type="search" 
                    id="search" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>
        </div>
        <div className='table-container'>
            <table className='inv-tbl'>
                <thead className='inv-thead'>
                    <tr>
                        <th>Id</th>
                        <th>Created by</th>
                        <th>Date created</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Recieved from</th>
                    </tr>
                </thead>
                <tbody className='inv-body'>
                    {searchResults.map(item => {
                        const qty = Number(item.qty);
                        const unitPrice = Number(item.unitPriceCents);
                        const sub = qty * unitPrice;
                        const tax = Math.round(sub * 0.07);
                        const preTotal = sub + tax;
                        const total = (preTotal / 100).toFixed(2)
                        const date = new Date(item.date);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = date.toLocaleString("en-us", {month: "short"});
                        const year = String(date.getFullYear());
                        return (
                            <tr key={item._id} className='inv-tr'>
                                <td className='inv-id'>{item._id}</td>
                                <td className='centered'>{item.createdBy}</td>
                                <td className='centered'>{`${month} ${day}, ${year}`}</td>
                                <td className='centered'>{item.itemName}</td>
                                <td className='centered'>{item.qty}</td>
                                <td className='centered'>{total}</td>
                                <td className='centered'>{item.supplier}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default ViewInventory
