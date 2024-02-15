# Project Inventory Application by Manvinderjit
A project based primarily on a NodeJS, Express, and MongoDB app with EJS templating view engine and Mongoose ODM.

Creates an app ecosystem for an organization selling computer hardware by actings as a full-fledged WebApp while also providing RESTful APIs for the [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/). 

The app ecosystem consists of two user roles:
- `Customers:` They use the [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/) to place orders.
- `Employees`: They use this `Inventory App` to perform inventory and logistics operations, including processing orders received through the `Shopping Cart App`.

## Description

Inventory App has two distinct functions:

1. Inventory Management: `Inventory App` is a full-fledged app that assists an organization in inventory management. The  employees can `Register` and `Login`, create `Categories` describing products, add `Products` to categories, and manage customer `Orders`. 

2. RESTful APIs: `Inventory App` provides RESTful APIs required by another app, `Shopping Cart App`, to function. The `Customers` of the business interact with  [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/), to place and manage orders.   <br><br>
The `Promos` shown in the `Carousel` of the `Shopping Cart App` are uploaded and managed in the `Inventory App`. <br><br>
Similarly, the `Orders` placed by the `Customers` in the `Shopping Cart App` are managed by the `Employees` in the `Inventory App`.


# 1. Objectives

## 1.1 Skill Demonstration Objectives
The application is created to demonstrate the following coding abilities:

    1. Build a full-stack app utilizing Node, Express, MongoDB Atlas / Mongoose, and EJS templating engine.

    2. Creating RESTfuls APIs for connecting to a single-page web app.

    3. Utilizing a CI/CD pipeline for integration and deployment of new features automatically.

    4. Usage of Docker containerization to build and deploy the application and persist data using Docker volumes.

    5. Use of self-signed SSL certificates to provide an https server.

    6. Familiarity with the AWS cloud platform, with the project showing deployment to an EC2 instance using AWS CodeDeploy via AppSpec and Linux shell scripts, and storing environment variables in the AWS Parameter Store.

## 1.2 Functional Objectives
The webapp has the following functional objectives:

    1. Allows a computer hardware retailer to manage product inventory, promotions, and orders.

    2. Provide APIs to complement its customer-facing application, Shopping Cart.

Shopping Cart GitHub Repo [Click Here for Shopping Cart GitHub Repo Page](https://github.com/manvinderjit/2023-TOP-Project-Shopping-Cart).

Shopping Cart WebApp Live Link [Click Here for Shopping Cart WebApp Live Link](https://2023-top-project-shopping-cart.pages.dev/).

# 2. Inventory App: Usage Guide for Inventory Management Features
## 2.1 User Role: `Employee`
You will be using the inventory app as an `Employee` of the organization, i.e., your user role with be that of an `employee`.
## 2.2 User Actions: `Employee` 
As an `employee` user, you will be able to perform the following actions:

- Register as an `employee`.

- Log in as an `employee`.

- Perform CRUD operations related to a `Category` for products.

- Perform CRUD operations related to a `Product` in a category.

- Perform CRUD operations related to `Orders`.

- Perform CRUD operations related to `Promotions` that are shown in the `Carousel` or other areas of the customer-facing [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/).

### 2.2.a. User Actions: Registering as an `Employee`<hr/>
To register as an employee, click on the `Register` link in the top navigation bar.

Password must contain at least one number and one uppercase and lowercase letter, and at least 5 or more characters

    Using your actual email address is neither recommended nor required because no email registration link will be sent for account activation.

A success message will appear upon successful registration. In case of an error, take action according to the message.

    You can use these demo credentials to log in instead of registering your own account:
    email: `email@email.com`
    password: `Admin1` 

### 2.2.b. User Actions: Log in as an employee <hr/>
To log in as an employee, use the credentials provided or the ones you used to register.

Upon successful login, you will be taken to the `Employee Dashboard`. It allows you to perform CRUD operations for the following:
- `Categories`: Categories are required for segmenting products. Each product must belong to a particular category, e.g., `Monitors`.
- `Products`: Products refer to any product to be sold by the organization. All products added through the `Inventory App` are then available for purchase via the `Shopping Cart App`.
- `Promos`: Any promos shown on the `Shopping Cart App`, like `Carousel Promos` are also added and managed through the `Inventory App`.
- `Orders`: Orders placed by `Customers` on the `Shopping Cart App` are managed by `Employees` through the `Inventory App`.

Click on the link according to the CRUD operation you want to perform.

### 2.2.c. User Actions: CRUD Operations - Category <hr/>
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

### 2.2.d. User Actions: CRUD Operations - Products <hr/>

### 2.2.e. User Actions: CRUD Operations - Promos <hr/>

### 2.2.f. User Actions: CRUD Operations - Orders <hr/>
These CRUD operations are still under development.
# 3. Inventory App: RESTful APIs
Inventory App also provides RESTful APIs for the customer-facing [Shopping Cart App](https://2023-top-project-shopping-cart.pages.dev/) used by the same organization.

## 3.1 RESTful APIs Tech Stack and Packages
The inventory app uses additional technologies and packages for its RESTful APIs.

#### JWT Token
The APIs provided by the app use JWT-based authentication for protected API routes. These routes are for the [Shopping Inventory app](https://2023-top-project-shopping-cart.pages.dev/).

## 3.2 RESTful API Routes
The following routes are provided by the app:

### 3.2.a. RESTful API Routes: Public Routes
The application provides the following public routes:

`~/api/products` GET route to fetch data of all products sold by the organization.

`~/api/products/image/:productName` GET route to fetch to get product image by product name.

`~/api/promos/carousel` GET route to fetch all active carousel promos.

`~/api/promos/carousel/:promoName` GET route to get a promo image by promo name.

### 3.2.b. RESTful API Routes: Protected Routes
The application provides the following protected routes:

`~/api/dash`: GET request to fetch data for the logged-in user.

`~/api/orders`: GET request to fetch all orders for the logged-in user.

`~/api/checkout`: POST request to checkout the cart items for the logged-in user.

`~/api/orders`: POST request to cancel an order based on the `order id` provided in the request body.
