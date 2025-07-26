'use client';

import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Cart, CartItem } from '@/types';
import { Plus, PlusIcon, Minus, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleAddToCart = async () => {
    startTransition(async() => {

      const res = await addItemToCart(item);
  
      if (!res.success) {
        toast.error(res.message);
        return;
      }
  
      toast.custom((t) => (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex items-center space-x-4">
          <span className="text-sm text-gray-500">{res.message}</span>
          <Button
            onClick={() => {
              router.push('/cart');
              toast.dismiss(t);
            }}
            className="ml-auto bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
          >
            Go to Cart
          </Button>
        </div>
      ));
    }
    )
  };

  const handleRemoveFromCart = async () => {
    startTransition(async() =>{

      const res = await removeItemFromCart(item.productId);
  
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    })
  };

  const existItem = cart?.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="flex items-center space-x-2">
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending? (<Loader className='w-4 h-4 animate-spin'/>
      ):(
      <Minus className="h-4 w-4" />
      )}
      </Button>

      <span className="px-2">{existItem.qty}</span>

      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending? (<Loader className='w-4 h-4 animate-spin'/>
      ):(
      <Plus className="h-4 w-4" />
      )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full hover:scale-105 transition-transform duration-150"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending? (<Loader className='w-4 h-4 animate-spin'/>
      ):(
      <PlusIcon className="h-4 w-4" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
