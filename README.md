# OpenAPI Architecture Explorer

[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0-green.svg)](https://swagger.io/specification/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![HTML5](https://img.shields.io/badge/HTML-5-orange.svg)](https://www.w3.org/TR/html52/)
[![CSS3](https://img.shields.io/badge/CSS-3-blue.svg)](https://www.w3.org/Style/CSS/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A visual explorer for understanding and navigating modular OpenAPI (Swagger) specifications. This tool helps you visualize how a large API specification can be split into maintainable, reusable components.

## 🚀 Features

- **Interactive Tree View**: Navigate through your API components with an expandable/collapsible tree structure
- **Smart Search**: Quickly find files, folders, or components with real-time search
- **Component Visualization**: See how different parts of your API spec connect through `$ref` relationships
- **Code Preview**: View YAML content with syntax highlighting and easy copy functionality
- **Modular Architecture**: Demonstrates best practices for splitting OpenAPI specs into manageable pieces

## 📁 Project Structure

```
ScalableSystem/
├── Split/                      # Modular OpenAPI components
│   ├── components/            # Reusable API components
│   │   ├── examples/         # Example request/response data
│   │   │   ├── CatToyProduct.yaml
│   │   │   ├── DogFoodProduct.yaml
│   │   │   └── ...
│   │   ├── parameters/       # API parameters
│   │   │   ├── Category.yaml
│   │   │   ├── InStock.yaml
│   │   │   └── ...
│   │   └── schemas/         # Data models
│   │       ├── Address.yaml
│   │       ├── Cart.yaml
│   │       └── ...
│   ├── paths/               # API endpoints
│   │   ├── products.yaml
│   │   ├── products_{productId}.yaml
│   │   └── ...
│   ├── info.yaml           # API metadata
│   └── openapi.yaml        # Main OpenAPI file

```



## 🗂️ API Components

### Schemas
- `Address.yaml`: Postal address structure used throughout the API
- `Cart.yaml`: Shopping cart data model with items and totals
- `Product.yaml`: Product information schema
- `User.yaml`: User profile data structure

### Examples
- `CatToyProduct.yaml`: Sample cat toy product data
- `DogFoodProduct.yaml`: Sample dog food product data
- `UserCart.yaml`: Example of a populated shopping cart

### Parameters
- `Category.yaml`: Product category filter
- `InStock.yaml`: Inventory filter
- `Limit.yaml`: Pagination size parameter
- `Page.yaml`: Pagination page number

## 🔍 Features in Detail

1. **Tree Navigation**
   - Expandable/collapsible folders
   - File preview on click
   - Visual indicators for different file types

2. **Search Functionality**
   - Real-time filtering
   - Highlights matching items
   - Auto-expands relevant folders

3. **Content Panel**
   - YAML syntax highlighting
   - Copy to clipboard functionality
   - File description and purpose

4. **Statistics Display**
   - Component count
   - Modularity metrics
   - Quick overview of API structure

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Notes

- The project demonstrates the "Design First" approach to API development
- Uses OpenAPI 3.0.3 specification
- Follows modular architecture principles for maintainability
- Implements best practices for large-scale API documentation


## � Using This Pattern For Your API Specifications

This project demonstrates a scalable pattern for organizing large OpenAPI specifications. Here's how to adapt this structure for your own API specs:

### 1. Directory Structure
```
your-api/
├── components/            # Reusable elements
│   ├── schemas/          # Data models
│   ├── parameters/       # Common parameters
│   ├── responses/        # Reusable responses
│   ├── examples/         # Example payloads
│   └── security/         # Security schemes
├── paths/                # API endpoints by resource
│   ├── resource1/        # Group related endpoints
│   └── resource2/        # Another resource group
├── info.yaml            # API metadata
├── servers.yaml         # Server configurations
└── openapi.yaml         # Main entry point
```

### 2. Making It Scalable
- **Group by Domain**: Create subdirectories in `paths/` for each business domain or resource type
- **Version Control**: Each component can evolve independently
- **Team Collaboration**: Different teams can work on different domains without conflicts
- **Reuse Components**: Reference common schemas and responses across endpoints using `$ref`

### 3. Example: Adding a New API Domain
1. Create a new directory: `paths/new-domain/`
2. Add endpoint files:
   ```yaml
   # paths/new-domain/list.yaml
   get:
     summary: List items
     parameters:
       - $ref: '../../components/parameters/pagination.yaml'
     responses:
       '200':
         content:
           application/json:
             schema:
               $ref: '../../components/schemas/itemList.yaml'
   ```
3. Reference in main file:
   ```yaml
   # openapi.yaml
   paths:
     /new-domain:
       $ref: './paths/new-domain/list.yaml'
   ```

### 4. Best Practices
- Keep individual files focused and small
- Use consistent naming conventions
- Maintain a flat hierarchy where possible
- Document component purposes
- Use relative paths in `$ref`s
- Create reusable parameter sets
- Standardize response formats

### 5. Common Use Cases
- **Microservices**: Split specs by service
- **Multi-Version APIs**: Maintain different versions in parallel
- **White-Label APIs**: Share common components across different branded APIs
- **Partner-Specific APIs**: Customize endpoints while sharing core models

This modular approach scales well from small APIs to large enterprise systems with hundreds of endpoints.

## �🔗 Related Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [API Design Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [Understanding $ref in OpenAPI](https://swagger.io/docs/specification/using-ref/)