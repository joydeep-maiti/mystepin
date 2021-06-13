const roles = [
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "General Manager", value: "General Manager" },
    { label: "Staff", value: "Staff" },
]

const departments = [
    { label: "Front Office", value: "Front Office" },
    { label: "Restaurant", value: "Restaurant" },
    { label: "Finance", value: "Finance" },
    { label: "Operations", value: "Operations" },
    // { label: "IT", value: "IT" },
    { label: "House Keeping", value: "House Keeping" }
]

const permissions = {
    Configuration: ["Rooms", "Room Category", "Rate Master", "Season Master", "Taxes", "Property Details", "User Management", "Inventory", "Access Management"],
    Reports: ["Billing Details", "Booking Report", "POS Sales", "Agent", "Occupancy", "Collection Report", "Guest Details", "User Logs"],
    Others: ["Utility", "POS", "Booking", "Checkin/Checkout"],
    Default: ["Room Chart", "Occupancy Chart"]
}


exports.roles = roles
exports.departments = departments
exports.permissions = permissions