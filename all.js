const apiUrl = "https://livejs-api.hexschool.io";
const apiPath = "ssshane";
const token = "OFoGe2S8H0TnOV6pxPSz0fputjl1";

// 取得產品列表
const productList = document.querySelector(".productWrap");
let productData = [];
function getProductList() {
  axios
    .get(`${apiUrl}/api/livejs/v1/customer/${apiPath}/products`)
    .then((res) => {
      productData = res.data.products;
      renderProductList();
    })
    .catch((err) => {
      Swal.fire("產品取得失敗!");
    });
}
getProductList();

// // 產品列表渲染 forEach會遍歷陣列，若需要取值則需要宣告變數push進去
// function renderProductList() {
//   let str = "";
//   productData.forEach((item) => {
//     str += `
//     <li class="productCard">
//       <h4 class="productType">新品</h4>
//       <img
//         src="${item.images}"
//         alt="images"
//       />
//       <a class="addCardBtn" data-id="${item.id}">加入購物車</a>
//       <h3>${item.title}</h3>
//       <del class="originPrice">NT$${item.origin_price}</del>
//       <p class="nowPrice">NT$${item.price}</p>
//     </li>`;
//   });
//   productList.innerHTML = str;
// }

// 產品列表渲染 map版 map一樣會遍歷陣列，但他會回傳一個新陣列回來，陣列之間有,號，所以要join('')去濾掉,
const renderProductList = () => {
  productList.innerHTML = productData
    .map(
      (item) => `
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt="images"
      />
      <a class="addCardBtn" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>`
    )
    .join("");
};

// 取得購物車列表
const cartList = document.querySelector(".shoppingCart-table");

let cartData = [];
function getCartList() {
  axios
    .get(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`)
    .then((res) => {
      cartData = res.data.carts;
      renderCarttList();
    })
    .catch((err) => {
      Swal.fire("購物車列表取得失敗!");
    });
}
getCartList();

// 購物車列表渲染
// function renderCarttList() {
//   let str = "";
//   let totalAmount = 0;
//   cartData.forEach((item) => {
//     const itemAmount = item.quantity * item.product.price;
//     totalAmount += itemAmount;
//     str += ` <tr>
//         <td>
//           <div class="cardItem-title">
//             <img src="${item.product.images}" alt="" />
//             <p>${item.product.title}</p>
//           </div>
//         </td>
//         <td>NT$${item.product.price}</td>
//         <td>${item.quantity}</td>
//         <td>NT$${item.quantity * item.product.price}</td>
//         <td class="discardBtn" >
//           <a class="material-icons" >clear</a>
//         </td>
//       </tr>`;
//   });
//   cartList.innerHTML = `
//         <tr>
//           <th width="40%">品項</th>
//           <th width="15%">單價</th>
//           <th width="15%">數量</th>
//           <th width="15%">金額</th>
//           <th width="15%"></th>
//         </tr>
//         ${str}
//         <tr>
//           <td>
//             <a class="discardAllBtn">刪除所有品項</a>
//           </td>
//           <td></td>
//           <td></td>
//           <td>
//             <p>總金額</p>
//           </td>
//           <td>NT$${totalAmount}</td>
//         </tr>`;
// }

// 購物車列表渲染 .map
function renderCarttList() {
  const str = cartData
    .map((item) => {
      const itemAmount = item.quantity * item.product.price;
      return `
      <tr>
        <td>
          <div class="cardItem-title">
            <img src="${item.product.images}" alt="" />
            <p>${item.product.title}</p>
          </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${itemAmount}</td>
        <td class="discardBtn" >
          <a class="material-icons" data-id="${item.id}">clear</a>
        </td>
      </tr>`;
    })
    .join("");

  const totalAmount = cartData.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  cartList.innerHTML = `
    <tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>
    ${str}
    <tr>
      <td>
        <a  class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td>
        <p>總金額</p>
      </td> 
      <td>NT$${totalAmount}</td>
    </tr>`;
}

// 針對產品列表做事件監聽，抓取點擊的位置進行事件處理
productList.addEventListener("click", (e) => {
  const addCartList = e.target.getAttribute("class");
  // 判斷若點擊的位置不是addCartBtn則不執行下方程式碼
  if (addCartList !== "addCardBtn") {
    return;
  }
  // 取出id
  const productId = e.target.getAttribute("data-id");
  let numCheck = 1;

  cartData.forEach((item) => {
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  });

  // 加入購物車
  axios
    .post(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`, {
      data: {
        productId: productId,
        quantity: numCheck,
      },
    })
    .then((res) => {
      Swal.fire({
        title: "加入購物車成功",
        icon: "success",
      });
      getCartList();
    })
    .catch((err) => {
      Swal.fire({
        title: "加入購物車失敗!",
        text: err.response.data.message,
        icon: "question",
      });
    });
});

// 加入購物車
// function addCartItem(id, numCheck) {
//   axios
//     .post(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`, {
//       data: {
//         productId: id,
//         quantity: numCheck,
//       },
//     })
//     .then((res) => {
//       Swal.fire({
//         title: "加入購物車成功",
//         icon: "success",
//       });
//       getCartList();
//     })
//     .catch((err) => {
//       Swal.fire({
//         title: "加入購物車失敗!",
//         text: err.response.data.message,
//         icon: "question",
//       });
//     });
// }

// 清除購物車內全部產品
const deleteAllCartBtn = document.querySelector(".discardAllBtn");

function deleteAllCartList() {
  axios
    .delete(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`)
    .then((res) => {
      Swal.fire({
        title: "清除購物車成功",
        icon: "success",
      });
      getCartList();
    })
    .catch((err) => {
      Swal.fire({
        title: "清除購物車失敗!",
        text: err.response.data.message,
        icon: "question",
      });
    });
}

// cartList 作為父級元素，使用事件委派的方式來處理
cartList.addEventListener("click", (e) => {
  // 檢查點擊的元素是否為 .discardAllBtn
  if (e.target.classList.contains("discardAllBtn")) {
    // 執行相清除購物車內全部產品
    deleteAllCartList();
  }
});

// 刪除購物車內特定產品
cartList.addEventListener("click", (e) => {
  e.preventDefault();

  const cartId = e.target.getAttribute("data-id");

  if (cartId == null) {
    return;
  }

  axios
    .delete(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts/${cartId}`)
    .then((res) => {
      Swal.fire({
        title: "刪除商品成功",
        icon: "success",
      });
      getCartList();
    })
    .catch((err) => {
      Swal.fire({
        title: "刪除商品失敗!",
        text: err.response.data.message,
        icon: "error",
      });
    });
});

// 送出購買訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (cartData.length == 0) {
    Swal.fire({
      title: "購物車是空的哦",
      icon: "warning",
    });
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;

  if (
    customerName == "" ||
    customerPhone == "" ||
    customerEmail == "" ||
    customerAddress == "" ||
    customerTradeWay == ""
  ) {
    Swal.fire({
      title: "請輸入訂單資訊",
      icon: "warning",
    });
    return;
  }
  axios
    .post(`${apiUrl}/api/livejs/v1/customer/${apiPath}/orders`, {
      data: {
        user: {
          name: customerName,
          tel: customerPhone,
          email: customerEmail,
          address: customerAddress,
          payment: customerTradeWay,
        },
      },
    })
    .then((res) => {
      Swal.fire({
        title: "訂單建立成功",
        icon: "success",
      });
      document.querySelector("#customerName").value = "";
      document.querySelector("#customerPhone").value = "";
      document.querySelector("#customerEmail").value = "";
      document.querySelector("#customerAddress").value = "";
      document.querySelector("#tradeWay").value = "ATM";
      getCartList();
    })
    .catch((err) => {
      Swal.fire({
        title: "訂單送出失敗!",
        text: err.response.data.message,
        icon: "question",
      });
    });
});

// 修改訂單狀態
function editOrderList(orderId) {
  axios
    .put(
      `${apiUrl}/api/livejs/v1/admin/${apiPath}/orders`,
      {
        data: {
          id: orderId,
          paid: true,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      console.log(res.data);
    });
}

// 刪除全部訂單
function deleteAllOrder() {
  axios
    .delete(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      console.log(res.data);
    });
}

// 刪除特定訂單
function deleteOrderItem() {
  axios
    .delete(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders/${orderId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      console.log(res.data);
    });
}
