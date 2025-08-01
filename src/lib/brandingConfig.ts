// Branding Configuration Templates and Utilities

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface BrandTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface BusinessProfile {
  name: string;
  tagline: string;
  description: string;
  focus: string;
  target: string;
}

export interface BrandConfig {
  business: BusinessProfile;
  categories: Category[];
  theme: BrandTheme;
  translations?: Record<string, any>;
}

// Pre-defined business templates
export const businessTemplates: Record<string, BrandConfig> = {
  creative: {
    business: {
      name: "CreativeHub Studio",
      tagline: "Premium Design Resources for Creative Professionals",
      description: "Discover high-quality graphics, fonts, templates, and design tools to elevate your creative projects",
      focus: "Design resources, graphics, and creative tools",
      target: "designers"
    },
    categories: [
      { id: "graphics", name: "Graphics & Illustrations", description: "Vector graphics and illustrations", icon: "🎨" },
      { id: "fonts", name: "Fonts & Typography", description: "Premium font collections", icon: "🔤" },
      { id: "mockups", name: "Mockups & Templates", description: "Product presentation mockups", icon: "🖼️" },
      { id: "icons", name: "Icons & UI Elements", description: "Interface design elements", icon: "⚡" },
      { id: "brushes", name: "Brushes & Textures", description: "Digital painting resources", icon: "🖌️" },
      { id: "photography", name: "Stock Photography", description: "High-resolution photos", icon: "📸" }
    ],
    theme: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#a78bfa",
      background: "#faf5ff"
    }
  },

  education: {
    business: {
      name: "EduMaster Academy",
      tagline: "Comprehensive Learning Resources for Modern Education",
      description: "Access quality courses, ebooks, study guides, and educational materials designed for effective learning",
      focus: "Educational content, courses, and learning materials",
      target: "students"
    },
    categories: [
      { id: "courses", name: "Online Courses", description: "Structured video courses", icon: "🎓" },
      { id: "ebooks", name: "Educational eBooks", description: "Comprehensive study materials", icon: "📚" },
      { id: "worksheets", name: "Worksheets & Exercises", description: "Practice and assessment tools", icon: "📝" },
      { id: "guides", name: "Study Guides", description: "Exam preparation resources", icon: "📖" },
      { id: "certificates", name: "Certificates & Templates", description: "Achievement recognition", icon: "🏆" },
      { id: "tools", name: "Learning Tools", description: "Educational software and apps", icon: "⚙️" }
    ],
    theme: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#34d399",
      background: "#f0fdf4"
    }
  },

  business: {
    business: {
      name: "ProBusiness Hub",
      tagline: "Professional Tools for Modern Business Success",
      description: "Streamline your business operations with professional templates, contracts, and productivity tools",
      focus: "Business tools, templates, and professional resources",
      target: "professionals"
    },
    categories: [
      { id: "presentations", name: "Business Presentations", description: "Professional slide templates", icon: "📊" },
      { id: "contracts", name: "Legal Documents", description: "Contracts and agreements", icon: "📋" },
      { id: "marketing", name: "Marketing Materials", description: "Brochures and promotional tools", icon: "📈" },
      { id: "finance", name: "Financial Tools", description: "Budgeting and tracking templates", icon: "💰" },
      { id: "hr", name: "HR Resources", description: "Human resources templates", icon: "👥" },
      { id: "strategy", name: "Business Strategy", description: "Planning and analysis tools", icon: "🎯" }
    ],
    theme: {
      primary: "#dc2626",
      secondary: "#b91c1c",
      accent: "#f87171",
      background: "#fef2f2"
    }
  },

  wellness: {
    business: {
      name: "WellnessVault",
      tagline: "Complete Health & Wellness Digital Resources",
      description: "Transform your lifestyle with comprehensive fitness programs, nutrition guides, and wellness tools",
      focus: "Health, fitness, wellness, and lifestyle products",
      target: "health-conscious"
    },
    categories: [
      { id: "fitness", name: "Fitness Programs", description: "Workout plans and routines", icon: "💪" },
      { id: "nutrition", name: "Nutrition Guides", description: "Meal plans and diet advice", icon: "🥗" },
      { id: "mindfulness", name: "Mental Wellness", description: "Meditation and mindfulness", icon: "🧘" },
      { id: "recipes", name: "Healthy Recipes", description: "Nutritious cooking guides", icon: "👨‍🍳" },
      { id: "tracking", name: "Health Trackers", description: "Progress monitoring tools", icon: "📱" },
      { id: "therapy", name: "Wellness Therapy", description: "Self-care and recovery", icon: "🌿" }
    ],
    theme: {
      primary: "#ea580c",
      secondary: "#c2410c",
      accent: "#fb923c",
      background: "#fff7ed"
    }
  },

  tech: {
    business: {
      name: "TechForge Digital",
      tagline: "Cutting-Edge Digital Tools for Tech Professionals",
      description: "Boost your development workflow with premium code templates, tools, and technical resources",
      focus: "Development tools, code templates, and tech resources",
      target: "developers"
    },
    categories: [
      { id: "code", name: "Code Templates", description: "Ready-to-use code snippets", icon: "💻" },
      { id: "ui-kits", name: "UI/UX Kits", description: "Interface design systems", icon: "🎨" },
      { id: "plugins", name: "Plugins & Extensions", description: "Development tools", icon: "🔧" },
      { id: "apis", name: "API Collections", description: "Prebuilt API integrations", icon: "🔗" },
      { id: "databases", name: "Database Schemas", description: "Data structure templates", icon: "💾" },
      { id: "deployment", name: "Deployment Tools", description: "DevOps and hosting configs", icon: "🚀" }
    ],
    theme: {
      primary: "#3b82f6",
      secondary: "#1e40af",
      accent: "#60a5fa",
      background: "#f8fafc"
    }
  },

  photography: {
    business: {
      name: "PhotoCraft Studio",
      tagline: "Professional Photography Resources & Presets",
      description: "Enhance your photography with premium presets, actions, overlays, and editing tools",
      focus: "Photography resources, presets, and editing tools",
      target: "photographers"
    },
    categories: [
      { id: "presets", name: "Lightroom Presets", description: "Professional photo filters", icon: "📷" },
      { id: "actions", name: "Photoshop Actions", description: "Automated editing workflows", icon: "⚡" },
      { id: "overlays", name: "Photo Overlays", description: "Creative overlay effects", icon: "✨" },
      { id: "templates", name: "Album Templates", description: "Photo book layouts", icon: "📖" },
      { id: "textures", name: "Textures & Backgrounds", description: "Artistic backgrounds", icon: "🎭" },
      { id: "tutorials", name: "Video Tutorials", description: "Photography education", icon: "🎬" }
    ],
    theme: {
      primary: "#6366f1",
      secondary: "#4f46e5",
      accent: "#818cf8",
      background: "#f1f5f9"
    }
  }
};

// Utility functions for applying branding configurations
export function generateCSSVariables(theme: BrandTheme): string {
  return `
:root {
  --brand-primary: ${theme.primary};
  --brand-secondary: ${theme.secondary};
  --brand-accent: ${theme.accent};
  --brand-background: ${theme.background};
}

.brand-primary { color: ${theme.primary}; }
.bg-brand-primary { background-color: ${theme.primary}; }
.border-brand-primary { border-color: ${theme.primary}; }

.brand-secondary { color: ${theme.secondary}; }
.bg-brand-secondary { background-color: ${theme.secondary}; }
.border-brand-secondary { border-color: ${theme.secondary}; }

.brand-accent { color: ${theme.accent}; }
.bg-brand-accent { background-color: ${theme.accent}; }
.border-brand-accent { border-color: ${theme.accent}; }

.brand-background { background-color: ${theme.background}; }
`;
}

export function generateTranslations(config: BrandConfig): Record<string, any> {
  const { business, categories } = config;

  return {
    en: {
      // Business branding
      "home.hero.title": business.tagline.split(' ').slice(0, -2).join(' '),
      "home.hero.subtitle": business.tagline.split(' ').slice(-2).join(' '),
      "home.hero.description": business.description,

      // Categories
      ...categories.reduce((acc, cat) => ({
        ...acc,
        [`category.${cat.id}`]: cat.name,
        [`category.${cat.id}.desc`]: cat.description
      }), {}),

      // Meta
      "nav.brandName": business.name,
      "home.categories.title": `Shop by ${business.focus.includes('Design') ? 'Creative Type' : 'Category'}`,
      "products.title": `All ${business.focus.split(',')[0]}`,
    }
  };
}

export function generateCategoryConfig(categories: Category[]): string {
  return `
export const productCategories = [
${categories.map(cat => `  {
    id: "${cat.id}",
    name: "${cat.name}",
    description: "${cat.description}",
    icon: "${cat.icon}"
  }`).join(',\n')}
];

export const categoryNames: Record<string, string> = {
${categories.map(cat => `  "${cat.id}": "${cat.name}"`).join(',\n')}
};
`;
}

export function generateBrandingFiles(config: BrandConfig) {
  return {
    'tailwind.config.ts': generateTailwindConfig(config.theme),
    'src/lib/categories.ts': generateCategoryConfig(config.categories),
    'src/styles/brand.css': generateCSSVariables(config.theme),
    'src/lib/translations.ts': JSON.stringify(generateTranslations(config), null, 2),
    'brand-config.json': JSON.stringify(config, null, 2)
  };
}

function generateTailwindConfig(theme: BrandTheme): string {
  return `
import type { Config } from "tailwindcss";

const config: Config = {
  // ... existing config
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "${theme.primary}",
          secondary: "${theme.secondary}",
          accent: "${theme.accent}",
          background: "${theme.background}"
        }
      }
    }
  }
  // ... rest of config
};

export default config;
`;
}

// Get a template by ID
export function getBusinessTemplate(templateId: string): BrandConfig | null {
  return businessTemplates[templateId] || null;
}

// Get all available template IDs
export function getAvailableTemplates(): string[] {
  return Object.keys(businessTemplates);
}

// Apply branding configuration (this would be used by the customizer)
export async function applyBrandingConfig(config: BrandConfig): Promise<boolean> {
  try {
    // In a real implementation, this would:
    // 1. Update configuration files
    // 2. Regenerate styles
    // 3. Update database with new categories
    // 4. Restart development server if needed

    console.log('Applying branding configuration:', config);
    return true;
  } catch (error) {
    console.error('Failed to apply branding configuration:', error);
    return false;
  }
}
