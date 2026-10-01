import { useEffect, useMemo, useState } from "react";

const starterProducts = [
  {
    id: "margherita",
    name: "Margherita, my love",
    category: "Pizza",
    description: "San Marzano tomato, fior di latte, fresh basil",
    price: 14,
    rating: "4.9",
    time: "15–20 min",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "truffle-pasta",
    name: "Truffle & parmesan",
    category: "Pasta",
    description: "Silky tagliatelle, wild mushroom, truffle oil",
    price: 18,
    rating: "4.8",
    time: "20 min",
    badge: "A little fancy",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "burrata-salad",
    name: "The good green salad",
    category: "Salads",
    description: "Creamy burrata, heirloom tomato, basil oil",
    price: 16,
    rating: "4.9",
    time: "10–15 min",
    badge: "Fresh pick",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "tiramisu",
    name: "Nonna's tiramisu",
    category: "Desserts",
    description: "Espresso-soaked sponge, mascarpone, cocoa",
    price: 9,
    rating: "5.0",
    time: "Ready now",
    badge: "Made with love",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "pepperoni",
    name: "Hot honey pepperoni",
    category: "Pizza",
    description: "Spicy pepperoni, mozzarella, a little hot honey",
    price: 17,
    rating: "4.8",
    time: "18–22 min",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "ravioli",
    name: "Sunday ricotta ravioli",
    category: "Pasta",
    description: "Hand-folded ravioli, sage butter, toasted hazelnut",
    price: 19,
    rating: "4.9",
    time: "20–25 min",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = ["Everything", "Pizza", "Pasta", "Salads", "Desserts", "Drinks"];
const statusOptions = ["New", "Preparing", "Ready for pickup", "Completed"];

function readSaved(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Couldn't load saved ${key}.`, error);
    return fallback;
  }
}

function Icon({ name, size = 18 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "bag") {
    return (
      <svg {...shared}>
        <path d="M5 8h14l1 12H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg {...shared}>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg {...shared}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  if (name === "minus") {
    return (
      <svg {...shared}>
        <path d="M5 12h14" />
      </svg>
    );
  }
  if (name === "arrow") {
    return (
      <svg {...shared}>
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg {...shared}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg {...shared}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }
  return null;
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function App() {
  const [products, setProducts] = useState(() =>
    readSaved("little-olive-products", starterProducts),
  );
  const [orders, setOrders] = useState(() => readSaved("little-olive-orders", []));
  const [cart, setCart] = useState(() => readSaved("little-olive-cart", {}));
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notice, setNotice] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Pizza",
    description: "",
    price: "",
  });

  useEffect(() => {
    window.localStorage.setItem("little-olive-products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    window.localStorage.setItem("little-olive-orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    window.localStorage.setItem("little-olive-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "Everything" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => ({
          product: products.find((product) => product.id === id),
          quantity,
        }))
        .filter((item) => item.product && item.quantity > 0),
    [cart, products],
  );
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 && subtotal < 35 ? 3.5 : 0;
  const total = subtotal + deliveryFee;

  function updateCart(productId, change) {
    setCart((current) => {
      const nextQuantity = (current[productId] || 0) + change;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[productId];
      else next[productId] = nextQuantity;
      return next;
    });
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!cartItems.length || !customerName.trim() || !customerPhone.trim()) return;
    const order = {
      id: `OL-${String(Date.now()).slice(-6)}`,
      customer: customerName.trim(),
      phone: customerPhone.trim(),
      items: cartItems.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
        price: Number(product.price),
      })),
      total,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [order, ...current]);
    setCart({});
    setCustomerName("");
    setCustomerPhone("");
    setShowCheckout(false);
    setNotice(`Order ${order.id} is in! We'll get cooking.`);
    window.setTimeout(() => setNotice(""), 5000);
  }

  function addProduct(event) {
    event.preventDefault();
    const price = Number(productForm.price);
    if (!productForm.name.trim() || !productForm.description.trim() || !Number.isFinite(price) || price <= 0) {
      return;
    }
    const id = `${productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const imageByCategory = {
      Pizza:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
      Pasta:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
      Salads:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
      Desserts:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=85",
      Drinks:
        "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85",
    };
    setProducts((current) => [
      {
        id,
        name: productForm.name.trim(),
        category: productForm.category,
        description: productForm.description.trim(),
        price,
        rating: "New",
        time: "15–20 min",
        badge: "Just added",
        image: imageByCategory[productForm.category] || imageByCategory.Pizza,
      },
      ...current,
    ]);
    setProductForm({ name: "", category: "Pizza", description: "", price: "" });
    setNotice("Your new dish is on the menu.");
    window.setTimeout(() => setNotice(""), 3500);
  }

  function updateOrderStatus(orderId, status) {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            setIsAdmin(false);
          }}
          aria-label="Little Olive Kitchen home"
        >
          <span className="brand-mark">lo</span>
          <span className="brand-copy">
            <strong>little olive</strong>
            <small>KITCHEN & WINE</small>
          </span>
        </a>
        <div className="topbar-center">
          <span className="open-dot" />
          <span>Open today</span>
          <span className="topbar-divider">·</span>
          <span>11:00 am — 10:00 pm</span>
        </div>
        <div className="topbar-actions">
          <button className="admin-toggle" onClick={() => setIsAdmin((value) => !value)}>
            <span className="admin-avatar">{isAdmin ? "LO" : "A"}</span>
            <span>{isAdmin ? "Back to shop" : "Admin"}</span>
            <span className="toggle-caret">⌄</span>
          </button>
          {!isAdmin && (
            <button
              className="mobile-cart"
              aria-label={`Open basket, ${cartCount} items`}
              onClick={() => document.querySelector(".basket-panel")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Icon name="bag" />
              {cartCount > 0 && <span>{cartCount}</span>}
            </button>
          )}
        </div>
      </header>

      {isAdmin ? (
        <AdminDashboard
          orders={orders}
          products={products}
          productForm={productForm}
          setProductForm={setProductForm}
          onAddProduct={addProduct}
          onUpdateStatus={updateOrderStatus}
        />
      ) : (
        <main className="store-layout" id="home">
          <section className="store-content">
            <div className="hero">
              <img
                className="hero-photo"
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1800&q=90"
                alt="Freshly baked pizza topped with basil"
              />
              <div className="hero-overlay" />
              <div className="hero-content">
                <span className="eyebrow hero-eyebrow">A little taste of Italy</span>
                <h1>Good food.<br />Good mood.</h1>
                <p>Handmade with love, right around the corner.</p>
                <div className="hero-meta">
                  <span><Icon name="clock" size={15} /> 25–35 min</span>
                  <i />
                  <span><Icon name="pin" size={15} /> Brooklyn, NY</span>
                </div>
              </div>
              <div className="hero-sticker"><span>made fresh</span><strong>daily</strong></div>
            </div>

            <div className="welcome-row">
              <div>
                <span className="eyebrow">From our kitchen to your table</span>
                <h2>Something delicious awaits.</h2>
              </div>
              <div className="review-pill"><span>★</span> 4.9 <small>(280+ happy bites)</small></div>
            </div>

            <div className="search-row">
              <label className="search-box">
                <Icon name="search" size={19} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Find your new favorite..."
                  aria-label="Search menu"
                />
                <kbd>⌘ K</kbd>
              </label>
              <div className="delivery-note"><span>✦</span> Free delivery over $35</div>
            </div>

            <nav className="category-tabs" aria-label="Menu categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? "category-tab active" : "category-tab"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === "Everything" && <span className="all-icon">✳</span>}
                  {category}
                  {category !== "Everything" && (
                    <span className="tab-count">
                      {products.filter((product) => product.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="section-heading">
              <div>
                <h3>{activeCategory === "Everything" ? "The good stuff" : activeCategory}</h3>
                <p>Made from scratch. Never in a rush.</p>
              </div>
              <span className="menu-count">{filteredProducts.length} dishes</span>
            </div>

            {filteredProducts.length ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <img src={product.image} alt={product.name} className="product-image" />
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                      <button
                        className="add-button"
                        aria-label={`Add ${product.name} to basket`}
                        onClick={() => updateCart(product.id, 1)}
                      >
                        <Icon name="plus" size={20} />
                      </button>
                    </div>
                    <div className="product-info">
                      <div className="product-title-row">
                        <h4>{product.name}</h4>
                        <strong>{formatPrice(product.price)}</strong>
                      </div>
                      <p>{product.description}</p>
                      <div className="product-details">
                        <span className="rating">★ {product.rating}</span>
                        <span className="detail-dot">·</span>
                        <span>{product.time}</span>
                        <span className="detail-category">{product.category}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-menu">
                <span>🥄</span>
                <h3>No dishes found</h3>
                <p>Try another search or choose a different category.</p>
                <button onClick={() => { setSearch(""); setActiveCategory("Everything"); }}>Show the whole menu</button>
              </div>
            )}

            <footer className="store-footer">
              <span>© {new Date().getFullYear()} Little Olive Kitchen</span>
              <span>Made with <b>♥</b> in Brooklyn</span>
              <a href="mailto:hello@littleolive.example">Need a hand?</a>
            </footer>
          </section>

          <aside className="basket-panel">
            <div className="basket-header">
              <div>
                <span className="eyebrow">Your order</span>
                <h2>Your little basket <span className="basket-count">{cartCount}</span></h2>
              </div>
              <span className="basket-icon"><Icon name="bag" size={20} /></span>
            </div>
            <div className="basket-pickup">
              <span className="pickup-icon"><Icon name="pin" size={16} /></span>
              <div><strong>Deliver to</strong><small>Brooklyn, NY · Change</small></div>
              <Icon name="arrow" size={15} />
            </div>

            {cartItems.length ? (
              <>
                <div className="basket-items">
                  {cartItems.map(({ product, quantity }) => (
                    <div className="basket-item" key={product.id}>
                      <img src={product.image} alt="" />
                      <div className="basket-item-copy">
                        <strong>{product.name}</strong>
                        <small>{formatPrice(product.price)}</small>
                        <div className="quantity-control">
                          <button onClick={() => updateCart(product.id, -1)} aria-label={`Remove one ${product.name}`}><Icon name="minus" size={13} /></button>
                          <span>{quantity}</span>
                          <button onClick={() => updateCart(product.id, 1)} aria-label={`Add one ${product.name}`}><Icon name="plus" size={13} /></button>
                        </div>
                      </div>
                      <strong className="item-total">{formatPrice(product.price * quantity)}</strong>
                    </div>
                  ))}
                </div>
                {subtotal < 35 && (
                  <div className="free-delivery-progress">
                    <div className="progress-copy"><span>Add {formatPrice(35 - subtotal)} for free delivery</span><b>{Math.min(100, Math.round((subtotal / 35) * 100))}%</b></div>
                    <div className="progress-track"><span style={{ width: `${Math.min(100, (subtotal / 35) * 100)}%` }} /></div>
                  </div>
                )}
                <div className="basket-summary">
                  <div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div><span>Delivery</span><span>{deliveryFee ? formatPrice(deliveryFee) : <em>Free</em>}</span></div>
                  <div className="summary-total"><strong>Total</strong><strong>{formatPrice(total)}</strong></div>
                </div>
                <button className="checkout-button" onClick={() => setShowCheckout(true)}>
                  Continue to checkout <Icon name="arrow" size={17} />
                </button>
                <div className="secure-note"><Icon name="check" size={14} /> Secure checkout · Pay on delivery</div>
              </>
            ) : (
              <div className="empty-basket">
                <div className="empty-bag"><Icon name="bag" size={25} /></div>
                <h3>Your basket is taking a nap</h3>
                <p>Add something delicious and we'll take it from here.</p>
                <button onClick={() => document.querySelector(".category-tabs")?.scrollIntoView({ behavior: "smooth" })}>Explore the menu <Icon name="arrow" size={15} /></button>
              </div>
            )}
            <div className="basket-help"><span>Need something?</span><a href="tel:+17185550142">Give us a ring <Icon name="arrow" size={13} /></a></div>
          </aside>
        </main>
      )}

      {notice && <div className="toast"><span className="toast-check"><Icon name="check" size={16} /></span>{notice}</div>}

      {showCheckout && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowCheckout(false);
        }}>
          <form className="checkout-modal" onSubmit={placeOrder}>
            <button type="button" className="modal-close" onClick={() => setShowCheckout(false)} aria-label="Close checkout">×</button>
            <span className="eyebrow">Almost there</span>
            <h2>Let's get this to you.</h2>
            <p className="modal-intro">Pop in your details and our kitchen will get started.</p>
            <label className="field-label">Your name<input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g. Alex Morgan" /></label>
            <label className="field-label">Phone number<input required type="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="For delivery updates" /></label>
            <div className="checkout-total"><span>{cartCount} {cartCount === 1 ? "item" : "items"} · Pay on delivery</span><strong>{formatPrice(total)}</strong></div>
            <button className="checkout-button" type="submit" disabled={!cartItems.length}>Place my order <Icon name="arrow" size={17} /></button>
            <div className="secure-note"><Icon name="check" size={14} /> No payment needed right now</div>
          </form>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ orders, products, productForm, setProductForm, onAddProduct, onUpdateStatus }) {
  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const activeOrders = orders.filter((order) => order.status !== "Completed").length;

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">Little Olive Kitchen · Workspace</span>
          <h1>Good afternoon, Alex <span>✳</span></h1>
          <p>Here's what's cooking at your restaurant today.</p>
        </div>
        <div className="admin-date"><span className="open-dot" /> Store is open <span className="admin-date-divider">·</span> {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-top"><span>Today's orders</span><span className="stat-icon green">↗</span></div><strong>{orders.length.toString().padStart(2, "0")}</strong><small><b>+12%</b> from last week</small></div>
        <div className="stat-card"><div className="stat-top"><span>In the kitchen</span><span className="stat-icon amber">◷</span></div><strong>{activeOrders.toString().padStart(2, "0")}</strong><small>Orders to take care of</small></div>
        <div className="stat-card"><div className="stat-top"><span>Today's revenue</span><span className="stat-icon peach">$</span></div><strong>{formatPrice(revenue)}</strong><small><b>+8%</b> from last week</small></div>
        <div className="stat-card"><div className="stat-top"><span>Menu items</span><span className="stat-icon lilac">✳</span></div><strong>{products.length.toString().padStart(2, "0")}</strong><small>Across {new Set(products.map((product) => product.category)).size} categories</small></div>
      </div>

      <div className="admin-columns">
        <section className="admin-card orders-card">
          <div className="admin-card-heading">
            <div><h2>Recent orders <span className="order-count">{orders.length}</span></h2><p>A little overview of what's coming through.</p></div>
            <button className="subtle-button">Today <span>⌄</span></button>
          </div>
          {orders.length ? (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th></tr></thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong><small>{new Date(order.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</small></td>
                      <td><strong>{order.customer}</strong><small>{order.phone}</small></td>
                      <td><strong>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</strong><small>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</small></td>
                      <td><strong>{formatPrice(order.total)}</strong></td>
                      <td>
                        <select className={`status-select status-${order.status.toLowerCase().replaceAll(" ", "-")}`} value={order.status} onChange={(event) => onUpdateStatus(order.id, event.target.value)} aria-label={`Status for order ${order.id}`}>
                          {statusOptions.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty"><div>🧾</div><h3>No orders just yet</h3><p>When a customer places an order, you'll see it right here.</p></div>
          )}
        </section>

        <section className="admin-card create-card">
          <div className="admin-card-heading">
            <div><h2>Add to the menu <span className="create-spark">✳</span></h2><p>Something new and delicious?</p></div>
          </div>
          <form className="product-form" onSubmit={onAddProduct}>
            <label className="field-label">Dish name<input required value={productForm.name} onChange={(event) => setProductForm((form) => ({ ...form, name: event.target.value }))} placeholder="e.g. Sunday sauce rigatoni" /></label>
            <label className="field-label">A little description<input required value={productForm.description} onChange={(event) => setProductForm((form) => ({ ...form, description: event.target.value }))} placeholder="What's in it? Make us hungry." /></label>
            <div className="form-split">
              <label className="field-label">Category<select value={productForm.category} onChange={(event) => setProductForm((form) => ({ ...form, category: event.target.value }))}>{["Pizza", "Pasta", "Salads", "Desserts", "Drinks"].map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="field-label">Price<input required min="0.01" step="0.01" type="number" value={productForm.price} onChange={(event) => setProductForm((form) => ({ ...form, price: event.target.value }))} placeholder="$ 0.00" /></label>
            </div>
            <button className="add-menu-button" type="submit"><Icon name="plus" size={17} /> Add to menu</button>
          </form>
          <div className="menu-tip"><span>✦</span><p><strong>A little tip</strong> — Good descriptions make hungry people even hungrier.</p></div>
        </section>
      </div>
      <div className="admin-footer"><span>Little Olive Kitchen · Admin workspace</span><span>You're doing great. Keep it saucy. <b>♥</b></span></div>
    </main>
  );
}

export default App;
