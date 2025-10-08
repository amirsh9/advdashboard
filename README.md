# AdventureWorks Management System

A comprehensive and modern management system for human resources, sales, production, and purchasing based on AdventureWorks data.

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Main Modules](#-main-modules)
- [Technologies](#-technologies)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Introduction

AdventureWorks Management System is a modern web platform designed for comprehensive management of AdventureWorks company data. This system is developed using the latest web technologies and provides a simple and efficient user interface for managing various company resources.

## ✨ Features

### 🏠 Dashboard
- Real-time business key performance indicators
- Interactive sales and production charts
- Quick system status display
- Quick access to main modules
- **Advanced Filtering**: Filter data by year, department, territory, category, vendor, and status
- **Data Refresh**: Real-time data refresh capability

### 📊 Sales Management
- Sales territory performance analysis
- Sales order management and tracking
- Customer analytics and segmentation
- Regional sales reports
- **Sales Analytics**: Comprehensive sales analytics with trends and comparisons
- **Financial Reports**: Detailed financial reporting and analysis

### 👥 Human Resources
- Employee management and analytics
- Department performance tracking
- Job candidate management
- Employee demographics and statistics
- **HR Analytics**: Advanced HR metrics and workforce analysis

### 🏦 Inventory & Production
- Product inventory management
- Production order tracking
- Stock level monitoring
- Product performance analysis
- **Product Management**: Comprehensive product catalog and analysis
- **Category Analysis**: Product category and subcategory performance

### 🛒 Purchasing & Vendors
- Purchase order management
- Vendor performance analysis
- Purchase order tracking
- Vendor comparison and evaluation
- **Vendor Management**: Complete vendor relationship management
- **Purchase Analytics**: Purchase order analysis and trends

### 📈 Reports & Analytics
- Financial reports and analysis
- Revenue and expense tracking
- Budget vs. actual comparisons
- Cash flow analysis
- **Custom Reports**: Customizable reports with filtering capabilities

### ⚙️ System Settings
- **User Profile**: Personal information and avatar management
- **Notifications**: Email and system notification settings
- **Appearance**: Theme, language, and format customization
- **System**: Data management and performance
- **Security**: Security settings and access management

## 🚀 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Modern web browser
- SQL Server (for production use)

### Installation Steps

1. **Clone the repository**
```bash
git clone [repository-url]
cd adventureworks
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
# For development with SQLite
npm run db:push

# For production with SQL Server
# Configure your database connection in src/lib/mssql.ts
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the application**
Open your browser and navigate to `http://localhost:3000`.

## 📁 Project Structure

```
adventureworks/
├── src/
│   ├── app/                  # Application routes
│   │   ├── api/             # API endpoints
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Main layout
│   │   └── page.tsx         # Main page
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   └── ui/              # Base UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Libraries and utilities
│   │   ├── db.ts           # Database connection
│   │   ├── mssql.ts        # SQL Server connection
│   │   ├── socket.ts       # WebSocket configuration
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript definitions
├── prisma/                 # Database schema and settings
├── public/                 # Static files
├── db/                     # Database files
└── README.md              # Project documentation
```

## 🎯 Main Modules

### 1. Dashboard
- Business status summary
- Interactive and analytical charts
- Quick access to main functions
- **Real-time Data**: Live data updates with refresh capability
- **Advanced Filtering**: Multi-dimensional data filtering

### 2. Sales Management
- Sales territory performance
- Order and customer management
- Sales performance analysis
- Regional reports
- **Sales Analytics**: Advanced sales metrics and trends
- **Customer Analytics**: Customer segmentation and analysis

### 3. Human Resources
- Employee search and management
- Department-based filtering
- Contact and organizational information
- **HR Analytics**: Workforce metrics and analytics

### 4. Inventory & Production
- Inventory and production control
- Work order management
- Production line performance monitoring
- **Product Management**: Complete product lifecycle management
- **Category Analysis**: Product category performance metrics

### 5. Purchasing & Vendors
- Purchase order management
- Vendor performance tracking
- Purchase analysis and reporting
- **Vendor Management**: Comprehensive vendor relationship management
- **Purchase Analytics**: Purchase order analysis and trends

### 6. Reports & Analytics
- Financial reporting
- Revenue and expense tracking
- Budget analysis
- Cash flow management
- **Custom Reports**: Customizable reports with advanced filtering

## 🛠 Technologies

### Framework and Language
- **Next.js 15**: React framework with SSR
- **TypeScript**: Type-safe coding
- **React 18**: UI library

### Styling and UI
- **Tailwind CSS**: Modern CSS framework
- **shadcn/ui**: High-quality UI components
- **Lucide React**: Modern icons
- **Recharts**: Chart library for data visualization

### Data and State Management
- **SQL Server**: Primary database for production
- **SQLite**: Lightweight database for development
- **Custom API Layer**: RESTful API endpoints
- **React Hooks**: State management

### Development Tools
- **ESLint**: Code quality checking
- **TypeScript**: Type checking
- **Prettier**: Code formatting

## 📖 Usage Guide

### Getting Started
1. Log in to the system
2. Select the desired module from the left sidebar
3. Use the dashboard to view overall status

### Using Filters
1. Click the filter button in any dashboard
2. Select your desired filter criteria:
   - **Date Range**: Filter by year (2011-2014)
   - **Department**: Filter by department (for HR data)
   - **Territory**: Filter by sales territory
   - **Category**: Filter by product category
   - **Vendor**: Filter by vendor (for purchasing data)
   - **Status**: Filter by order status
3. Click "Apply Filters" to apply your selections
4. Use "Clear" to reset all filters

### Managing Data
1. Navigate to the desired module
2. Use the search bar to find specific items
3. Use filters to narrow down results
4. Click the refresh button to update data

### Customizing Appearance
1. Go to the "Settings" section
2. Select the "Appearance" tab
3. Choose your preferred theme
4. Configure language and formats

## 📊 API Documentation

### Dashboard Endpoints

#### Sales Territory
```
GET /api/dashboard/sales-territory
Query Parameters:
- dateRange: Year filter (2011, 2012, 2013, 2014, all)
- territory: Territory filter (north-america, europe, pacific, all)
```

#### Human Resources
```
GET /api/dashboard/hr
Query Parameters:
- dateRange: Year filter (2011, 2012, 2013, 2014, all)
- department: Department filter (engineering, production, sales, marketing, all)
```

#### Products
```
GET /api/dashboard/products
Query Parameters:
- dateRange: Year filter (2011, 2012, 2013, 2014, all)
- category: Category filter (bikes, components, clothing, accessories, all)
```

#### Purchasing
```
GET /api/dashboard/purchasing
Query Parameters:
- dateRange: Year filter (2011, 2012, 2013, 2014, all)
- vendor: Vendor filter (top, regular, all)
- status: Status filter (approved, rejected, pending, all)
```

#### Inventory
```
GET /api/dashboard/inventory
Query Parameters:
- dateRange: Year filter (2011, 2012, 2013, 2014, all)
- category: Category filter (bikes, components, clothing, accessories, all)
```

#### Sales
```
GET /api/dashboard/sales
Query Parameters:
- dateRange: Year filter (2011, 2012, 2013, 2014, all)
```

### Health Check
```
GET /api/health
Returns: Server status and database connection
```

## 🎯 Dashboard Features

### Sales Territory Dashboard
- Territory performance metrics
- Sales trends and comparisons
- Regional analysis
- Top performing territories

### HR Dashboard
- Employee demographics
- Department statistics
- Hire and termination trends
- Employee distribution

### Product Dashboard
- Product performance metrics
- Category analysis
- Inventory levels
- Product trends

### Purchasing Dashboard
- Purchase order analysis
- Vendor performance
- Order status tracking
- Purchase trends

### Inventory Dashboard
- Stock levels and alerts
- Inventory turnover
- Product availability
- Warehouse analysis

### Sales Dashboard
- Sales performance metrics
- Order analysis
- Customer trends
- Revenue tracking

## 🤝 Contributing

To contribute to the project:

1. Fork the project
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 📞 Support

For bug reports or suggestions, please contact us through Issues on GitHub.

---

**Developed with ❤️ for better business management**