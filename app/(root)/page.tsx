
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  // You can use the sampleData here to render components or pass it to child
  return(
   <>
      <ProductList data={latestProducts} title="Featured Products"  /> 
  </>
  );
};

export default HomePage;