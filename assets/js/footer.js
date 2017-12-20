$('#footer').show();
$('#footerbuttondown').on('click', shrink);
$('#footerbuttonup').on('click', expand);

  
function shrink() {
    if ((document.getElementById("footer").style.height = "440px")) {
        document.getElementById("footer").style.height = "20px";
        document.getElementById("footerbuttondown").style.visibility = "hidden";
        document.getElementById("footerbuttonup").style.visibility = "visible";
        document.getElementById("footercont").style.opacity = "0";
        document.getElementById("footercont").style.visibility = "hidden";
    }
}
  
function expand() {
    if ((document.getElementById("footer").style.height = "20px")) {
        document.getElementById("footer").style.height = "440px";
        document.getElementById("footerbuttondown").style.visibility = "visible";
        document.getElementById("footerbuttonup").style.visibility = "hidden";
        document.getElementById("footercont").style.opacity = "1";
        document.getElementById("footercont").style.visibility = "visible";
    }
}
  