const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const cors = require("cors");
const session = require("express-session");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});
const upload = multer();
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventory",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(cors());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static", express.static("./static/"));
app.use("/uploads", express.static("./uploads/"));

app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname + "/index.html"));
  } else {
    res.sendFile(path.join(__dirname + "/login.html"));
  }
});

app.post("/auth", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    con.query("SELECT * FROM users WHERE user_name = ? AND user_password = ?", [username, password], (error, results) => {
      console.log(results[0]);
      if (error) throw error;
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res.send({ message: "Giris yapiliyor", type: "success", user_id: results[0].user_id, user_name: results[0].user_name });
      } else {
        res.send({ message: "Giris bilgileri hatali", type: "danger" });
      }
      res.end();
    });
  }
});

app.post("/getCategories", (req, res) => {
  const sql = `SELECT * FROM categories WHERE category_parent_id='${req.body.categoryId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/getAllCategories", (req, res) => {
  con.query(`SELECT * FROM categories`, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/getProducts", (req, res) => {
  const sql = `SELECT * FROM products WHERE product_category_id='${req.body.categoryId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/getProductInfos", (req, res) => {
  console.log(req.body.id);
  const sql = `SELECT * FROM products WHERE product_id='${req.body.productId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.post("/addNewCategory", upload.none(), (req, res) => {
  console.log(req.body);
  if (req.body["parent-category-id"] == 0) {
    const sql = `INSERT INTO categories (category_parent_id, category_name) VALUES ('${req.body["parent-category-id"]}', '${req.body["category-name-input"]}')`;
    con.query(sql, function (err, result) {
      res.send({ type: "success", message: "Kategori eklendi." });
      console.log(0);
    });
  } else {
    const sql = `SELECT * FROM categories WHERE category_id='${req.body["parent-category-id"]}'`;
    con.query(sql, (err, result) => {
      console.log(result);
      if (result[0].category_sub === 0) {
        res.send({ type: "danger", message: "Ürün iceren kategoriye alt kategori ekleyemezsiniz." });
      } else {
        const sql = `INSERT INTO categories (category_parent_id, category_name) VALUES ('${req.body["parent-category-id"]}', '${req.body["category-name-input"]}')`;
        con.query(sql, function (err, result) {
          const sql = `UPDATE categories SET category_sub=${1}  WHERE category_id='${req.body["parent-category-id"]}'`;
          con.query(sql, (err, result) => {
            res.send({ type: "success", message: "Kategori eklendi." });
          });
        });
      }
    });
  }
});

app.post(
  "/addNewProduct",
  imageUpload.single("product-image-input"),
  (req, res) => {
    const sql = `SELECT * FROM categories WHERE category_id='${req.body["category-id"]}'`;
    con.query(sql, (err, result1) => {
      if (result1.length > 0) {
        if (result1[0].category_sub === 1) {
          res.send({ type: "danger", message: "Alt kategorisi olan bir kategoriye ürün ekleyemezsiniz." });
        } else {
          const sql = `INSERT INTO products (product_category_id,product_image, product_name,product_brand,product_pprice,product_wprice,product_rprice) VALUES
          ('${req.body["category-id"]}', '${req.file.filename}','${req.body["product-name-input"]}','${req.body["product-brand-input"]}','${req.body["product-purchase-price"]}','${req.body["product-wholesale-price"]}','${req.body["product-retail-price"]}')`;
          con.query(sql, (err, result2) => {
            const sql = `UPDATE categories SET category_sub=${0}  WHERE category_id='${req.body["category-id"]}'`;
            con.query(sql, (err, result3) => {
              res.send({ type: "success", message: "Ürün eklendi." });
            });
          });
        }
      } else {
        res.send({ type: "danger", message: "Bu kategoriye ürün ekleyemezsiniz." });
      }
    });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.post("/addToCart", (req, res) => {
  console.log(req.body);
  const sql = `SELECT * FROM cart WHERE cart_product_id='${req.body.productId}' AND cart_user_id='${req.body.userId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      const sql = `UPDATE cart SET cart_product_quantity='${req.body.productQuantity}' WHERE cart_product_id='${req.body.productId}' AND cart_user_id='${req.body.userId}'`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send({ type: "success", message: "Sepete eklendi" });
      });
    } else {
      const sql = `INSERT INTO cart (cart_product_id,cart_product_quantity,cart_user_id) VALUES ('${req.body.productId}', '${req.body.productQuantity}','${req.body.userId}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send({ type: "success", message: "Sepete eklendi" });
      });
    }
  });
});

app.post("/getCart", (req, res) => {
  const sql = `SELECT cart.*,products.* FROM cart,products WHERE products.product_id=cart.cart_product_id AND cart.cart_user_id='${req.body.userId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/removeItemFromCart", (req, res) => {
  const sql = `DELETE FROM cart WHERE cart_product_id='${req.body.productId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send({ type: "success", message: "Sepetten silindi" });
  });
});

app.post("/updateCart", (req, res) => {
  console.log(req.body.userId);
  const sql = `UPDATE cart SET cart_product_quantity='${req.body.productQuantity}' WHERE cart_product_id='${req.body.productId}' AND cart_user_id='${req.body.userId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send({ type: "success", message: "Sepet güncellendi" });
  });
});

app.post("/confirmOrder", (req, res) => {
  console.log(req.body);

  const sql = `INSERT INTO orders (order_user_id,order_notes) VALUES ('${req.body.userId}','${req.body.orderNote}')`;
  con.query(sql, function (err, result1) {
    if (err) throw err;
    const sql = `SELECT cart.cart_product_id,cart.cart_product_quantity,products.product_wprice FROM cart,products WHERE products.product_id=cart.cart_product_id AND cart.cart_user_id='${req.body.userId}'`;
    con.query(sql, function (err, result2) {
      if (err) throw err;
      result2 = result2.map((e) => Object.values(e));
      result2.forEach((element) => {
        element.unshift(result1.insertId);
      });
      console.log(result2);
      const sql = `INSERT INTO order_details (order_id,ordered_product_id,ordered_product_quantity,ordered_product_wprice) VALUES ?`;
      con.query(sql, [result2], function (err, result3) {
        if (err) throw err;
        const sql = `DELETE FROM cart WHERE cart_user_id='${req.body.userId}'`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send({ type: "success", message: "Siparis verildi" });
        });
      });
    });
  });

  // const sql = `INSERT INTO orders (order_products,order_note,order_user_id,order_status) VALUES ('${JSON.stringify(req.body.order_products)}', '${req.body.order_note}','${req.body.order_user_id}','ordered')`;
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("ok");
  //   res.send(true);
  // });
});

app.post("/getOrders", (req, res) => {
  console.log(req.body);
  con.query(`SELECT * FROM users WHERE user_id='${req.body.userId}'`, function (err, result) {
    if (result[0].user_role == "admin") {
      con.query(`SELECT orders.*,users.user_name FROM orders,users WHERE user_id=order_user_id`, function (err, result1) {
        console.log(result1);
        res.send(result1);
      });
    } else {
      con.query(`SELECT orders.*,users.user_name FROM orders,users WHERE order_user_id='${req.body.userId}' AND user_id=order_user_id`, function (err, result2) {
        res.send(result2);
      });
    }
  });
});

app.post("/getOrderDetails", (req, res) => {
  const sql = `SELECT order_details.*,products.* FROM order_details,products WHERE order_details.order_id='${req.body.orderId}' AND order_details.ordered_product_id=products.product_id`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.post("/getOrderSummary", (req, res) => {
  const sql = `SELECT SUM(ordered_product_quantity),SUM(ordered_product_wprice) FROM order_details WHERE order_id='${req.body.orderId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.post("/addManualProductToOrder", (req, res) => {
  const sql = `INSERT INTO products (product_category_id,product_image, product_name,product_brand,product_pprice,product_wprice,product_rprice) VALUES ('','no-picture.jpg','Yeni ürün','','0','0','0')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    const productId = result.insertId;
    const sql = `INSERT INTO order_details (order_id,ordered_product_id,ordered_product_name,ordered_product_quantity,ordered_product_wprice) VALUES ('${req.body.orderId}','${productId}','Yeni ürün','1','0')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.send({ order_id: req.body.orderId, product_image: "no-picture.jpg", product_id: productId, product_name: "Yeni ürün", product_quantity: "1", product_wprice: "0" });
    });
  });
});

app.post("/deleteManualProductFromOrder", (req, res) => {
  const sql = `DELETE FROM order_details WHERE ordered_product_id='${req.body.productId}' AND order_id='${req.body.orderId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    const sql = `DELETE FROM products WHERE product_id='${req.body.productId}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.send({ type: "success", message: "Ürün silindi" });
    });
  });
});

app.post("/deleteProduct", (req, res) => {
  const sql = `DELETE FROM products WHERE product_id='${req.body.productId}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send({ type: "success", message: "Ürün silindi" });
  });
});

app.post(
  "/updateProduct",
  imageUpload.single("update-product-image-input"),
  (req, res) => {
    console.log(req.file.filename);
    console.log(req.body);
    if (req.file.filename) {
      const image = req.file.filename;

      const sql = `UPDATE products SET product_image='${image}',
       product_name='${req.body["update-product-name-input"]}',
       product_brand='${req.body["update-product-brand-input"]}',
       product_pprice='${req.body["update-product-purchase-price"]}',
       product_wprice='${req.body["update-product-wholesale-price"]}',
       product_rprice = '${req.body["update-product-retail-price"]}'
        WHERE product_id='${req.body["update-product-id"]}'`;
      con.query(sql, (err, result2) => {
        if (err) throw err;
        console.log(result2);
        res.send({ type: "success", message: "Ürün güncellendi." });
      });
    }

    // const sql = `SELECT * FROM categories WHERE category_id='${req.body["category-id"]}'`;
    // con.query(sql, (err, result1) => {
    //   if (result1.length > 0) {
    //     if (result1[0].category_sub === 1) {
    //       res.send({ type: "danger", message: "Alt kategorisi olan bir kategoriye ürün ekleyemezsiniz." });
    //     } else {
    //       const sql = `INSERT INTO products (product_category_id,product_image, product_name,product_brand,product_pprice,product_wprice,product_rprice) VALUES
    //       ('${req.body["category-id"]}', '${req.file.filename}','${req.body["product-name-input"]}','${req.body["product-brand-input"]}','${req.body["product-purchase-price"]}','${req.body["product-wholesale-price"]}','${req.body["product-retail-price"]}')`;
    //       con.query(sql, (err, result2) => {
    //         const sql = `UPDATE categories SET category_sub=${0}  WHERE category_id='${req.body["category-id"]}'`;
    //         con.query(sql, (err, result3) => {
    //           res.send({ type: "success", message: "Ürün eklendi." });
    //         });
    //       });
    //     }
    //   } else {
    //     res.send({ type: "danger", message: "Bu kategoriye ürün ekleyemezsiniz." });
    //   }
    // });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
