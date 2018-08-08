/* global $ likeStatus :true*/

function showLikeButton(likeStatus) {
  // shows like or unlike button
  $('.like').hide();
  if (likeStatus === 'like') {
    $('#like').show();
  }
  if (likeStatus === 'liked') {
    $('#liked').show();
  }
}

showLikeButton(likeStatus);

function likePattern() {
  // sends the like/unlike request to server
  $.post(`${window.location.pathname}`, {}, (res) => showLikeButton(res));
}

$('.like').on('click', likePattern);
