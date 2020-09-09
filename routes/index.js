const router = require("express").Router();
const paypal = require("paypal-rest-sdk");
const paypalConfig = require("../config/paypal");

paypal.configure(paypalConfig);

const { products } = require("../config/products");

router.get('/', (req, res) => res.render('index', { products }));

router.post('/buy', (req, res) => {
  
  const productId = req.query.id;
  const product = products.reduce((all, item) => item.id === product ? product : this.all, {});
    if(!product.id) return res.render('index', { products });

    const carrinho = [{
      "name": product.titulo,
      "sku": product.id,
      "price": product.preco.toFixed(2),
      "currency": "BRL",
      "quantity":1
    }];
  
    const valor = { "currency": "BRL", "total": product.preco.toFixed(2)};
    const descricao = product.descricao;

    const json_pagamento = {
      "intent": "sale",
      "payer":{ payment_method: "paypal" },
      "redirect_urls": {
        "return_url":"http://localhost:3000/sucess",
        "cancel_url":"http://localhost3000/cancel"
      },
      "transactions":[{
        "item_list": {"items":carrinho},
        "amount": valor,
        "description": descricao
      }]
    };
    paypal.payment.create(json_pagamento, (err, pagamento)=> {
      if(err){
        console.warn(err);
      }
      else{
        pagamento.links.forEach(link) => {
          if(link.rel === 'aproval_url')
          return res.redirect(link.href);
        })
      }
    })
    
});

router.get('/success', (req, res) => {
  //quando cliente clicar em pagar
  res.render('success');
});

router.get('/cancel', (req, res) => {
  //quando cliente cancelar a compra
  res.render('cancel');
});

module.exports = router;
