
Built by https://www.blackbox.ai

---

# Negozio 3D Print - Slicer Tool

## Project Overview
Negozio 3D Print is a web application designed for managing the upload and ordering of 3D printed objects. The application allows users to register, upload 3D models in STL format, provide personal data, and make payments. The admin interface provides functionalities to manage users and orders seamlessly. The application utilizes Three.js for STL file processing and Tailwind CSS for styling.

## Installation
To run the application locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd 3d-print-store
   ```

2. **Open `index.html` in your browser**: 
   Simply double-click on `index.html` to open it in your default web browser. No additional installations are required as the application runs entirely in the browser.

## Usage
1. **Registration**:
   - Fill out the registration form with a username, email, and password.
   - Click the "Registrati" button to proceed.

2. **Upload 3D Model**:
   - Upload a valid STL file through the file input.
   - After the model is processed, it will display the estimated weight and cost, then click the "Procedi ai dati personali" button.

3. **Provide Personal Data**:
   - Fill in your name, surname, state, city, street, and postal code.
   - Click "Procedi al pagamento" to continue.

4. **Payment**:
   - Select a payment method (Credit Card or PayPal).
   - Provide your credit card details if required or be redirected to PayPal.
   - Click "Conferma ordine" to finalize your order.

5. **Order Confirmation**:
   - A success message will appear confirming your order.

6. **Admin Panel**:
   - Navigate to `admin.html` for admin operations (confirm credentials: username `admin`, password `admin123`).

## Features
- **User Registration**: Create a new account for ordering.
- **3D Model Upload**: Upload and calculate the weight and price based on the model.
- **Personal Data Entry**: Provide necessary personal details for order processing.
- **Payment Processing**: Another option between credit card and PayPal.
- **Admin Panel**: View and manage registered users and order details.
  
## Dependencies
The application uses the following external libraries:
- [Three.js](https://threejs.org/) for 3D model processing.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Font Awesome](https://fontawesome.com/) for icons.

These libraries are included via CDN in the `index.html` and `admin.html` files.

## Project Structure
The project structure is organized as follows:

```
3d-print-store/
│
├── index.html           # Main user interface for ordering 3D prints
├── app.js               # Main application logic
├── admin.html           # Admin panel interface
├── admin.js             # Admin panel logic
│
└── ...                  # Additional assets and files (if any)
```

This structure keeps the user interface and logic files separated, ensuring a clean and maintainable codebase. The core functionalities exist in `app.js` and `admin.js`, managing the user interactions and data handling.

## Conclusion
Negozio 3D Print is a feature-rich web application aiming to simplify the process of ordering 3D prints while providing an easy-to-use interface for both users and administrators. With easy navigation and functional steps, it's designed to enhance the user experience in ordering custom 3D printed objects.