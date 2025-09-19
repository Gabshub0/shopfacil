// App.js
import React, { useReducer, createContext, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Context para gerenciamento de estado global
const AppContext = createContext();

// Estado inicial
const initialState = {
  products: [],
  cart: [],
  user: null,
  isCartOpen: false,
  isAuthModalOpen: false,
  authMode: 'login',
  searchTerm: '',
  selectedCategory: 'all',
  orders: []
};

// Reducer para gerenciar ações de estado
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    case 'TOGGLE_AUTH_MODAL':
      return { ...state, isAuthModalOpen: !state.isAuthModalOpen, authMode: action.payload || state.authMode };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
}

// Provedor de contexto
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar produtos (simulando uma API)
  useEffect(() => {
    const mockProducts = [
      { 
        id: 1, 
        name: 'Smartphone XYZ', 
        price: 899.99, 
        category: 'eletronicos', 
        image: 'https://http2.mlstatic.com/D_Q_NP_802475-MLU77627701871_072024-O.webp', 
        rating: 4.5 
      },
      { 
        id: 2, 
        name: 'Notebook Ultra', 
        price: 2499.99, 
        category: 'eletronicos', 
        image: 'https://lojaibyte.vteximg.com.br/arquivos/ids/428375-1200-1200/notebook-ub261-multi-ultra-4gb-ddr4-128gb-emmc-15-6-cinza-001.jpg?v=638512050468700000', 
        rating: 4.8 
      },
      { 
        id: 3, 
        name: 'Fone de Ouvido Bluetooth', 
        price: 199.99, 
        category: 'eletronicos', 
        image: 'https://tudotem.com.br/cdn/shop/files/S490be8bd4fe741da8e18adb0031a30bf9.webp?v=1717303940', 
        rating: 4.3 
      },
      { 
        id: 4, 
        name: 'Camiseta Básica', 
        price: 39.99, 
        category: 'roupas', 
        image: 'https://lojamundootaku.com.br/cdn/shop/files/Se08c48279ec54b1688c3442756ccf044k_1024x.webp?v=1724690752', 
        rating: 4.0 
      },
      { 
        id: 5, 
        name: 'Tênis Esportivo', 
        price: 299.99, 
        category: 'calcados', 
        image: 'https://img.joomcdn.net/addeb3c9b634c8d941e289c3d4591a4792c0be07_1024_1024.jpeg', 
        rating: 4.6 
      },
      { 
        id: 6, 
        name: 'Livro de React', 
        price: 59.99, 
        category: 'livros', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY615S7uIKxPLZYkslmdkZSe741uQTFqffUg&s', 
        rating: 4.7 
      },
      { 
        id: 7, 
        name: 'Mochila Executiva', 
        price: 129.99, 
        category: 'acessorios', 
        image: 'https://static.dafiti.com.br/p/STAR-SHOP-Mochila-Executiva-Viagem-Grande-Notebook-Feminina-Masculina-Star-Shop-Rosa-0331-79876041-1-zoom.jpg', 
        rating: 4.4 
      },
      { 
        id: 8, 
        name: 'Smartwatch', 
        price: 399.99, 
        category: 'eletronicos', 
        image: 'https://ae01.alicdn.com/kf/S0946fd0e775942c2bcf3b1d34b66bff5i.jpg?width=800&height=800&hash=1600', 
        rating: 4.2 
      }
    ];

    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
  }, []);

  // Efeito para persistir o carrinho no localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      cartData.forEach(item => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const value = {
    state,
    dispatch,
    addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
    removeFromCart: (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId }),
    updateQuantity: (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    toggleAuthModal: (mode) => dispatch({ type: 'TOGGLE_AUTH_MODAL', payload: mode }),
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    setSearchTerm: (term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
    setCategory: (category) => dispatch({ type: 'SET_CATEGORY', payload: category }),
    addOrder: (order) => dispatch({ type: 'ADD_ORDER', payload: order }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar o contexto
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Componentes
function Header() {
  const { state, toggleCart, toggleAuthModal, logout } = useAppContext();
  const { user, cart } = state;

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <a href="#" className="logo">
            <i className="fas fa-shopping-bag"></i>
            ShopFácil
          </a>

          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Produtos</a></li>
            <li><a href="#">Categorias</a></li>
            <li><a href="#">Ofertas</a></li>
            <li><a href="#">Contato</a></li>
          </ul>

          <div className="header-actions">
            <div className="cart-icon" onClick={toggleCart}>
              <i className="fas fa-shopping-cart"></i>
              {cartItemsCount > 0 && <span className="cart-count">{cartItemsCount}</span>}
            </div>

            <div className="auth-buttons">
              {user ? (
                <>
                  <span>Olá, {user.name}</span>
                  <button className="btn-login" onClick={logout}>Sair</button>
                </>
              ) : (
                <>
                  <button className="btn-login" onClick={() => toggleAuthModal('login')}>Entrar</button>
                  <button className="btn-register" onClick={() => toggleAuthModal('register')}>Registrar</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Bem-vindo à ShopFácil</h1>
          <p>Encontre os melhores produtos com os preços mais baixos do mercado</p>
          <a href="#products" className="btn btn-primary">Ver Produtos</a>
        </div>
      </div>
    </section>
  );
}

function ProductList() {
  const { state, addToCart } = useAppContext();
  const { products, searchTerm, selectedCategory } = state;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="products">
      <div className="container">
        <h2 className="section-title">Nossos Produtos</h2>

        <div className="filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => state.dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
            />
          </div>

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => state.dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
            >
              <option value="all">Todas as categorias</option>
              <option value="eletronicos">Eletrônicos</option>
              <option value="roupas">Roupas</option>
              <option value="calcados">Calçados</option>
              <option value="livros">Livros</option>
              <option value="acessorios">Acessórios</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">R$ {product.price.toFixed(2)}</div>
                <div className="product-rating">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                  ({product.rating})
                </div>
                <div className="product-actions">
                  <button className="btn-add-cart" onClick={() => addToCart(product)}>
                    <i className="fas fa-cart-plus"></i> Adicionar
                  </button>
                  <button className="btn-details">Detalhes</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cart() {
  const { state, toggleCart, updateQuantity, removeFromCart } = useAppContext();
  const { isCartOpen, cart } = state;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <div className={`overlay ${isCartOpen ? 'active' : ''}`} onClick={toggleCart}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-cart" onClick={toggleCart}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">R$ {item.price.toFixed(2)}</div>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Finalizar Compra</button>
        </div>
      </div>
    </>
  );
}

function AuthModal() {
  const { state, toggleAuthModal, setUser } = useAppContext();
  const { isAuthModalOpen, authMode } = state;

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem');
        return;
      }
    }

    setUser({ name: formData.name || 'Usuário', email: formData.email });
    toggleAuthModal();
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const switchMode = (mode) => {
    toggleAuthModal(mode);
  };

  return (
    <>
      <div className={`overlay ${isAuthModalOpen ? 'active' : ''}`} onClick={() => toggleAuthModal()}></div>
      <div className={`auth-modal ${isAuthModalOpen ? 'active' : ''}`}>
        <div className="auth-header">
          <h2>{authMode === 'login' ? 'Entrar' : 'Criar Conta'}</h2>
          <button className="close-cart" onClick={() => toggleAuthModal()}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="auth-tabs">
          <div
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Entrar
          </div>
          <div
            className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Registrar
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {authMode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit">
            {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>ShopFácil</h3>
            <ul>
              <li><a href="#">Sobre nós</a></li>
              <li><a href="#">Nossas lojas</a></li>
              <li><a href="#">Trabalhe conosco</a></li>
              <li><a href="#">Termos e condições</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Ajuda</h3>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Entregas</a></li>
              <li><a href="#">Devoluções</a></li>
              <li><a href="#">Status do pedido</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Categorias</h3>
            <ul>
              <li><a href="#">Eletrônicos</a></li>
              <li><a href="#">Roupas</a></li>
              <li><a href="#">Calçados</a></li>
              <li><a href="#">Acessórios</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contato</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Av. Principal, 123</li>
              <li><i className="fas fa-phone"></i> (11) 9999-9999</li>
              <li><i className="fas fa-envelope"></i> contato@shopfacil.com</li>
            </ul>

            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <div className="copyright">
          <p>&copy; 2023 ShopFácil - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}

// Componente principal App
function App() {
  return (
    <AppProvider>
      <div className="App">
        <Header />
        <Hero />
        <main>
          <ProductList />
        </main>
        <Footer />
        <Cart />
        <AuthModal />
      </div>
    </AppProvider>
  );
}

export default App;