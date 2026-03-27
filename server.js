const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch'); // ← ADD THIS

const app = express();
const PORT = process.env.PORT || 3000;


// Simple ping endpoint - FAST response with no loading
app.get('/ping', (req, res) => {
    res.status(200).send('OK');
});
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const uri = "mongodb+srv://mrdev:dev091339@cluster0.grjlq7v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let db;
let shipmentsCollection;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('globeswift');
        shipmentsCollection = db.collection('shipments');
        console.log('✅ Connected to MongoDB Atlas');
        await shipmentsCollection.createIndex({ trackingCode: 1 }, { unique: true });
        await initDefaultData();
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
}

async function initDefaultData() {
    const count = await shipmentsCollection.countDocuments();
    if (count === 0) {
        const now = new Date().toLocaleString();
        const defaultShipments = [
            {
                trackingCode: 'GL-3722-TAB2NLX6',
                status: 'order_confirmed',
                statusText: 'Order Confirmed',
                statusDesc: 'Your shipment has been confirmed and is being processed.',
                lastUpdated: now,
                sender: { name: 'Prince Hamdan Fazza', country: 'United Arab Emirates', address: 'Abu Dhabi, Dubai', phone: 'N/A' },
                receiver: { name: 'Aleksandar Molan', country: 'Serbia', address: 'Belgrade, Serbia', phone: '+381692609980', email: 'molan-aleksandar@hotmail.com' },
                parcel: { weight: '2.5 kg', type: 'Documents', dutyFeesStatus: 'Paid', dutyFeesAmount: 'EUR 25.00', dutyFeesDisplay: 'EUR 25.00', pickupDate: now, expectedDelivery: 'Mar 28, 2026', trackingStatus: 'Order Confirmed' },
                invoice: { orderId: '326', bookingMode: 'ToPay', shipmentCost: 'EUR 300', clearanceCost: 'EUR 350', totalAmount: 'EUR 650', paymentStatus: 'To Pay on Delivery' },
                timeline: [
                    { date: now, title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: true, active: true },
                    { date: 'Pending', title: 'Picked by Courier', desc: 'Courier will pick up the package', completed: false, active: false },
                    { date: 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: false, active: false },
                    { date: 'Pending', title: 'Delivered', desc: 'Package delivered', completed: false, active: false }
                ],
                origin: 'United Arab Emirates', destination: 'Serbia', coordinates: [25.2048, 55.2708]
            },
            {
                trackingCode: 'GL-4521-PK9M3RT7',
                status: 'picked',
                statusText: 'Picked by Courier',
                statusDesc: 'Your package has been picked up by our courier.',
                lastUpdated: now,
                sender: { name: 'Ahmed Al Maktoum', country: 'United Arab Emirates', address: 'Dubai Logistics Hub', phone: '+971 50 123 4567' },
                receiver: { name: 'Maria Garcia', country: 'Spain', address: 'Madrid, Spain', phone: '+34 612 345 678', email: 'maria.garcia@email.com' },
                parcel: { weight: '5.2 kg', type: 'Electronics', dutyFeesStatus: 'Paid', dutyFeesAmount: 'EUR 45.00', dutyFeesDisplay: 'EUR 45.00', pickupDate: now, expectedDelivery: 'Mar 28, 2026', trackingStatus: 'Picked by Courier' },
                invoice: { orderId: '452', bookingMode: 'Prepaid', shipmentCost: 'EUR 450', clearanceCost: 'EUR 200', totalAmount: 'EUR 650', paymentStatus: 'Paid' },
                timeline: [
                    { date: now, title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: true, active: false },
                    { date: now, title: 'Picked by Courier', desc: 'Package picked up by courier', completed: true, active: true },
                    { date: 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: false, active: false },
                    { date: 'Pending', title: 'Delivered', desc: 'Package delivered', completed: false, active: false }
                ],
                origin: 'United Arab Emirates', destination: 'Spain', coordinates: [25.2048, 55.2708]
            }
        ];
        await shipmentsCollection.insertMany(defaultShipments);
        console.log('✅ Default shipments added');
    }
}

connectDB();
// ============================================
// PING FUNCTION - KEEP SERVER AWAKE
// ============================================



// ============================================
// HEALTH CHECK ENDPOINT
// ============================================


// ============================================
// API ENDPOINTS
// ============================================

app.get('/api/shipments', async (req, res) => {
    try {
        const shipments = await shipmentsCollection.find({}).toArray();
        const shipmentsObj = {};
        shipments.forEach(s => {
            shipmentsObj[s.trackingCode] = {
                status: s.status,
                statusText: s.statusText,
                lastUpdated: s.lastUpdated,
                sender: s.sender,
                receiver: s.receiver,
                parcel: s.parcel,
                invoice: s.invoice,
                timeline: s.timeline,
                origin: s.origin,
                destination: s.destination,
                coordinates: s.coordinates
            };
        });
        res.json(shipmentsObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/shipments/:trackingCode', async (req, res) => {
    try {
        const trackingCode = req.params.trackingCode.toUpperCase();
        const shipment = await shipmentsCollection.findOne({ trackingCode });
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        const { _id, ...data } = shipment;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/shipments', async (req, res) => {
    try {
        const { trackingCode, ...shipmentData } = req.body;
        
        if (!trackingCode || !trackingCode.trim()) {
            return res.status(400).json({ error: 'Tracking code is required' });
        }
        
        const upperCode = trackingCode.toUpperCase();
        const existing = await shipmentsCollection.findOne({ trackingCode: upperCode });
        if (existing) return res.status(409).json({ error: 'Tracking code already exists' });
        
        const now = new Date().toLocaleString();
        const statusMap = {
            'order_confirmed': 'Order Confirmed',
            'picked': 'Picked by Courier',
            'onway': 'On The Way',
            'customs': 'Custom Hold',
            'delivered': 'Delivered'
        };
        
        const status = shipmentData.status || 'order_confirmed';
        const dutyAmount = shipmentData.parcel?.dutyFeesAmount || 'N/A';
        const dutyStatus = shipmentData.parcel?.dutyFeesStatus || 'Paid';
        
        const timeline = [
            { date: now, title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: status !== 'order_confirmed', active: status === 'order_confirmed' },
            { date: status === 'picked' || status === 'onway' || status === 'customs' || status === 'delivered' ? now : 'Pending', title: 'Picked by Courier', desc: 'Package picked up', completed: status === 'picked' || status === 'onway' || status === 'customs' || status === 'delivered', active: status === 'picked' },
            { date: status === 'onway' || status === 'customs' || status === 'delivered' ? now : 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: status === 'onway' || status === 'customs' || status === 'delivered', active: status === 'onway' },
            { date: status === 'customs' ? now : 'Pending', title: 'Custom Hold', desc: 'Customs clearance', completed: status === 'customs' || status === 'delivered', active: status === 'customs' },
            { date: status === 'delivered' ? now : 'Pending', title: 'Delivered', desc: 'Package delivered', completed: status === 'delivered', active: status === 'delivered' }
        ].filter(t => t.title !== 'Custom Hold' || status !== 'order_confirmed');
        
        const newShipment = {
            trackingCode: upperCode,
            status: status,
            statusText: statusMap[status],
            statusDesc: `Your shipment is ${statusMap[status].toLowerCase()}`,
            lastUpdated: now,
            createdAt: now,
            sender: {
                name: shipmentData.sender?.name || 'N/A',
                country: shipmentData.sender?.country || 'Unknown',
                address: shipmentData.sender?.address || '',
                phone: shipmentData.sender?.phone || 'N/A'
            },
            receiver: {
                name: shipmentData.receiver?.name || 'N/A',
                country: shipmentData.receiver?.country || 'Unknown',
                address: shipmentData.receiver?.address || '',
                phone: shipmentData.receiver?.phone || 'N/A',
                email: shipmentData.receiver?.email || 'N/A'
            },
            parcel: {
                weight: shipmentData.parcel?.weight || 'N/A',
                type: shipmentData.parcel?.type || 'N/A',
                dutyFeesStatus: dutyStatus,
                dutyFeesAmount: dutyAmount,
                dutyFeesDisplay: dutyAmount !== 'N/A' ? dutyAmount : dutyStatus,
                pickupDate: now,
                expectedDelivery: shipmentData.parcel?.expectedDelivery || 'Pending',
                trackingStatus: statusMap[status]
            },
            invoice: {
                orderId: shipmentData.invoice?.orderId || Math.floor(Math.random() * 9000 + 1000).toString(),
                bookingMode: shipmentData.invoice?.bookingMode || 'Standard',
                shipmentCost: shipmentData.invoice?.shipmentCost || 'N/A',
                clearanceCost: shipmentData.invoice?.clearanceCost || 'N/A',
                totalAmount: shipmentData.invoice?.totalAmount || 'N/A',
                paymentStatus: shipmentData.invoice?.paymentStatus || 'Pending'
            },
            timeline: timeline,
            origin: shipmentData.sender?.country || 'Unknown',
            destination: shipmentData.receiver?.country || 'Unknown',
            coordinates: shipmentData.coordinates || [25.2048, 55.2708]
        };
        
        await shipmentsCollection.insertOne(newShipment);
        res.json({ success: true, trackingCode: upperCode });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/shipments/:trackingCode', async (req, res) => {
    try {
        const trackingCode = req.params.trackingCode.toUpperCase();
        const updateData = req.body;
        updateData.lastUpdated = new Date().toLocaleString();
        if (updateData.receiver?.country) updateData.destination = updateData.receiver.country;
        const result = await shipmentsCollection.updateOne({ trackingCode }, { $set: updateData });
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Shipment not found' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/shipments/:trackingCode', async (req, res) => {
    try {
        const trackingCode = req.params.trackingCode.toUpperCase();
        const result = await shipmentsCollection.deleteOne({ trackingCode });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Shipment not found' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.get('*.html', (req, res) => { res.sendFile(path.join(__dirname, req.path)); });

// ============================================
// START SERVER WITH PING
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    
    // Start keep-alive ping (only in production)
    if (process.env.NODE_ENV === 'production' || true) {
        keepAlive();
    }
});
            
