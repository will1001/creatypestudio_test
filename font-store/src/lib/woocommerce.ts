import crypto from "crypto";
import { mockProducts, mockCategories, mockTags } from "./mock-data";

// WooCommerce API configuration
const WOOCOMMERCE_URL =
  process.env.WOOCOMMERCE_URL || "https://creatypestudiobackend.local/";
const CONSUMER_KEY =
  process.env.WOOCOMMERCE_CONSUMER_KEY ||
  "ck_0022b503bc112022ac4af1b9b73e1b6bf4cfe890";
const CONSUMER_SECRET =
  process.env.WOOCOMMERCE_CONSUMER_SECRET ||
  "cs_3340260f4ed4645c28822375f397e968a4e27996";
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Production environment variables logging
if (process.env.NODE_ENV === "development") {
  console.log("Environment variables loaded:");
  console.log("WOOCOMMERCE_URL:", WOOCOMMERCE_URL);
  console.log(
    "CONSUMER_KEY:",
    CONSUMER_KEY ? CONSUMER_KEY.substring(0, 10) + "..." : "Missing"
  );
  console.log(
    "CONSUMER_SECRET:",
    CONSUMER_SECRET ? CONSUMER_SECRET.substring(0, 10) + "..." : "Missing"
  );
  console.log("USE_MOCK_DATA:", USE_MOCK_DATA);
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_to: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads?: Array<{
    id: string;
    name: string;
    file: string;
  }>;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }>;
  default_attributes: Array<{
    id: number;
    name: string;
    option: string;
  }>;
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: Array<{
    id: number;
    key: string;
    value: any;
  }>;
  stock_status: string;
}

export interface WooCommerceOrder {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: string;
  date_completed: string | null;
  cart_hash: string;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: Array<{
      id: number;
      total: string;
      subtotal: string;
    }>;
    meta_data: Array<{
      id: number;
      key: string;
      value: any;
    }>;
    sku: string;
    price: number;
  }>;
  tax_lines: Array<{
    id: number;
    rate_code: string;
    rate_id: number;
    label: string;
    compounding: boolean;
    tax_total: string;
    shipping_tax_total: string;
    rate_percent: number;
  }>;
  shipping_lines: Array<{
    id: number;
    method_title: string;
    method_id: string;
    instance_id: string;
    total: string;
    total_tax: string;
    taxes: Array<{
      id: number;
      total: string;
      subtotal: string;
    }>;
    meta_data: Array<{
      id: number;
      key: string;
      value: any;
    }>;
  }>;
  fee_lines: Array<{
    id: number;
    name: string;
    tax_class: string;
    tax_status: string;
    total: string;
    total_tax: string;
    taxes: Array<{
      id: number;
      total: string;
      subtotal: string;
    }>;
    meta_data: Array<{
      id: number;
      key: string;
      value: any;
    }>;
  }>;
  coupon_lines: Array<{
    id: number;
    code: string;
    discount: string;
    discount_tax: string;
    meta_data: Array<{
      id: number;
      key: string;
      value: any;
    }>;
  }>;
  refunds: Array<{
    id: number;
    reason: string;
    total: string;
  }>;
  set_paid: boolean;
}

export interface WooCommerceOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface WooCommerceApiParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  tag?: string;
  status?: string;
  type?: string;
  featured?: boolean;
  on_sale?: boolean;
  min_price?: number;
  max_price?: number;
  stock_status?: string;
  orderby?: "date" | "id" | "title" | "price" | "popularity" | "rating";
  order?: "asc" | "desc";
}

class WooCommerceAPI {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.baseUrl = WOOCOMMERCE_URL.replace(/\/$/, ""); // Remove trailing slash
    this.consumerKey = CONSUMER_KEY;
    this.consumerSecret = CONSUMER_SECRET;

    if (process.env.NODE_ENV === "development") {
      console.log("WooCommerce API initialized with URL:", this.baseUrl);
    }
  }

  private generateQueryString(params: WooCommerceApiParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return searchParams.toString();
  }

  private async makeRequest(
    endpoint: string,
    params: WooCommerceApiParams = {}
  ): Promise<any> {
    try {
      const queryString = this.generateQueryString(params);
      const url = `${this.baseUrl}/wp-json/wc/v3/${endpoint}${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching from WooCommerce API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.consumerKey}:${this.consumerSecret}`
          ).toString("base64")}`,
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("WooCommerce API Error:", response.status, errorText);
        throw new Error(
          `WooCommerce API error: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("WooCommerce API request failed:", error);
      throw error;
    }
  }

  async getProducts(
    params: WooCommerceApiParams = {}
  ): Promise<WooCommerceProduct[]> {
    if (USE_MOCK_DATA) {
      return this.getMockProducts(params);
    }
    return await this.makeRequest("products", params);
  }

  async getProduct(id: number): Promise<WooCommerceProduct> {
    if (USE_MOCK_DATA) {
      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      return product;
    }
    return await this.makeRequest(`products/${id}`);
  }

  async getCategories(
    params: Partial<WooCommerceApiParams> = {}
  ): Promise<any[]> {
    if (USE_MOCK_DATA) {
      return mockCategories;
    }
    return await this.makeRequest("products/categories", params);
  }

  async getTags(params: Partial<WooCommerceApiParams> = {}): Promise<any[]> {
    if (USE_MOCK_DATA) {
      return mockTags;
    }
    return await this.makeRequest("products/tags", params);
  }

  async searchProducts(
    query: string,
    params: WooCommerceApiParams = {}
  ): Promise<WooCommerceProduct[]> {
    return await this.getProducts({
      ...params,
      search: query,
    });
  }

  async createOrder(
    orderData: WooCommerceOrderData
  ): Promise<WooCommerceOrder> {
    try {
      console.log(
        "Creating order with data:",
        JSON.stringify(orderData, null, 2)
      );

      const response = await fetch(`${this.baseUrl}/wp-json/wc/v3/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.consumerKey}:${this.consumerSecret}`
          ).toString("base64")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "WooCommerce createOrder API Error:",
          response.status,
          errorText
        );
        throw new Error(
          `WooCommerce createOrder API error: ${response.status} - ${errorText}`
        );
      }

      const order = await response.json();
      console.log("Order created successfully:", order);
      return order;
    } catch (error) {
      console.error("WooCommerce createOrder request failed:", error);
      throw error;
    }
  }

  async getOrders(
    params: WooCommerceApiParams = {}
  ): Promise<WooCommerceOrder[]> {
    if (USE_MOCK_DATA) {
      return this.getMockOrders(params);
    }
    return await this.makeRequest("orders", {
      ...params,
      per_page: params.per_page || 10,
    });
  }

  private getMockProducts(params: WooCommerceApiParams): WooCommerceProduct[] {
    let filteredProducts = [...mockProducts];

    // Apply filters
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.short_description.toLowerCase().includes(searchTerm)
      );
    }

    if (params.category) {
      filteredProducts = filteredProducts.filter((product) =>
        product.categories.some(
          (cat) =>
            cat.slug === params.category ||
            cat.name.toLowerCase() === params.category?.toLowerCase()
        )
      );
    }

    if (params.featured) {
      filteredProducts = filteredProducts.filter((product) => product.featured);
    }

    if (params.on_sale) {
      filteredProducts = filteredProducts.filter((product) => product.on_sale);
    }

    if (params.min_price !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => parseFloat(product.price) >= params.min_price!
      );
    }

    if (params.max_price !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => parseFloat(product.price) <= params.max_price!
      );
    }

    // Apply sorting
    if (params.orderby) {
      switch (params.orderby) {
        case "title":
          filteredProducts.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return params.order === "desc" ? -comparison : comparison;
          });
          break;
        case "price":
          filteredProducts.sort((a, b) => {
            const comparison = parseFloat(a.price) - parseFloat(b.price);
            return params.order === "desc" ? -comparison : comparison;
          });
          break;
        case "date":
          filteredProducts.sort((a, b) => {
            const comparison =
              new Date(a.date_created).getTime() -
              new Date(b.date_created).getTime();
            return params.order === "desc" ? -comparison : comparison;
          });
          break;
        case "popularity":
          filteredProducts.sort((a, b) => {
            const comparison = a.total_sales - b.total_sales;
            return params.order === "desc" ? -comparison : comparison;
          });
          break;
        case "rating":
          filteredProducts.sort((a, b) => {
            const comparison =
              parseFloat(a.average_rating) - parseFloat(b.average_rating);
            return params.order === "desc" ? -comparison : comparison;
          });
          break;
      }
    }

    // Apply pagination
    const page = params.page || 1;
    const perPage = params.per_page || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    return filteredProducts.slice(startIndex, endIndex);
  }

  private getMockOrders(params: WooCommerceApiParams): WooCommerceOrder[] {
    // Mock orders data for development
    const mockOrders: WooCommerceOrder[] = [
      {
        id: 81,
        parent_id: 0,
        number: "81",
        order_key: "wc_order_example123",
        created_via: "checkout",
        version: "8.0.0",
        status: "completed",
        currency: "USD",
        date_created: "2024-01-15T10:30:00",
        date_modified: "2024-01-15T10:30:00",
        discount_total: "0.00",
        discount_tax: "0.00",
        shipping_total: "0.00",
        shipping_tax: "0.00",
        cart_tax: "0.00",
        total: "29.00",
        total_tax: "0.00",
        prices_include_tax: false,
        customer_id: 1,
        customer_ip_address: "192.168.1.1",
        customer_user_agent: "Mozilla/5.0",
        customer_note: "",
        billing: {
          first_name: "John",
          last_name: "Doe",
          company: "",
          address_1: "123 Main St",
          address_2: "",
          city: "Jakarta",
          state: "JK",
          postcode: "12345",
          country: "ID",
          email: "john.doe@example.com",
          phone: "+628123456789",
        },
        shipping: {
          first_name: "John",
          last_name: "Doe",
          company: "",
          address_1: "123 Main St",
          address_2: "",
          city: "Jakarta",
          state: "JK",
          postcode: "12345",
          country: "ID",
        },
        payment_method: "cod",
        payment_method_title: "Cash on Delivery",
        transaction_id: "",
        date_paid: "2024-01-15T10:30:00",
        date_completed: "2024-01-15T10:30:00",
        cart_hash: "example_hash",
        line_items: [
          {
            id: 1,
            name: "Modern Sans Font Family",
            product_id: 62,
            variation_id: 0,
            quantity: 1,
            tax_class: "",
            subtotal: "29.00",
            subtotal_tax: "0.00",
            total: "29.00",
            total_tax: "0.00",
            taxes: [],
            meta_data: [],
            sku: "",
            price: 29,
          },
        ],
        tax_lines: [],
        shipping_lines: [],
        fee_lines: [],
        coupon_lines: [],
        refunds: [],
        set_paid: true,
      },
      {
        id: 80,
        parent_id: 0,
        number: "80",
        order_key: "wc_order_example456",
        created_via: "checkout",
        version: "8.0.0",
        status: "processing",
        currency: "USD",
        date_created: "2024-01-14T15:45:00",
        date_modified: "2024-01-14T15:45:00",
        discount_total: "0.00",
        discount_tax: "0.00",
        shipping_total: "5.00",
        shipping_tax: "0.00",
        cart_tax: "0.00",
        total: "54.00",
        total_tax: "0.00",
        prices_include_tax: false,
        customer_id: 1,
        customer_ip_address: "192.168.1.1",
        customer_user_agent: "Mozilla/5.0",
        customer_note: "Please deliver after 5 PM",
        billing: {
          first_name: "Jane",
          last_name: "Smith",
          company: "Design Studio",
          address_1: "456 Creative Ave",
          address_2: "Suite 200",
          city: "Bandung",
          state: "JB",
          postcode: "40115",
          country: "ID",
          email: "jane@designstudio.com",
          phone: "+628987654321",
        },
        shipping: {
          first_name: "Jane",
          last_name: "Smith",
          company: "Design Studio",
          address_1: "456 Creative Ave",
          address_2: "Suite 200",
          city: "Bandung",
          state: "JB",
          postcode: "40115",
          country: "ID",
        },
        payment_method: "cod",
        payment_method_title: "Cash on Delivery",
        transaction_id: "",
        date_paid: "2024-01-14T15:45:00",
        date_completed: null,
        cart_hash: "example_hash_2",
        line_items: [
          {
            id: 2,
            name: "Classic Serif Bundle",
            product_id: 45,
            variation_id: 0,
            quantity: 2,
            tax_class: "",
            subtotal: "49.00",
            subtotal_tax: "0.00",
            total: "49.00",
            total_tax: "0.00",
            taxes: [],
            meta_data: [],
            sku: "",
            price: 24.5,
          },
        ],
        tax_lines: [],
        shipping_lines: [
          {
            id: 1,
            method_title: "Standard Shipping",
            method_id: "flat_rate",
            instance_id: "1",
            total: "5.00",
            total_tax: "0.00",
            taxes: [],
            meta_data: [],
          },
        ],
        fee_lines: [],
        coupon_lines: [],
        refunds: [],
        set_paid: true,
      },
    ];

    // Apply pagination
    const page = params.page || 1;
    const perPage = params.per_page || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    return mockOrders.slice(startIndex, endIndex);
  }
}

export const wooCommerceAPI = new WooCommerceAPI();
