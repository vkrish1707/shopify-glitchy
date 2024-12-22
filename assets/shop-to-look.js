document.addEventListener("DOMContentLoaded", () => {
    const fetchProducts = async () => {
        const query = `
            query getProducts($first: Int!) {
                products(first: $first) {
                    edges {
                        node {
                            id
                            title
                            description
                            featuredImage {
                                url
                            }
                            metafields(identifiers: [{namespace: "custom", key: "top"}, {namespace: "custom", key: "left"}]) {
                                namespace
                                key
                                value
                            }
                            variants(first: 10) {
                                edges {
                                    node {
                                        id
                                        title
                                        price {
                                            amount
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = { first: 5 };

        try {
            const response = await fetch("https://glitchyglitchy.myshopify.com/api/2023-01/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": "e3784e83a32cfcadf8d3727077b35522",
                },
                body: JSON.stringify({ query, variables }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const products = data.data.products.edges.map((edge) => edge.node);
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };

    const renderHotspots = (products) => {
        const hotspotsContainer = document.getElementById("hotspotsContainer");

        products.forEach((product) => {
            const top = product.metafields.find((m) => m.key === "top")?.value;
            const left = product.metafields.find((m) => m.key === "left")?.value;

            if (top && left) {
                const hotspot = document.createElement("div");
                hotspot.className = "hotspot";
                hotspot.style.position = "absolute";
                hotspot.style.top = `${top}%`;
                hotspot.style.left = `${left}%`;
                hotspot.setAttribute("data-product-id", product.id);
                hotspot.setAttribute("aria-label", `View ${product.title}`);
                hotspot.innerHTML = `<span class="hotspot-inner"></span>`;

                hotspot.addEventListener("click", () => renderModal(product));
                hotspotsContainer.appendChild(hotspot);
            }
        });
    };

    const renderModal = (product) => {
        const modalsContainer = document.getElementById("productModalsContainer");
        const variants = product.variants.edges;
        const hasMultipleVariants = variants.length > 1;
        let quantity = 1;

        const variantOptions = hasMultipleVariants
            ? variants.map(
                (variant) => `
                <option value="${variant.node.id}">
                  ${variant.node.title} - $${parseFloat(variant.node.price.amount).toFixed(2)}
                </option>`
            ).join("")
            : "";

        modalsContainer.innerHTML = `
            <div class="product-modal">
                <div class="modal-content">
                    <div class="modal-left">
                        <img src="${product.featuredImage.url}" alt="${product.title}" class="modal-product-image" />
                    </div>
                    <div class="modal-right">
                        <h2>${product.title}</h2>
                        <p>${product.description}</p>
                        ${hasMultipleVariants
                ? `
                        <label for="variant-select">Choose Size:</label>
                        <select id="variant-select" class="variant-select">${variantOptions}</select>`
                : `<p class="price">Price: $${parseFloat(variants[0]?.node.price.amount || 0).toFixed(2)}</p>`
            }
                        <div class="quantity-control">
                            <label>Quantity:</label>
                            <button id="decreaseQuantity">-</button>
                            <span id="quantityDisplay">${quantity}</span>
                            <button id="increaseQuantity">+</button>
                        </div>
                        <button id="addToCart" class="add-to-cart-btn">Add to Cart</button>
                        <button id="closeModal" class="modal-close-btn">×</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("closeModal").addEventListener("click", () => {
            modalsContainer.innerHTML = "";
        });

        document.getElementById("increaseQuantity").addEventListener("click", () => {
            quantity++;
            document.getElementById("quantityDisplay").textContent = quantity;
        });

        document.getElementById("decreaseQuantity").addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                document.getElementById("quantityDisplay").textContent = quantity;
            }
        });

        document.getElementById("addToCart").addEventListener("click", () => {
            const selectedVariant = hasMultipleVariants
                ? document.getElementById("variant-select")?.value
                : variants[0]?.node.id;
            const productId = product.id.split("/").pop();
            const productHandle = product.title.replace(/\s+/g, "-").toLowerCase();
            const size = hasMultipleVariants
                ? document.getElementById("variant-select")?.options[
                    document.getElementById("variant-select").selectedIndex
                ]?.textContent.trim()
                : "";

            addToCart(selectedVariant, quantity, productId, size, productHandle);
        });
    };

    const addToCart = async (variantId, quantity, productId, size, productHandle) => {
        const formData = new URLSearchParams();
        const sectionId = document.getElementById("hotspotsContainer").dataset.sectionId;
        formData.append("id", variantId.split("/").pop());
        formData.append("quantity", quantity);
        formData.append("form_type", "product");
        formData.append("utf8", "✓");
        formData.append("product-id", productId);
        formData.append("section-id", sectionId);
        formData.append(
            "sections",
            "cart-notification-product,cart-notification-button,cart-icon-bubble"
        );
        formData.append("sections_url", `/products/${productHandle}`);
        if (size) {
            const formattedSize = size.split(" - ")[0]; 
            formData.append("Size-1%0D%0A", `${formattedSize}`); 
        }
        try {
            const response = await fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });

            if (response.ok || response.status === 302) {
                
                showSnackbar("Product added to cart successfully!");

                
                fetchCart();

                
                document.getElementById("productModalsContainer").innerHTML = "";
            } else {
                throw new Error("Failed to add product to cart.");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            showSnackbar("Failed to add product to cart. Please try again.");
        }
    };

    const fetchCart = async () => {
        try {
            const response = await fetch("/cart.js");
            const cart = await response.json();
            const cartCountElement = document.querySelector(".cart-count-bubble span[aria-hidden='true']");
            if (cartCountElement) {
                cartCountElement.textContent = cart.item_count;
            }
        } catch (error) {
            console.error("Error fetching cart details:", error);
        }
    };

    const showSnackbar = (message) => {
        let snackbar = document.querySelector(".snackbar");
    
        // If snackbar does not exist, create it
        if (!snackbar) {
            snackbar = document.createElement("div");
            snackbar.className = "snackbar";
            document.body.appendChild(snackbar);
        }
    
        snackbar.textContent = message;
        snackbar.classList.add("show");
    
        setTimeout(() => {
            snackbar.classList.remove("show");
        }, 3000);
    };

    fetchProducts().then((products) => {
        renderHotspots(products);
    });
});
