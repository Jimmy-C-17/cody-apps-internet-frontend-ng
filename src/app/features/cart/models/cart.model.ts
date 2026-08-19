import { Product } from '../../products/models/product.model';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product?: Product;
}
