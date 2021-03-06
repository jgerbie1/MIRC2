function setPrefs(theEvent) {
	var source = getSource(getEvent(theEvent));
	var row = findRowFor(source);
	var username = row.getElementsByTagName("TD")[1].firstChild.value;
	username = trim(username);

	if (username != "") {

		var req = new AJAX();
		req.GET("/prefs/xml/user/"+username, req.timeStamp(), null);
		if (req.success()) {
			var xml = req.responseXML();
			var root = xml ? xml.firstChild : null;

			var name = root.getAttribute("name");
			var affiliation = root.getAttribute("affiliation");
			var contact = root.getAttribute("contact");

			if (!name) name = "";
			if (!affiliation) affiliation = "";
			if (!contact) contact = "";

			//alert("responseText = "+req.responseText()+"\nname = "+name+"\naffiliation = "+affiliation+"\ncontact = "+contact);

			var id = "prefsID";
			var pop = document.getElementById(id);
			if (pop) pop.parentNode.removeChild(pop);

			var w = 400;
			var h = 330;
			var closebox = "/icons/closebox.gif";

			var div = getPrefsDiv(username, name, affiliation, contact);
			div.row = row;

			//popupDivId, w, h, title, closeboxFile, heading, div, okHandler, cancelHandler, hide
			showDialog(id, w, h, "User Preferences", closebox, null, div, updatePrefs, hidePopups);
		}
	}
}

function findRowFor(node) {
	while ( node && (node.tagName != 'TR') ) node = node.parentNode;
	return node;
}

function updatePrefs() {
	var div = document.getElementById("prefsDiv");
	var username = div.username;
	var nameInput = document.getElementById("namePref");
	var namePref = nameInput.value;
	var affiliationInput = document.getElementById("affiliationPref");
	var affiliationPref = affiliationInput.value;
	var contactInput = document.getElementById("contactPref");
	var contactPref = contactInput.value;
	div.namePref = namePref;

	var req = new AJAX();
	var form = "username="+encodeURIComponent(username);
	form += "&namePref="+encodeURIComponent(namePref);
	form += "&affiliationPref="+encodeURIComponent(affiliationPref);
	form += "&contactPref="+encodeURIComponent(contactPref);
	req.POST("/prefs/admin", form+"&"+req.timeStamp(), updateNameTD);
}

function updateNameTD(req) {
	if (req.success()) {
		var div = document.getElementById("prefsDiv");
		var row = div.row;
		var td = row.getElementsByTagName("TD")[0];
		while (td.firstChild) td.removeChild(td.firstChild);
		td.appendChild(document.createTextNode(div.namePref));
		hidePopups();
	}
}

function getPrefsDiv(username, name, affiliation, contact) {
	var div = document.createElement("DIV");
	div.id = "prefsDiv";
	div.username = username;
	div.className = "content";
	var h1 = document.createElement("H1");
	h1.appendChild(document.createTextNode("Set User Preferences"));
	h1.style.fontSize = "18pt";
	div.appendChild(h1);
	var h2 = document.createElement("H2");
	h2.appendChild(document.createTextNode(username));
	h2.style.fontSize = "12pt";
	div.appendChild(h2);
	var center = document.createElement("CENTER");
	var p = document.createElement("P");

	var table = document.createElement("TABLE");
	var tbody = document.createElement("TBODY");

	tbody.appendChild(makeRow("Name:", name, "namePref", username));
	tbody.appendChild(makeRow("Affiliation:", affiliation, "affiliationPref"));
	tbody.appendChild(makeRow("Contact:", contact, "contactPref"));

	table.appendChild(tbody);
	p.appendChild(table);
	center.appendChild(p)
	div.appendChild(center);
	return div
}

function makeRow(label, text, id, username) {
	var row = document.createElement("TR");
	var td = document.createElement("TD");
	td.appendChild(document.createTextNode(label));
	td.className = "tdl";
	row.appendChild(td);
	td = document.createElement("TD");
	var input = document.createElement("INPUT");
	input.type = "text";
	input.value = text;
	input.id = id;
	td.appendChild(input);
	row.appendChild(td);
	return row;
}

function downloadCSV() {
	window.open("/users?format=csv", "_self");
}

function uploadCSV() {
	var id = "uploadCSVID";
	var pop = document.getElementById(id);
	if (pop) pop.parentNode.removeChild(pop);

	var w = 400;
	var h = 220;
	var closebox = "/icons/closebox.gif";

	var div = getUploadCSVDiv();

	//popupDivId, w, h, title, closeboxFile, heading, div, okHandler, cancelHandler, hide
	showDialog(id, w, h, "Upload CSV Users File", closebox, null, div, submitCSV, hidePopups);
}

function getUploadCSVDiv() {
	var div = document.createElement("DIV");
	div.className = "content";
	var h1 = document.createElement("H1");
	h1.appendChild(document.createTextNode("Select CSV File"));
	h1.style.fontSize = "18pt";
	div.appendChild(h1);
	div.appendChild(document.createElement("BR"));
	var center = document.createElement("CENTER");
	var p = document.createElement("P");

	var form = document.createElement("FORM");
	form.id = "CSVFormID";
	form.method = "post";
	form.target = "_self";
	form.encoding = "multipart/form-data";
	form.acceptCharset = "UTF-8";
	form.action = "/users";

	var input = document.createElement("INPUT");
	input.name = "filecontent";
	input.id = "selectedFile";
	input.type = "file";
	input.style.width = 320;

	form.appendChild(input);

	p.appendChild(form);

	center.appendChild(p)
	div.appendChild(center);
	return div
}

function submitCSV() {
	var form = document.getElementById("CSVFormID");
	form.submit();
}

function clearUser(theEvent) {
	var source = getSource(getEvent(theEvent));
	var row = findRowFor(source);
	var tds = row.getElementsByTagName("TD");
	for (var i=0; i<tds.length; i++) {
		var td = tds[i];
		var inputs = td.getElementsByTagName("INPUT");
		for (var k=0; k<inputs.length; k++) {
			var input = inputs[k];
			if (input.type == "text") input.value = "";
			else if (input.type == "checkbox") input.checked = false;
		}
	}
	var pn = tds[0];
	while (pn.firstChild) pn.removeChild(pn.firstChild);
}
