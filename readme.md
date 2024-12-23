Shop the Look – Implementation Guide and Setup Documentation

Overview

The “Shop the Look” feature is designed to create an engaging shopping experience by showcasing purchasable products on a lifestyle image. Interactive hotspots are overlaid on the image, allowing customers to view detailed product information, select variants, check availability, and add products directly to their cart. This feature integrates Shopify’s Storefront API for real-time product data and ensures seamless cart functionality.

Step-by-Step Setup Instructions

1. Set Up Shopify Store

This was the starting point. I created a Shopify store and ensured it supported Online Store 2.0 themes.
	•	Enable Storefront API:
	•	Accessed the Apps section in Shopify Admin.
	•	Created a private app or custom app and granted Storefront API access.
	•	Generated a Storefront Access Token to use for all API requests.

2. Create Product Metafields

To position the hotspots dynamically, I set up metafields for each product.
	•	Metafield Configuration:
	•	Used the namespace custom with keys top and left to define the hotspot coordinates (in percentages).
	•	Assigned values for each product based on where I wanted the hotspot to appear on the lifestyle image.
	•	Example:
	•	top: 50
	•	left: 60

3. Create a New Section

To integrate this feature into Shopify, I created a custom Liquid section.
	•	File Setup:
	•	Added a shop-to-look.liquid file to the sections/ folder.
	•	Included settings for:
	•	Image Picker: To upload the lifestyle image.
	•	Product List: To select up to 10 products for display.
	•	Example Code:

{% schema %}
{
  "name": "Shop the Look",
  "settings": [
    {
      "type": "image_picker",
      "id": "featured_image",
      "label": "Featured Image"
    },
    {
      "type": "product_list",
      "id": "products",
      "label": "Featured Products",
      "limit": 10
    }
  ]
}
{% endschema %}



4. Include the Section in the Theme

I added the new section to the Shopify template to make it visible on the desired page.
	•	Integration:
	•	Injected the shop-to-look section into the index.liquid or any relevant template.
	•	Example:

{% section 'shop-to-look' %}


5. Add Frontend Files

To implement interactivity and styling, I included the following files in the assets/ folder:
	•	CSS:
	•	Created shop-to-look.css to define styles for hotspots, modals, and overall UI.
	•	Ensured the design was responsive and matched the store’s theme.
	•	JavaScript:
	•	Added shop-to-look.js to manage API calls, render hotspots, and handle modal functionality.

6. Fetch Product Data via API

I wrote the fetchProducts function in shop-to-look.js to retrieve product data, including variants, prices, and available quantities.
	•	Storefront API Query:
	•	Used the Storefront Access Token to query the API.

7. Implement the Quick-View Modal

The modal dynamically displays product details and variant options.
	•	Features:
	•	Shows product title, description, image, price, and available quantity.
	•	Updates price and available quantity when a size is selected.
	•	Includes an Add to Cart button that updates the cart without refreshing the page.

8. Deploy Changes

Finally, I saved and pushed all files to the Shopify theme.
	•	Testing:
	•	Verified the positioning of hotspots and the functionality of modals.
	•	Ensured smooth API integration and cart updates.

Key Features

1. Interactive Hotspots
	•	Hotspots are dynamically positioned based on product metafields (top and left values).
	•	Clicking on a hotspot opens a modal with detailed product information.

2. Dynamic Modal
	•	Displays:
	•	Product details (title, description, image).
	•	Variant options (size selection).
	•	Price and available quantity, which update dynamically upon size selection.

3. Add to Cart
	•	Adds selected products and quantities to the cart using the /cart/add endpoint.
	•	Displays a snackbar confirming the addition to the cart.

4. Real-Time API Integration
	•	Fetches product data, including variants, inventory levels, and prices, using the Storefront API.

Assumptions Made
	•	Metafields: Assumed that all products have preconfigured metafields with accurate coordinates for hotspots.
	•	Cart System: Relied on Shopify’s standard cart system to support /cart/add.

Known Limitations
	1.	Product Count:
	•	The feature supports up to 10 products per image.
	•	Adding more products may require additional design adjustments.
	2.	Responsiveness:
	•	On smaller screens, the modal may cover most of the image.
	3.	Inventory Accuracy:
	•	Real-time inventory updates depend on the responsiveness of the Storefront API.

Future Improvements

1. Drag-and-Drop Hotspot Editing
	•	Add functionality for admins to reposition hotspots visually in the Shopify theme customizer.

2. Improved Accessibility
	•	Enable keyboard navigation for hotspots and modals.
	•	Add ARIA labels for better screen reader compatibility.

3. Enhanced Performance
	•	Implement lazy loading for images and modals to optimize performance.

4. Custom Branding
	•	Allow store admins to customize modal colors, fonts, and animations to match their brand identity.

Deployment Summary

Prerequisites
	•	Shopify Store with Online Store 2.0 enabled.
	•	Storefront API with access token.
	•	Configured product metafields.

Steps
	1.	Add the shop-to-look.liquid section to your theme.
	2.	Include shop-to-look.js and shop-to-look.css in the assets folder.
	3.	Inject the section into a Shopify template.
	4.	Test thoroughly in a development theme.

Final Deployment
	•	Push changes to the live theme after confirming functionality.
	•	Verify that hotspots, modals, and cart updates are working seamlessly.
