// Router de products
import ProductManager from "../managers/productManager.js" ;
import {Router} from "express";
const productRouter = Router();

//Instanciamos nuestro manager de productos.
const manager = new ProductManager("./src/data/products/products.json");


// GET
/*!!!!!!!!!!!!!!!!!!!!!! */
// FALTA AGREGAR LIMITACION DE VISTAS.
/* !!!!!!!!!!!!!!!!!!!!!! */
productRouter.get('/api/products',async (req,res) => {
        const arrayProducts = await manager.getProducts();
        res.send(arrayProducts);
})

productRouter.get("/api/products/:pid", async (req,res) => {
    const {pid} = req.params;
    try {
        const productFound = await manager.getProductById(pid);
        if(!productFound) {
            res.send(`No hay productos con el id ${pid}`);
        } else {
            res.send(productFound);
        }
    } catch (error) {
        res.status(204).send("Error al buscar porductos con ese id")
    }
});

// POST
productRouter.post("/api/products", async (req,res) => {
    const newProduct = req.body;
    try {
        if(!newProduct) {
            res.send("El producto que intenta crear esta vacio");
        } else {
            const productNew = await manager.addProduct(newProduct);
            res.send("Se envio la solicitud exitosamente");
        }
    } catch (error) {
        console.log(error);
        res.send("No puede crearse el producto");
    }
});

// PUT

productRouter.put("/api/products/:pid", async (req, res) => {
    const {pid} = req.params;
    const updateProduct = req.body;

    try {
        if (!updateProduct) {
        res.status(400).send("Se encuentra vacia la informacion a actualizar");
        return;
    }
    const productFound = await manager.getProductById(pid);
    if (!productFound) {
        res.status(404).send(`No se encontró producto con el id ${pid}`);
        return;
    }
        await manager.updateProduct(pid, updateProduct);
        res.send("Producto actualizado con exito!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el producto");
    }
});


// DELETE

productRouter.delete("/api/products/:pid", async (req,res) => {
    const {pid} = req.params;
    // Revisamos primero si hay un producto con ese id.
    const productFound = await manager.getProductById(pid);
    try {
        if(!pid){
            res.send("es necesario el id para poder eliminar el producto");
            return;
        }
        if(!productFound){
                res.status(404).send(`No se encontró producto con el id ${pid}`);
                return;
            } else {
                await manager.deleteProduct(pid);
                res.send("Producto eliminado de forma exitosa");
            }

    } catch (error) {
        res.send("No se pudo eliminar el producto");
    }
})

export default productRouter;