"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { safeLocalStorage, safeWindow } from "@/lib/browser-utils";

export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "ja"
  | "ko"
  | "zh";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export const supportedLanguages: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    currency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
    currency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    currency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    currency: "JPY",
    currencySymbol: "¥",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    currency: "KRW",
    currencySymbol: "₩",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    currency: "CNY",
    currencySymbol: "¥",
  },
];

// Translation definitions
export const translations = {
  en: {
    // Navigation
    "nav.products": "Products",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.admin": "Admin",
    "nav.signin": "Sign In",
    "nav.account": "Account",
    "nav.signout": "Sign Out",
    "nav.cart": "Cart",
    "nav.backToStore": "Back to Store",
    "nav.backToHome": "Back to Home",
    "nav.continueShopping": "Continue Shopping",

    // Homepage
    "home.hero.title": "Premium Digital Products for",
    "home.hero.subtitle": "Modern Productivity",
    "home.hero.description":
      "Discover beautifully crafted eBooks, planners, schedulers, and digital tools designed to elevate your workflow and inspire your best work.",
    "home.hero.exploreBtn": "Explore Collections",
    "home.hero.featuredBtn": "View Featured Products",

    "home.banner.title": "Get 25% OFF on All Digital Products",
    "home.banner.description": "Use code",
    "home.banner.instant": "Instant Download",
    "home.banner.guarantee": "30-Day Guarantee",

    "home.stats.downloads": "Digital Downloads",
    "home.stats.customers": "Happy Customers",
    "home.stats.rating": "Average Rating",
    "home.stats.newProducts": "New Products Monthly",

    "home.categories.title": "Shop by Category",
    "home.categories.description":
      "Discover our curated collections of premium digital products designed for every aspect of your life.",
    "home.categories.browse": "Browse",

    "home.featured.title": "Featured Products",
    "home.featured.description":
      "Handpicked digital products that our customers love most.",
    "home.featured.viewAll": "View All Products",

    // Categories
    "category.ebooks": "eBooks",
    "category.ebooks.desc": "Premium guides",
    "category.planners": "Planners",
    "category.planners.desc": "Digital planning",
    "category.templates": "Templates",
    "category.templates.desc": "Productivity tools",
    "category.tools": "Design Tools",
    "category.tools.desc": "Creative resources",
    "category.health": "Health & Nutrition",
    "category.health.desc": "Nutrition tracking",
    "category.fitness": "Fitness & Training",
    "category.fitness.desc": "Training programs",

    // Products
    "products.title": "All Products",
    "products.description":
      "Discover our complete collection of premium digital products",
    "products.search": "Search digital products...",
    "products.category": "Category",
    "products.allCategories": "All Categories",
    "products.filters": "Filters",
    "products.clear": "Clear",
    "products.sortBy": "Sort by:",
    "products.newest": "Newest",
    "products.popular": "Most Popular",
    "products.priceLowToHigh": "Price: Low to High",
    "products.priceHighToLow": "Price: High to Low",
    "products.highestRated": "Highest Rated",
    "products.addToCart": "Add to Cart",
    "products.viewProduct": "View Product",
    "products.bestseller": "Bestseller",
    "products.reviews": "reviews",
    "products.noResults": "No products found",
    "products.noResultsDesc": "Try adjusting your search or filters",
    "products.clearFilters": "Clear all filters",

    // Cart & Checkout
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.items": "items",
    "cart.item": "item",
    "cart.total": "Total",
    "cart.proceedToCheckout": "Proceed to Checkout",
    "cart.removeItem": "Remove item",

    "checkout.title": "Secure Checkout",
    "checkout.description": "Complete your purchase with confidence",
    "checkout.orderSummary": "Order Summary",
    "checkout.reviewProducts": "Review your digital products",
    "checkout.subtotal": "Subtotal",
    "checkout.tax": "Tax",
    "checkout.instantDelivery": "Instant Digital Delivery",
    "checkout.instantDeliveryDesc":
      "Download links will be available immediately after payment",
    "checkout.secureCheckout": "Secure Checkout",
    "checkout.stripeDescription":
      "Complete your purchase with Stripe's secure payment system",
    "checkout.email": "Email Address",
    "checkout.fullName": "Full Name",
    "checkout.acceptTerms": "I accept the Terms of Service and Privacy Policy",
    "checkout.payButton": "Pay",
    "checkout.payButtonDemo": "Pay (Demo)",
    "checkout.processing": "Processing...",
    "checkout.securedBy": "Secured by Stripe | 256-bit SSL encryption",

    // Admin
    "admin.title": "Admin Dashboard",
    "admin.description":
      "Manage your digital products, payments, and monitor store performance",
    "admin.overview": "Overview",
    "admin.productCMS": "Product CMS",
    "admin.stripePayments": "Stripe Payments",
    "admin.settings": "Settings",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.download": "Download",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.price": "Price",
    "common.rating": "Rating",
    "common.name": "Name",
    "common.description": "Description",
    "common.category": "Category",
    "common.date": "Date",
    "common.status": "Status",
    "common.actions": "Actions",

    // Footer
    "footer.newsletter.title": "Stay Updated",
    "footer.newsletter.description":
      "Get the latest products and exclusive offers",
    "footer.newsletter.placeholder": "Enter your email",
    "footer.newsletter.subscribe": "Subscribe",
    "footer.support": "24/7 Support",
    "footer.products": "Products",
    "footer.company": "Company",
    "footer.help": "Help Center",
    "footer.contact": "Contact Us",
    "footer.downloads": "Downloads",
    "footer.refunds": "Refunds",
    "footer.about": "About",
    "footer.blog": "Blog",
    "footer.careers": "Careers",
    "footer.privacy": "Privacy",
    "footer.rights": "All rights reserved",

    // Authentication
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.welcome": "Welcome to DigiNest.io",
    "auth.welcomeDesc":
      "Sign in to your account or create a new one to start shopping",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.createPassword": "Create a password (min 6 characters)",
    "auth.createAccount": "Create Account",
    "auth.demoCredentials": "Demo credentials: admin@diginest.io / password123",
    "auth.welcomeUser": "Welcome, {name}",

    // Currency & Formatting
    "currency.symbol": "$",
    "date.format": "MM/DD/YYYY",
    "number.decimal": ".",
    "number.thousand": ",",
  },
  es: {
    // Navigation
    "nav.products": "Productos",
    "nav.categories": "Categorías",
    "nav.about": "Acerca de",
    "nav.admin": "Admin",
    "nav.signin": "Iniciar Sesión",
    "nav.account": "Cuenta",
    "nav.signout": "Cerrar Sesión",
    "nav.cart": "Carrito",
    "nav.backToStore": "Volver a la Tienda",
    "nav.backToHome": "Volver al Inicio",
    "nav.continueShopping": "Continuar Comprando",

    // Homepage
    "home.hero.title": "Productos Digitales Premium para",
    "home.hero.subtitle": "Productividad Moderna",
    "home.hero.description":
      "Descubre eBooks, planificadores, programadores y herramientas digitales bellamente diseñadas para elevar tu flujo de trabajo e inspirar tu mejor trabajo.",
    "home.hero.exploreBtn": "Explorar Colecciones",
    "home.hero.featuredBtn": "Ver Productos Destacados",

    "home.banner.title":
      "Obtén 25% de DESCUENTO en Todos los Productos Digitales",
    "home.banner.description": "Usa el código",
    "home.banner.instant": "Descarga Instantánea",
    "home.banner.guarantee": "Garantía de 30 Días",

    "home.stats.downloads": "Descargas Digitales",
    "home.stats.customers": "Clientes Satisfechos",
    "home.stats.rating": "Calificación Promedio",
    "home.stats.newProducts": "Nuevos Productos Mensuales",

    "home.categories.title": "Comprar por Categoría",
    "home.categories.description":
      "Descubre nuestras colecciones curadas de productos digitales premium diseñados para cada aspecto de tu vida.",
    "home.categories.browse": "Navegar",

    "home.featured.title": "Productos Destacados",
    "home.featured.description":
      "Productos digitales seleccionados que más aman nuestros clientes.",
    "home.featured.viewAll": "Ver Todos los Productos",

    // Categories
    "category.ebooks": "eBooks",
    "category.ebooks.desc": "Guías premium",
    "category.planners": "Planificadores",
    "category.planners.desc": "Planificación digital",
    "category.templates": "Plantillas",
    "category.templates.desc": "Herramientas de productividad",
    "category.tools": "Herramientas de Diseño",
    "category.tools.desc": "Recursos creativos",
    "category.health": "Salud y Nutrición",
    "category.health.desc": "Seguimiento nutricional",
    "category.fitness": "Fitness y Entrenamiento",
    "category.fitness.desc": "Programas de entrenamiento",

    // Products
    "products.title": "Todos los Productos",
    "products.description":
      "Descubre nuestra colección completa de productos digitales premium",
    "products.search": "Buscar productos digitales...",
    "products.category": "Categoría",
    "products.allCategories": "Todas las Categorías",
    "products.filters": "Filtros",
    "products.clear": "Limpiar",
    "products.sortBy": "Ordenar por:",
    "products.newest": "Más Nuevos",
    "products.popular": "Más Populares",
    "products.priceLowToHigh": "Precio: Menor a Mayor",
    "products.priceHighToLow": "Precio: Mayor a Menor",
    "products.highestRated": "Mejor Calificados",
    "products.addToCart": "Añadir al Carrito",
    "products.viewProduct": "Ver Producto",
    "products.bestseller": "Más Vendido",
    "products.reviews": "reseñas",
    "products.noResults": "No se encontraron productos",
    "products.noResultsDesc": "Intenta ajustar tu búsqueda o filtros",
    "products.clearFilters": "Limpiar todos los filtros",

    // Cart & Checkout
    "cart.title": "Carrito de Compras",
    "cart.empty": "Tu carrito está vacío",
    "cart.items": "artículos",
    "cart.item": "artículo",
    "cart.total": "Total",
    "cart.proceedToCheckout": "Proceder al Pago",
    "cart.removeItem": "Eliminar artículo",

    "checkout.title": "Pago Seguro",
    "checkout.description": "Completa tu compra con confianza",
    "checkout.orderSummary": "Resumen del Pedido",
    "checkout.reviewProducts": "Revisa tus productos digitales",
    "checkout.subtotal": "Subtotal",
    "checkout.tax": "Impuestos",
    "checkout.instantDelivery": "Entrega Digital Instantánea",
    "checkout.instantDeliveryDesc":
      "Los enlaces de descarga estarán disponibles inmediatamente después del pago",
    "checkout.secureCheckout": "Pago Seguro",
    "checkout.stripeDescription":
      "Completa tu compra con el sistema de pago seguro de Stripe",
    "checkout.email": "Dirección de Email",
    "checkout.fullName": "Nombre Completo",
    "checkout.acceptTerms":
      "Acepto los Términos de Servicio y Política de Privacidad",
    "checkout.payButton": "Pagar",
    "checkout.payButtonDemo": "Pagar (Demo)",
    "checkout.processing": "Procesando...",
    "checkout.securedBy": "Asegurado por Stripe | Encriptación SSL de 256 bits",

    // Common
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.view": "Ver",
    "common.download": "Descargar",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.confirm": "Confirmar",
    "common.close": "Cerrar",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.price": "Precio",
    "common.rating": "Calificación",
    "common.name": "Nombre",
    "common.description": "Descripción",
    "common.category": "Categoría",
    "common.date": "Fecha",
    "common.status": "Estado",
    "common.actions": "Acciones",

    // Currency & Formatting
    "currency.symbol": "€",
    "date.format": "DD/MM/YYYY",
    "number.decimal": ",",
    "number.thousand": ".",
  },
  fr: {
    // Navigation
    "nav.products": "Produits",
    "nav.categories": "Catégories",
    "nav.about": "À propos",
    "nav.admin": "Admin",
    "nav.signin": "Se connecter",
    "nav.account": "Compte",
    "nav.signout": "Se déconnecter",
    "nav.cart": "Panier",
    "nav.backToStore": "Retour au magasin",
    "nav.backToHome": "Retour à l'accueil",
    "nav.continueShopping": "Continuer les achats",

    // Homepage
    "home.hero.title": "Produits Numériques Premium pour la",
    "home.hero.subtitle": "Productivité Moderne",
    "home.hero.description":
      "Découvrez des eBooks, planificateurs, calendriers et outils numériques magnifiquement conçus pour élever votre flux de travail et inspirer votre meilleur travail.",
    "home.hero.exploreBtn": "Explorer les Collections",
    "home.hero.featuredBtn": "Voir les Produits Vedettes",

    "home.stats.downloads": "Téléchargements Numériques",
    "home.stats.customers": "Clients Satisfaits",
    "home.stats.rating": "Note Moyenne",
    "home.stats.newProducts": "Nouveaux Produits Mensuels",

    "home.categories.title": "Acheter par Catégorie",
    "home.categories.description":
      "Découvrez nos collections organisées de produits numériques premium conçus pour chaque aspect de votre vie.",
    "home.categories.browse": "Parcourir",

    "home.featured.title": "Produits Vedettes",
    "home.featured.description":
      "Produits numériques sélectionnés que nos clients adorent le plus.",
    "home.featured.viewAll": "Voir Tous les Produits",

    "home.banner.title":
      "Obtenez 25% de RÉDUCTION sur Tous les Produits Numériques",
    "home.banner.description": "Utilisez le code",
    "home.banner.instant": "Téléchargement Instantané",
    "home.banner.guarantee": "Garantie 30 Jours",

    // Categories
    "category.ebooks": "eBooks",
    "category.ebooks.desc": "Guides premium",
    "category.planners": "Planificateurs",
    "category.planners.desc": "Planification numérique",
    "category.templates": "Modèles",
    "category.templates.desc": "Outils de productivité",
    "category.tools": "Outils de Conception",
    "category.tools.desc": "Ressources créatives",
    "category.health": "Santé et Nutrition",
    "category.health.desc": "Suivi nutritionnel",
    "category.fitness": "Fitness et Entraînement",
    "category.fitness.desc": "Programmes d'entraînement",

    // Currency & Formatting
    "currency.symbol": "€",
    "date.format": "DD/MM/YYYY",
    "number.decimal": ",",
    "number.thousand": " ",
  },
  de: {
    // Navigation
    "nav.products": "Produkte",
    "nav.categories": "Kategorien",
    "nav.about": "Über uns",
    "nav.admin": "Admin",
    "nav.signin": "Anmelden",
    "nav.account": "Konto",
    "nav.signout": "Abmelden",
    "nav.cart": "Warenkorb",
    "nav.backToStore": "Zurück zum Shop",
    "nav.backToHome": "Zurück zur Startseite",
    "nav.continueShopping": "Weiter einkaufen",

    // Homepage
    "home.hero.title": "Premium Digitale Produkte für",
    "home.hero.subtitle": "Moderne Produktivität",
    "home.hero.description":
      "Entdecken Sie wunderschön gestaltete eBooks, Planer, Terminplaner und digitale Tools, die Ihren Workflow verbessern und Ihre beste Arbeit inspirieren.",
    "home.hero.exploreBtn": "Kollektionen erkunden",
    "home.hero.featuredBtn": "Empfohlene Produkte ansehen",

    // Currency & Formatting
    "currency.symbol": "€",
    "date.format": "DD.MM.YYYY",
    "number.decimal": ",",
    "number.thousand": ".",
  },
  pt: {
    // Navigation
    "nav.products": "Produtos",
    "nav.categories": "Categorias",
    "nav.about": "Sobre",
    "nav.admin": "Admin",
    "nav.signin": "Entrar",
    "nav.account": "Conta",
    "nav.signout": "Sair",
    "nav.cart": "Carrinho",

    // Homepage
    "home.hero.title": "Produtos Digitais Premium para",
    "home.hero.subtitle": "Produtividade Moderna",
    "home.hero.description":
      "Descubra eBooks, planejadores, agendas e ferramentas digitais lindamente criadas para elevar seu fluxo de trabalho e inspirar seu melhor trabalho.",

    // Currency & Formatting
    "currency.symbol": "€",
    "date.format": "DD/MM/YYYY",
    "number.decimal": ",",
    "number.thousand": ".",
  },
  it: {
    // Navigation
    "nav.products": "Prodotti",
    "nav.categories": "Categorie",
    "nav.about": "Chi siamo",
    "nav.admin": "Admin",
    "nav.signin": "Accedi",
    "nav.account": "Account",
    "nav.signout": "Esci",
    "nav.cart": "Carrello",

    // Currency & Formatting
    "currency.symbol": "€",
    "date.format": "DD/MM/YYYY",
    "number.decimal": ",",
    "number.thousand": ".",
  },
  ja: {
    // Navigation
    "nav.products": "製品",
    "nav.categories": "カテゴリー",
    "nav.about": "会社概要",
    "nav.admin": "管理者",
    "nav.signin": "ログイン",
    "nav.account": "アカウント",
    "nav.signout": "ログアウト",
    "nav.cart": "カート",

    // Homepage
    "home.hero.title": "モダンな生産性のための",
    "home.hero.subtitle": "プレミアムデジタル製品",
    "home.hero.description":
      "ワークフローを向上させ、最高の仕事を刺激するために美しくデザインされたeBook、プランナー、スケジューラー、デジタルツールを発見してください。",

    // Currency & Formatting
    "currency.symbol": "¥",
    "date.format": "YYYY/MM/DD",
    "number.decimal": ".",
    "number.thousand": ",",
  },
  ko: {
    // Navigation
    "nav.products": "제품",
    "nav.categories": "카테고리",
    "nav.about": "회사 소개",
    "nav.admin": "관리자",
    "nav.signin": "로그인",
    "nav.account": "계정",
    "nav.signout": "로그아웃",
    "nav.cart": "장바구니",

    // Currency & Formatting
    "currency.symbol": "₩",
    "date.format": "YYYY.MM.DD",
    "number.decimal": ".",
    "number.thousand": ",",
  },
  zh: {
    // Navigation
    "nav.products": "产品",
    "nav.categories": "分类",
    "nav.about": "关于我们",
    "nav.admin": "管理员",
    "nav.signin": "登录",
    "nav.account": "账户",
    "nav.signout": "退出",
    "nav.cart": "购物车",

    // Homepage
    "home.hero.title": "现代生产力的",
    "home.hero.subtitle": "优质数字产品",
    "home.hero.description":
      "发现精美设计的电子书、规划器、调度器和数字工具，旨在提升您的工作流程并激发您的最佳作品。",

    // Currency & Formatting
    "currency.symbol": "¥",
    "date.format": "YYYY年MM月DD日",
    "number.decimal": ".",
    "number.thousand": ",",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  formatPrice: (price: number) => string;
  formatDate: (date: Date) => string;
  getCurrentLanguage: () => LanguageOption;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Get language from localStorage or browser preference
    const savedLanguage = safeLocalStorage.getItem("language") as Language;
    if (
      savedLanguage &&
      supportedLanguages.find((l) => l.code === savedLanguage)
    ) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      if (safeWindow.navigator?.language) {
        const browserLang = safeWindow.navigator.language.split(
          "-",
        )[0] as Language;
        if (supportedLanguages.find((l) => l.code === browserLang)) {
          setLanguage(browserLang);
        }
      }
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        safeLocalStorage.setItem("language", newLanguage);
      } catch (error) {
        console.error("Failed to save language to localStorage:", error);
      }
    }
  };

  const t = (key: string, params?: Record<string, string>) => {
    const langTranslations = translations[language] as Record<string, string>;
    const enTranslations = translations.en as Record<string, string>;
    const translation = langTranslations?.[key] || enTranslations[key] || key;

    if (params) {
      return Object.keys(params).reduce((text, param) => {
        return text.replace(`{${param}}`, params[param]);
      }, translation);
    }

    return translation;
  };

  const getCurrentLanguage = () => {
    return (
      supportedLanguages.find((l) => l.code === language) ||
      supportedLanguages[0]
    );
  };

  const formatPrice = (price: number) => {
    const currentLang = getCurrentLanguage();
    const { currencySymbol } = currentLang;
    const decimalSeparator = t("number.decimal");
    const thousandSeparator = t("number.thousand");

    // Format number with proper separators
    const parts = price.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    const formattedNumber = parts.join(decimalSeparator);

    return `${currencySymbol}${formattedNumber}`;
  };

  const formatDate = (date: Date) => {
    const format = t("date.format");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return format.replace("DD", day).replace("MM", month).replace("YYYY", year);
  };

  const isRTL = false; // Add RTL languages here if needed

  const value: I18nContextType = {
    language,
    setLanguage: changeLanguage,
    t,
    formatPrice,
    formatDate,
    getCurrentLanguage,
    isRTL,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Hook for currency conversion (simplified - in production use real exchange rates)
export function useCurrency() {
  const { getCurrentLanguage } = useI18n();

  const convertPrice = (price: number, fromCurrency = "USD") => {
    const targetCurrency = getCurrentLanguage().currency;

    // Simplified conversion rates (in production, use a real API)
    const exchangeRates: Record<string, number> = {
      USD: 1,
      EUR: 0.85,
      JPY: 110,
      KRW: 1200,
      CNY: 6.5,
    };

    if (fromCurrency === targetCurrency) return price;

    const usdPrice = price / (exchangeRates[fromCurrency] || 1);
    return usdPrice * (exchangeRates[targetCurrency] || 1);
  };

  return { convertPrice };
}
