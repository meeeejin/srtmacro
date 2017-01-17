function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}

var dsturl1 = "https://etk.srail.co.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";

if (document.URL.substring(0, dsturl1.length) == dsturl1) {

	$(document).ready(function() {
		injectJs(chrome.extension.getURL('inject.js'));

		var coachSelected = JSON.parse(localStorage.getItem('coachSelected'));
		var firstSelected = JSON.parse(localStorage.getItem('firstSelected'));
		if (coachSelected == null) coachSelected = [];
		if (firstSelected == null) firstSelected = [];
		console.log("coach:" + coachSelected);
		console.log("first:" + firstSelected);

		if (localStorage.getItem('macro') == "true") {
			$("div.button").append('<a href="#" onclick="macrostop();" style="font-size:15px; margin-left:5px;"><img src="' + chrome.extension.getURL('images/btn_stop.png') + '"></a>');
			
		} else {
			$("div.button").append('<a href="#" onclick="macro();" style="font-size:15px; margin-left:5px;"><img src="' + chrome.extension.getURL('images/btn_start.png') + '"></a>');
		}

		// Inserts the macro button into the table.
		if ($("#search-list").length != 0) {
			var rows = $('#search-list table tr');
			for (i = 1; i < rows.length; i++) {
				var columns = $(rows[i]).children('td');
				var first = $(columns[5]);
				var coach = $(columns[6]);
				if (coach.children().length > 0) {
					coach.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="coachMacro" value="' + i + '">매크로');
					checkbox.children('input').prop('checked', coachSelected.indexOf(i+"") > -1);
					coach.append(checkbox);
				}
				if (first.children().length > 0) {
					first.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="firstMacro" value="' + i + '">매크로');
					checkbox.children('input').prop('checked', firstSelected.indexOf(i+"") > -1);
					first.append(checkbox);
				}
			}
		}

		if (localStorage.getItem('macro') == "true") {
			// Restores user preferences
			$("#psgInfoPerPrnb1").val(localStorage.getItem('psgInfoPerPrnb1'));
			$("#psgInfoPerPrnb5").val(localStorage.getItem('psgInfoPerPrnb5'));
			$("#psgInfoPerPrnb4").val(localStorage.getItem('psgInfoPerPrnb4'));
			$("#psgInfoPerPrnb2").val(localStorage.getItem('psgInfoPerPrnb2'));
			$("#psgInfoPerPrnb3").val(localStorage.getItem('psgInfoPerPrnb3'));
			$("#locSeatAttCd1").val(localStorage.getItem('locSeatAttCd1'));
			$("#rqSeatAttCd1").val(localStorage.getItem('rqSeatAttCd1'));

			if ($("#search-list").length != 0) {
				var rows = $('#search-list table tr');

				var succeed = false;
				for (i = 1; i < rows.length; i++) {
					var columns = $(rows[i]).children('td');

					var first = $(columns[5]);
					var coach = $(columns[6]);

					if (coachSelected.indexOf(i+"") > -1) {
						var coachSpecials = coach.children("a");
						if (coachSpecials.length != 0) {
							for (j = 0; j < coachSpecials.length; j++) {
								name = $(coachSpecials[j]).attr('class');
								if (name == 'button button-02') {
									$(coachSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}

					if (firstSelected.indexOf(i+"") > -1) {
						var firstSpecials = first.children("a");
						if (firstSpecials.length != 0) {
							for (j = 0; j < firstSpecials.length; j++) {
								name = $(firstSpecials[j]).attr('class');
								if (name == 'button button-02') {
									$(firstSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}
				}

				if (succeed == true) {
					localStorage.removeItem('macro');
					localStorage.removeItem('coachSelected');
					localStorage.removeItem('firstSelected');
					localStorage.removeItem('psgInfoPerPrnb1');
					localStorage.removeItem('psgInfoPerPrnb5');
					localStorage.removeItem('psgInfoPerPrnb4');
					localStorage.removeItem('psgInfoPerPrnb2');
					localStorage.removeItem('psgInfoPerPrnb3');
					localStorage.removeItem('locSeatAttCd1');
					localStorage.removeItem('rqSeatAttCd1');
					chrome.extension.sendMessage({type: 'playSound'}, function(data) { });
				} else {
					setTimeout(function() { 
					location.reload();
					}, 1000);
				}
			} else {
				history.go(-1);
			}
		}
	});
}
