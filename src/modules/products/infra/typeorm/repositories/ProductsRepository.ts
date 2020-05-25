import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(x => x.id);

    return this.ormRepository.findByIds(ids);
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const ids = products.map(x => x.id);

    const storedProducts = await this.ormRepository.findByIds(ids);

    const updatedProducts = storedProducts.map(storedProduct => {
      const product = products.find(
        x => x.id === storedProduct.id,
      ) as IUpdateProductsQuantityDTO;

      return {
        ...storedProduct,
        quantity: product.quantity,
      };
    });

    return this.ormRepository.save(updatedProducts);
  }
}

export default ProductsRepository;
