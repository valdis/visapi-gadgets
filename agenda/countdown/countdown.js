/***********************************************

* JavaScript Image Clock- by JavaScript Kit (www.javascriptkit.com)
* This notice must stay intact for usage
* Visit JavaScript Kit at http://www.javascriptkit.com/ for this script and 100s more

***********************************************/
var imagepath = "http://visapi-gadgets.googlecode.com/svn/trunk/agenda/countdown/";
var countdown=new Object()
//Enter path to clock digit images here, in order of 0-9, then colon image:
countdown.digits=[imagepath + "c0.gif", 
                  imagepath + "c1.gif",
                  imagepath + "c2.gif",
                  imagepath + "c3.gif",
                  imagepath + "c4.gif",
                  imagepath + "c5.gif",
                  imagepath + "c6.gif",
                  imagepath + "c7.gif",
                  imagepath + "c8.gif",
                  imagepath + "c9.gif",
                  imagepath + "colon.gif"]

countdown.imageHTML=function(dateobj){ //return timestring (ie: 1:56:38) into string of images instead
    var hours = dateobj.getUTCHours();
    var mins = dateobj.getUTCMinutes();
    var secs = dateobj .getUTCSeconds();
    // Hours
    digit = hours % 10;
	countdown.hour0.src = _IG_GetImage(countdown.digits[digit]).src;
	digit = (hours - (hours % 10))/10;
	countdown.hour1.src = _IG_GetImage(countdown.digits[digit]).src;
	// Minutes
    var digit;
    digit = mins % 10;
    countdown.min0.src = _IG_GetImage(countdown.digits[digit]).src;
	digit = (mins - (mins % 10))/10;
	countdown.min1.src = _IG_GetImage(countdown.digits[digit]).src;
	// Seconds
	digit = secs % 10;
	countdown.sec0.src = _IG_GetImage(countdown.digits[digit]).src
	digit = (secs - (secs % 10))/10;
	countdown.sec1.src = _IG_GetImage(countdown.digits[digit]).src;
}

countdown.update=function(dateobj, container){
    if (!container.firstChild) {
      container.innerHTML = "<span style='background-color: black;'>" +
                            "<img border=0  id='hour1'></img>" +
                            "<img border=0  id='hour0'></img>" +
                            "<img border=0  id='hours'></img>" +
                            "<img border=0  id='min1'></img>" +
                            "<img border=0  id='min0'></img>" +
                            "<img border=0  id='mins'></img>" +
                            "<img border=0  id='sec1'></img>" +
                            "<img border=0  id='sec0'></img>" +
                            "</span>"; 
      countdown.getElements();                      
    }  
    
	countdown.imageHTML(dateobj);
}

countdown.getElements = function() {
  countdown.hour1 = document.getElementById('hour1');
  countdown.hour0 = document.getElementById('hour0');
  countdown.hours = document.getElementById('hours');
  countdown.min1 = document.getElementById('min1');
  countdown.min0 = document.getElementById('min0');
  countdown.mins = document.getElementById('mins');
  countdown.sec1 = document.getElementById('sec1');
  countdown.sec0 = document.getElementById('sec0');
  
  hours.src = _IG_GetImage(countdown.digits[10]).src;
  mins.src = _IG_GetImage(countdown.digits[10]).src;
  
}

