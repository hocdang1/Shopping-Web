import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";

const ProductDetailsPage = async(props:{
    params: Promise<{ slug: string }>;
}) => {
    const slug = await props.params;

    const product = await getProductBySlug(slug.slug);
    if (!product) {
        notFound();
    }
    return <>
        <section>
            <div className="grid grid-cols-1 md:grid-cols-5">
                {/*Images*/}
                <div className="col-span-2">
                    <ProductImages images={product.images} />
                </div>
                {/*Details*/}
                <div className="col-span-2 p-5">
                    <div className="flex flex-col gap-6">
                        <p>{product.brand} {product.category} </p>
                        <h1 className="h3-bold">{product.name}</h1>
                       
                        <p>{product.rating} of {product.numReviews} Reviews</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <ProductPrice value={Number(product.price)} 
                            className='w-24 rounded-full bg-green-100 text-green-900 font-semibold text-center'/>
                        </div>
                    </div>
                     <div className="mt-10">
                        <p className="font-semibold">Description</p>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                     </div>
                </div>
                {/*Action column}n*/}
                <div>
                    <Card >
                        <CardContent className="p-5">
                            <div className="mb-2 flex justify-between">
                                <div>Price</div>
                                <div>
                                    <ProductPrice value={Number(product.price)} />
                                </div>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <div>Status</div>
                                {product.stock > 0 ? (
                                    <Badge className="bg-green-100 text-green-900">In Stock</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-900">Out of Stock</Badge>
                                )}
                                
                            </div>
                            { product.stock > 0 && (
                                <div className="my-5 flex justify-between">
                                    <Button className="w-full">Add to Cart</Button>
                                    </div>
                                    )}
                        </CardContent>
                    </Card>
                </div>

            </div>

        </section>
    </>;
}
 
export default ProductDetailsPage;