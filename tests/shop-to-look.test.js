/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";

// Mock Fetch Response
global.fetch = jest.fn();

describe("ShopToLook", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="hotspotsContainer" data-section-id="template--18923173249283__main"></div>
            <div id="productModalsContainer"></div>
            <div class="cart-count-bubble">
                <span aria-hidden="true">0</span>
            </div>
        `;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("fetchProducts() should return product data", async () => {
        const mockResponse = {
            data: {
                products: {
                    edges: [
                        {
                            node: {
                                id: "1",
                                title: "Product 1",
                                description: "Description 1",
                                featuredImage: { url: "image1.jpg" },
                                metafields: [
                                    { namespace: "custom", key: "top", value: "20" },
                                    { namespace: "custom", key: "left", value: "30" },
                                ],
                                variants: {
                                    edges: [
                                        { node: { id: "variant1", title: "Size S", price: { amount: "19.99" } } },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const products = await fetchProducts();
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/2023-01/graphql"), expect.any(Object));
        expect(products).toEqual(mockResponse.data.products.edges.map((edge) => edge.node));
    });

    it("renderHotspots() should append hotspots to DOM", () => {
        const products = [
            {
                id: "1",
                title: "Product 1",
                description: "Description 1",
                featuredImage: { url: "image1.jpg" },
                metafields: [
                    { namespace: "custom", key: "top", value: "20" },
                    { namespace: "custom", key: "left", value: "30" },
                ],
                variants: { edges: [] },
            },
        ];

        renderHotspots(products);
        const hotspots = document.querySelectorAll(".hotspot");
        expect(hotspots).toHaveLength(1);
        expect(hotspots[0]).toHaveStyle({ top: "20%", left: "30%" });
        expect(hotspots[0].getAttribute("data-product-id")).toBe("1");
    });

    it("renderModal() should display modal with product details", () => {
        const product = {
            id: "1",
            title: "Product 1",
            description: "Description 1",
            featuredImage: { url: "image1.jpg" },
            variants: { edges: [{ node: { id: "variant1", title: "Size S", price: { amount: "19.99" } } }] },
        };

        renderModal(product);

        const modal = screen.getByRole("dialog");
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveTextContent("Product 1");
        expect(modal).toHaveTextContent("Description 1");
    });

    it("addToCart() should call /cart/add API", async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await addToCart("variant1", 2, "1", "Size S", "product-1");
        expect(fetch).toHaveBeenCalledWith("/cart/add", expect.any(Object));
    });

    it("fetchCart() should update cart count", async () => {
        const mockCartResponse = { item_count: 3 };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockCartResponse,
        });

        await fetchCart();

        const cartCountElement = document.querySelector(".cart-count-bubble span[aria-hidden='true']");
        expect(cartCountElement.textContent).toBe("3");
    });

    it("showSnackbar() should display snackbar with message", () => {
        showSnackbar("Product added successfully!");

        const snackbar = document.querySelector(".snackbar");
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent("Product added successfully!");

        jest.advanceTimersByTime(3000); // Simulate timeout
        expect(snackbar).not.toBeInTheDocument();
    });
});