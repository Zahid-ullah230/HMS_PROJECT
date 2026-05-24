Central Hospital Management System (HMS PRO)
Developer Profile
Student Name: Zahid Ullah
University Roll Number: F24BDOCS1M09011
Academic Program: BSNT
Current Semester: 4th Semester
Course Assignment: Web Technologies Project
Project Overview
This is a lightweight Hospital Management System built to handle basic healthcare workflows. The project is constructed using Plain JavaScript for front-end DOM manipulation and JSON Server as a local mock REST API backend database. It uses Bootstrap 5 via CDN for responsive styling.
Core Features
 1. Patient Portal (index.html)
 * Displays a list of medical staff fetched dynamically using GET requests.
 * Allows users to filter the doctors list by department.
 * Includes an appointment booking form with 5 input fields.
 * Validates inputs using custom inline JavaScript logic without blocking alert boxes.
 * Re-renders the list automatically after a new booking is submitted via POST.
 2. Administrative Control Center (admin.html)
 * Displays a management table of all appointments fetched from the backend server.
 * Calculates and shows 3 live statistics: Total Bookings, Total Revenue in PKR, and Pending Invoices.
 * Allows updating appointment details and status values using PUT requests via a modal form.
 * Allows deleting individual booking records using DELETE requests accompanied by a confirmation alert.
Technical Stack
 * Markup: HTML5
 * Styling: Bootstrap 5 via CDN
 * Scripts: Plain JavaScript using async/await and try/catch
 * Database backend: JSON Server REST API
How to Run the Project
Step 1: Start the Database Server
Open your terminal in the project directory and run this command:
npx json-server --watch db.json
Step 2: View the Application
Open the files using Live Server or double-click them to run in your browser:
 * Patient Gateway: http://127.0.0.1:5500/index.html
 * Admin Dashboard: http://127.0.0.1:5500/admin.html