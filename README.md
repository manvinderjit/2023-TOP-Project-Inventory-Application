# Project Inventory Application by Manvinderjit
A project based primarily on a NodeJS, Express, and MongoDB app with EJS templating view engine and Mongoose ODM.

Creates an app ecosystem for an organization selling computer hardware by actings as a full-fledged WebApp while also providing RESTful APIs for the [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/). 

The app ecosystem consists of two user roles:
- `Customers:` They use the [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/) to place orders.
- `Employees`: They use this `Inventory App` to perform inventory and logistics operations, including processing orders received through the `Shopping Cart App`.

# 1. Description

Inventory App has two distinct functions:

1. Inventory Management: `Inventory App` is a full-fledged app that assists an organization in inventory management. The  employees can `Register` and `Login`, create `Categories` describing products, add `Products` to categories, and manage customer `Orders`. 

2. RESTful APIs: `Inventory App` provides RESTful APIs required by another app, `Shopping Cart App`, to function. The `Customers` of the business interact with  [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/), to place and manage orders.   <br><br>
The `Promos` shown in the `Carousel` of the `Shopping Cart App` are uploaded and managed in the `Inventory App`. <br><br>
Similarly, the `Orders` placed by the `Customers` in the `Shopping Cart App` are managed by the `Employees` in the `Inventory App`.

## Tech Stack

### Core Development Stack
The `Inventory App` part of the application (except the RESTful APIs provided for `Shopping Cart App`) makes use of the following technologies and packages:
- `NodeJS & Express`: NodeJS and Express are used to create the server and APIs.
- `EJS Template Engine`: EJS Template rendering engine is used for the front-end of the `Inventory App`.
- `HTTPS & SSL`: HTTPS and self-generated SSL certificates to deploy a secure server.
- `MongoDB Atlas & Mongoose ORM`: MongoDB Atlas is the database of choice with Mongoose ORM being used for data modeling.
- `Connect Mongo & Express Session Based Login`: Employee authentication utilizes session-based login through `Express Session` and `Connect Mongo` packages.
- `Bcrypt Password Encryption`: Bcrypt is used for encrypting the passwords.
- `Express File Upload`: Media files are uploaded using the `Express File Upload` package.

### Deployment Stack
The `Inventory App` is deployed using the following technologies:
- `CI/CD Pipeline With GitHub`: A CI/CD pipeline is created by leveraging GitHub actions to automatically deploy newly implemented features to the production environment.
- `AWS EC2 Cloud Instance`: The application is deployed on the cloud on an AWS EC2 instance running Linux OS.
- `AWS CodeDeploy`: AWS CodeDeploy is used to automate the deployment process. It uses `AppSpec` and `Linux Shell Scripts` to deploy the `Inventory App` to the EC2 instance.
- `AWS Parameter Store`: `AWS Parameter Store` is used to manage environment variables and secrets.

# 2. Objectives

## 2.1 Skill Demonstration Objectives
The application is created to demonstrate the following coding abilities:

    1. Build a full-stack app utilizing Node, Express, MongoDB Atlas / Mongoose, and EJS templating engine.

    2. Creating RESTfuls APIs for connecting to a single-page web app.

    3. Utilizing a CI/CD pipeline for integration and deployment of new features automatically.

    4. Usage of Docker containerization to build and deploy the application and persist data using Docker volumes.

    5. Use of self-signed SSL certificates to provide an https server.

    6. Familiarity with the AWS cloud platform, with the project showing deployment to an EC2 instance using AWS CodeDeploy via AppSpec and Linux shell scripts, and storing environment variables in the AWS Parameter Store.

## 2.2 Functional Objectives
The webapp has the following functional objectives:

    1. Allows a computer hardware retailer to manage product inventory, promotions, and orders.

    2. Provide APIs to complement its customer-facing application, Shopping Cart.

Shopping Cart GitHub Repo [Click Here for Shopping Cart GitHub Repo Page](https://github.com/manvinderjit/2023-TOP-Project-Shopping-Cart).

Shopping Cart WebApp Live Link [Click Here for Shopping Cart WebApp Live Link](https://2023-top-project-shopping-cart.pages.dev/).

# 3. Inventory App: Usage Guide for Inventory Management Features

## 3.1 User Role: `Employee`
You will be using the inventory app as an `Employee` of the organization, i.e., your user role with be that of an `employee`.
## 3.2 User Actions: `Employee` 
As an `employee` user, you will be able to perform the following actions:

- Register as an `employee`.

- Log in as an `employee`.

- Perform CRUD operations related to a `Category` for products.

- Perform CRUD operations related to a `Product` in a category.

- Perform CRUD operations related to `Orders`.

- Perform CRUD operations related to `Promotions` that are shown in the `Carousel` or other areas of the customer-facing [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/).

### 3.2.a. User Actions: Registering as an `Employee`<hr/>
To register as an employee, click on the `Register` link in the top navigation bar.

Password must contain at least one number and one uppercase and lowercase letter, and at least 5 or more characters

    Using your actual email address is neither recommended nor required because no email registration link will be sent for account activation.

A success message will appear upon successful registration. In case of an error, take action according to the message.

    You can use these demo credentials to log in instead of registering your own account:
    email: `email@email.com`
    password: `Admin1` 

### 3.2.b. User Actions: Log in as an employee <hr/>
To log in as an employee, use the credentials provided or the ones you used to register.

Upon successful login, you will be taken to the `Employee Dashboard`. It allows you to perform CRUD operations for the following:
- `Categories`: Categories are required for segmenting products. Each product must belong to a particular category, e.g., `Monitors`.
- `Products`: Products refer to any product to be sold by the organization. All products added through the `Inventory App` are then available for purchase via the `Shopping Cart App`.
- `Promos`: Any promos shown on the `Shopping Cart App`, like `Carousel Promos` are also added and managed through the `Inventory App`.
- `Orders`: Orders placed by `Customers` on the `Shopping Cart App` are managed by `Employees` through the `Inventory App`.

Click on the link according to the CRUD operation you want to perform.

### 3.2.c. User Actions: CRUD Operations - Category <hr/>
Clicking on the `Manage Categories` link will open the `Categories` page. It will show:
- An `Add a New Category` link to add a new category.
- All existing categories with the links to `View`, `Edit`, or `Delete` each of the categories.
#### Creating a Category <hr/>
1. To create a new `Category`, click on the `Add a New Category` link.
2. Add the `Category Name` and `Category Description`.
3. Click on the `Create Category` button.

If category was create successfully, a success alert will show. If something goes wrong, the corresponding error may appear. If you click `Back to All Categories` link at the bottom, it will take you to the `Categories` page. The new category should now be visible here.
#### Reading (Viewing) a Category <hr/>
1. To view a category, go to the `Category` page. 
2. Click on the corresponing `View` button for the category.
3. The page for that particular category will open and show the details.
4. Links to `Edit` and `Delete` that category are also available on the page.
#### Updating (Updating) a Category <hr/>
1. Click on the `Edit` link for a `Category` from the `Categories` page or `View Category` page.
2. Change the `Category Name` and `Category Description`.
3. Click on the `Update Category` button to update the details for the category.
4. Upon successful updation, you will be taken to the `View` page for the updated category.
#### Deleting a Category <hr/>
1. Click on the `Delete` link for a `Category` from the `Categories` page or `View Category` page.
2. You will be taken to the `Delete Category` confirmation page. Click on the `Delete Category` button to delete the category.
3. After successful deletion, you will be taken back to the `Categories` page.

### 3.2.d. User Actions: CRUD Operations - Products <hr/>
Click on the `Manage Products` link from the employee `Dashboard`. It will open the `All Products` page. By default, it shows all `Products` with details in a list format. 

#### Viewing Products for Only a Particular Category

To view `Products` belonging to a specific category, select the category from the dropdown list and click on the `Get Products` button. It will show products only from the specified category.

#### Adding a New Product
1. To add a new product, click on the `Add a New Product` button. It will lead you to the `Create Product` page.
2. Enter all product details, select a category, and upload an image.
3. Click on the `Add Product` button. A success message will show if the product is created successfully.
4. Click on the `Back to All Products` link on the bottom to return to the `Products` page. The newly created product should be in the list.
5. This new product will also be added available on the [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/). Click the link and visit the home page to confirm the same.

#### In addition to adding a product, the following product CRUD operations can be performed:
- `Viewing` a product's details on the `~/allproducts/:productID` route.
- `Editing` a product's details on the `~/allproducts/:productID/edit` route.
- `Changing` a product's image on the `~/allproducts/:productID/edit/image` route.
- `Deleting` a product's image on the `~/allproducts/:productID/delete` route.

### 3.2.e. User Actions: CRUD Operations - Promos <hr/>
This `Inventory App` allows `Employees` to manage the `Promos` visible in the carousel of the `Shopping App`. The following CRUD operations can be perfomed for the `Promos`.

#### Adding a Promo

#### Editing a Promo

#### 


### 3.2.f. User Actions: CRUD Operations - Orders <hr/>
This `Inventory App` allows `Employees` to manage the `Orders` placed by `Customers` on the `Shopping App`. They can change the `Orders Status` based on its fulfillment status(Processing, Ready for Shipping, Shipped, or Delivered).

    These CRUD operations are still under development.

#### Updating Order Fullfilment Status
- Under Development

# 4. Inventory App: RESTful APIs
Inventory App also provides RESTful APIs for the customer-facing [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/) used by the same organization. In addition to being a standalone WebApp, it acts as a back-end for the `Shopping Cart App`.

## 4.1 RESTful APIs Tech Stack and Packages
The inventory app uses additional technologies and packages for its RESTful APIs.

#### JWT Token
The APIs provided by the app use JWT-based authentication for protected API routes. These routes are for the [Shopping Inventory app](https://2023-top-project-shopping-cart.pages.dev/).

## 4.2 RESTful API Routes
The following routes are provided by the app:

### 4.2.a. RESTful API Routes: Public Routes
The application provides the following public routes:

`~/api/products` GET route to fetch data of all products sold by the organization.

`~/api/products/image/:productName` GET route to fetch to get product image by product name.

`~/api/promos/carousel` GET route to fetch all active carousel promos.

`~/api/promos/carousel/:promoName` GET route to get a promo image by promo name.

### 4.2.b. RESTful API Routes: Protected Routes
The application provides the following protected routes:

`~/api/dash`: GET request to fetch data for the logged-in user.

`~/api/orders`: GET request to fetch all orders for the logged-in user.

`~/api/checkout`: POST request to checkout the cart items for the logged-in user.

`~/api/orders`: POST request to cancel an order based on the `order id` provided in the request body.
