//You'll likely need to import extension_settings, getContext, and loadExtensionSettings from extensions.js
import { doExtrasFetch, extension_settings, getApiUrl, getContext, modules } from "../../../extensions.js";
import { eventSource, event_types, saveSettingsDebounced } from "../../../../script.js";
import { EdgeTtsProvider } from '../../tts/edge.js'
import { ElevenLabsTtsProvider } from '../../tts/elevenlabs.js'
import { SileroTtsProvider } from '../../tts/silerotts.js'
import { CoquiTtsProvider } from '../../tts/coqui.js'
import { SystemTtsProvider } from '../../tts/system.js'
import { NovelTtsProvider } from '../../tts/novel.js'
import { registerSlashCommand } from '../../../slash-commands.js'

// Keep track of where your extension is located, name should match repo name
const extensionName = "joi-extension";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

const dictionary = await import('./dictionary.json', {
	assert: {
		type: 'json'
	}
});

let ttsProviders = {
	ElevenLabs: ElevenLabsTtsProvider,
	Silero: SileroTtsProvider,
	System: SystemTtsProvider,
	Coqui: CoquiTtsProvider,
	Edge: EdgeTtsProvider,
	Novel: NovelTtsProvider,
}


const defaultSettings = {
	initial_delay: 30,
	loop_duration: 30,
	leave_loop: 25,
	encourage_loop: 1,
	leave_joi: 25,
	cum: 50,
	magic_words1: "jerk, masturbate, stroke",
	magic_words2: "instruction",
	magic_words3: "",
	magic_words4: "not allowed, forbidden",

};

const provider = new ttsProviders[extension_settings.tts.currentProvider]

var count = 99;
var delay = 100;
var speed = 2;
var jerkIndex = 3;

var peviousGripText;
var peviousContinueText;
var peviousEncourageText;
var peviousRewardText;
var peviousKeepText;
var peviousChangeText;
var peviousSlowerText;
var peviousFasterText;
var peviousCountdownText;

let storedvalue = false;

registerSlashCommand("joi", commandFunction, ["Jerk off instruction"], "Your character is giving you detailed instructions /help", true, true);

function commandFunction(args) {
	count = 0;
	sleep(1000).then(() => { doThings() });
}

eventSource.on(event_types.MESSAGE_RECEIVED, handleIncomingMessage);

function handleIncomingMessage(data) {

	const context = getContext();
	const chat = context.chat;
	const message = structuredClone(chat[chat.length - 1])

	var start1 = false;

	extension_settings.joi.magic_words1.split(",").forEach(function(item) {
		if (message.mes.toLowerCase().includes(item.toLowerCase().trim()))
			start1=true;
	});

	var start2 = false;

	extension_settings.joi.magic_words2.split(",").forEach(function(item) {
		if (message.mes.toLowerCase().includes(item.toLowerCase().trim()))
			start2=true;
	});

	var start3 = false;

	extension_settings.joi.magic_words3.split(",").forEach(function(item) {
		if (message.mes.toLowerCase().includes(item.toLowerCase().trim()))
			start3=true;
	});

    var start4 = true;

    extension_settings.joi.magic_words4.split(",").forEach(function(item) {
		if (message.mes.toLowerCase().includes(item.toLowerCase().trim()))
			start4 = false;
	});

	if(start1==true&&start2==true&&start3==true&&start4==true)
	{
		count = 0;
		startFun();
	}

}

async function startFun() {
	sleep(extension_settings.joi.initial_delay * 1000).then(() => { doThings() });

}

eventSource.on(event_types.MESSAGE_SENT, handleOutgoingMessage);

function handleOutgoingMessage(data) {
	if (count != 99) {
		count = -1;
		doThings();
	}

}

// Loads the extension settings if they exist, otherwise initializes them to the defaults.
async function loadSettings() {
	//Create the settings if they don't exist
	extension_settings['joi'] = extension_settings['joi'] || {};
	if (Object.keys(extension_settings['joi']).length === 0) {
		Object.assign(extension_settings['joi'], defaultSettings);
	}

	$('#joi_initial_delay').val(extension_settings.joi.initial_delay).trigger('input');
	$('#joi_loop_duration').val(extension_settings.joi.loop_duration).trigger('input');
	$('#joi_leave_loop').val(extension_settings.joi.leave_loop).trigger('input');
	$('#joi_encourage_loop').val(extension_settings.joi.encourage_loop).trigger('input');
	$('#joi_leave_joi').val(extension_settings.joi.leave_joi).trigger('input');
	$('#joi_cum').val(extension_settings.joi.cum).trigger('input');
	$('#joi_magic_words1').val(extension_settings.joi.magic_words1).trigger('input');
	$('#joi_magic_words2').val(extension_settings.joi.magic_words2).trigger('input');
	$('#joi_magic_words3').val(extension_settings.joi.magic_words3).trigger('input');
	$('#joi_magic_words4').val(extension_settings.joi.magic_words4).trigger('input');

}

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function randomText(text) {
	return text[random(0, text.length)];
}

// This function is called when the button is clicked
function onButtonClick() {
	// You can do whatever you want here
	// Let's make a popup appear with the checked setting

	count = 0;
	doThings();

	//	toastr.info(
	//		"hallo",
	//		"A popup appeared because you clicked the button!"
	//	);
}

function doWait() {
	talkingAnimation(false)
	if (count == 99)
		return;
	sleep(delay).then(() => { doThings() });
}

function getJerkIndex() {
	var index = random(0, (dictionary.default.jerkText.length - (dictionary.default.jerkText.length % 3)) / 3) * 3;
	return index;
}

async function doThings() {

	if (count == 99)
		return;

	var text;

	count = count + 1;

	if (count == 0) {
		text = randomText(dictionary.default.denialText);
		count = 99;
	}
	else if (count == 1) {
		text = randomText(dictionary.default.openingText);
		delay = extension_settings.joi.initial_delay * 1000;
	}
	else if (count < 3) {
		jerkIndex = getJerkIndex();
		do {
			text = randomText(dictionary.default.gripText);
		} while (dictionary.default.gripText.length > 1 && peviousGripText == text)

		peviousGripText = text;
		delay = 100;

	}
	else if (count < 13) {
		if (speed < 2) {
			delay = 100;
			text = "";
			if (count == 3) {
				for (let i = 0; i < 10; i++) {
					if (i % 2 == 0) {
						text = text + dictionary.default.jerkText[jerkIndex] + " ";
						if (speed > 0)
							text = text + dictionary.default.jerkText[jerkIndex + 1] + " ";
					}
					else {
						text = text + dictionary.default.jerkText[jerkIndex + 2] + " ";
						text = text + " ";
					}

				}
			}

		}
		else {
			delay = speed * 100;
			if (count % 2 == 1) {
				text = dictionary.default.jerkText[jerkIndex] + " ";
			}
			else {
				text = dictionary.default.jerkText[jerkIndex + 1] + " " + dictionary.default.jerkText[jerkIndex + 2];
			}
		}
	}
	else if (count < 14) {

		do {
			text = randomText(dictionary.default.continueText);
		} while (dictionary.default.continueText.length > 1 && peviousContinueText == text)

		peviousContinueText = text;
	}



	else if (count < 24) {
		text = null;
		delay = random(50, 100) * extension_settings.joi.loop_duration;
		var rnd = random(0, 10);
		if (rnd < extension_settings.joi.encourage_loop) {

			do {
				text = randomText(dictionary.default.encourageText);
			} while (dictionary.default.encourageText.length > 1 && peviousEncourageText == text)

			peviousEncourageText = text;

		}

	}
	else if (count < 25) {


		const leaveRnd = random(0, 100);

		text = null;

		if (leaveRnd > extension_settings.joi.leave_loop) {
			var rnd = random(0, 5);
			if (rnd == 0) {

				do {
					text = randomText(dictionary.default.fasterText);
				} while (dictionary.default.fasterText.length > 1 && peviousFasterText == text)

				peviousFasterText = text;


				if (speed > 0) {
					speed = speed - 1;
				}
				else
					text = null;
				count = 2;
			}
			else if (rnd == 1) {

				if (speed < 2) {

					do {
						text = randomText(dictionary.default.slowerText);
					} while (dictionary.default.slowerText.length > 1 && peviousSlowerText == text)

					peviousSlowerText = text;

					speed = speed + 1
				}
				else
					text = null;

				count = 2;
			}
			else if (rnd == 2) {

				do {
					text = randomText(dictionary.default.changeText);
				} while (dictionary.default.changeText.length > 1 && peviousChangeText == text)

				peviousChangeText = text;

				count = 1;
			}
			else if (rnd == 3) {

				do {
					text = randomText(dictionary.default.keepText);
				} while (dictionary.default.keepText.length > 1 && peviousKeepText == text)

				peviousKeepText = text;

				count = 2;
			}
			else if (rnd == 4) {

				do {
					text = randomText(dictionary.default.fasterText);
				} while (dictionary.default.fasterText.length > 1 && peviousFasterText == text)

				peviousFasterText = text;


				if (speed > 0) {
					speed = speed - 1;
				}
				else
					text = null;

				count = 2;
			}
		}



	}
	else if (count < 26) {
		if (random(0, 101) > extension_settings.joi.leave_joi) {
			do {
				text = randomText(dictionary.default.rewardText);
			} while (dictionary.default.rewardText.length > 1 && peviousRewardText == text)

			peviousRewardText = text;


			delay = 30000;
			count = 1;
		}
		else {

			do {
				text = randomText(dictionary.default.countdownText);
			} while (dictionary.default.countdownText.length > 1 && peviousCountdownText == text)

			peviousCountdownText = text;
			delay = 1000;
		}
	}
	else if (count < 36) {
		text = dictionary.default.numberText[36 - count];
		delay = 1000 + random(0, 1000);

		if (count > 29 && count < 34) {
			var denial = random(1, 101);
			if (denial > extension_settings.joi.cum) {
				if (random(1, 101) < 26) {
					text = randomText(dictionary.default.denialText);
					count = 99;
				}
			}
		}
		if (count === 34 && extension_settings.joi.cum === 0) {
			text = randomText(dictionary.default.denialText);
			count = 99;
		}

	}
	else if (count < 37) {
		text = randomText(dictionary.default.cumText);
	}
	else {
		count = 99;
		throw "stop execution";
	}


	if (text && text != null) {

		text = text.replace("{{user}}", getContext().name1);
		text = text.replace("{{USER}}", getContext().name1);
		text = text.replace("{{char}}", getContext().name2);
		text = text.replace("{{CHAR}}", getContext().name2);

		const response = await provider.generateTts(text, provider.settings.voiceMap[getContext().name2]);

		const audioData = await response.blob();
		if (!audioData.type in ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/webm']) {
			throw `TTS received HTTP response with invalid data format. Expecting audio/mpeg, got ${audioData.type}`
		}
		playAudioData(audioData);
	}
	else
		doWait();
}



function talkingAnimation(switchValue) {
	if (!modules.includes('talkinghead')) {
		console.debug("Talking Animation module not loaded");
		return;
	}

	const apiUrl = getApiUrl();
	const animationType = switchValue ? "start" : "stop";

	if (switchValue !== storedvalue) {
		try {
			console.log(animationType + " Talking Animation");
			doExtrasFetch(`${apiUrl}/api/talkinghead/${animationType}_talking`);
			storedvalue = switchValue; // Update the storedvalue to the current switchValue
		} catch (error) {
			// Handle the error here or simply ignore it to prevent logging
		}
	}
}

let audioElement = new Audio()
audioElement.autoplay = true


async function playAudioData(audioBlob) {

	const reader = new FileReader()
	reader.onload = function(e) {
		const srcUrl = e.target.result
		audioElement.src = srcUrl
	}
	reader.readAsDataURL(audioBlob)
	audioElement.addEventListener('ended', doWait)
	audioElement.addEventListener('canplay', () => {
		talkingAnimation(true);
		console.debug(`Starting TTS playback`)
		audioElement.play()
	})
}

function onLoopDurationInput() {
	extension_settings.joi.loop_duration = Number($('#joi_loop_duration').val());
	$('#joi_loop_duration_value').text(extension_settings.joi.loop_duration.toFixed(1));
	saveSettingsDebounced();
}

function onLeaveLoopInput() {
	extension_settings.joi.leave_loop = Number($('#joi_leave_loop').val());
	$('#joi_leave_loop_value').text(extension_settings.joi.leave_loop.toFixed(1));
	saveSettingsDebounced();
}

function onLeaveJoiInput() {
	extension_settings.joi.leave_joi = Number($('#joi_leave_joi').val());
	$('#joi_leave_joi_value').text(extension_settings.joi.leave_joi.toFixed(1));
	saveSettingsDebounced();
}

function onCumInput() {
	extension_settings.joi.cum = Number($('#joi_cum').val());
	$('#joi_cum_value').text(extension_settings.joi.cum.toFixed(1));
	saveSettingsDebounced();
}

function onEncouragePerLoopInput() {
	extension_settings.joi.encourage_loop = Number($('#joi_encourage_loop').val());
	$('#joi_encourage_loop_value').text(extension_settings.joi.encourage_loop.toFixed(1));
	saveSettingsDebounced();
}

function onInitialDelayInput() {
	extension_settings.joi.initial_delay = Number($('#joi_initial_delay').val());
	$('#joi_initial_delay_value').text(extension_settings.joi.initial_delay.toFixed(1));
	saveSettingsDebounced();
}

function onMagicWords1Input() {
	extension_settings.joi.magic_words1 = $('#joi_magic_words1').val().trim();
	let element = document.getElementById("joi_magic_words1_label");
	if (extension_settings.joi.magic_words1.length > 0)
		element.style.opacity = 1.00;
	else
		element.style.opacity = 0.25;
	saveSettingsDebounced();
}

function onMagicWords2Input() {
	extension_settings.joi.magic_words2 = $('#joi_magic_words2').val().trim();
	let element = document.getElementById("joi_magic_words2_label");
	if (extension_settings.joi.magic_words2.length > 0)
		element.style.opacity = 1.00;
	else
		element.style.opacity = 0.25;
	saveSettingsDebounced();
}

function onMagicWords3Input() {
	extension_settings.joi.magic_words3 = $('#joi_magic_words3').val().trim();
	let element = document.getElementById("joi_magic_words3_label");
	if (extension_settings.joi.magic_words3.length > 0)
		element.style.opacity = 1.00;
	else
		element.style.opacity = 0.25;
	saveSettingsDebounced();
}

function onMagicWords4Input() {
	extension_settings.joi.magic_words4 = $('#joi_magic_words4').val().trim();
	let element = document.getElementById("joi_magic_words4_label");
	if (extension_settings.joi.magic_words4.length > 0)
		element.style.opacity = 1.00;
	else
		element.style.opacity = 0.25;
	saveSettingsDebounced();
}


// This function is called when the extension is loaded
jQuery(async () => {

	provider.loadSettings(extension_settings.tts[extension_settings.tts.currentProvider]);

	// This is an example of loading HTML from a file
	const settingsHtml = await $.get(`${extensionFolderPath}/joi.html`);

	// Append settingsHtml to extensions_settings
	// extension_settings and extensions_settings2 are the left and right columns of the settings menu
	// Left should be extensions that deal with system functions and right should be visual/UI related
	$("#extensions_settings").append(settingsHtml);

	// These are examples of listening for events
	$("#joi_button").on("click", onButtonClick);

	$('#joi_initial_delay').on('input', onInitialDelayInput);
	$('#joi_loop_duration').on('input', onLoopDurationInput);
	$('#joi_leave_loop').on('input', onLeaveLoopInput);
	$('#joi_encourage_loop').on('input', onEncouragePerLoopInput);
	$('#joi_leave_joi').on('input', onLeaveJoiInput);
	$('#joi_cum').on('input', onCumInput);
	$('#joi_magic_words1').on('input', onMagicWords1Input);
	$('#joi_magic_words2').on('input', onMagicWords2Input);
	$('#joi_magic_words3').on('input', onMagicWords3Input);
	$('#joi_magic_words4').on('input', onMagicWords4Input);

	// Load settings when starting things up (if you have any)
	loadSettings();
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
