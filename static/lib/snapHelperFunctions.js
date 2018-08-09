
Snap.plugin( function(Snap, Element, Paper, global) {
  Element.prototype.getMatrix = function(  ) {
    return this.node.transform.baseVal.getItem(0).matrix;
  };

    //angles in degrees
  Element.prototype.skew = function( angleX, angleY ) {
    var m = this.getMatrix();
    m.b = Math.tan(angleY*Math.PI/180)
    m.c = Math.tan(angleX*Math.PI/180)
  };

  Element.prototype.translate = function( x, y ) {
    var m = this.getMatrix();
    m.e += x;
    m.f += y;
  };

  Element.prototype.scale = function( x, y ) {
    var m = this.getMatrix();
    m.a = x;
    m.d = y;
  };

  Element.prototype.rotate = function( degrees) {
    var m = this.getMatrix();
    var a = degrees*Math.PI/180; 
    m.a = Math.cos(a);
    m.b = Math.sin(a);
    m.c = -Math.sin(a);
    m.d = Math.cos(a);
  };
});