class Storage {
  constructor() {
    this.url = "http://192.168.0.45:3001/";
  }
  async getCategories(categoryId) {
    const response = (
      await fetch(`${this.url}getCategories`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
      })
    ).json();
    return response;
  }

  async getAllCategories() {
    return (await fetch(`${this.url}getAllCategories`)).json();
  }

  async getProducts(categoryId) {
    const response = (
      await fetch(`${this.url}getProducts`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
      })
    ).json();
    return response;
  }

  async getProductInfos(productId) {
    const response = (
      await fetch(`${this.url}getProductInfos`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })
    ).json();
    return response;
  }

  async addNewCategory(addNewCategoryFormData) {
    const response = (
      await fetch(`${this.url}addNewCategory`, {
        method: "POST",
        headers: {
          accept: "multipart/form-data",
        },
        body: addNewCategoryFormData,
      })
    ).json();
    return response;
  }

  async addNewProduct(addNewProductFormData) {
    return await fetch(`${this.url}addNewProduct`, {
      method: "POST",
      body: addNewProductFormData,
    }).then((res) => res.json());
  }

  async addToCart(productId, productQuantity, userId) {
    return (
      await fetch(`${this.url}addToCart`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ productId, productQuantity, userId }),
      })
    ).json();
  }

  async getCart(userId) {
    return (
      await fetch(`${this.url}getCart`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
    ).json();
  }
  // async addToCart(productId, quantity) {
  //   let cart = this.getCart();
  //   if (cart.length === 0) {
  //     await this.getProductInfos(productId).then((res) => {
  //       const cartItem = {
  //         product_id: Number(productId),
  //         product_image: res[0].product_image,
  //         product_name: res[0].product_name,
  //         product_brand: res[0].product_brand,
  //         product_pprice: res[0].product_pprice,
  //         product_wprice: res[0].product_wprice,
  //         product_rprice: res[0].product_rprice,
  //         product_quantity: Number(quantity),
  //       };
  //       cart.push(cartItem);
  //     });
  //   } else {
  //     let i = cart.findIndex((c) => {
  //       return c.product_id == productId;
  //     });
  //     if (i >= 0) {
  //       cart[i].product_quantity += Number(quantity);
  //     } else {
  //       await this.getProductInfos(productId).then((res) => {
  //         const cartItem = {
  //           product_id: Number(productId),
  //           product_image: res[0].product_image,
  //           product_name: res[0].product_name,
  //           product_brand: res[0].product_brand,
  //           product_pprice: res[0].product_pprice,
  //           product_wprice: res[0].product_wprice,
  //           product_rprice: res[0].product_rprice,
  //           product_quantity: Number(quantity),
  //         };
  //         cart.push(cartItem);
  //       });
  //     }
  //   }
  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   ui.updatePill();
  // }

  // getCart() {
  //   // return (await fetch(`${this.url}getCart`)).json();
  //   let cart;
  //   if (localStorage.getItem("cart") === null) {
  //     cart = [];
  //   } else {
  //     cart = JSON.parse(localStorage.getItem("cart"));
  //   }
  //   // const a = cart.map((value) => value.product_id);
  //   // console.log(a);
  //   return cart;
  // }

  async updateCart(userId, productId, productQuantity) {
    return (
      await fetch(`${this.url}updateCart`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userId, productId, productQuantity }),
      })
    ).json();
    // let cart = this.getCart();
    // for (let c of cart) {
    //   if (c.product_id == productId) {
    //     c.product_quantity = Number(quantity);
    //   }
    // }
    // localStorage.setItem("cart", JSON.stringify(cart));
    // return true;
  }

  async removeItemFromCart(productId) {
    return (
      await fetch(`${this.url}removeItemFromCart`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })
    ).json();
    // let cart = this.getCart();
    // for (let c in cart) {
    //   if (cart[c].product_id == productId) {
    //     cart.splice(c, 1);
    //   }
    // }
    // localStorage.setItem("cart", JSON.stringify(cart));
    // return true;
  }

  async confirmOrder(userId, orderNote) {
    return (
      await fetch(`${this.url}confirmOrder`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userId, orderNote }),
      })
    ).json();
  }

  async getOrders(userId) {
    return (
      await fetch(`${this.url}getOrders`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
    ).json();
  }

  async getOrderDetails(orderId) {
    return (
      await fetch(`${this.url}getOrderDetails`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })
    ).json();
  }

  categoryTree(categoryId, categoryName = "ANASAYFA") {
    let categoryTree;
    if (localStorage.getItem("category-tree") === null) {
      categoryTree = [{ category_id: 0, category_name: "ANASAYFA" }];
      localStorage.setItem("category-tree", JSON.stringify(categoryTree));
    } else {
      categoryTree = JSON.parse(localStorage.getItem("category-tree"));
    }
    let index = categoryTree.findIndex((e) => e.category_id == categoryId);
    if (index == -1) {
      categoryTree.unshift({ category_id: categoryId, category_name: categoryName });
    } else {
      index = categoryTree.findIndex((e) => e.category_id == categoryId);
      categoryTree = categoryTree.slice(index, categoryTree.length);
    }
    localStorage.setItem("category-tree", JSON.stringify(categoryTree));
  }

  getCurrentCategoryId() {
    return JSON.parse(localStorage.getItem("category-tree"))[0].category_id;
  }

  getUserInfo() {
    return JSON.parse(localStorage.getItem("user-info"));
  }

  async deleteProduct(productId) {
    const response = (
      await fetch(`${this.url}deleteProduct`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })
    ).json();
    return response;
  }

  async updateProduct(updateProductFormData) {
    return await fetch(`${this.url}updateProduct`, {
      method: "POST",
      body: updateProductFormData,
    }).then((res) => res.json());
  }

  setOrderOnLocal(e) {
    const orderTbody = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    const orderId = orderTbody.getAttribute("data-order-id");
    const tableRows = Array.from(orderTbody.getElementsByTagName("tr"));
    let ordersOnLocal = JSON.parse(localStorage.getItem("orders"));
    let currentOrder = ordersOnLocal.filter((e) => e.order_id == orderId);
    const currentOrderProducts = JSON.parse(currentOrder[0].order_products);
    tableRows.forEach((item, index) => {
      if (index < tableRows.length - 1) {
        const productBrand = item.getElementsByTagName("input")[0].value;
        const productName = item.getElementsByTagName("input")[1].value;
        const productQuantity = Number(item.getElementsByTagName("input")[2].value);
        const productWprice = Number(item.getElementsByTagName("input")[3].value);

        if (item.hasAttribute("data-product-id")) {
          currentOrderProducts[index].d_product_brand = productBrand;
          currentOrderProducts[index].d_product_name = productName;
          currentOrderProducts[index].d_product_quantity = productQuantity;
          currentOrderProducts[index].d_product_wprice = productWprice;
        } else {
          currentOrderProducts.push({
            product_brand: productBrand,
            product_name: productName,
            product_quantity: productQuantity,
            product_wprice: productWprice,
            d_product_brand: productBrand,
            d_product_name: productName,
            d_product_quantity: productQuantity,
            d_product_wprice: productWprice,
          });
        }
      }
    });
    ordersOnLocal.map((e) => {
      if (e.order_id == orderId) {
        e.order_products = JSON.stringify(currentOrderProducts);
      }
    });
    localStorage.setItem("orders", JSON.stringify(ordersOnLocal));
    console.log(currentOrderProducts);
  }
}
