// At this point I can interact with the DOM as normal,
// but can't use variables or functions defined in the bootstrap script or the page itself.
// Everything here (e.g. console statements) end up the visitor's main console

console.log("extension.js is here!");

//TODO: Figure out why the bootstrap code doesn't work for gating the extension...
if (window.location.href.toLowerCase().indexOf("frenzyboard.net") > -1)
{	
    if ((window.location.href.toLowerCase().indexOf("?action=browse") > -1) ||
	    (window.location.href.toLowerCase().indexOf("?action") === -1))
	{
		window.addEventListener('load', function()
		{
			console.log("extension.js load browse page listener");
			getTopicClassRows();
		});
	}
	
	if (window.location.href.toLowerCase().indexOf("?action=read") > -1)
	{
		window.addEventListener('load', function()
		{
			console.log("extension.js load read page listener");
			getYoutubeTags();
		});
	}
}

function getYoutubeTags()
{
	var ytTag = "[yt]";
	var endTag = "[/yt]";
	// If the board classes made some FUCKING SENSE this search
	// would be 100x simpler. But hey, take what you can get.
	var replies = document.querySelectorAll("td.window");
	console.log(replies.length);
	for (var i = 0; i < replies.length; i++)
	{
		var outerHTML = replies[i].outerHTML;
		var startTagIndex = 0;
		startTagIndex = outerHTML.indexOf(ytTag);
		var newHTML = outerHTML; // God it's so gross
		while (startTagIndex > -1)
		{
			var endTagIndex = outerHTML.indexOf(endTag, startTagIndex + ytTag.length);
			if (endTagIndex != -1)
			{
				// Grab video ID
				var fullYt = outerHTML.substring(startTagIndex, endTagIndex + endTag.length);
				// Send just the inner portion of the tags
				var ytId = getYoutubeVideoId(fullYt.substring(ytTag.length, fullYt.length - endTag.length));
				// Replace YT tag contents with YT iframe code
				var ytIframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/';
				ytIframe += ytId + '" frameborder="0" allowfullscreen></iframe>';
				// I really wish I could replace in-place but Javascript strings are immutable. FML.
				newHTML = newHTML.replace(fullYt, ytIframe);
				startTagIndex = endTagIndex + endTag.length;
			}
			else
			{
				break;
			}
			startTagIndex = outerHTML.indexOf(ytTag, startTagIndex + 1);
		}
		replies[i].outerHTML = newHTML; // Eugh
	}
}

function getYoutubeVideoId(ytStr)
{
	var slashIndex = ytStr.indexOf("/");
	var lastSlashIndex = -1;
	while (slashIndex > -1)
	{
		lastSlashIndex = slashIndex;
		slashIndex = ytStr.indexOf("/", slashIndex + 1);
	}
	if (lastSlashIndex === -1)
	{
		// If there isn't a slash at the end of the body, assume it's all an ID
		return ytStr;
	}
	else
	{
		var watchStr = "watch?v=";
		var watchIndex = ytStr.indexOf(watchStr);
		// This is likely a short-form URL (i.e. https://youtu.be/<ID>)
		if (watchIndex === -1)
		{
			return ytStr.substring(lastSlashIndex + 1);
		}
		else
		{
			// Long-form URL (i.e. https://www.youtube.com/watch?v=<ID>&<morestuff>
			var a = watchIndex + watchStr.length;
			return ytStr.substring(a, ytStr.indexOf("&", a + 1));
		}
	}
}
// This would have been used for fixing the window.status bullshit, but alas
// and alack, the old mouseover events can't be removed because they're
// anonymous functions. HOW FUCKING GREAT!
function getTopicClassRows()
{
	var targetString = "window.status";
	var returnTrueString = "; return true;";
	// Get all TD tags with topic class
	var rows = document.querySelectorAll("td.topic");
	console.log(rows.length);
	for (var i = 0; i < rows.length; i++) 
	{
		var outerHTML = rows[i].outerHTML.toLowerCase();
		// Get status text
		var statusPos = outerHTML.indexOf(targetString);
		var statusText = '';
		if (statusPos > -1)
		{
			var startPos = statusPos + targetString.length + 2;
			var endPos = outerHTML.indexOf('"', startPos);
			if (endPos == -1) 
			{ 
				continue;
			}
			statusText = outerHTML.substring(startPos, endPos - returnTrueString.length - 1);
		}
		if (statusText != '')
		{
			var spanElement = document.createElement('span');
			// add visible=false attribute
			var attr = document.createAttribute('visible');
			attr.value = false;
			spanElement.setAttributeNode(attr);
			// add onmouseover attribute
			attr = document.createAttribute('onmouseover');
			attr.value = 'function() { log(\'' + statusText + '\'); }';
			spanElement.setAttributeNode(attr);
			spanElement.className = "bubble-item";
			rows[i].appendChild(spanElement);
		}
	}
}

function log(str)
{
	console.log(str);
}

function extractPreviewText(node, indexOfStatusStr)
{
	
}