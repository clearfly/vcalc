var g711Payload = 160;
var g729Payload = 20;
var ipOverhead = 20;
var udpOverhead = 8;
var rtpOverhead = 12;
var ethOverhead = 18;
var pppOverhead = 7;
var atmOverheadG711 = 73;
var atmOverheadG729 = 46;
var pps = 50;
var signalingPercent = 5;
var commonHeaders = [ "col_ip", "col_udp", "col_rtp" ];
var ethHeaders = [ "col_eth", "col_eth_crc" ];
var pppHeaders = [ "col_ppp", "col_ppp_fcs" ];
var g711Header = "col_codec_g711u";
var g729Header = "col_codec_g729";

function populateCcsSelector() {
	for (var i = 2; i < 51; i++) {
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.text = i;
		document.getElementById('ccs').appendChild(option);
	}
    for (var i = 100; i < 1001; i += 100) {
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.text = i;
		document.getElementById('ccs').appendChild(option);
	}
}

function updateBwCalcs() {
    var codec = document.querySelector('input[type=radio][name=codec]:checked').value;
    var wan = document.querySelector('input[type=radio][name=wan]:checked').value;
	var ccs = document.getElementById('ccs').value;
	var intervalPayload = calculatePayload(codec);
	var wanOverhead = calculateWan(wan,codec);
	var ipOverhead = 20;
	var udpOverhead = 8;
	var rtpOverhead = 12;
	var packetSize = intervalPayload + ipOverhead + udpOverhead + rtpOverhead + wanOverhead;
	var callMedia = kbps(packetSize);
	var callSignaling = callMedia * 0.05;

	// Per Interval
	document.getElementById('intervalPayload').innerHTML = intervalPayload + " Bytes";
	document.getElementById('intervalIp').innerHTML = ipOverhead + " Bytes";
	document.getElementById('intervalUdp').innerHTML = udpOverhead + " Bytes";
	document.getElementById('intervalRtp').innerHTML = rtpOverhead + " Bytes";
	document.getElementById('intervalWan').innerHTML = wanOverhead + " Bytes";
	document.getElementById('intervalSize').innerHTML = packetSize + " Bytes";

	// Per Call
	document.getElementById('callPps').innerHTML = pps + " pps";
	document.getElementById('callBwCodec').innerHTML = kbps(intervalPayload) + " kbps";
	document.getElementById('callIpOverhead').innerHTML = kbps(ipOverhead) + " kbps";
	document.getElementById('callUdpOverhead').innerHTML = kbps(udpOverhead) + " kbps";
	document.getElementById('callRtpOverhead').innerHTML = kbps(rtpOverhead) + " kbps";
	document.getElementById('callWanOverhead').innerHTML = kbps(wanOverhead) + " kbps";
	document.getElementById('callMedia').innerHTML = callMedia + " kbps";
	document.getElementById('callSignaling').innerHTML = (callSignaling).toFixed(2) + " kbps";
	document.getElementById('callTotal').innerHTML = (callMedia + callSignaling).toFixed(2) + " kbps";

	// Total
	document.getElementById('totalPps').innerHTML = pps * ccs + " pps";
	document.getElementById('totalBwCodec').innerHTML = (kbps(intervalPayload) * ccs).toFixed(2) + " kbps";
	document.getElementById('totalIpOverhead').innerHTML = (kbps(ipOverhead) * ccs).toFixed(2) + " kbps";
	document.getElementById('totalUdpOverhead').innerHTML = (kbps(udpOverhead) * ccs).toFixed(2) + " kbps";
	document.getElementById('totalRtpOverhead').innerHTML = (kbps(rtpOverhead) * ccs).toFixed(2) + " kbps";
	document.getElementById('totalWanOverhead').innerHTML = (kbps(wanOverhead) * ccs).toFixed(2) + " kbps";
	document.getElementById('totalMedia').innerHTML = (callMedia * ccs).toFixed(2) + " kbps";
	document.getElementById('totalSignaling').innerHTML = (callSignaling * ccs).toFixed(2) + " kbps";
	document.getElementById('totalTotal').innerHTML = (callSignaling * ccs + callMedia * ccs).toFixed(2) + " kbps";

	updateHeaders(wan,codec);
}

function updateHeaders(wan,codec) {
	hideHeaders();
	if (wan == "adsl" && codec == "g711u") {
		document.getElementById('adsl_g711u').style.display = "table";
	}
	else if (wan == "adsl" && codec == "g729"){
		document.getElementById('adsl_g729').style.display = "table";
	}
	else {
		var visibleHeaders = commonHeaders;
		if (wan == "eth") {
			visibleHeaders = visibleHeaders.concat(ethHeaders);
		}
		else if (wan == "t1ppp") {
			visibleHeaders = visibleHeaders.concat(pppHeaders);
		}
		if (codec == "g711u") {
			visibleHeaders.push(g711Header);
		}
		else if (codec == "g729") {
			visibleHeaders.push(g729Header);
		}
		for (i = 0; i < visibleHeaders.length; i++) {
			document.getElementById(visibleHeaders[i]).style.display = "table-cell";
		}
	}
}

function hideHeaders() {
	document.getElementById('adsl_g711u').style.display = "none";
	document.getElementById('adsl_g729').style.display = "none";
	var headers = commonHeaders.concat(ethHeaders).concat(pppHeaders);
	headers.push(g729Header);
	headers.push(g711Header);
	for (i = 0; i < headers.length; i++) {
		document.getElementById(headers[i]).style.display = "none";
	}
}

function bandwidth(codec) {
	if (codec == "g711u") {
		return "64";
	}
	else if (codec == "g729") {
		return "8";
	}
	else {
		return null;
	}
}

function kbps(intervalBytes) {
	return (intervalBytes * pps * 8) / 1000;
}

function calculatePayload(codec) {
	if (codec == "g711u") {
		return g711Payload;
	}
	else if (codec == "g729") {
		return g729Payload;
	}
	else {
		return null;
	}
}

function calculateWan(wan,codec) {
	if (wan == "eth") {
		return ethOverhead;
	}
	else if (wan == "t1ppp") {
		return pppOverhead;
	}
	else if (wan == "adsl") {
		if (codec == "g711u") {
			return atmOverheadG711;
		}
		else if (codec == "g729") {
			return atmOverheadG729;
		}
	}
}