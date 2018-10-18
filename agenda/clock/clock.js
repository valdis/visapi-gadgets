/**
 * Cut & Paste Live clock using images II
 * Credit: Jeremy Proffitt
 * http://www.javascriptkit.com/script/script2/liveclock2.shtml
 */
var image_path = "http://visapi-gadgets.googlecode.com/svn/trunk/agenda/clock/";
var clock = new Object();
  if (document.images) { 
    clock.digits = [
   		image_path + "digit0.gif", 
        image_path + "digit1.gif",
     	image_path + "digit2.gif", 
    	image_path + "digit3.gif", 
    	image_path + "digit4.gif", 
    	image_path + "digit5.gif", 
    	image_path + "digit6.gif", 
    	image_path + "digit7.gif", 
    	image_path + "digit8.gif", 
    	image_path + "digit9.gif", 
    	image_path + "digitcolon.gif"
	]
	}
	
clock.run = function(){
    if (!clock.init) {
      clock.getElements();
     } 
    var time = new Date();
    var hours = time.getHours();
    var mins = time.getMinutes();
    var digit;
	digit = hours % 10;
	
	clock.hoursones.src = _IG_GetImage(clock.digits[digit]).src;
	digit = (hours - (hours % 10))/10;
	clock.hourstens.src = _IG_GetImage(clock.digits[digit]).src;
	digit = mins % 10;
    clock.minsones.src = _IG_GetImage(clock.digits[digit]).src;
	digit = (mins - (mins % 10))/10;
	clock.minstens.src = _IG_GetImage(clock.digits[digit]).src;
	
	clock.colon.src = _IG_GetImage(clock.digits[10]).src;
	setTimeout("clock.run()",30000);
}

  
clock.getElements = function() {
  clock.hourstens = document.getElementById('hourstens');
  clock.hoursones = document.getElementById('hoursones');
  clock.minstens = document.getElementById('minstens');
  clock.minsones = document.getElementById('minsones');
  clock.colon = document.getElementById('colon');
  clock.init = true;
}
  