// At this point I can interact with the DOM as normal,
// but can't use variables or functions defined in the bootstrap script or the page itself.
// Everything here (e.g. console statements) end up the visitor's main console

console.log("extension.js is here!");

//TODO: Figure out why the bootstrap code doesn't work for gating the extension...
if ((window.location.href.toLowerCase().indexOf("frenzyboard.net") > -1) &&
    ((window.location.href.toLowerCase().indexOf("?action=browse") > -1) ||
	 (window.location.href.toLowerCase().indexOf("?action") === -1)))
{
	window.addEventListener('load', function()
	{
		console.log("extension.js onload listener");
		getTopicClassRows();
	});
}

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