(function( $ ) {
  $.fn.collide = function (el2) {
    var rect1 = this[0].getBoundingClientRect();
    var rect2 = $(el2)[0].getBoundingClientRect();

    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
  }

  $.fn.inside = function (el2) {
    var rect1 = this[0].getBoundingClientRect();
    var rect2 = $(el2)[0].getBoundingClientRect();

    return (
      ((rect2.top <= rect1.top) && (rect1.top <= rect2.bottom)) &&
      ((rect2.top <= rect1.bottom) && (rect1.bottom <= rect2.bottom)) &&
      ((rect2.left <= rect1.left) && (rect1.left <= rect2.right)) &&
      ((rect2.left <= rect1.right) && (rect1.right <= rect2.right))
    );
  }
}( jQuery ));