var dsturl1 = 'https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000'

window.showModalDialog = window.showModalDialog || function(url, arg, opt) {
	window.open(url, arg, opt);
};

function macrostart() {
	coachSelected = [].map.call(document.querySelectorAll('.coachMacro:checked'), function (select) {
		return select.value;
	});
	firstSelected = [].map.call(document.querySelectorAll('.firstMacro:checked'), function (select) {
		return select.value;
	});
	waitingSelected = [].map.call(document.querySelectorAll('.waitingMacro:checked'), function (select) {
		return select.value;
	});

	if (coachSelected.length == 0 && firstSelected.length == 0 && waitingSelected.length == 0) {
		alert("매크로를 실행하기 위해서는 예매하기 위한 열차 1개 이상을 선택하십시오.");
	} else {
		alert("매크로를 시작합니다.\n트럼펫 소리가 나면 바로 결제를 해주셔야 합니다.");

		sessionStorage.setItem('macro', true);
		sessionStorage.setItem('coachSelected', JSON.stringify(coachSelected));
		sessionStorage.setItem('firstSelected', JSON.stringify(firstSelected));
		sessionStorage.setItem('waitingSelected', JSON.stringify(waitingSelected));

		// Stores user preferences.
		sessionStorage.setItem('psgInfoPerPrnb1', document.getElementsByName('psgInfoPerPrnb1')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb5', document.getElementsByName('psgInfoPerPrnb5')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb4', document.getElementsByName('psgInfoPerPrnb4')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb2', document.getElementsByName('psgInfoPerPrnb2')[0].value);
		sessionStorage.setItem('psgInfoPerPrnb3', document.getElementsByName('psgInfoPerPrnb3')[0].value);
		sessionStorage.setItem('locSeatAttCd1', document.getElementsByName('locSeatAttCd1')[0].value);
		sessionStorage.setItem('rqSeatAttCd1', document.getElementsByName('rqSeatAttCd1')[0].value);

		location.reload();
	}
}

function macrostop() {
	alert("매크로를 중지합니다.\n조건을 변경하여 재조회하신 후 다시 시작하실 수 있습니다.");

	sessionStorage.removeItem('macro');
	sessionStorage.removeItem('coachSelected');
	sessionStorage.removeItem('firstSelected');
	sessionStorage.removeItem('waitingSelected');
	sessionStorage.removeItem('psgInfoPerPrnb1');
	sessionStorage.removeItem('psgInfoPerPrnb5');
	sessionStorage.removeItem('psgInfoPerPrnb4');
	sessionStorage.removeItem('psgInfoPerPrnb2');
	sessionStorage.removeItem('psgInfoPerPrnb3');
	sessionStorage.removeItem('locSeatAttCd1');
	sessionStorage.removeItem('rqSeatAttCd1');

	location.reload();
}

if (document.URL.substring(0, dsturl1.length) == dsturl1) {

	$(document).ready(function() {

		var coachSelected = JSON.parse(sessionStorage.getItem('coachSelected'));
		var firstSelected = JSON.parse(sessionStorage.getItem('firstSelected'));
		var waitingSelected = JSON.parse(sessionStorage.getItem('waitingSelected'));

		if (coachSelected == null) coachSelected = [];
		if (firstSelected == null) firstSelected = [];
		if (waitingSelected == null) waitingSelected = [];

		if (sessionStorage.getItem('macro') == "true") {
			$("div#search_top_tag.tal_c.mgt30").append('<a href="#" id="btnstop" style="margin-left:5px;display:inline-block;height:100%;vertical-align:middle;"><img src="' + chrome.runtime.getURL('images/btn_stop.png') + '"></a>');			
		} else {
			$("div#search_top_tag.tal_c.mgt30").append('<a href="#" id="btnstart" style="margin-left:5px;display:inline-block;height:100%;vertical-align:middle;"><img src="' + chrome.runtime.getURL('images/btn_start.png') + '"></a>');	
		}	
		
		var btnstop = document.getElementById("btnstop");
		var btnstart = document.getElementById("btnstart");

		if (btnstop) {
			btnstop.addEventListener("click", macrostop, false);
		}
		if (btnstart) {
			btnstart.addEventListener("click", macrostart, false);
		}

		$("<style>")
    .prop("type", "text/css")
    .html("\
    .search-form form .button input, .search-form form .button a img{\
    	vertical-align: middle;\
    }")
    .appendTo("body");

		// Inserts the macro button into the table.
		if ($("#search-list").length != 0) {
			var rows = $('#search-list table tr');
			for (i = 1; i < rows.length; i++) {
				var columns = $(rows[i]).children('td');
				var first = $(columns[5]);
				var coach = $(columns[6]);
				var waiting = $(columns[7]);
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
				if (waiting.children().length > 0) {
					waiting.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="waitingMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', waitingSelected.indexOf(i+"") > -1);
					waiting.append(checkbox);
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

			if ($("#search-list").length != 0) {
				var rows = $('#search-list table tr');

				var succeed = false;
				for (i = 1; i < rows.length; i++) {
					var columns = $(rows[i]).children('td');

					var first = $(columns[5]);
					var coach = $(columns[6]);
					var waiting = $(columns[7]);

					if (coachSelected.indexOf(i+"") > -1) {
						var coachSpecials = coach.children("a");
						if (coachSpecials.length != 0) {
							for (j = 0; j < coachSpecials.length; j++) {
								name = $(coachSpecials[j]).attr('class');
								if (name == 'btn_small btn_burgundy_dark val_m wx90') {
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
								if (name == 'btn_small btn_burgundy_dark val_m wx90') {
									$(firstSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}

					if (waitingSelected.indexOf(i+"") > -1) {
						var waitingSpecials = waiting.children("a");
						if (waitingSpecials.length != 0) {
							for (j = 0; j < waitingSpecials.length; j++) {
								name = $(waitingSpecials[j]).attr('class');
								if (name == 'btn_small btn_burgundy_dark val_m wx90') {
									$(waitingSpecials[0])[0].click();
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
					sessionStorage.removeItem('waitingSelected');
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
