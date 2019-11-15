export { };
import express from 'express';
let product: string;
let router = express.Router();
router.get('/product', (req: any, resp: any) => {
    console.log("get product");
    if (product == undefined) {
        product = "Empty"
    }
    resp.json({ product: product });
});
router.post('/product', (req: any, resp: any) => {
    console.log("set product");
    console.log(req.body);
    product = req.body.product as string;
    resp.redirect("/product");
});

exports.router = router;

