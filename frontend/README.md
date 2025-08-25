# ShopList Frontend

A modern, responsive web interface for the ShopList Inventory Management API.

## Features

✅ **Product Management**
- Add new products with validation
- Edit existing products
- Delete products with confirmation
- View product details in cards

✅ **Search & Pagination**
- Search products by name or SKU
- Paginated product listing
- Real-time search results

✅ **Responsive Design**
- Mobile-friendly interface
- Clean, modern UI
- Smooth animations and transitions

✅ **Error Handling**
- User-friendly error messages
- Success notifications
- Loading states

## Quick Start

1. **Start the API server** (from project root):
   ```bash
   npm start
   ```

2. **Open the frontend**:
   - Open `frontend/index.html` in your browser
   - Or serve it with a local server:
     ```bash
     # Using Python
     cd frontend
     python -m http.server 8000
     
     # Using Node.js (if you have http-server)
     npx http-server frontend
     ```

3. **Access the application**:
   - Direct file: `file:///path/to/frontend/index.html`
   - Local server: `http://localhost:8000`

## Configuration

The frontend is configured to connect to the API at `http://localhost:3000`. 

To change the API URL, edit the `API_BASE_URL` in `js/app.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000';
```

## Authentication

The frontend uses Basic Authentication with default credentials:
- Username: `admin`
- Password: `secret`

These are hardcoded in `js/app.js` for simplicity. In production, implement proper authentication.

## File Structure

```
frontend/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Styling
├── js/
│   └── app.js         # JavaScript functionality
└── README.md          # This file
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Features in Detail

### Add Product
- Form validation for all required fields
- Real-time feedback
- Automatic form reset after successful submission

### Product Grid
- Responsive card layout
- Hover effects
- Action buttons for edit/delete

### Search
- Search by product name or SKU
- Instant results
- Clear search functionality

### Pagination
- Navigate through product pages
- Shows current page
- Previous/Next navigation

### Edit Modal
- Popup modal for editing
- Pre-filled with current values
- Cancel/Update options