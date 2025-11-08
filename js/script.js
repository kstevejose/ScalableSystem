function formatYaml(yamlString) {
            // Escape HTML special characters
            let html = yamlString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            // Apply syntax highlighting classes
            html = html.replace(/(^[ \t]*)(#.*)/gm, '$1<span class="comment">$2</span>'); // Comments
            html = html.replace(/(^[ \t]*)([^:\n&<]+)(:)/gm, '$1<span class="property">$2</span>$3'); // Keys
            html = html.replace(/(:\s*)(\$ref:.*)/gm, '$1<span class="keyword">$2</span>'); // $ref keywords
            html = html.replace(/(:\s*)('.*')/gm, '$1<span class="string">$2</span>'); // Single-quoted strings
            html = html.replace(/(:\s*)(".*")/gm, '$1<span class="string">$2</span>'); // Double-quoted strings
            html = html.replace(/(:\s*)([^ \n<&]+)/gm, '$1<span class="value">$2</span>'); // Other values
            
            return html;
        }

        // This is our "database" of file content
        const fileContentStore = {
            'openapi.yaml': {
                description: 'This is your source file that Redocly CLI uses to split into modular components.',
                content: `
openapi: 3.0.3
info:
  title: PetStore API
  description: A comprehensive API for managing pet store operations including products and users
  version: 1.0.0
  contact:
    name: API Support
    email: support@petstore.com

servers:
  - url: https://api.petstore.com/v1
    description: Production server
  - url: https://staging-api.petstore.com/v1
    description: Staging server

paths:
  /products:
    get:
      tags:
        - Products
      summary: Get all products
      description: Retrieve a list of all products with optional filtering and pagination
      operationId: getProducts
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Category'
        - $ref: '#/components/parameters/InStock'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  total:
                    type: integer
                    example: 150
                  page:
                    type: integer
                    example: 1
                  limit:
                    type: integer
                    example: 10
        '500':
          $ref: '#/components/responses/InternalServerError'

    post:
      tags:
        - Products
      summary: Create a new product
      description: Add a new product to the store
      operationId: createProduct
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
            examples:
              dogFood:
                $ref: '#/components/examples/DogFoodProduct'
              catToy:
                $ref: '#/components/examples/CatToyProduct'
      responses:
        '201':
          description: Product created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '400':
          $ref: '#/components/responses/BadRequest'
        '500':
          $ref: '#/components/responses/InternalServerError'

  /products/{productId}:
    get:
      tags:
        - Products
      summary: Get product by ID
      description: Retrieve a specific product by its ID
      operationId: getProductById
      parameters:
        - $ref: '#/components/parameters/ProductId'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'

    put:
      tags:
        - Products
      summary: Update product
      description: Update an existing product
      operationId: updateProduct
      parameters:
        - $ref: '#/components/parameters/ProductId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
            examples:
              updatedDogFood:
                $ref: '#/components/examples/UpdatedDogFood'
      responses:
        '200':
          description: Product updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'

    delete:
      tags:
        - Products
      summary: Delete product
      description: Remove a product from the store
      operationId: deleteProduct
      parameters:
        - $ref: '#/components/parameters/ProductId'
      responses:
        '204':
          description: Product deleted successfully
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'

  /users:
    post:
      tags:
        - Users
      summary: Create a new user
      description: Register a new user in the system
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserInput'
            examples:
              johnDoe:
                $ref: '#/components/examples/JohnDoeUser'
              janeSmith:
                $ref: '#/components/examples/JaneSmithUser'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '500':
          $ref: '#/components/responses/InternalServerError'

  /users/{userId}:
    get:
      tags:
        - Users
      summary: Get user by ID
      description: Retrieve a specific user by their ID
      operationId: getUserById
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'

    put:
      tags:
        - Users
      summary: Update user
      description: Update an existing user's information
      operationId: updateUser
      parameters:
        - $ref: '#/components/parameters/UserId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserInput'
            examples:
              updatedJohnDoe:
                $ref: '#/components/examples/UpdatedJohnDoe'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'

    delete:
      tags:
        - Users
      summary: Delete user
      description: Remove a user from the system
      operationId: deleteUser
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '204':
          description: User deleted successfully
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'

  /users/{userId}/cart:
    get:
      tags:
        - Users
      summary: Get user cart
      description: Retrieve the shopping cart for a specific user
      operationId: getUserCart
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'
              examples:
                userCart:
                  $ref: '#/components/examples/UserCart'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'

components:
  schemas:
    Product:
      type: object
      required:
        - id
        - name
        - price
        - category
        - stock
      properties:
        id:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440000"
        name:
          type: string
          example: "Premium Dog Food"
        description:
          type: string
          example: "High-quality dog food with natural ingredients"
        price:
          type: number
          format: float
          minimum: 0
          example: 45.99
        category:
          type: string
          enum: [food, toys, accessories, health, grooming]
          example: food
        stock:
          type: integer
          minimum: 0
          example: 100
        tags:
          type: array
          items:
            type: string
          example: ["dog", "food", "premium"]
        createdAt:
          type: string
          format: date-time
          example: "2023-01-15T10:30:00Z"
        updatedAt:
          type: string
          format: date-time
          example: "2023-01-15T10:30:00Z"

    ProductInput:
      type: object
      required:
        - name
        - price
        - category
        - stock
      properties:
        name:
          type: string
          example: "Premium Dog Food"
        description:
          type: string
          example: "High-quality dog food with natural ingredients"
        price:
          type: number
          format: float
          minimum: 0
          example: 45.99
        category:
          type: string
          enum: [food, toys, accessories, health, grooming]
          example: food
        stock:
          type: integer
          minimum: 0
          example: 100
        tags:
          type: array
          items:
            type: string
          example: ["dog", "food", "premium"]

    User:
      type: object
      required:
        - id
        - username
        - email
        - firstName
        - lastName
      properties:
        id:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440001"
        username:
          type: string
          example: "johndoe"
        email:
          type: string
          format: email
          example: "john.doe@example.com"
        firstName:
          type: string
          example: "John"
        lastName:
          type: string
          example: "Doe"
        phone:
          type: string
          example: "+1234567890"
        address:
          $ref: '#/components/schemas/Address'
        createdAt:
          type: string
          format: date-time
          example: "2023-01-15T10:30:00Z"
        updatedAt:
          type: string
          format: date-time
          example: "2023-01-15T10:30:00Z"

    UserInput:
      type: object
      required:
        - username
        - email
        - firstName
        - lastName
      properties:
        username:
          type: string
          example: "johndoe"
        email:
          type: string
          format: email
          example: "john.doe@example.com"
        firstName:
          type: string
          example: "John"
        lastName:
          type: string
          example: "Doe"
        phone:
          type: string
          example: "+1234567890"
        address:
          $ref: '#/components/schemas/Address'

    Address:
      type: object
      properties:
        street:
          type: string
          example: "123 Main St"
        city:
          type: string
          example: "New York"
        state:
          type: string
          example: "NY"
        zipCode:
          type: string
          example: "10001"
        country:
          type: string
          example: "USA"

    Cart:
      type: object
      properties:
        userId:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440001"
        items:
          type: array
          items:
            type: object
            properties:
              productId:
                type: string
                format: uuid
                example: "550e8400-e29b-41d4-a716-446655440000"
              productName:
                type: string
                example: "Premium Dog Food"
              quantity:
                type: integer
                minimum: 1
                example: 2
              price:
                type: number
                format: float
                example: 45.99
        total:
          type: number
          format: float
          example: 91.98
        updatedAt:
          type: string
          format: date-time
          example: "2023-01-15T10:30:00Z"

  parameters:
    ProductId:
      name: productId
      in: path
      required: true
      description: Unique identifier of the product
      schema:
        type: string
        format: uuid
      example: "550e8400-e29b-41d4-a716-446655440000"

    UserId:
      name: userId
      in: path
      required: true
      description: Unique identifier of the user
      schema:
        type: string
        format: uuid
      example: "550e8400-e29b-41d4-a716-446655440001"

    Page:
      name: page
      in: query
      required: false
      description: Page number for pagination
      schema:
        type: integer
        minimum: 1
        default: 1
      example: 1

    Limit:
      name: limit
      in: query
      required: false
      description: Number of items per page
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 10
      example: 10

    Category:
      name: category
      in: query
      required: false
      description: Filter products by category
      schema:
        type: string
        enum: [food, toys, accessories, health, grooming]
      example: food

    InStock:
      name: inStock
      in: query
      required: false
      description: Filter products that are in stock
      schema:
        type: boolean
      example: true

  examples:
    DogFoodProduct:
      summary: Dog Food Product
      value:
        name: "Premium Dog Food"
        description: "High-quality dog food with natural ingredients"
        price: 45.99
        category: "food"
        stock: 100
        tags: ["dog", "food", "premium"]

    CatToyProduct:
      summary: Cat Toy Product
      value:
        name: "Interactive Cat Toy"
        description: "Electronic toy to keep your cat entertained"
        price: 24.99
        category: "toys"
        stock: 50
        tags: ["cat", "toy", "interactive"]

    UpdatedDogFood:
      summary: Updated Dog Food Product
      value:
        name: "Premium Dog Food - Updated Formula"
        description: "Improved high-quality dog food with added vitamins"
        price: 49.99
        category: "food"
        stock: 150
        tags: ["dog", "food", "premium", "vitamins"]

    JohnDoeUser:
      summary: John Doe User
      value:
        username: "johndoe"
        email: "john.doe@example.com"
        firstName: "John"
        lastName: "Doe"
        phone: "+1234567890"
        address:
          street: "123 Main St"
          city: "New York"
          state: "NY"
          zipCode: "10001"
          country: "USA"

    JaneSmithUser:
      summary: Jane Smith User
      value:
        username: "janesmith"
        email: "jane.smith@example.com"
        firstName: "Jane"
        lastName: "Smith"
        phone: "+0987654321"
        address:
          street: "456 Oak Ave"
          city: "Los Angeles"
          state: "CA"
          zipCode: "90210"
          country: "USA"

    UpdatedJohnDoe:
      summary: Updated John Doe User
      value:
        username: "johndoe"
        email: "john.doe.updated@example.com"
        firstName: "John"
        lastName: "Doe"
        phone: "+1234567890"
        address:
          street: "789 Updated St"
          city: "Boston"
          state: "MA"
          zipCode: "02101"
          country: "USA"

    UserCart:
      summary: User Shopping Cart
      value:
        userId: "550e8400-e29b-41d4-a716-446655440001"
        items:
          - productId: "550e8400-e29b-41d4-a716-446655440000"
            productName: "Premium Dog Food"
            quantity: 2
            price: 45.99
          - productId: "550e8400-e29b-41d4-a716-446655440002"
            productName: "Interactive Cat Toy"
            quantity: 1
            price: 24.99
        total: 116.97
        updatedAt: "2023-01-15T10:30:00Z"

  responses:
    NotFound:
      description: The requested resource was not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: "Resource not found"
              message:
                type: string
                example: "The requested product does not exist"
              code:
                type: integer
                example: 404

    BadRequest:
      description: Bad request - invalid input
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: "Bad Request"
              message:
                type: string
                example: "Invalid input data"
              code:
                type: integer
                example: 400
              details:
                type: array
                items:
                  type: object
                  properties:
                    field:
                      type: string
                      example: "price"
                    message:
                      type: string
                      example: "Price must be a positive number"

    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: "Internal Server Error"
              message:
                type: string
                example: "An unexpected error occurred"
              code:
                type: integer
                example: 500

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
                `
            },
            'info.yaml': {
                description: 'Contains the API\'s metadata (title, version, etc.). You will need to manually create this file as Redocly CLI doesn\'t support splitting the info object yet.',
                content: `
title: PetStore API
version: v2.0
description: A scalable API for managing pet store operations.
contact:
  email: 'api-support@petstore.com'
                `
            },
            'servers.yaml': {
                description: 'Defines the servers where the API is hosted. You will need to manually create this file as Redocly CLI doesn\'t support splitting the info object yet.',
                content: `- url: https://api.petstore.com/v2 `
            },
            'CatToyProduct.yaml': {
                description: 'The content of example section for the CatToyProduct.yaml',
                content: ` 
summary: Cat Toy Product
value:
  name: Interactive Cat Toy
  description: Electronic toy to keep your cat entertained
  price: 24.99
  category: toys
  stock: 50
  tags:
    - cat
    - toy
    - interactive

                `
            },
            'DogFoodProduct.yaml': {
                description: 'The content of example section for the DogFoodProduct.yaml',
                content: `
summary: Dog Food Product
value:
  name: Premium Dog Food
  description: High-quality dog food with natural ingredients
  price: 45.99
  category: food
  stock: 100
  tags:
    - dog
    - food
    - premium

                `
            },
            'Category.yaml': {
                description: 'components/parameters/Category.yaml',
                content: `
name: category
in: query
required: false
description: Filter products by category
schema:
  type: string
  enum:
    - food
    - toys
    - accessories
    - health
    - grooming
example: food

                `
            },
            'documentCollection.yaml': {
                description: 'A reusable data model (schema) for a "DocumentCollection".',
                content: `
type: 'object'
properties:
  id:
    type: 'string'
    format: 'uuid'
  name:
    type: 'string'
    description: 'Name of the document collection.'
  documentCount:
    type: 'integer'
    description: 'Number of documents in the collection.'
required:
  - 'id'
  - 'name'
                `
            },
            'products_{productId}.yaml': {
                description: 'paths/products_{productId}.yaml',
                content: `get:
  tags:
    - Products
  summary: Get product by ID
  description: Retrieve a specific product by its ID
  operationId: getProductById
  parameters:
    - $ref: ../components/parameters/ProductId.yaml
  responses:
    '200':
      description: Successful operation
      content:
        application/json:
          schema:
            $ref: ../components/schemas/Product.yaml
    '404':
      $ref: ../components/responses/NotFound.yaml
    '500':
      $ref: ../components/responses/InternalServerError.yaml
put:
  tags:
    - Products
  summary: Update product
  description: Update an existing product
  operationId: updateProduct
  parameters:
    - $ref: ../components/parameters/ProductId.yaml
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: ../components/schemas/ProductInput.yaml
        examples:
          updatedDogFood:
            $ref: ../components/examples/UpdatedDogFood.yaml
  responses:
    '200':
      description: Product updated successfully
      content:
        application/json:
          schema:
            $ref: ../components/schemas/Product.yaml
    '400':
      $ref: ../components/responses/BadRequest.yaml
    '404':
      $ref: ../components/responses/NotFound.yaml
    '500':
      $ref: ../components/responses/InternalServerError.yaml
delete:
  tags:
    - Products
  summary: Delete product
  description: Remove a product from the store
  operationId: deleteProduct
  parameters:
    - $ref: ../components/parameters/ProductId.yaml
  responses:
    '204':
      description: Product deleted successfully
    '404':
      $ref: ../components/responses/NotFound.yaml
    '500':
      $ref: ../components/responses/InternalServerError.yaml
`
            },
            'Address.yaml': {
                description: 'components/schemas/Address.yaml',
                content: `
type: object
properties:
  street:
    type: string
    example: 123 Main St
  city:
    type: string
    example: New York
  state:
    type: string
    example: NY
  zipCode:
    type: string
    example: '10001'
  country:
    type: string
    example: USA

                `
            },
            'Cart.yaml': {
                description: 'components/schemas/Cart.yaml',
                content: `
type: object
properties:
  userId:
    type: string
    format: uuid
    example: 550e8400-e29b-41d4-a716-446655440001
  items:
    type: array
    items:
      type: object
      properties:
        productId:
          type: string
          format: uuid
          example: 550e8400-e29b-41d4-a716-446655440000
        productName:
          type: string
          example: Premium Dog Food
        quantity:
          type: integer
          minimum: 1
          example: 2
        price:
          type: number
          format: float
          example: 45.99
  total:
    type: number
    format: float
    example: 91.98
  updatedAt:
    type: string
    format: date-time
    example: '2023-01-15T10:30:00Z'

                `
            },
            'path-product': {
                description: 'A single path file, defining the GET operation for an organization.',
                content: `
get:
  tags:
    - Products
  summary: Get all products
  description: Retrieve a list of all products with optional filtering and pagination
  operationId: getProducts
  parameters:
    - $ref: ../components/parameters/Page.yaml
    - $ref: ../components/parameters/Limit.yaml
    - $ref: ../components/parameters/Category.yaml
    - $ref: ../components/parameters/InStock.yaml
  responses:
    '200':
      description: Successful operation
      content:
        application/json:
          schema:
            type: object
            properties:
              products:
                type: array
                items:
                  $ref: ../components/schemas/Product.yaml
              total:
                type: integer
                example: 150
              page:
                type: integer
                example: 1
              limit:
                type: integer
                example: 10
    '500':
      $ref: ../components/responses/InternalServerError.yaml
post:
  tags:
    - Products
  summary: Create a new product
  description: Add a new product to the store
  operationId: createProduct
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: ../components/schemas/ProductInput.yaml
        examples:
          dogFood:
            $ref: ../components/examples/DogFoodProduct.yaml
          catToy:
            $ref: ../components/examples/CatToyProduct.yaml
  responses:
    '201':
      description: Product created successfully
      content:
        application/json:
          schema:
            $ref: ../components/schemas/Product.yaml
    '400':
      $ref: ../components/responses/BadRequest.yaml
    '500':
      $ref: ../components/responses/InternalServerError.yaml
`
            },

            'store-journey.yaml': {
                description: 'Content for dist/store-journey.yaml',
                content: `openapi: 3.0.3
info:
  title: PetStore API
  description: A comprehensive API for managing pet store operations including products and users
  version: 1.0.0
  contact:
    name: API Support
    email: support@petstore.com
servers:
  - url: https://api.petstore.com/v1
    description: Production server
  - url: https://staging-api.petstore.com/v1
    description: Staging server
paths:
  /products:
    get:
      tags:
        - Products
      summary: Get all products
      description: Retrieve a list of all products with optional filtering and pagination
      operationId: getProducts
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Category'
        - $ref: '#/components/parameters/InStock'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  total:
                    type: integer
                    example: 150
                  page:
                    type: integer
                    example: 1
                  limit:
                    type: integer
                    example: 10
        '500':
          $ref: '#/components/responses/InternalServerError'
    post:
      tags:
        - Products
      summary: Create a new product
      description: Add a new product to the store
      operationId: createProduct
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
            examples:
              dogFood:
                $ref: '#/components/examples/DogFoodProduct'
              catToy:
                $ref: '#/components/examples/CatToyProduct'
      responses:
        '201':
          description: Product created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '400':
          $ref: '#/components/responses/BadRequest'
        '500':
          $ref: '#/components/responses/InternalServerError'
  /products/{productId}:
    get:
      tags:
        - Products
      summary: Get product by ID
      description: Retrieve a specific product by its ID
      operationId: getProductById
      parameters:
        - $ref: '#/components/parameters/ProductId'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'
    put:
      tags:
        - Products
      summary: Update product
      description: Update an existing product
      operationId: updateProduct
      parameters:
        - $ref: '#/components/parameters/ProductId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
            examples:
              updatedDogFood:
                $ref: '#/components/examples/UpdatedDogFood'
      responses:
        '200':
          description: Product updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'
    delete:
      tags:
        - Products
      summary: Delete product
      description: Remove a product from the store
      operationId: deleteProduct
      parameters:
        - $ref: '#/components/parameters/ProductId'
      responses:
        '204':
          description: Product deleted successfully
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'
components:
  parameters:
    Page:
      name: page
      in: query
      required: false
      description: Page number for pagination
      schema:
        type: integer
        minimum: 1
        default: 1
      example: 1
    Limit:
      name: limit
      in: query
      required: false
      description: Number of items per page
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 10
      example: 10
    Category:
      name: category
      in: query
      required: false
      description: Filter products by category
      schema:
        type: string
        enum:
          - food
          - toys
          - accessories
          - health
          - grooming
      example: food
    InStock:
      name: inStock
      in: query
      required: false
      description: Filter products that are in stock
      schema:
        type: boolean
      example: true
    ProductId:
      name: productId
      in: path
      required: true
      description: Unique identifier of the product
      schema:
        type: string
        format: uuid
      example: 550e8400-e29b-41d4-a716-446655440000
  schemas:
    Product:
      type: object
      required:
        - id
        - name
        - price
        - category
        - stock
      properties:
        id:
          type: string
          format: uuid
          example: 550e8400-e29b-41d4-a716-446655440000
        name:
          type: string
          example: Premium Dog Food
        description:
          type: string
          example: High-quality dog food with natural ingredients
        price:
          type: number
          format: float
          minimum: 0
          example: 45.99
        category:
          type: string
          enum:
            - food
            - toys
            - accessories
            - health
            - grooming
          example: food
        stock:
          type: integer
          minimum: 0
          example: 100
        tags:
          type: array
          items:
            type: string
          example:
            - dog
            - food
            - premium
        createdAt:
          type: string
          format: date-time
          example: '2023-01-15T10:30:00Z'
        updatedAt:
          type: string
          format: date-time
          example: '2023-01-15T10:30:00Z'
    ProductInput:
      type: object
      required:
        - name
        - price
        - category
        - stock
      properties:
        name:
          type: string
          example: Premium Dog Food
        description:
          type: string
          example: High-quality dog food with natural ingredients
        price:
          type: number
          format: float
          minimum: 0
          example: 45.99
        category:
          type: string
          enum:
            - food
            - toys
            - accessories
            - health
            - grooming
          example: food
        stock:
          type: integer
          minimum: 0
          example: 100
        tags:
          type: array
          items:
            type: string
          example:
            - dog
            - food
            - premium
  responses:
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: Internal Server Error
              message:
                type: string
                example: An unexpected error occurred
              code:
                type: integer
                example: 500
    BadRequest:
      description: Bad request - invalid input
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: Bad Request
              message:
                type: string
                example: Invalid input data
              code:
                type: integer
                example: 400
              details:
                type: array
                items:
                  type: object
                  properties:
                    field:
                      type: string
                      example: price
                    message:
                      type: string
                      example: Price must be a positive number
    NotFound:
      description: The requested resource was not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: Resource not found
              message:
                type: string
                example: The requested product does not exist
              code:
                type: integer
                example: 404
  examples:
    DogFoodProduct:
      summary: Dog Food Product
      value:
        name: Premium Dog Food
        description: High-quality dog food with natural ingredients
        price: 45.99
        category: food
        stock: 100
        tags:
          - dog
          - food
          - premium
    CatToyProduct:
      summary: Cat Toy Product
      value:
        name: Interactive Cat Toy
        description: Electronic toy to keep your cat entertained
        price: 24.99
        category: toys
        stock: 50
        tags:
          - cat
          - toy
          - interactive
    UpdatedDogFood:
      summary: Updated Dog Food Product
      value:
        name: Premium Dog Food - Updated Formula
        description: Improved high-quality dog food with added vitamins
        price: 49.99
        category: food
        stock: 150
        tags:
          - dog
          - food
          - premium
          - vitamins
`
            },
            'stores.yaml': {
                description: 'Content for Products/Store.yaml',
                content: `openapi: 3.0.3
info:
  $ref: '../info.yaml'
servers:
  $ref: '../servers.yaml'
  
paths:
  /products:
    $ref: ../paths/products.yaml

  /products/{productId}:
    $ref: ../paths/products_{productId}.yaml`
            },
            'users.yaml': {
                description: 'Content for Products/User.yaml',
                content: `openapi: 3.0.3
info:
  $ref: '../info.yaml'
servers:
  $ref: '../servers.yaml'
  
paths:
  /products:
    $ref: ../paths/users_{userId}.yaml

  /products/{productId}:
    $ref: ../paths/users_{userId}_cart.yaml`
            },
            'user-journey.yaml': {
                description: 'Content for dist/user-journey.yaml',
                content: `openapi: 3.0.3
info:
  title: PetStore API
  description: A comprehensive API for managing pet store operations including products and users
  version: 1.0.0
  contact:
    name: API Support
    email: support@petstore.com
servers:
  - url: https://api.petstore.com/v1
    description: Production server
  - url: https://staging-api.petstore.com/v1
    description: Staging server
paths:
  /products:
    get:
      tags:
        - Users
      summary: Get user by ID
      description: Retrieve a specific user by their ID
      operationId: getUserById
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'
    put:
      tags:
        - Users
      summary: Update user
      description: Update an existing user's information
      operationId: updateUser
      parameters:
        - $ref: '#/components/parameters/UserId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserInput'
            examples:
              updatedJohnDoe:
                $ref: '#/components/examples/UpdatedJohnDoe'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'
    delete:
      tags:
        - Users
      summary: Delete user
      description: Remove a user from the system
      operationId: deleteUser
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '204':
          description: User deleted successfully
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'
  /products/{productId}:
    get:
      tags:
        - Users
      summary: Get user cart
      description: Retrieve the shopping cart for a specific user
      operationId: getUserCart
      parameters:
        - $ref: '#/components/parameters/UserId'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'
              examples:
                userCart:
                  $ref: '#/components/examples/UserCart'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/InternalServerError'
components:
  parameters:
    UserId:
      name: userId
      in: path
      required: true
      description: Unique identifier of the user
      schema:
        type: string
        format: uuid
      example: 550e8400-e29b-41d4-a716-446655440001
  schemas:
    Address:
      type: object
      properties:
        street:
          type: string
          example: 123 Main St
        city:
          type: string
          example: New York
        state:
          type: string
          example: NY
        zipCode:
          type: string
          example: '10001'
        country:
          type: string
          example: USA
    User:
      type: object
      required:
        - id
        - username
        - email
        - firstName
        - lastName
      properties:
        id:
          type: string
          format: uuid
          example: 550e8400-e29b-41d4-a716-446655440001
        username:
          type: string
          example: johndoe
        email:
          type: string
          format: email
          example: john.doe@example.com
        firstName:
          type: string
          example: John
        lastName:
          type: string
          example: Doe
        phone:
          type: string
          example: '+1234567890'
        address:
          $ref: '#/components/schemas/Address'
        createdAt:
          type: string
          format: date-time
          example: '2023-01-15T10:30:00Z'
        updatedAt:
          type: string
          format: date-time
          example: '2023-01-15T10:30:00Z'
    UserInput:
      type: object
      required:
        - username
        - email
        - firstName
        - lastName
      properties:
        username:
          type: string
          example: johndoe
        email:
          type: string
          format: email
          example: john.doe@example.com
        firstName:
          type: string
          example: John
        lastName:
          type: string
          example: Doe
        phone:
          type: string
          example: '+1234567890'
        address:
          $ref: '#/components/schemas/Address'
    Cart:
      type: object
      properties:
        userId:
          type: string
          format: uuid
          example: 550e8400-e29b-41d4-a716-446655440001
        items:
          type: array
          items:
            type: object
            properties:
              productId:
                type: string
                format: uuid
                example: 550e8400-e29b-41d4-a716-446655440000
              productName:
                type: string
                example: Premium Dog Food
              quantity:
                type: integer
                minimum: 1
                example: 2
              price:
                type: number
                format: float
                example: 45.99
        total:
          type: number
          format: float
          example: 91.98
        updatedAt:
          type: string
          format: date-time
          example: '2023-01-15T10:30:00Z'
  responses:
    NotFound:
      description: The requested resource was not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: Resource not found
              message:
                type: string
                example: The requested product does not exist
              code:
                type: integer
                example: 404
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: Internal Server Error
              message:
                type: string
                example: An unexpected error occurred
              code:
                type: integer
                example: 500
    BadRequest:
      description: Bad request - invalid input
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: Bad Request
              message:
                type: string
                example: Invalid input data
              code:
                type: integer
                example: 400
              details:
                type: array
                items:
                  type: object
                  properties:
                    field:
                      type: string
                      example: price
                    message:
                      type: string
                      example: Price must be a positive number
  examples:
    UpdatedJohnDoe:
      summary: Updated John Doe User
      value:
        username: johndoe
        email: john.doe.updated@example.com
        firstName: John
        lastName: Doe
        phone: '+1234567890'
        address:
          street: 789 Updated St
          city: Boston
          state: MA
          zipCode: '02101'
          country: USA
    UserCart:
      summary: User Shopping Cart
      value:
        userId: 550e8400-e29b-41d4-a716-446655440001
        items:
          - productId: 550e8400-e29b-41d4-a716-446655440000
            productName: Premium Dog Food
            quantity: 2
            price: 45.99
          - productId: 550e8400-e29b-41d4-a716-446655440002
            productName: Interactive Cat Toy
            quantity: 1
            price: 24.99
        total: 116.97
        updatedAt: '2023-01-15T10:30:00Z'
`
            },
            'InStock.yaml': {
                description: 'components/parameters/InStock.yaml',
                content: `
name: inStock
in: query
required: false
description: Filter products that are in stock
schema:
  type: boolean
example: true

                `
            },
            'DocumentCollection-main.yaml': {
                description: 'Main file for DocumentCollection schema.',
                content: '# This main.yaml might aggregate other partial schemas.\nref: ./documentCollection.yaml'
            },
            'path-users.yaml': {
                description: 'paths/users.yaml.',
                content: `
post:
  tags:
    - Users
  summary: Create a new user
  description: Register a new user in the system
  operationId: createUser
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: ../components/schemas/UserInput.yaml
        examples:
          johnDoe:
            $ref: ../components/examples/JohnDoeUser.yaml
          janeSmith:
            $ref: ../components/examples/JaneSmithUser.yaml
  responses:
    '201':
      description: User created successfully
      content:
        application/json:
          schema:
            $ref: ../components/schemas/User.yaml
    '400':
      $ref: ../components/responses/BadRequest.yaml
    '500':
      $ref: ../components/responses/InternalServerError.yaml

                `
            },
            'SampleRequest.yaml': {
                description: 'A generic sample request.',
                content: `
value:
  data:
    key: 'value'
summary: 'Sample Request'
                `
            },
            'SampleParameter.yaml': {
                description: 'A generic sample parameter.',
                content: `
name: 'sample_param'
in: 'query'
schema:
  type: 'string'
                `
            }

        };

        // --- Main Script ---
        document.addEventListener('DOMContentLoaded', function() {
            const treeNodes = document.querySelectorAll('.tree-node[data-target]');
            const expandAllBtn = document.getElementById('expandAllBtn');
            let allExpanded = false;
            
            // --- NEW: Panel and File Node selections ---
            const panel = document.getElementById('contentPanel');
            const panelTitle = document.getElementById('panelTitle');
            const panelSubtitle = document.getElementById('panelSubtitle');
            const contentBody = document.getElementById('contentBody');
            const closeBtn = document.getElementById('closeBtn');
            const fileNodes = document.querySelectorAll('.file-node');
            let currentSelectedFile = null;

            // Add fade-in animation
            document.querySelectorAll('.tree-node').forEach((node, index) => {
                node.style.animationDelay = `${index * 0.03}s`;
                node.classList.add('fade-in');
            });

            // Toggle tree nodes
            treeNodes.forEach(node => {
                node.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const targetId = this.getAttribute('data-target');
                    const targetList = document.getElementById(targetId);
                    
                  
                    if (targetId && !this.classList.contains('file-node') && panel.classList.contains('active')) {
                        hidePanel();
                    }
                    
                    if (targetList) {
                        this.classList.toggle('expanded');
                        targetList.classList.toggle('active');
                    }
                });
            });

           
            expandAllBtn.addEventListener('click', function() {
                allExpanded = !allExpanded;
                
                if (allExpanded) {
                    document.querySelectorAll('.nested').forEach(nested => {
                        nested.classList.add('active');
                    });
                    treeNodes.forEach(node => {
                        node.classList.add('expanded');
                    });
                    this.textContent = 'Collapse All';
                    this.classList.add('expanded-state');
                    this.classList.remove('collapsed-state');
                } else {
                    document.querySelectorAll('.nested').forEach(nested => {
                        nested.classList.remove('active');
                    });
                    treeNodes.forEach(node => {
                        node.classList.remove('expanded');
                    });
                    this.textContent = 'Expand All';
                    this.classList.add('collapsed-state');
                    this.classList.remove('expanded-state');
                }
            });
           
            expandAllBtn.classList.add('collapsed-state');

  
            document.querySelectorAll('.stat-card').forEach(card => {
            
                card.addEventListener('mouseenter', function() {
                    const number = this.querySelector('.number');
                    number.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        number.style.transform = 'scale(1)';
                    }, 200);
                });
            });

            // --- NEW: Panel Logic ---

            function showPanel(fileName) {
                const fileData = fileContentStore[fileName];
                
                if (fileData) {
                    panelTitle.textContent = fileName;
                    panelSubtitle.textContent = fileData.description;

                    const formattedCode = formatYaml(fileData.content);
                    
                    // Build the inner HTML for the panel
                    // Note: Description is already shown in the subtitle, so we don't repeat it here to avoid duplication
                    const isExampleFile = fileName.includes('Product.yaml') || fileName === 'SampleRequest.yaml' || fileName.includes('Example');
                    const isParameterFile = fileName === 'Category.yaml' || fileName === 'InStock.yaml' || fileName === 'SampleParameter.yaml';
                    const isSchemaFile = fileName === 'Address.yaml' || fileName === 'Cart.yaml';
                    const isYamlFile = fileName.includes('.yaml') || fileName.includes('.yml');
                    
                    contentBody.innerHTML = `
                        <div class="info-section">
                            <h3>🚀 Purpose</h3>
                            ${fileName === 'store-journey.yaml' || fileName === 'user-journey.yaml' ? 
                                `<p>These are the contents of the ${fileName === 'store-journey.yaml' ? 'Store' : 'User'} API specification that you defined inside the Products folder.</p>
                                <p>This serves as the bundled output, essentially a custom API documentation generated from your master list.</p>
                                <p>It represents a tailored subset of endpoints specifically focused on ${fileName === 'store-journey.yaml' ? 'store operations' : 'user management'}, making it easier for clients to understand and implement ${fileName === 'store-journey.yaml' ? 'store-related' : 'user-related'} functionality.</p>`
                                :
                                isSchemaFile ?
                                    `<p>Here, you define the schema of the request and response payload.</p>
                                     <p> You only reference the path in your custom API Docs where the file is actually located. This is the core principle of a scalable, "DRY" (Don't Repeat Yourself) architecture.</p>`
                                    
                                    :
                                    isParameterFile ?
                                        `<p>Here, you define the query parameter details. You only reference the query parameter path in your custom API Docs where the file is actually located. This is the core principle of a scalable, "DRY" (Don't Repeat Yourself) architecture.</p>`
                                        :
                                        // isPathfile?
                                        // ` <p> You only reference the path in your custom API Docs where the file is actually located. This is the core principle of a scalable, "DRY" (Don't Repeat Yourself) architecture.</p>`
                                        // :
                                        isExampleFile ?
                                            `<p>This is an example file that contains the actual json content that gets rendered in the API Docs. These examples help developers understand the expected format and structure of the API.</p>
                                            <p> You only reference the path in your custom API Docs where the file is actually located. This is the core principle of a scalable, "DRY" (Don't Repeat Yourself) architecture.</p>`
                                            :
                                            `${fileName === 'openapi.yaml' ? '<p>This file acts as the "brain" of the operation, using <strong>$ref</strong> to link all the other modular files into one cohesive API specification.</p>' : ''}
                                            ${isYamlFile && fileName !== 'openapi.yaml' && !isExampleFile && !isParameterFile && !isSchemaFile ? '<p>These are the contents of your split <strong>API files</strong>. You only reference the path in your custom API Docs where the file is actually located. This is the core principle of a scalable, "DRY" (Don\'t Repeat Yourself) architecture.</p>' : ''}
                                            ${!isYamlFile ? `<p>${fileData.description}</p>` : ''}`
                            }
                        </div>
                        <div class="code-block">
                            <div class="code-header">
                                <span class="code-language">YAML</span>
                                <button class="copy-btn" id="copyCodeBtn">Copy</button>
                            </div>
                            <pre><code id="codeContent">${formattedCode}</code></pre>
                        </div>
                    `;
                    
                    panel.classList.add('active');
                    // Add class to body so the page content makes room for the panel
                    document.body.classList.add('panel-open');
                } else {
                    // Fallback for files not in the store
                    panelTitle.textContent = fileName;
                    panelSubtitle.textContent = 'No content available for this file.';
                    contentBody.innerHTML = '<p>This is a placeholder for content.</p>';
                    panel.classList.add('active');
                    document.body.classList.add('panel-open');
                }
            }

            function hidePanel() {
                panel.classList.remove('active');
                // Remove the body padding so content returns to normal
                document.body.classList.remove('panel-open');
                 if (currentSelectedFile) {
                    currentSelectedFile.classList.remove('selected');
                    currentSelectedFile = null;
                }
            }

            // Add click listener to all file nodes
            fileNodes.forEach(node => {
                node.addEventListener('click', function(e) {
                    e.stopPropagation(); // Stop click from bubbling to parent folders
                    
                    // Remove 'selected' from previously clicked file
                    if (currentSelectedFile) {
                        currentSelectedFile.classList.remove('selected');
                    }
                    // Add 'selected' to this file
                    this.classList.add('selected');
                    currentSelectedFile = this;

                    const fileName = this.getAttribute('data-file');
                    showPanel(fileName);
                });
            });

            // Add click listener to close button
            closeBtn.addEventListener('click', () => {
                hidePanel();
            });

            // Add click listener for the dynamic copy button (using event delegation)
            contentBody.addEventListener('click', function(e) {
                if (e.target.id === 'copyCodeBtn') {
                    const codeElement = document.getElementById('codeContent');
                    const rawText = fileContentStore[panelTitle.textContent].content;
                    
                    navigator.clipboard.writeText(rawText.trim()).then(() => {
                        e.target.textContent = 'Copied!';
                        e.target.classList.add('copied');
                        setTimeout(() => {
                            e.target.textContent = 'Copy';
                            e.target.classList.remove('copied');
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            });

        });