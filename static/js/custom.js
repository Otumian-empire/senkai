$(document).ready(() => {
  function submitForm(
    url = "",
    data = {},
    method = "POST",
    dataType = "json",
    redirect = "/"
  ) {
    $.ajax({
      url,
      method,
      data,
      dataType,
      success: (response) => {
        const { success, message } = response;

        if (success) {
          location.href = redirect;
        } else {
          $("#flash").attr("class", "alert alert-danger").text(message);
        }
      },
      error: (error, xhr, message) => {
        console.log(error, xhr, message);
        $("#flash").attr("class", "alert alert-danger").text(message);
      }
    });
  }

  //Signup form submission
  $("#signup_form").submit((e) => {
    e.preventDefault();

    const url = "/api/account/signup";
    // const method = "POST";

    const first_name = $("#first_name").val();
    const last_name = $("#last_name").val();
    const email = $("#email").val();
    const bio = $("#bio").val();
    const password = $("#password").val();
    const confirm_password = $("#confirm_password").val();

    const data = {
      first_name,
      last_name,
      email,
      bio,
      password,
      confirm_password
    };

    submitForm(url, data);
  });

  //Login form submission
  $("#login_form").submit((e) => {
    e.preventDefault();

    const url = "/api/account/login";
    const method = "POST";

    const email = $("#email").val();
    const password = $("#password").val();

    const data = { email, password };

    submitForm(url, data);
  });
});
