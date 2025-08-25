# ShopList - Inventory Management API

A REST API for small e-commerce shops to manage product inventory built with Node.js, Express, and PostgreSQL.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup PostgreSQL database:**
   ```bash
   createdb shoplist
   npm run db:migrate
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string

4. **Start the server:**
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

## API Endpoints

### Public Endpoints
- `GET /products` - List products (supports pagination & search)
- `GET /products/:id` - Get product by ID
- `GET /health` - Health check

### Protected Endpoints (Basic Auth Required)
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Testing with cURL

### Create Product (Protected)
```bash
curl -X POST http://localhost:8080/products \
  -H "Authorization: Basic $(printf 'admin:secret' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"name":"T-shirt","description":"Cotton, size M","price":19.99,"quantity":100,"sku":"TSHIRT-M-001"}'
```

### List Products (Public)
```bash
curl "http://localhost:8080/products?page=1&limit=5&search=TSHIRT"
```

### Get Product by ID (Public)
```bash
curl http://localhost:8080/products/<uuid>
```

### Update Product (Protected)
```bash
curl -X PUT http://localhost:8080/products/<uuid> \
  -H "Authorization: Basic $(printf 'admin:secret' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"name":"T-shirt","description":"Cotton, size L","price":21.99,"quantity":120,"sku":"TSHIRT-L-001"}'
```

### Delete Product (Protected)
```bash
curl -X DELETE http://localhost:8080/products/<uuid> \
  -H "Authorization: Basic $(printf 'admin:secret' | base64)"
```

## Architecture

The API follows a layered architecture:

```
Route → Controller → Service → Repository → Database
```

- **Routes**: HTTP endpoint definitions with authentication
- **Controllers**: Request/response handling and validation
- **Services**: Business logic and data validation
- **Repositories**: Database queries and data access
- **Database**: PostgreSQL with proper schema and constraints

## Database Schema

Products table with:
- UUID primary key
- Name, description, price, quantity, SKU fields
- Automatic timestamps (created_at, updated_at)
- Indexes on name and SKU for search performance
- Constraints for data integrity