const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
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
        
        // Create unique index on trackingCode
        await shipmentsCollection.createIndex({ trackingCode: 1 }, { unique: true });
        
        // Initialize default data if empty
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
                sender: { name: 'Prince Hamdan Fazza', country: 'United Arab Emirates', phone: 'N/A' },
                receiver: { name: 'Aleksandar Molan', phone: '+381692609980', email: 'molan-aleksandar@hotmail.com' },
                parcel: { 
                    weight: '2.5 kg', 
                    type: 'Documents', 
                    dutyFees: 'Paid',  // ← DUTY FEES SET BY ADMIN
                    pickupDate: now, 
                    expectedDelivery: 'Mar 28, 2026', 
                    trackingStatus: 'Order Confirmed' 
                },
                timeline: [
                    { date: now, title: 'Order Confirmed', desc: 'Your shipment has been confirmed and is being processed.', completed: true, active: true },
                    { date: 'Pending', title: 'Picked by Courier', desc: 'Courier will pick up the package', completed: false, active: false },
                    { date: 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: false, active: false },
                    { date: 'Pending', title: 'Delivered', desc: 'Package delivered', completed: false, active: false }
                ],
                origin: 'United Arab Emirates',
                destination: 'Serbia',
                coordinates: [25.2048, 55.2708]
            },
            {
                trackingCode: 'GL-4521-PK9M3RT7',
                status: 'picked',
                statusText: 'Picked by Courier',
                statusDesc: 'Your package has been picked up by our courier.',
                lastUpdated: now,
                sender: { name: 'Ahmed Al Maktoum', country: 'United Arab Emirates', phone: '+971 50 123 4567' },
                receiver: { name: 'Maria Garcia', phone: '+34 612 345 678', email: 'maria.garcia@email.com' },
                parcel: { 
                    weight: '5.2 kg', 
                    type: 'Electronics', 
                    dutyFees: 'Paid',  // ← DUTY FEES SET BY ADMIN
                    pickupDate: now, 
                    expectedDelivery: 'Mar 28, 2026', 
                    trackingStatus: 'Picked by Courier' 
                },
                timeline: [
                    { date: now, title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: true, active: false },
                    { date: now, title: 'Picked by Courier', desc: 'Package picked up by courier', completed: true, active: true },
                    { date: 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: false, active: false },
                    { date: 'Pending', title: 'Delivered', desc: 'Package delivered', completed: false, active: false }
                ],
                origin: 'United Arab Emirates',
                destination: 'Spain',
                coordinates: [25.2048, 55.2708]
            }
        ];
        
        await shipmentsCollection.insertMany(defaultShipments);
        console.log('✅ Default shipments added');
    }
}

connectDB();

// ============================================
// API ENDPOINTS
// ============================================

// Get all shipments (for admin)
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

// Get single shipment by tracking code
app.get('/api/shipments/:trackingCode', async (req, res) => {
    try {
        const trackingCode = req.params.trackingCode.toUpperCase();
        const shipment = await shipmentsCollection.findOne({ trackingCode });
        
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        
        const { _id, ...shipmentData } = shipment;
        res.json(shipmentData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE NEW SHIPMENT - ADMIN CAN SET DUTY FEES
app.post('/api/shipments', async (req, res) => {
    try {
        const { trackingCode, ...shipmentData } = req.body;
        const upperCode = trackingCode.toUpperCase();
        
        // Check if exists
        const existing = await shipmentsCollection.findOne({ trackingCode: upperCode });
        if (existing) {
            return res.status(409).json({ error: 'Tracking code already exists' });
        }
        
        const now = new Date().toLocaleString();
        
        // Status mapping
        const statusMap = {
            'order_confirmed': 'Order Confirmed',
            'picked': 'Picked by Courier',
            'onway': 'On The Way',
            'customs': 'Custom Hold',
            'delivered': 'Delivered'
        };
        
        // Build timeline based on status
        const status = shipmentData.status;
        const timeline = [
            { date: now, title: 'Order Confirmed', desc: 'Shipment confirmed', completed: status !== 'order_confirmed', active: status === 'order_confirmed' },
            { date: status === 'picked' || status === 'onway' || status === 'customs' || status === 'delivered' ? now : 'Pending', title: 'Picked by Courier', desc: 'Package picked up', completed: status === 'picked' || status === 'onway' || status === 'customs' || status === 'delivered', active: status === 'picked' },
            { date: status === 'onway' || status === 'customs' || status === 'delivered' ? now : 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: status === 'onway' || status === 'customs' || status === 'delivered', active: status === 'onway' },
            { date: status === 'customs' ? now : 'Pending', title: 'Custom Hold', desc: 'Customs clearance', completed: status === 'customs' || status === 'delivered', active: status === 'customs' },
            { date: status === 'delivered' ? now : 'Pending', title: 'Delivered', desc: 'Package delivered', completed: status === 'delivered', active: status === 'delivered' }
        ].filter(t => t.title !== 'Custom Hold' || status !== 'order_confirmed');
        
        const newShipment = {
            trackingCode: upperCode,
            status: status,
            statusText: statusMap[status],
            statusDesc: shipmentData.statusDesc || `Your shipment is ${statusMap[status].toLowerCase()}`,
            lastUpdated: now,
            createdAt: now,
            sender: shipmentData.sender || { name: 'N/A', country: 'Unknown', phone: 'N/A' },
            receiver: shipmentData.receiver || { name: 'N/A', phone: 'N/A', email: 'N/A' },
            parcel: {
                weight: shipmentData.parcel?.weight || 'N/A',
                type: shipmentData.parcel?.type || 'N/A',
                dutyFees: shipmentData.parcel?.dutyFees || 'Paid',  // ← DUTY FEES FROM ADMIN
                pickupDate: now,
                expectedDelivery: shipmentData.parcel?.expectedDelivery || 'Pending',
                trackingStatus: statusMap[status]
            },
            timeline: timeline,
            origin: shipmentData.sender?.country || 'Unknown',
            destination: shipmentData.receiver?.country || 'Unknown',
            coordinates: shipmentData.coordinates || [25.2048, 55.2708]
        };
        
        const result = await shipmentsCollection.insertOne(newShipment);
        res.json({ success: true, trackingCode: upperCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update shipment (admin)
app.put('/api/shipments/:trackingCode', async (req, res) => {
    try {
        const trackingCode = req.params.trackingCode.toUpperCase();
        const updateData = req.body;
        updateData.lastUpdated = new Date().toLocaleString();
        
        const result = await shipmentsCollection.updateOne(
            { trackingCode },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete shipment
app.delete('/api/shipments/:trackingCode', async (req, res) => {
    try {
        const trackingCode = req.params.trackingCode.toUpperCase();
        const result = await shipmentsCollection.deleteOne({ trackingCode });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 MongoDB Atlas: ${uri}`);
});
