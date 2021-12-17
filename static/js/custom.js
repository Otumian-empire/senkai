// TODO: Find a way to send some auth credential along with the
// to be send to the api. We have to make sure that the data was
// sent with our jquery and not from outside by a user who has
// logged in on the system

jQuery(function ($) {
  // Submit form - login and signup
  function submitAccountForm(url = "", data = {}) {
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

  function articleForm(event, method = "POST") {
    const action = event.target.action;

    const titleId = event.target[0].id;
    const titleValue = event.target[0].value;

    const contentId = event.target[1].id;
    const contentValue = event.target[1].value;

    $.ajax({
      url: action,
      method,
      data: { title: titleValue, content: contentValue },
      dataType: "json",
      success: (response) => {
        const { success, message, articleId } = response;

        if (success) {
          $(`#${titleId}`).val("");
          $(`#${contentId}`).val("");
          $("#flash").attr("class", "alert alert-success").text(message);
          redirectTo(`/article/${articleId}`);
        } else {
          $("#flash").attr("class", "alert alert-danger").text(message);
        }
      },
      error: (error, xhr, message) => {
        console.log({ error }, { xhr }, { message });
        $("#flash").attr("class", "alert alert-danger").text(message);
      }
    });
  }

  function redirectTo(page = "/") {
    location.href = page;
  }

  // Submit form - update firstName, lastName, bio
  function updateAccountFieldForm(event) {
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

    submitAccountForm(url, data);
  });

  // Login form submission
  $("#loginForm").submit((e) => {
    e.preventDefault();

    const url = "/api/account/login";

    const email = $("#email").val();
    const password = $("#password").val();

    const data = { email, password };

    submitAccountForm(url, data);
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

    updateAccountFieldForm(e);
  });

  // update lastName
  $("#lastNameUpdateForm").submit((e) => {
    e.preventDefault();

    updateAccountFieldForm(e);
  });

  // update bio
  $("#bioUpdateForm").submit((e) => {
    e.preventDefault();
    updateAccountFieldForm(e);
  });

  // create article
  // TODO: when a check field is added, get the id and value of the check field
  $("#createArticleForm").submit((event) => {
    event.preventDefault();
    articleForm(event);
  });

  // update article
  // TODO: when a check field is added, get the id and value of the check field
  $("#updateArticleForm").submit((event) => {
    event.preventDefault();
    const method = "PUT";
    articleForm(event, method);
  });

  function commentForm(event, method = "POST") {
    const action = event.target.action;
    const value = event.target[0].value;
    const id = event.target[0].id;

    $.ajax({
      url: action,
      method,
      data: { comment: value },
      dataType: "json",
      success: (response) => {
        const { success, message, articleId } = response;

        if (success) {
          $(`#${id}`).val("");
          $("#flash").attr("class", "alert alert-success").text(message);
          reloadPageAfter(2000);
          redirectTo(`/article/${articleId}`);
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

  // add comment
  $("#addCommentForm").submit((event) => {
    event.preventDefault();
    commentForm(event);
  });

  $("#updateCommentForm").submit((event) => {
    event.preventDefault();
    commentForm(event, "PUT");
  });

  $(".delete-comment").on("click", (e) => {
    e.preventDefault();

    const id = e.target.dataset.id;

    if (id) {
      $.ajax({
        url: `/api/comment/${id}`,
        method: "DELETE",
        dataType: "json",
        success: (response) => {
          const { success, message, articleId } = response;

          if (success) {
            $("#flash").attr("class", "alert alert-success").text(message);
            redirectTo(`/article/${articleId}`);
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
  });

  $(".delete-article").on("click", (e) => {
    e.preventDefault();

    const id = e.target.dataset.id;

    if (id) {
      $.ajax({
        url: `/api/article/${id}`,
        method: "DELETE",
        dataType: "json",
        success: (response) => {
          const { success, message } = response;

          if (success) {
            $("#flash").attr("class", "alert alert-success").text(message);
            redirectTo("/article");
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
  });
});
