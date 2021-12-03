$(document).ready(() => {
  // Submit form
  function submitForm(url = "", data = {}) {
    const method = "POST";
    const dataType = "json";
    const redirect = "/";

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

  // Signup form submission
  $("#signupForm").submit((e) => {
    e.preventDefault();

    const url = "/api/account/signup";

    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#email").val();
    const bio = $("#bio").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();

    const data = {
      firstName,
      lastName,
      email,
      bio,
      password,
      confirmPassword
    };

    submitForm(url, data);
  });

  // Login form submission
  $("#loginForm").submit((e) => {
    e.preventDefault();

    const url = "/api/account/login";

    const email = $("#email").val();
    const password = $("#password").val();

    const data = { email, password };

    submitForm(url, data);
  });

  // Contact Me form submission
  $("#contactMeForm").submit((e) => {
    e.preventDefault();

    const url = "/api/contact";
    const method = "POST";
    const dataType = "json";

    const fullName = $("#fullName").val();
    const email = $("#email").val();
    const subject = $("#subject").val();
    const content = $("#content").val();

    const data = { fullName, email, subject, content };

    $.ajax({
      url,
      method,
      data,
      dataType,
      success: (response) => {
        const { success, message } = response;

        if (success) {
          $("#fullName").val("");
          $("#email").val("");
          $("#subject").val("");
          $("#content").val("");

          $("#flash").attr("class", "alert alert-success").text(message);
        } else {
          $("#flash").attr("class", "alert alert-danger").text(message);
        }
      },
      error: (error, xhr, message) => {
        console.log(error, xhr, message);
        $("#flash").attr("class", "alert alert-danger").text(message);
      }
    });
  });
});
