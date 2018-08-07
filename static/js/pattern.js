/* global $ likedYet patternid :true*/
function showLikeButton(likedYet) {
  console.log(likedYet);
  $('.like').hide();
  if (likedYet === 'like') {
    $('#like').show();
  }
  if (likedYet === 'liked') {
    $('#liked').show();
  }
}

showLikeButton(likedYet);

function likePattern() {
  $.post(`/patterns/${patternid}`, {}, (res) => showLikeButton(res));
}

$('.like').on('click', likePattern);
