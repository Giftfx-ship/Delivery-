// ============================================
// GLOBESWIFT ADMIN DATA MANAGEMENT
// ============================================

// Default shipment database
const defaultShipments = {
    'GL-3722-TAB2NLX6': {
        status: 'order_confirmed',
        statusText: 'Order Confirmed',
        statusDesc: 'Your shipment has been confirmed and is being processed.',
        lastUpdated: 'Mar 26, 2026 - 05:48 PM',
        sender: {
            name: 'Prince Hamdan Fazza',
            country: 'United Arab Emirates',
            phone: 'N/A'
        },
        receiver: {
            name: 'Aleksandar Molan',
            phone: '+381692609980',
            email: 'molan-aleksandar@hotmail.com'
        },
        parcel: {
            weight: '2.5 kg',
            type: 'Documents',
            dutyFees: 'Paid',
            pickupDate: 'Mar 26, 2026 - 04:48 PM',
            expectedDelivery: 'Mar 28, 2026 - 04:48 PM',
            trackingStatus: 'Order Confirmed'
        },
        timeline: [
            { date: 'Mar 26, 2026 - 04:48 PM', title: 'Order Confirmed', desc: 'Your shipment has been confirmed and is being processed.', completed: true, active: true },
            { date: 'Pending', title: 'Picked by Courier', desc: 'Courier will pick up the package', completed: false, active: false },
            { date: 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: false, active: false },
            { date: 'Pending', title: 'Delivered', desc: 'Package delivered', completed: false, active: false }
        ],
        origin: 'United Arab Emirates',
        destination: 'Serbia',
        coordinates: [25.2048, 55.2708]
    },
    'GL-4521-PK9M3RT7': {
        status: 'picked',
        statusText: 'Picked by Courier',
        statusDesc: 'Your package has been picked up by our courier.',
        lastUpdated: 'Mar 26, 2026 - 02:30 PM',
        sender: {
            name: 'Ahmed Al Maktoum',
            country: 'United Arab Emirates',
            phone: '+971 50 123 4567'
        },
        receiver: {
            name: 'Maria Garcia',
            phone: '+34 612 345 678',
            email: 'maria.garcia@email.com'
        },
        parcel: {
            weight: '5.2 kg',
            type: 'Electronics',
            dutyFees: 'Paid',
            pickupDate: 'Mar 26, 2026 - 10:00 AM',
            expectedDelivery: 'Mar 28, 2026 - 06:00 PM',
            trackingStatus: 'Picked by Courier'
        },
        timeline: [
            { date: 'Mar 26, 2026 - 10:00 AM', title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: true, active: false },
            { date: 'Mar 26, 2026 - 02:30 PM', title: 'Picked by Courier', desc: 'Package picked up by courier', completed: true, active: true },
            { date: 'Pending', title: 'On The Way', desc: 'Shipment in transit', completed: false, active: false },
            { date: 'Pending', title: 'Delivered', desc: 'Package delivered', completed: false, active: false }
        ],
        origin: 'United Arab Emirates',
        destination: 'Spain',
        coordinates: [25.2048, 55.2708]
    },
    'GL-8912-XC4BV9N2': {
        status: 'onway',
        statusText: 'On The Way',
        statusDesc: 'Your shipment is in transit and moving through our network.',
        lastUpdated: 'Mar 26, 2026 - 08:00 AM',
        sender: {
            name: 'Dubai Logistics Co.',
            country: 'United Arab Emirates',
            phone: '+971 4 123 4567'
        },
        receiver: {
            name: 'James Wilson',
            phone: '+44 20 7946 0123',
            email: 'james.wilson@email.co.uk'
        },
        parcel: {
            weight: '12.8 kg',
            type: 'Commercial Goods',
            dutyFees: 'Paid',
            pickupDate: 'Mar 25, 2026 - 09:00 AM',
            expectedDelivery: 'Mar 27, 2026 - 03:00 PM',
            trackingStatus: 'On The Way'
        },
        timeline: [
            { date: 'Mar 25, 2026 - 09:00 AM', title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: true, active: false },
            { date: 'Mar 25, 2026 - 02:00 PM', title: 'Picked by Courier', desc: 'Package picked up', completed: true, active: false },
            { date: 'Mar 26, 2026 - 08:00 AM', title: 'On The Way', desc: 'Shipment in transit - Dubai Hub', completed: true, active: true },
            { date: 'Pending', title: 'Delivered', desc: 'Package delivered', completed: false, active: false }
        ],
        origin: 'United Arab Emirates',
        destination: 'United Kingdom',
        coordinates: [25.2048, 55.2708]
    },
    'GL-2345-DL8F6G1H': {
        status: 'customs',
        statusText: 'Custom Hold',
        statusDesc: 'Shipment is being held for customs clearance.',
        lastUpdated: 'Mar 26, 2026 - 11:00 AM',
        sender: {
            name: 'Global Trading LLC',
            country: 'China',
            phone: '+86 10 1234 5678'
        },
        receiver: {
            name: 'Robert Chen',
            phone: '+1 212 555 0123',
            email: 'robert.chen@email.com'
        },
        parcel: {
            weight: '25.0 kg',
            type: 'Electronics',
            dutyFees: 'Pending',
            pickupDate: 'Mar 24, 2026 - 08:00 AM',
            expectedDelivery: 'Pending Clearance',
            trackingStatus: 'Customs Hold'
        },
        timeline: [
            { date: 'Mar 24, 2026 - 08:00 AM', title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: true, active: false },
            { date: 'Mar 24, 2026 - 01:00 PM', title: 'Picked by Courier', desc: 'Package picked up', completed: true, active: false },
            { date: 'Mar 25, 2026 - 09:00 AM', title: 'On The Way', desc: 'Shipment in transit', completed: true, active: false },
            { date: 'Mar 26, 2026 - 11:00 AM', title: 'Custom Hold', desc: 'Awaiting customs clearance', completed: true, active: true }
        ],
        origin: 'China',
        destination: 'United States',
        coordinates: [39.9042, 116.4074]
    },
    'GL-6789-LM2N5P8Q': {
        status: 'delivered',
        statusText: 'Delivered',
        statusDesc: 'Your package has been successfully delivered.',
        lastUpdated: 'Mar 26, 2026 - 09:15 AM',
        sender: {
            name: 'Tech Supply Co.',
            country: 'Japan',
            phone: '+81 3 1234 5678'
        },
        receiver: {
            name: 'Sarah Johnson',
            phone: '+1 310 555 0987',
            email: 'sarah.johnson@email.com'
        },
        parcel: {
            weight: '3.2 kg',
            type: 'Electronics',
            dutyFees: 'Paid',
            pickupDate: 'Mar 20, 2026 - 10:00 AM',
            expectedDelivery: 'Mar 26, 2026 - 09:00 AM',
            trackingStatus: 'Delivered'
        },
        timeline: [
            { date: 'Mar 20, 2026 - 10:00 AM', title: 'Order Confirmed', desc: 'Your shipment has been confirmed', completed: true, active: false },
            { date: 'Mar 20, 2026 - 03:00 PM', title: 'Picked by Courier', desc: 'Package picked up', completed: true, active: false },
            { date: 'Mar 22, 2026 - 08:00 AM', title: 'On The Way', desc: 'Shipment in transit', completed: true, active: false },
            { date: 'Mar 26, 2026 - 09:15 AM', title: 'Delivered', desc: 'Signed by: Sarah J.', completed: true, active: true }
        ],
        origin: 'Japan',
        destination: 'United States',
        coordinates: [35.6762, 139.6503]
    }
};

// Status mapping
const statusMap = {
    'order_confirmed': { text: 'Order Confirmed', desc: 'Your shipment has been confirmed and is being processed.', icon: 'fa-check-circle' },
    'picked': { text: 'Picked by Courier', desc: 'Your package has been picked up by our courier.', icon: 'fa-truck' },
    'onway': { text: 'On The Way', desc: 'Your shipment is in transit and moving through our network.', icon: 'fa-shipping-fast' },
    'customs': { text: 'Custom Hold', desc: 'Shipment is being held for customs clearance.', icon: 'fa-clock' },
    'delivered': { text: 'Delivered', desc: 'Your package has been successfully delivered.', icon: 'fa-check-circle' }
};

// Storage key
const STORAGE_KEY = 'globeswift_shipments';

// ============================================
// CORE FUNCTIONS
// ============================================

// Get all shipments
function getAllShipments() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return { ...defaultShipments };
}

// Save all shipments
function saveAllShipments(shipments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
    return shipments;
}

// Get single shipment by tracking code
function getShipment(trackingCode) {
    const shipments = getAllShipments();
    return shipments[trackingCode.toUpperCase()] || null;
}

// Add new shipment
function addShipment(trackingCode, shipmentData) {
    const shipments = getAllShipments();
    const upperCode = trackingCode.toUpperCase();
    
    if (shipments[upperCode]) {
        return { success: false, error: 'Tracking code already exists' };
    }
    
    shipments[upperCode] = shipmentData;
    saveAllShipments(shipments);
    return { success: true, code: upperCode };
}

// Update existing shipment
function updateShipment(trackingCode, shipmentData) {
    const shipments = getAllShipments();
    const upperCode = trackingCode.toUpperCase();
    
    if (!shipments[upperCode]) {
        return { success: false, error: 'Shipment not found' };
    }
    
    shipments[upperCode] = { ...shipments[upperCode], ...shipmentData, lastUpdated: new Date().toLocaleString() };
    saveAllShipments(shipments);
    return { success: true };
}

// Delete shipment
function deleteShipment(trackingCode) {
    const shipments = getAllShipments();
    const upperCode = trackingCode.toUpperCase();
    
    if (!shipments[upperCode]) {
        return { success: false, error: 'Shipment not found' };
    }
    
    delete shipments[upperCode];
    saveAllShipments(shipments);
    return { success: true };
}

// Generate random tracking code
function generateTrackingCode() {
    const prefix = 'GL';
    const numbers = Math.floor(Math.random() * 9000) + 1000;
    const letters = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `${prefix}-${numbers}-${letters}`;
}

// Create shipment object from form data
function createShipmentObject(formData, status) {
    const now = new Date().toLocaleString();
    const statusInfo = statusMap[status];
    
    // Generate timeline based on status
    const timeline = [];
    const statusOrder = ['order_confirmed', 'picked', 'onway', 'customs', 'delivered'];
    let currentIndex = statusOrder.indexOf(status);
    
    statusOrder.forEach((s, index) => {
        let isCompleted = index <= currentIndex;
        let isActive = index === currentIndex;
        let date = isCompleted ? now : 'Pending';
        
        // Special handling for customs
        if (s === 'customs' && status !== 'customs' && status !== 'delivered') {
            isCompleted = false;
            isActive = false;
            date = 'Pending';
        }
        
        timeline.push({
            date: date,
            title: statusMap[s].text,
            desc: statusMap[s].desc,
            completed: isCompleted,
            active: isActive
        });
    });
    
    // Filter out customs if not relevant
    const filteredTimeline = timeline.filter(t => 
        t.title !== 'Custom Hold' || status === 'customs' || status === 'delivered'
    );
    
    return {
        status: status,
        statusText: statusInfo.text,
        statusDesc: statusInfo.desc,
        lastUpdated: now,
        sender: {
            name: formData.senderName || 'N/A',
            country: formData.senderCountry || 'Unknown',
            phone: formData.senderPhone || 'N/A'
        },
        receiver: {
            name: formData.receiverName || 'N/A',
            phone: formData.receiverPhone || 'N/A',
            email: formData.receiverEmail || 'N/A'
        },
        parcel: {
            weight: formData.weight || 'N/A',
            type: formData.type || 'N/A',
            dutyFees: formData.dutyFees || 'Paid',
            pickupDate: now,
            expectedDelivery: formData.expectedDelivery || 'Pending',
            trackingStatus: statusInfo.text
        },
        timeline: filteredTimeline,
        origin: formData.senderCountry || 'Unknown',
        destination: formData.receiverCountry || 'Unknown',
        coordinates: formData.coordinates || [25.2048, 55.2708]
    };
}

// Export shipments to JSON file
function exportShipments() {
    const shipments = getAllShipments();
    const dataStr = JSON.stringify(shipments, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `globeswift_shipments_${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Import shipments from JSON file
function importShipments(jsonData) {
    try {
        const imported = JSON.parse(jsonData);
        const current = getAllShipments();
        const merged = { ...current, ...imported };
        saveAllShipments(merged);
        return { success: true, count: Object.keys(imported).length };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Clear all shipments (danger!)
function clearAllShipments() {
    if (confirm('⚠️ DANGER: This will delete ALL shipments. Are you sure?')) {
        saveAllShipments({});
        return { success: true };
    }
    return { success: false };
}

// Reset to default shipments
function resetToDefault() {
    if (confirm('Reset all shipments to default?')) {
        saveAllShipments({ ...defaultShipments });
        return { success: true };
    }
    return { success: false };
}

// Get shipment count
function getShipmentCount() {
    return Object.keys(getAllShipments()).length;
}

// Search shipments
function searchShipments(query) {
    const shipments = getAllShipments();
    const lowerQuery = query.toLowerCase();
    const results = {};
    
    Object.entries(shipments).forEach(([code, data]) => {
        if (code.toLowerCase().includes(lowerQuery) ||
            data.sender?.name?.toLowerCase().includes(lowerQuery) ||
            data.receiver?.name?.toLowerCase().includes(lowerQuery)) {
            results[code] = data;
        }
    });
    
    return results;
}

// ============================================
// EXPORT FOR USE IN HTML
// ============================================

// Make functions available globally
window.GlobeSwiftAdmin = {
    getAllShipments,
    getShipment,
    addShipment,
    updateShipment,
    deleteShipment,
    generateTrackingCode,
    createShipmentObject,
    exportShipments,
    importShipments,
    clearAllShipments,
    resetToDefault,
    getShipmentCount,
    searchShipments,
    defaultShipments,
    statusMap,
    STORAGE_KEY
};

console.log('✅ GlobeSwift Admin Data Manager Loaded');
console.log(`📦 Current shipments: ${getShipmentCount()}`);
