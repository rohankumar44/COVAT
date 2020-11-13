import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function ShopOrderItems(props) {
    var columnDefs = [
        { 
            headerName: 'ORDER NO.',
            field: 'orderNumber',
            sortable: true,
            width: "250", 
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true
        },
        {
            headerName: 'CUSTOMER NAME',
            field: 'name',
            textAlign: 'center',
            width: "250", 
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true
        },
        { 
            headerName: 'SHIPPING ADDRESS', 
            field: 'shippingAddress', 
            width: "500", 
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true 
        },
        { 
            headerName: 'CUSTOMER CONTACT', 
            field: 'contactNumber',
            width: "200",
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true 
        },
        { 
            headerName: 'QUANTITY',
            field: 'quantity',
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
            sortable: true
        },
        { 
            headerName: 'PRICE', 
            field: 'price', 
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
            sortable: true
        },
        { 
            headerName: 'DATE OF ORDER', 
            field: 'dateOfOrder', 
            //width: "250", 
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
            sortable: true
        },
        { 
            headerName: 'DATE OF DELIVERY', 
            field: 'dateOfDelivery',
            //width: "250", 
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
            sortable: true
        }
    ];
    
    const rowData = props.orders.map(order => {
        return {
            orderNumber: order._id,
            contactNumber: order.contactNumber,
            quantity: order.quantity,
            price: order.price,
            shippingAddress: order.shippingAddress,
            id: order.shopkeeperId,
            delivered: order.delivered,
            dateOfDelivery: order.dateOfDelivery.slice(0,15),
            dateOfOrder: order.dateOfOrder.slice(0,15),
            name: order.name
        };
    });

    return (
        <div style={{ 
            height: 600, 
            width: "100%", 
            borderLeft: "1px solid grey", 
            borderTop: "1px solid grey" 
        }}
        >
            <AgGridReact className="ag-theme-alpine"
                rowData={rowData} onGridReady
                columnDefs={columnDefs}
                onRowClicked={props.onOrderClicked}
            >
            </AgGridReact>{props.alert}
        </div>
    )
}

export default ShopOrderItems;
