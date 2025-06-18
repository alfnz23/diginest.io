import type { Product } from "@/contexts/CartContext";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: File[];
  features: string[];
  requirements: string[];
  tags: string[];
}

export interface ProductFile {
  name: string;
  file: File;
  type: 'main' | 'preview' | 'bonus';
}

export interface UploadProgress {
  productId: string;
  progress: number;
  stage: 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
}

class ProductManagerService {
  private products: Product[] = [];
  private uploadQueue: Map<string, UploadProgress> = new Map();

  // Simulate product database operations
  async getAllProducts(): Promise<Product[]> {
    // In production, this would fetch from your database
    return this.products;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async createProduct(formData: ProductFormData, files: ProductFile[]): Promise<Product> {
    const productId = `product-${Date.now()}`;

    // Simulate upload progress
    this.uploadQueue.set(productId, {
      productId,
      progress: 0,
      stage: 'uploading',
      message: 'Uploading product files...'
    });

    try {
      // Simulate file upload and processing
      await this.simulateFileProcessing(productId, files);

      // Create product object
      const product: Product = {
        id: productId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        rating: 0,
        reviews: 0,
        image: await this.processMainImage(formData.images[0]),
        downloadUrl: `/downloads/${productId}.zip`
      };

      this.products.push(product);

      // Update progress to complete
      this.uploadQueue.set(productId, {
        productId,
        progress: 100,
        stage: 'complete',
        message: 'Product created successfully!'
      });

      return product;
    } catch (error) {
      this.uploadQueue.set(productId, {
        productId,
        progress: 0,
        stage: 'error',
        message: 'Failed to create product'
      });
      throw error;
    }
  }

  async updateProduct(id: string, formData: Partial<ProductFormData>): Promise<Product> {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = {
      ...this.products[productIndex],
      ...formData,
      price: formData.price || this.products[productIndex].price
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    this.products.splice(productIndex, 1);
  }

  getUploadProgress(productId: string): UploadProgress | null {
    return this.uploadQueue.get(productId) || null;
  }

  // File processing utilities
  private async simulateFileProcessing(productId: string, files: ProductFile[]): Promise<void> {
    const stages = [
      { progress: 20, message: 'Validating files...' },
      { progress: 40, message: 'Compressing images...' },
      { progress: 60, message: 'Generating thumbnails...' },
      { progress: 80, message: 'Creating download package...' },
      { progress: 100, message: 'Finalizing product...' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 500));
      this.uploadQueue.set(productId, {
        productId,
        progress: stage.progress,
        stage: 'processing',
        message: stage.message
      });
    }
  }

  private async processMainImage(imageFile: File): Promise<string> {
    // In production, upload to cloud storage and return URL
    // For now, create a blob URL for preview
    return URL.createObjectURL(imageFile);
  }

  // Bulk operations
  async bulkImport(csvData: string): Promise<Product[]> {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const products: Product[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const productData = headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index].trim();
          return obj;
        }, {} as Record<string, string>);

        const product: Product = {
          id: `import-${Date.now()}-${i}`,
          name: productData.name,
          description: productData.description,
          price: Number.parseFloat(productData.price),
          category: productData.category,
          rating: Number.parseFloat(productData.rating) || 0,
          reviews: Number.parseInt(productData.reviews) || 0,
          image: productData.image || '/placeholder.jpg',
          downloadUrl: productData.downloadUrl
        };

        products.push(product);
        this.products.push(product);
      }
    }

    return products;
  }

  // Analytics and reporting
  getProductAnalytics() {
    const totalProducts = this.products.length;
    const categories = [...new Set(this.products.map(p => p.category))];
    const averagePrice = this.products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const topRated = this.products.sort((a, b) => b.rating - a.rating).slice(0, 5);

    return {
      totalProducts,
      totalCategories: categories.length,
      averagePrice,
      topRated,
      categoryDistribution: categories.map(cat => ({
        category: cat,
        count: this.products.filter(p => p.category === cat).length
      }))
    };
  }

  // Search and filter
  async searchProducts(query: string, filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
  } = {}): Promise<Product[]> {
    let results = this.products;

    // Text search
    if (query) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= (filters.minPrice as number));
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= (filters.maxPrice as number));
    }

    if (filters.rating !== undefined) {
      results = results.filter(p => p.rating >= (filters.rating as number));
    }

    return results;
  }
}

export const productManager = new ProductManagerService();
