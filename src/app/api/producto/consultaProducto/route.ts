import getProducts from "@/actions/getProductos";

export async function GET() {
    return getProducts();
}