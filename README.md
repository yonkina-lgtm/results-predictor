# LeadPredictor

LeadPredictor is a simple web-based calculator that predicts the number of Customers, Leads and Prospects based on campaign revenue, average order value and response rates.

## Features

- Total Revenue and Average Order Value inputs
- Lead Response Rate slider
- Prospect Response Rate slider
- Dynamic Customers, Leads and Prospects calculations
- Dynamic six-month chart
- Currency selection
- Multi-language support
- Responsive dark-themed dashboard

## Formulas

### Customers
Customers = Revenue / Average Order Value

### Leads
Leads = Customers × 100 / Lead Response Rate

### Prospects
Prospects = Leads × 100 / Prospect Response Rate

## Technologies

- HTML
- CSS
- JavaScript

## How to run

Open `index.html` in a web browser or use Live Server in Visual Studio Code.

## Project Structure

- `index.html` – page structure
- `styles.css` – visual styling
- `script.js` – calculator functionality and dynamic updates
- `README.md` – project documentation