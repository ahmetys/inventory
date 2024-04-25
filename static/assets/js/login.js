const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const container = document.getElementsByClassName("container-fluid")[0];
const storage = new Storage();
loginButton.addEventListener("click", () => {
  if (username.value !== "" && password.value !== "") {
    fetch(`${storage.url}auth`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
      .then((res) => res.json())
      .then((auth) => {
        if (auth.type == "success") {
          let userInfo;
          if (localStorage.getItem("user-info") === null) {
            userInfo = { user_id: auth.user_id, user_name: auth.user_name };
            localStorage.setItem("user-info", JSON.stringify(userInfo));
          } else {
            userInfo = JSON.parse(localStorage.getItem("user-info"));
            userInfo = { user_id: auth.user_id, user_name: auth.user_name };
            localStorage.setItem("user-info", JSON.stringify(userInfo));
          }
          alert(auth.message, auth.type);
          setTimeout(() => {
            window.location.href = storage.url;
          }, 1000);
        } else {
          alert(auth.message, auth.type);
        }
      });
  } else {
    alert("Giris bilgilerini kontrol edin.", "danger");
  }
});

function alert(message, type) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = '<div class="mt-5 alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

  container.append(wrapper);

  setTimeout(() => {
    document.getElementsByClassName("alert")[0].remove();
  }, 1500);
}
