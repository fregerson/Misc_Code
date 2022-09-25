// ==UserScript==
// @name         Psithurism.user.js
// @namespace    http://tampermonkey.net/
// @version      0.1.2.3
// @description  Hotkeys for the N-Day Potato Alliance, based on NSBreeze++
// @author       Somyrion (Edited by Fregerson)
// @match        https://www.nationstates.net/*
// @downloadURL    https://github.com/fregerson/Misc_Code/raw/main/Psithurism.user.js
// @updateURL    https://github.com/fregerson/Misc_Code/raw/main/Psithurism.user.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// ==/UserScript==

/* Keybinds:
* = repeated several times for full action

[N] Reload the page to get a [n]ew page (mostly kept so R/Ders aren't confused)
[<] Go back
[P*] Convert production to nukes or shields based on specialty
[W] Convert production to nukes (nuclear weapons)
[S] Convert production to shields
[Spacebar*] Your nukes page (×1), your faction page (×2)
[M*] View and shield incoming nukes
[K*] Perform targetting procedure (from other faction page, choose nation and target it)
[L*] Launch nukes that are targetted
[F] Page listing all factions
[J] Join faction

*/

/* global $ */
$.fn.random = function() {
  return this.eq(Math.floor(Math.random() * this.length));
}

const facID = "95"; // update when N-Day starts!

(function() {
	var shifted = false;
	var controlled = false;
	var alternated = false;
	$(document).keydown(function(f) {
		shifted = f.shiftKey;
        controlled = f.ctrlKey;
		alternated = f.altKey;
		// Stops the spacebar from scrolling
		if (f.keyCode == 32 && f.target == document.body) {
			f.preventDefault();
			f.stopPropagation();
		}
	});
	// This is the main keymapping function of the script
	$(document).keyup(function(e) {
		// Psithurism will not activate while you are using the Shift, Ctrl, ot Alt keys
        if (shifted || controlled || alternated){
			return;
        }
		else {
			if ($("input,textarea").is(":focus")){
			// Psithurism will not activate if you are typing in a text field
				return;
			}
			// Go Back (<)
			else if (e.keyCode == 188) {
				window.history.back();
			}
			// Refresh (N)
			else if (e.keyCode == 78) {
				window.location.reload();
			}
			// Page listing all factions (F)
			else if (e.keyCode == 70) {
				window.location.href = "https://www.nationstates.net/page=factions";
			}
			// Convert Production (P, P)
			else if (e.keyCode == 80) {
				if (window.location.href.indexOf("view=production") > -1 && window.location.href.indexOf("page=nukes") > -1 && (window.location.href.indexOf("nation="+$('body').attr('data-nname')) > -1 || window.location.href.indexOf("/nation=") <= -1)) {
					if ($('span.fancylike').text().indexOf("Military") > -1) {
						$('.button[name="convertproduction"][value^="nukes"]').first().trigger('click');
					}
					else if ($('span.fancylike').text().indexOf("Strategic") > -1) {
						$('.button[name="convertproduction"][value^="shield"]').first().trigger('click');
					}
					else if ($('span.fancylike').text().indexOf("Economic") > -1) {
						$('.button[name="convertproduction"][value^="shield"]').first().trigger('click');
					}
					else if ($('span.fancylike').text().indexOf("Intel") > -1) {
						$('.button[name="convertproduction"][value^="nukes"]').first().trigger('click');
					}
				}
				else {
					window.location.href = "https://www.nationstates.net/page=nukes/view=production";
				}
			}
			// Convert Production to Nukes (W, W)
			else if (e.keyCode == 87) {
				if (window.location.href.indexOf("view=production") > -1 && window.location.href.indexOf("page=nukes") > -1 && (window.location.href.indexOf("nation="+$('body').attr('data-nname')) > -1 || window.location.href.indexOf("/nation=") <= -1)) {
					$('.button[name="convertproduction"][value^="nukes"]').first().trigger('click');
				}
				else {
					window.location.href = "https://www.nationstates.net/page=nukes/view=production";
				}
			}
			// Convert Production to Shields (S, S)
			else if (e.keyCode == 83) {
				if (window.location.href.indexOf("view=production") > -1 && window.location.href.indexOf("page=nukes") > -1 && (window.location.href.indexOf("nation="+$('body').attr('data-nname')) > -1 || window.location.href.indexOf("/nation=") <= -1)) {
					$('.button[name="convertproduction"][value^="shield"]').first().trigger('click');
				}
				else {
					window.location.href = "https://www.nationstates.net/page=nukes/view=production";
				}
			}
			// Your Nukes, Your Faction (Spacebar, Spacebar)
			else if (e.keyCode == 32 && e.target == document.body) {
				if (window.location.href.indexOf("page=nukes") > -1 && window.location.href.indexOf("/view=") <= -1 && (window.location.href.indexOf("nation="+$('body').attr('data-nname')) > -1 || window.location.href.indexOf("/nation=") <= -1)) {
					window.location.href = "https://www.nationstates.net/page=faction/fid="+facID;
				}
				else {
					window.location.href = "https://www.nationstates.net/page=nukes";
				}
			}
			// View and Shield Incoming (M, M)
			else if (e.keyCode == 77) {
				// if we're on the incoming nukes page
				if (window.location.href.indexOf("fid="+facID+"/view=incoming") > -1) {
					// shield a random incoming set in the list
					if ($('.button[name="defend"]').length > 0) {
						$('.button[name="defend"]').random().click();
						// any additional code if there's a captcha/additional choice?
					} else if ($('a[href*="view=incoming?start="]').length > 0) {
						$('a[href*="view=incoming?start="]')[0].click();
					}
					// reload the page to check for new incoming nukes
					else {
						window.location.href = "https://www.nationstates.net/page=faction/fid="+facID+"/view=incoming";
					}
				}
				// if we're not on the incoming nukes page
				else {
					window.location.href = "https://www.nationstates.net/page=faction/fid="+facID+"/view=incoming";
				}
			}
			// Perform Targetting (K, K, K, K)
			else if (e.keyCode == 75) {
                		var regexFindNumber = /[\d,]+/g;
				// if not on the faction's list of nations already, go to it
				if (window.location.href.indexOf("page=faction") > -1 && window.location.href.indexOf("view=nations") <= -1) {
					// $('a.nukestat-nations')[0].click(); // Traditional way of just going to the first nation page
                   			// Below method aims to randomise the nation page for huge factions
                    			var nationCount = parseInt($('.nukestat-nations').text().match(regexFindNumber)[0].replace(",",""));
                    			window.location.href = "https://nationstates.net" + $('.fancylike a').attr('href') + "/view=nations?start=" + Math.floor(Math.random()*nationCount);
				}
				// if on the faction's list of nations, choose a random non-fully-irradiated nation
				else if (window.location.href.indexOf("page=faction") > -1 && window.location.href.indexOf("view=nations") > -1) {
					if ($('ol li:not(:has(.nukedestroyedicon)) a').length) {
						var linkToTarget = $('ol li:not(:has(.nukedestroyedicon)) a').random()[0].href;
						var regexFindNation = /(?<=nation=).*(?=\/page=nukes)/g;
						var nationToTarget = linkToTarget.match(regexFindNation)[0];
						window.location.href = "https://www.nationstates.net/nation="+nationToTarget+"/page=nukes?target="+nationToTarget;
					} else {
						window.location.href = "https://nationstates.net" + $('.fancylike a').attr('href') + "/view=nations?start=" + Math.floor(Math.random()*nationCount);
					}
				}
				// if on the targetting page, calculate the appropriate number of nukes to target
				else if (window.location.href.indexOf("?target=") > -1 && window.location.href.indexOf("page=nukes") > -1) {
					var alreadyTargeted = parseInt($('.nukestat-targeted').text().match(regexFindNumber)[0].replace(",",""));
					var alreadyRads = parseInt($('.nukestat-radiation').text().match(regexFindNumber)[0].replace(",",""));
					var alreadyIncoming = parseInt($('.nukestat-incoming').text().match(regexFindNumber)[0].replace(",",""));
					var already = alreadyTargeted + alreadyRads + alreadyIncoming;
					// if not enough are already targeted/rad/incoming at the nation, fire more, otherwise go back to the faction list
					if (already < 100 && $('.button[name="nukes"]').length > 0) {
						var toTarget = 100 - already;
                        var nukeCount = parseInt($('.nukestat-nukes').text().match(regexFindNumber)[1].replace(",",""));
                        var currentWindow = window.location.href;
                        if (toTarget <= nukeCount) { // If you have more nukes than required
                           window.location.href = currentWindow + "&nukes=" + toTarget;
                        }
                        else { // If you have less nuke than required
                            window.location.href = currentWindow + "&nukes=" + nukeCount;
                        }
					}
					else {
						window.location.href = "https://nationstates.net" + $('.factionname').attr('href') + "/view=nations";
					}
				}
			}
			// Launch Nukes (L, L, L)
			else if (e.keyCode == 76) {
				if (window.location.href.indexOf("view=targets") > -1 && window.location.href.indexOf("page=nukes") > -1 && (window.location.href.indexOf("nation="+$('body').attr('data-nname')) > -1 || window.location.href.indexOf("/nation=") <= -1)) {
					// launch the first set in the list
					if ($('.button[name="launch"]').length > 0) {
						$('.button[name="launch"]')[0].click();
						// any additional code if there's a captcha/additional choice?
					}
					// reload the page to check for new incoming nukes
					else {
						window.location.reload();
					}
				}
				else {
					window.location.href = "https://www.nationstates.net/page=nukes/view=targets";
				}
			}
			// Go to Puppet Login (\)
			else if (e.keyCode == 220) {
				window.location.href = "https://www.nationstates.net/page=blank/puppetlist";
			}
			// Join faction (J)
			else if (e.keyCode == 74) {
				window.location.href = "https://www.nationstates.net/page=faction/fid=" + facID + "?consider_join_faction=1&join_faction=1";
			}
		} //End of Else keylist
	}); // End of Keyup Function(e)
})(); //End of Main function
