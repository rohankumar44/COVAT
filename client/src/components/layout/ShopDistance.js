import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function ShopDistance(props) {
    var columnDefs = [
        { 
            headerName: 'DISTANCE (KM)',
            field: 'distance',
            sortable: true, 
            width: 160,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true
        },
        {
            headerName: 'SHOPNAME',
            field: 'shopname',
            width: 230,
            textAlign: 'center',
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true
        },
        { 
            headerName: 'SHOP ADDRESS', 
            field: 'address', 
            width: 660,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true 
        },
        { 
            headerName: 'CONTACT', 
            field: 'contactnumber', 
            width: 180,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true 
        },
        { 
            headerName: 'AVAILABLE',
            field: 'available',
            width: 150,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
            sortable: true
        },
        { 
            headerName: 'SOLD', 
            field: 'sold', 
            width: 150,
            textAlign: 'center',
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
            sortable: true
        },
        { 
            headerName: 'PRICE', 
            field: 'price', 
            width: 150,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
            sortable: true
        }
    ];
    
    const rowData = props.users.map(user => {
        const newAddress = user.address.locality + ", " + user.address.landmark + ", " +
            user.address.state + ", " + user.address.pin + ", " + user.address.country;
        return {
            distance: user.distance,
            shopname: user.shopName,
            address: newAddress,
            contactnumber: user.contactNumber,
            available: user.available,
            sold: user.sold,
            price: user.price,
            id: user.id
        };
    });

    return (
        <div style={{ height: 400, width: "100%" }}>
            <AgGridReact className="ag-theme-alpine"
                rowData={rowData} onGridReady
                columnDefs={columnDefs}
                onRowClicked={props.onShopClicked}
            >
            </AgGridReact>{props.alert}
        </div>
    )
}

export default ShopDistance;
