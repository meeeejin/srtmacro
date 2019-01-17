function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}

var dsturl1 = "https://etk.srail.co.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";

if (document.URL.substring(0, dsturl1.length) == dsturl1) {

	$(document).ready(function() {
		injectJs(chrome.extension.getURL('inject.js'));

		var coachSelected = JSON.parse(sessionStorage.getItem('coachSelected'));
		var firstSelected = JSON.parse(sessionStorage.getItem('firstSelected'));
		if (coachSelected == null) coachSelected = [];
		if (firstSelected == null) firstSelected = [];
		console.log("coach:" + coachSelected);
		console.log("first:" + firstSelected);

		var searchButtonDiv = $('fieldset').first().find('input').last().parent();
		if (sessionStorage.getItem('macro') == "true") {
			searchButtonDiv.append('<a href="#" onclick="macrostop();" style="margin-left:5px;"><img src="' + chrome.extension.getURL('images/btn_stop.png') + '"></a>');
		} else {
			searchButtonDiv.append('<a href="#" onclick="macro();" style="margin-left:5px;"><img src="' + chrome.extension.getURL('images/btn_start.png') + '"></a>');
		}

		searchButtonDiv.css({
			display: 'flex',
			'align-items': 'center',
			'justify-content': 'center'
		});

		$("<style>")
    .prop("type", "text/css")
    .html("\
    .search-form form .button input, .search-form form .button a img{\
    	vertical-align: middle;\
    }")
    .appendTo("body");

		// Inserts the macro button into the table.
		if ($("#result-form").length != 0) {
			var rows = $('#result-form table tr');
			for (i = 1; i < rows.length; i++) {
				var columns = $(rows[i]).children('td');
				var first = $(columns[5]);
				var coach = $(columns[6]);
				if (coach.children().length > 0) {
					coach.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="coachMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', coachSelected.indexOf(i+"") > -1);
					coach.append(checkbox);
				}
				if (first.children().length > 0) {
					first.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="firstMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', firstSelected.indexOf(i+"") > -1);
					first.append(checkbox);
				}
			}
		}

		if (sessionStorage.getItem('macro') == "true") {
			// Restores user preferences
			$("#psgInfoPerPrnb1").val(sessionStorage.getItem('psgInfoPerPrnb1'));
			$("#psgInfoPerPrnb5").val(sessionStorage.getItem('psgInfoPerPrnb5'));
			$("#psgInfoPerPrnb4").val(sessionStorage.getItem('psgInfoPerPrnb4'));
			$("#psgInfoPerPrnb2").val(sessionStorage.getItem('psgInfoPerPrnb2'));
			$("#psgInfoPerPrnb3").val(sessionStorage.getItem('psgInfoPerPrnb3'));
			$("#locSeatAttCd1").val(sessionStorage.getItem('locSeatAttCd1'));
			$("#rqSeatAttCd1").val(sessionStorage.getItem('rqSeatAttCd1'));

			if ($("#result-form").length != 0) {
				var rows = $('#result-form table tr');

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
					sessionStorage.removeItem('macro');
					sessionStorage.removeItem('coachSelected');
					sessionStorage.removeItem('firstSelected');
					sessionStorage.removeItem('psgInfoPerPrnb1');
					sessionStorage.removeItem('psgInfoPerPrnb5');
					sessionStorage.removeItem('psgInfoPerPrnb4');
					sessionStorage.removeItem('psgInfoPerPrnb2');
					sessionStorage.removeItem('psgInfoPerPrnb3');
					sessionStorage.removeItem('locSeatAttCd1');
					sessionStorage.removeItem('rqSeatAttCd1');
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
