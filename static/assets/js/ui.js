class UI {
  constructor() {
    this.tabCollection = document.querySelector("#tab-collection");
    this.tabCart = document.querySelector("#tab-cart");
    this.tabOrders = document.querySelector("#tab-orders");
  }

  createNavigation() {
    const categories = JSON.parse(localStorage.getItem("category-tree")).reverse();
    const breadcrumbDiv = document.createElement("nav");
    breadcrumbDiv.classList = "row m-0 p-3 navbar sticky-top bg-light border-bottom";
    breadcrumbDiv.setAttribute("aria-label", "breadcrumb");
    breadcrumbDiv.id = "categories-breadcrumb";
    breadcrumbDiv.innerHTML = `<ol class="breadcrumb mb-0"></ol>`;
    this.tabCollection.appendChild(breadcrumbDiv);
    for (let c of categories) {
      const li = document.createElement("li");
      li.classList = "breadcrumb-item";
      li.setAttribute("aria-current", "page");
      li.innerHTML = `<a data-id="${c.category_id}" data-role="load-categories" href="javascript:void(0)">${c.category_name}</a>`;
      document.getElementById("categories-breadcrumb").firstElementChild.appendChild(li);
    }
  }

  loadTabCollection(categoryId = 0, categoryName) {
    this.cleaner(this.tabCollection);
    storage.getCategories(categoryId).then((resCategories) => {
      if (resCategories.length > 0) {
        storage.categoryTree(categoryId, categoryName);
        this.createNavigation();
        const categoriesDiv = document.createElement("div");
        categoriesDiv.classList = "row mx-0 mb-5 d-flex justify-content-evenly";
        for (let c of resCategories) {
          const categoryDiv = document.createElement("div");
          categoryDiv.classList = "col-5 border border-primary border-3 fw-bold fs-4 text-center  my-2 py-5";
          categoryDiv.setAttribute("data-id", c.category_id);
          categoryDiv.setAttribute("data-role", "load-categories");
          categoryDiv.setAttribute("role", "button");
          categoryDiv.setAttribute("data-category-name", c.category_name);
          categoryDiv.textContent = c.category_name;
          categoriesDiv.appendChild(categoryDiv);
        }
        this.tabCollection.appendChild(categoriesDiv);
      } else {
        storage.categoryTree(categoryId, categoryName);
        this.loadProductsToUI(categoryId);
      }
    });
  }

  loadProductsToUI(categoryId) {
    this.cleaner(this.tabCollection);
    this.createNavigation();

    storage.getProducts(categoryId).then((products) => {
      if (products.length > 0) {
        const tableDiv = document.createElement("div");
        tableDiv.classList = "row mx-0 mb-5";
        tableDiv.innerHTML = `
      <div class="col px-0">
        <table class="table table-striped table-hover table-responsive">
          <thead class="table-primary">
            <tr>
              <th scope="col">Görsel</th>
              <th scope="col">Ürün Bilgisi</th>
            </tr>
          </thead>
          <tbody id="products-tbody">          
          </tbody>
        </table>
      </div>`;
        this.tabCollection.appendChild(tableDiv);
        const productsTbody = document.querySelector("#products-tbody");
        for (let p of products) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
        <td>
          <img onclick="img_box(this)" src="uploads/${p.product_image}" width="80" height="125"/>
        </td>
        <td>
          <div class="row mx-0">
            <div class="col-12 px-0">${p.product_name}</div>
            <hr class="mb-1" />
            <div class="col-12 px-0">
              <strong>Marka:</strong> ${p.product_brand}
            </div>
            <hr class="mb-1" />
            <div class="col-4 px-0">
              <strong>Alis:</strong><span>${p.product_pprice}€</span>
            </div>
            <div class="col-4 px-0">
              <strong>T.Satis:</strong><span>${p.product_wprice}€</span>
            </div>
            <div class="col-4 px-0">
              <strong>P.Satis:</strong><span>${p.product_rprice}€</span>
            </div>
            <hr class="mb-1" />
            <div class="col-12 px-0 d-flex justify-content-around">
              <div class="dropdown d-flex align-items-center">
                <i class="fa-solid fa-2x fa-gear text-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" data-id="${p.product_id}" data-role="delete-product">Sil</a></li>
                  <li><a class="dropdown-item" href="#" data-id="${p.product_id}" data-role="show-update-product-modal">Düzenle</a></li>
                </ul>
              </div>
              <div class="d-flex align-items-center">
                <i type="button" class="fa-solid fa-2x fa-circle-minus text-secondary" onclick="ui.decrease(this)" ></i>
                <input onfocus="this.select();" onmouseup="return false;" type="number" class="inv-form-control form-control d-inline-block mx-1" value="1" data-id="${p.product_id}"/>
                <i type="button" class="fa-solid fa-2x fa-circle-plus text-secondary" onclick="ui.increase(this)"></i>
              </div>
              <div class="d-flex align-items-center">
                <i type="button" class="fa-solid fa-2x fa-cart-shopping text-secondary" data-role="add-product-to-cart" data-id="${p.product_id}"></i>
              </div>
            </div>
          </div>
        </td>`;
          productsTbody.appendChild(tr);
        }
      }
    });
  }

  loadTabCart() {
    this.cleaner(this.tabCart);
    storage.getCart(storage.getUserInfo().user_id).then((cart) => {
      if (cart.length > 0) {
        const cartDiv = document.createElement("div");
        cartDiv.classList = "row mx-0 mb-5";
        cartDiv.innerHTML = `
      <div class="col-12 px-0">
        <table class="table table-striped table-hover table-responsive">
          <thead class="table-primary">
            <tr>
              <th scope="col">Görsel</th>
              <th scope="col">Ürün Bilgisi</th>
            </tr>
          </thead>
          <tbody id="cart-tbody">
          </tbody>
        </table>
      </div>
      <div class="col-12">
        <div class="mb-3">
          <label for="order-note" class="form-label">Siparis Notu</label>
          <textarea class="form-control w-100 mb-3" id="order-note" rows="3"></textarea>
          <button type="button" class="btn btn-primary w-100" data-role="confirm-order">Siparisi Onayla</button>
        </div>
      </div>`;
        this.tabCart.appendChild(cartDiv);
        const cartTbody = document.querySelector("#cart-tbody");
        for (let p of cart) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
        <td>
          <img src="uploads/${p.product_image}" alt="" width="80" height="125" onclick="img_box(this)"/>
        </td>
        <td>
          <div class="row mx-0">
            <div class="col-12 px-0">${p.product_name}</div>
            <hr class="mb-1" />
            <div class="col-12 px-0">
              <strong>Marka:</strong> ${p.product_brand}
            </div>
            <hr class="mb-1" />
            <div class="col-4 px-0">
              <strong>Alis:</strong><span>${p.product_pprice}€</span>
            </div>
            <div class="col-4 px-0">
              <strong>T.Satis:</strong><span>${p.product_wprice}€</span>
            </div>
            <div class="col-4 px-0">
              <strong>P.Satis:</strong><span>${p.product_rprice}€</span>
            </div>
            <hr class="mb-1" />
            <div class="col-12 px-0 d-flex justify-content-around">
              <div class="d-flex align-items-center">
                <i type="button" class="fa-solid fa-2x fa-circle-minus text-secondary" onclick="ui.decrease(this)"></i>
                <input onfocus="this.select();" onmouseup="return false;" type="number" class="inv-form-control form-control d-inline-block mx-1" value="${p.cart_product_quantity}"/>
                <i type="button" class="fa-solid fa-2x fa-circle-plus text-secondary" onclick="ui.increase(this)"></i>
              </div>
              <div class="d-flex align-items-center">
                <i type="button" class="fa-solid fa-2x fa-arrows-rotate text-secondary" data-role="update-cart-row" data-id="${p.product_id}"></i>
              </div>
              <div class="d-flex align-items-center">
                <i class="fa-solid fa-2x fa-trash text-danger" type="button" data-id="${p.product_id}" data-role="remove-from-cart"></i>
              </div>
            </div>
          </div>
        </td>`;
          cartTbody.appendChild(tr);
        }
      }
    });
  }

  loadTabOrders() {
    this.cleaner(this.tabOrders);
    storage.getOrders(storage.getUserInfo().user_id).then((res) => {
      const accordionDiv = document.createElement("div");
      accordionDiv.id = "orders-accordion";
      accordionDiv.classList = "accordion";
      res.forEach((order) => {
        const accordion = document.createElement("div");
        accordion.classList = "accordion-item";
        accordion.innerHTML = `
        <h2 class="accordion-header">
          <button class="accordion-button collapsed bg-opacity-25 ${order.order_status == "ordered" ? "bg-warning" : "bg-success"}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${order.order_id}" aria-expanded="true" aria-controls="collapse-${order.order_id}" data-id="${
          order.order_id
        }" data-role="load-order-details">
            <div class="row m-0 w-100">
              <div class ="col-4">
                <div><strong>Siparis No</strong></div>
                <div>#${order.order_id}</div>
              </div>
              <div class ="col-4">
                <div><strong>Kullanici</strong></div>
                <div>${order.user_name}</div>
              </div>
              <div class ="col-4">
                <div><strong>Siparis Tarihi</strong></div>
                <div>${ui.formatDate(order.order_date)}</div>
              </div>
            </div>
          </button>
        </h2>
        <div id="collapse-${order.order_id}" class="accordion-collapse collapse" data-bs-parent="#orders-accordion">
          <div class="accordion-body p-0">
            <div class="row p-2 m-0 bg-light">              
              <div class="col-4 d-flex justify-content-around">
                <div class="dropdown">
                  <i class="fa-solid fa-3x fa-file-lines text-info bg-light rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                  <div class="dropdown-menu p-2 bg-info-subtle" style="width:75vw !important;">
                    <p class="m-0">${order.order_notes} 
                    </p>
                  </div>
                </div>                
              </div>
              <div class="col-4 d-flex justify-content-around">
                <div class="dropdown">
                  <i class="fa-solid fa-3x fa-gear text-secondary bg-light rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                  <ul class="dropdown-menu">
                    <li>
                      <a type="button" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#add-category-modal">Kategori Ekle</a>
                    </li>
                    <li>
                      <a type="button" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#add-product-modal">Ürün Ekle</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-4 d-flex flex-column">
                <strong class="mt-1 text-decoration-underline text-center">Toplam</strong>
                <strong class="text-center" id="order-total-${order.order_id}"></strong>
              </div>
            </div>
            <table class="table table-responsive">
              <tbody class="border-top" id="order-tbody-${order.order_id}" data-order-id="${order.order_id}">
              </tbody>
            </table>
          </div>
        </div>
        `;
        // const arr = JSON.parse(order.order_products);
        // let orderTotal = 0;
        // arr.forEach((p) => {
        //   const tr = document.createElement("tr");
        //   tr.setAttribute("data-product-id", p.product_id);
        //   tr.innerHTML = `
        //   <td class="py-0">
        //     <img onclick="img_box(this)" src="uploads/${p.product_image}" width="40" height="65"/>
        //   </td>
        //   <td>
        //     <div class="row mx-0">
        //       <div class="col-12 px-0 d-flex">
        //         <div class="col-3 px-0">
        //           <input type="text" class="form-control border-0  m-0 p-0" value="${p.product_brand}" disabled>
        //         </div>
        //         <div class="col-9 px-0">
        //           <input type="text" class="form-control border-0  m-0 p-0" value="${p.product_name}" disabled>
        //         </div>
        //       </div>
        //       <div class="col-12 px-0 d-flex">
        //         <div>
        //           <input onfocus="this.select();" onfocusout="ui.calculateSummary(this); storage.setOrderOnLocal(this)" onmouseup="return false;" type="number" class="inv-form-control-orders form-control d-inline-block mx-1 my-1 text-start" value="${p.product_quantity}">
        //         </div>
        //         x
        //         <div>
        //           <input onfocus="this.select();" onfocusout="ui.calculateSummary(this); storage.setOrderOnLocal(this)" onmouseup="return false;" type="number" class="inv-form-control-orders form-control d-inline-block mx-1 my-1 text-end" value="${p.product_wprice}">€
        //           <span> = ${p.product_wprice * p.product_quantity} €</span>
        //         <div>
        //       </div>
        //     </div>
        //   </td>
        //   `;
        //   accordion.querySelector("#order-tbody-" + order.order_id).appendChild(tr);
        //   orderTotal += p.product_wprice * p.product_quantity;
        //   accordion.querySelector("#order-total-" + order.order_id).textContent = orderTotal + "€";
        // });

        // const lastRow = document.createElement("tr");
        // lastRow.innerHTML = `
        // <td>
        //   <i class="fa-solid fa-2x fa-circle-plus text-success" type="button" data-role="add-row-to-table"></i>
        // </td>
        // <td>
        // </td>`;
        // accordion.querySelector("#order-tbody-" + order.order_id).appendChild(lastRow);
        accordionDiv.appendChild(accordion);
      });

      this.tabOrders.appendChild(accordionDiv);
    });
  }

  loadOrderDetails(orderId) {
    storage.getOrderDetails(orderId).then((resOrderDetails) => {
      storage.getOrderSummary(orderId).then((res) => {
        console.log(Object.values(res[0]));
        const sum = Object.values(res[0]);
        document.querySelector("#order-total-" + orderId).textContent = Number(sum[0] * sum[1]) + " €";
      });
      console.log(resOrderDetails);
      const orderTbody = document.querySelector("#order-tbody-" + orderId);
      this.cleaner(orderTbody);
      for (let order of resOrderDetails) {
        const deleteIcon = `
        <div>
          <i data-order-id="${order.order_id}" data-product-id="${order.product_id}" class="fa-solid fa-2x fa-circle-minus text-danger" onclick="" type="button" data-role="delete-row-from-table"></i>
        </div>
        
        `;
        const tr = document.createElement("tr");
        tr.setAttribute("data-product-id", order.product_id);
        tr.innerHTML = `
          <td class="py-0">
            <img onclick="img_box(this)" src="uploads/${order.product_image}" width="40" height="65"/>
          </td>
          <td>
            <div class="row mx-0">
              <div class="col-12 px-0 d-flex">
                <div class="col-3 px-0">
                  <input type="text" class="form-control border-0  m-0 p-0" value="${order.product_brand}" disabled>
                </div>
                <div class="col-9 px-0">
                  <input type="text" class="form-control border-0  m-0 p-0" value="${order.product_name}" disabled>
                </div>
              </div>
              <div class="col-12 px-0 d-flex">
                <div>
                  <input data-order-id="${order.order_id}" onfocus="this.select();" onfocusout="ui.calculateSummary(this)" onmouseup="return false;" type="number" class="inv-form-control-orders form-control d-inline-block mx-1 my-1 text-start" value="${order.ordered_product_quantity}">
                </div>
                x
                <div>
                  <input data-order-id="${order.order_id}" onfocus="this.select();" onfocusout="ui.calculateSummary(this)" onmouseup="return false;" type="number" class="inv-form-control-orders form-control d-inline-block mx-1 my-1 text-end" value="${order.ordered_product_wprice}">€
                  = <span data-role="ordered-product-total"> ${order.ordered_product_wprice * order.ordered_product_quantity} </span>€
                </div>
                ${order.product_category_id == 0 ? deleteIcon : ""}
              </div>
            </div>
          </td>
          `;
        orderTbody.appendChild(tr);
      }

      const lastRow = document.createElement("tr");
      lastRow.innerHTML = `
        <td>
          <i class="fa-solid fa-2x fa-circle-plus text-success" type="button" data-order-id="${orderId}" data-role="add-row-to-table"></i>
        </td>
        <td>
        </td>`;
      orderTbody.appendChild(lastRow);
    });
  }

  calculateSummary(e) {
    let val1 = e.parentElement.parentElement.getElementsByTagName("input")[0].value;
    let val2 = e.parentElement.parentElement.getElementsByTagName("input")[1].value;
    e.parentElement.parentElement.getElementsByTagName("span")[0].textContent = Number(val1 * val2);

    const orderTbody = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    let orderTotal = 0;
    Array.from(orderTbody.querySelectorAll('span[data-role="ordered-product-total"]')).forEach((e) => {
      console.log(e.textContent);
      orderTotal += Number(e.textContent);
    });
    console.log("order-total-" + e.getAttribute("data-order-id"));
    document.querySelector("#order-total-" + e.getAttribute("data-order-id")).textContent = orderTotal;
  }

  updatePill() {
    // const cartPill = document.querySelector("#cart-pill");
    // cartPill.classList += " d-none";
    // cartPill.textContent = Number(storage.getCart().length);
    // if (Number(storage.getCart().length) > 0) {
    //   cartPill.classList.remove("d-none");
    // }
  }

  showAlert(type, message) {
    const alertDiv = document.querySelector("#alert-div");
    if (type === "success") {
      alertDiv.textContent = message;
      alertDiv.classList = "alert alert-success";
      setTimeout(() => {
        alertDiv.classList += " d-none";
      }, 1000);
    } else {
      alertDiv.textContent = message;
      alertDiv.classList = "alert alert-danger";
      setTimeout(() => {
        alertDiv.classList += " d-none";
      }, 1000);
    }
  }

  cleaner(element) {
    while (element.firstElementChild) {
      element.firstElementChild.remove();
    }
  }

  decrease(e) {
    const quantity = e.nextElementSibling;
    if (quantity.value > 1) {
      quantity.value--;
    }
  }

  increase(e) {
    const quantity = e.previousElementSibling;
    quantity.value++;
  }

  formatDate(date) {
    let newDate = new Date(date);
    newDate = `${newDate.getDate()}.${newDate.getMonth()}.${newDate.getFullYear()}`;
    return newDate;
  }
}
