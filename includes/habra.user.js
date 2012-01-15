// ==UserScript==
// @include http://habrahabr.ru/*
// @include http://*.habrahabr.ru/*
// @include https://*.habrahabr.ru/*
// ==/UserScript==

(function() {
	var loaded = 0, // scripts loaded
	needed = 2, // scripts to load
	checkReady = function() {
		this.onload = null;
		loaded++;
		if (loaded !== needed) {
			return;
		}

		window
				.$(function() {

					document.onkeydown = function(e) {

						e = e || window.event;
						if (e.ctrlKey && e.keyCode == 13) {
							var authors = window.$('.author');
							if (authors.length == 1) {
								var author_name = window.$('.author a').text();
								var author_url = window.$('.author a').attr(
										'href');

								window.$('#dialog').remove();

								window
										.$('body')
										.append('<div id="dialog" title="В статье найдена ошибка"><form><table><tr><td>Кому: </td><td><input style="width:300px;" id="habracorrector_recipient" name="recipient" value="'
														+ author_name
														+ '"/></td></tr><tr><td>Тема сообщения:</td><td><input style="width:300px;" id="habracorrector_title" name="theme" value="Ошибка в статье '
														+ window.history.current
														+ '"/></td></tr><tr><td>Текст сообщения:</td><td> <textarea id="habracorrector_text" cols="40" rows="7" name="text">Здравствуйте, '
														+ author_name
														+ '. В вашей статье: '
														+ window.history.current
														+ ' допущена ошибка в этих строках:\n'
														+ window.getSelection()
																.toString()
														+ '\nЯ предлагаю такой правильный вариант:</textarea></td></tr></table></form></div>');

								window.$('#dialog')
										.dialog(
												{
													minWidth : 450,
													buttons : {
														"Отправить" : function() {
															var title = window
																	.$('#habracorrector_title')
																	.attr('value');
															var text = window
																	.$('#habracorrector_text')
																	.html();
															var recipient = window
																	.$('#habracorrector_recipient')
																	.attr('value');
															window.$
																	.post("http://habrahabr.ru/ajax/messages/add/",
																			{
																				'message[recipients]' : recipient,
																				'message[title]' : title,
																				'message[text]' : text
																			},
																			function(
																					data) {
																				window.$
																						.jGrowl(
																								'Сообщение об ошибке отправлено',
																								{});

																			});

															window
																	.$(this)
																	.dialog("close");
														}
													}
												});
							}
						}
						return true;
					}

				});
	}

	var headID = document.getElementsByTagName("head")[0];
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.id = 'myjQuery';
	newScript.onload = checkReady;
	newScript.src = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js';
	headID.appendChild(newScript);

	newScript = document.createElement('link');
	newScript.rel = 'stylesheet';
	newScript.type = 'text/css';
	newScript.onload = checkReady;
	newScript.href = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/themes/base/jquery-ui.css';
	headID.appendChild(newScript);

})();
