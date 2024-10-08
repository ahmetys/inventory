const ui = new UI();
const storage = new Storage();
const addNewCategoryForm = document.querySelector("#add-category-form");
const addNewCategoryModal = new bootstrap.Modal(document.querySelector("#add-category-modal"));
const addNewProductForm = document.querySelector("#add-new-product-form");
const addNewProductModal = new bootstrap.Modal(document.querySelector("#add-product-modal"));
const updateProductForm = document.querySelector("#update-product-form");
const updateProductModal = new bootstrap.Modal(document.querySelector("#update-product-modal"));

document.addEventListener("DOMContentLoaded", (e) => {
  ui.loadTabCollection();
  //  ui.updatePill();
  document.querySelector("#logged-in-user").textContent = storage.getUserInfo().user_name;

  if (storage.getUserInfo().user_role == "admin") {
    document.querySelector("#add-button-div").classList.remove("d-none");
  }
});

document.addEventListener("click", (e) => {
  switch (e.target.getAttribute("data-role")) {
    case "load-tab-collection":
      ui.loadTabCollection();
      if (storage.getUserInfo().user_role == "admin") {
        document.querySelector("#add-button-div").classList.remove("d-none");
      }
      break;
    case "load-tab-cart":
      ui.loadTabCart();
      if (storage.getUserInfo().user_role == "admin") {
        document.querySelector("#add-button-div").classList += " d-none";
      }
      break;
    case "load-tab-orders":
      ui.loadTabOrders();
      if (storage.getUserInfo().user_role == "admin") {
        document.querySelector("#add-button-div").classList += " d-none";
      }
      break;
    case "load-tab-settings":
      console.log("tab-settings");
      if (storage.getUserInfo().user_role == "admin") {
        document.querySelector("#add-button-div").classList += " d-none";
      }
      break;
    case "add-product-to-cart":
      let quantity = e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value;
      if (quantity > 0) {
        storage.addToCart(e.target.getAttribute("data-id"), quantity, storage.getUserInfo().user_id).then((resCart) => {
          console.log(resCart);
          ui.showAlert(resCart.type, resCart.message);
        });
      } else {
        ui.showAlert("danger", "Adet 1'den az olamaz");
      }
      break;
    case "load-categories":
      ui.loadTabCollection(Number(e.target.getAttribute("data-id")), e.target.getAttribute("data-category-name"));
      break;
    case "update-cart-row":
      const updateId = e.target.getAttribute("data-id");
      const newQuantity = e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value;
      if (newQuantity > 0) {
        storage.updateCart(storage.getUserInfo().user_id, updateId, newQuantity).then((res) => {
          ui.showAlert(res.type, res.message);
        });
      } else {
        ui.showAlert("danger", "Adet 1'den az olamaz");
      }
      break;
    case "remove-from-cart":
      const removeId = e.target.getAttribute("data-id");
      storage.removeItemFromCart(removeId).then((res) => {
        e.target.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
        ui.showAlert(res.type, res.message);
        if (!document.querySelector("#cart-tbody").firstElementChild) {
          ui.loadTabCart();
        }
      });
      // if (storage.removeItemFromCart(removeId)) {
      //   ui.showAlert("success", "Spetten silindi");
      //   //ui.updatePill();
      //   e.target.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      //   if (storage.getCart().length == 0) {
      //     ui.loadTabCart();
      //   }
      // }
      break;
    case "confirm-order":
      const orderNote = document.querySelector("#order-note").value;
      storage.confirmOrder(storage.getUserInfo().user_id, orderNote).then((res) => {
        ui.showAlert(res.type, res.message);
        ui.loadTabCart();
      });
      break;
    case "add-new-category":
      e.preventDefault();
      //storage.checkIncludesProduct(storage.getCurrentCategoryId()).then((res) => {
      // if (res) {
      let newCategoryFormData = new FormData(addNewCategoryForm);
      newCategoryFormData.append("parent-category-id", storage.getCurrentCategoryId());

      storage.addNewCategory(newCategoryFormData).then((res) => {
        if (res.type == "success") {
          addNewCategoryForm.reset();
          addNewCategoryModal.hide();
          ui.showAlert(res.type, res.message);
          ui.loadTabCollection(storage.getCurrentCategoryId());
        } else {
          addNewCategoryForm.reset();
          addNewCategoryModal.hide();
          ui.showAlert(res.type, res.message);
        }
      });
      // } else {
      //   ui.showAlert("danger", "Ürün iceren bir kategoriye alt kategori ekleyemezsiniz");
      //   addNewCategoryForm.reset();
      //   addNewCategoryModal.hide();
      // }
      //});

      break;
    case "add-new-product":
      e.preventDefault();
      //storage.checkIncludesSubCategory(storage.getCurrentCategoryId()).then((ress) => {
      let newProductFormData = new FormData(addNewProductForm);
      newProductFormData.append("category-id", storage.getCurrentCategoryId());
      //if (ress) {
      storage.addNewProduct(newProductFormData).then((res) => {
        if (res.type === "success") {
          addNewProductForm.reset();
          addNewProductModal.hide();
          ui.showAlert(res.type, res.message);
          ui.loadTabCollection(storage.getCurrentCategoryId());
        } else {
          ui.showAlert(res.type, res.message);
          addNewProductForm.reset();
          addNewProductModal.hide();
        }
      });

      //});
      break;
    case "delete-product":
      if (confirm("Ürünü silmek istediginize emin misiniz?")) {
        storage.deleteProduct(e.target.getAttribute("data-id")).then((res) => {
          if (res.type == "success") {
            ui.showAlert(res.type, res.message);
            e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
          } else {
            ui.showAlert(res.type, res.message);
          }
        });
      }
      break;
    case "show-update-product-modal":
      const productId = e.target.getAttribute("data-id");
      storage.getProductInfos(productId).then((productInfos) => {
        console.log(productInfos);
        document.querySelector("#update-product-id").value = productInfos[0].product_id;
        document.querySelector("#update-product-brand-input").value = productInfos[0].product_brand;
        document.querySelector("#update-product-name-input").value = productInfos[0].product_name;
        document.querySelector("#update-product-purchase-price").value = productInfos[0].product_pprice;
        document.querySelector("#update-product-wholesale-price").value = productInfos[0].product_wprice;
        document.querySelector("#update-product-retail-price").value = productInfos[0].product_rprice;
        updateProductModal.show();
      });

      break;
    case "update-product":
      e.preventDefault();
      let updateProductFormData = new FormData(updateProductForm);
      storage.updateProduct(updateProductFormData).then((res) => {
        if (res.type === "success") {
          updateProductForm.reset();
          updateProductModal.hide();
          ui.showAlert(res.type, res.message);
          ui.loadTabCollection(storage.getCurrentCategoryId());
        } else {
          ui.showAlert(res.type, res.message);
          updateProductForm.reset();
          updateProductModal.hide();
        }
      });

      break;
    case "add-row-to-table":
      storage.addManualProductToOrder(e.target.getAttribute("data-order-id")).then((resManualOrder) => {
        console.log(resManualOrder.product_image);
        const tableRow = document.createElement("tr");
        tableRow.setAttribute("data-product-id", resManualOrder.productId);
        tableRow.innerHTML = `
          <td class="py-0">
            <img onclick="img_box(this)" src="uploads/${resManualOrder.product_image}" width="40" height="65">
          </td>
          <td>
            <div class="row mx-0">
              <div class="col-12 px-0 d-flex">
                <div class="col-3 px-0">
                  <input onfocus="this.select();" onfocusout="" onmouseup="return false;" autocapitalize="characters" placeholder="Marka girin" type="text" class="form-control border-0 d-inline-block m-0 p-0 text-start">
                </div>                
                <div class="col-9 px-0">
                  <input  data-order-id="${resManualOrder.order_id}" data-product-id="${resManualOrder.product_id}" onfocus="this.select();" onfocusout="ui.updateOrderRow(this)" onmouseup="return false;" autocapitalize="characters" value="${resManualOrder.product_name}" type="text" class="form-control border-0 d-inline-block m-0 p-0 text-start">
                </div>                
              </div>
              <div class="col-12 px-0 d-flex">
                <div class="col-10">
                  <input data-order-id="${resManualOrder.order_id}" data-product-id="${resManualOrder.product_id}" onfocus="this.select();" onfocusout="ui.updateOrderRow(this)" onmouseup="return false;" type="number" class="inv-form-control-orders form-control d-inline-block mx-1 my-1 text-start" value="${resManualOrder.product_quantity}">
                    x
                  <input  data-order-id="${resManualOrder.order_id}" data-product-id="${resManualOrder.product_id}" onfocus="this.select();" onfocusout="ui.updateOrderRow(this)" onmouseup="return false;" type="number" class="inv-form-control-orders form-control d-inline-block mx-1 my-1 text-end" value="${resManualOrder.product_wprice}">€
                  <span>=0 €</span>
                </div>                
                <div class="col-2 px-0">
                  <i data-order-id="${resManualOrder.order_id}" data-product-id="${resManualOrder.product_id}" class="fa-solid fa-2x fa-circle-minus text-danger" onclick="" type="button" data-role="delete-row-from-table"></i>
                </div>
              </div>
            </div>
          </td>
      `;
        e.target.parentElement.parentElement.insertAdjacentHTML("beforebegin", tableRow.outerHTML);
      });

      break;
    case "delete-row-from-table":
      storage.deleteManualProductFromOrder(e.target.getAttribute("data-order-id"), e.target.getAttribute("data-product-id")).then((res) => {
        ui.showAlert(res.type, res.message);
        e.target.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
        storage.getOrderSummary(e.target.getAttribute("data-order-id")).then((res) => {
          console.log(res);
          document.querySelector("#order-total-" + e.target.getAttribute("data-order-id")).textContent = Number(res[0].total) + " €";
        });
      });

      break;
    case "load-order-details":
      const orderId = e.target.getAttribute("data-id");
      ui.loadOrderDetails(orderId);
      break;

    case "complete-order":
      console.log("complete order");
      storage.completeOrder(e.target.getAttribute("data-order-id")).then((res) => {
        ui.showAlert(res.type, res.message);
        ui.loadTabOrders();
      });
      break;
    default:
      break;
  }
});
