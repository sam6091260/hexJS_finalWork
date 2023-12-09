const apiUrl = "https://livejs-api.hexschool.io";
const apiPath = "ssshane";
const token = "OFoGe2S8H0TnOV6pxPSz0fputjl1";

// 取得訂單列表
let orderData = [];
const orderList = document.querySelector(".js-orderList");
function init() {
  getOrderList();
}
init();

function renderC3() {
  // 物件資料搜集
  let total = {};
  orderData.forEach((item) => {
    item.products.forEach((productItem) => {
      if (total[productItem.category] == undefined) {
        total[productItem.category] = productItem.price * productItem.quantity;
      } else {
        total[productItem.category] += productItem.price * productItem.quantity;
      }
    });
  });

  // 做出資料關聯
  let categoryAry = Object.keys(total);
  let newData = [];
  categoryAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  });

  // C3.js
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: newData,
      colors: {
        "Louvre 雙人床架": "#DACBFF",
        "Antony 雙人床架": "#9D7FEA",
        "Anty 雙人床架": "#5434A7",
        其他: "#301E5F",
      },
    },
  });
}

function getOrderList() {
  axios
    .get(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      orderData = res.data.orders;
      let str = "";
      orderData.forEach((item) => {
        // 組時間字串
        const timeStamp = new Date(item.createdAt * 1000);
        const orderTime = `${timeStamp.getFullYear()}/${
          timeStamp.getMonth() + 1
        }/${timeStamp.getDate()}`;

        // 組產品字串
        let productStr = "";
        item.products.forEach((productItem) => {
          productStr += `<p>${productItem.title}x${productItem.quantity}</p>`;
        });
        // 判斷訂單處理狀態
        let orderStatus = "";
        if (item.paid == true) {
          orderStatus = "已處理";
        } else {
          orderStatus = "未處理";
        }
        // 組訂單字串
        str += ` <tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${productStr}</p>
        </td>
        <td>${orderTime}</td>
        <td class=" js-orderStatus">
          <a href="#" data-status="${item.paid}" class="orderStatus" data-id="${item.id}" >${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除" />
        </td>
      </tr>`;
      });
      orderList.innerHTML = str;
      renderC3();
    });
}

orderList.addEventListener("click", (e) => {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  let id = e.target.getAttribute("data-id");
  if (targetClass == "delSingleOrder-Btn js-orderDelete") {
    deleteOrderItem(id);
    return;
  }
  if (targetClass == "orderStatus") {
    let status = e.target.getAttribute("data-status");

    changeOrderStatus(status, id);
    return;
  }
});
// 修改訂單狀態
function changeOrderStatus(status, id) {
  let newStatus;
  if (status == true) {
    newStatus = false;
  } else {
    newStatus = true;
  }
  axios
    .put(
      `${apiUrl}/api/livejs/v1/admin/${apiPath}/orders`,
      {
        data: {
          id: id,
          paid: newStatus,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      Swal.fire({
        title: "修改訂單成功",
        icon: "success",
      });
      getOrderList();
    });
}
// 刪除指定訂單
function deleteOrderItem(id) {
  axios
    .delete(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      Swal.fire({
        title: "刪除該筆訂單成功",
        icon: "success",
      });
      getOrderList();
    });
}

const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  axios
    .delete(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      Swal.fire({
        title: "刪除全部訂單成功",
        icon: "success",
      });
      getOrderList();
    });
});
