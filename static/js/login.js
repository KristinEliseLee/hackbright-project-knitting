/* global $ :true*/

function handleResults(results) {
  const data = results.data;
  let fieldsWithErrors = Object.keys(data);
  if (fieldsWithErrors.length >= 1) {
    for (let field of fieldsWithErrors) {
      $(`.${field}`).append('<ul class="errors"></ul>');
      for (let error of data[field]) {
        $(`.${field}`).find('.errors').append(`<li>${error}</li>`);
      }
    }
  } else {
    window.location.replace('/user');
  }
}

function handleSubmit(evt) {
  evt.preventDefault();
  $('.errors').remove();
  const formData = $('#login').serialize();
  $('#password').value = '';

  $.post('/login', formData, handleResults);
}

$('#login').submit(handleSubmit);
