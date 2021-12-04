$(document).ready(() => {
  // Submit form - login and signup
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

  function reloadPageAfter(seconds = 5000) {
    setTimeout(() => {
      location.reload(true);
    }, seconds);
  }

  // Submit form - update firstName, lastName, bio
  function updateFieldForm(event) {
    const action = event.target.action;
    const value = event.target[0].value;
    const id = event.target[0].id;

    $.ajax({
      url: action,
      method: "PUT",
      data: { value },
      dataType: "json",
      success: (response) => {
        const { success, message } = response;

        if (success) {
          $(`#${id}`).val("");
          $("#flash").attr("class", "alert alert-success").text(message);
          reloadPageAfter(2000);
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

  // update firstName
  $("#firstNameUpdateForm").submit((e) => {
    e.preventDefault();
    updateFieldForm(e);
  });

  // update lastName
  $("#lastNameUpdateForm").submit((e) => {
    e.preventDefault();
    updateFieldForm(e);
  });

  // update bio
  $("#bioUpdateForm").submit((e) => {
    e.preventDefault();
    updateFieldForm(e);
  });
});
