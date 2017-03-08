/**修改原modStep=64 提升过滤速度**/

var modStep = 16;
var step = 0;
var forStep = 0;
var pauseTime;
// 二次雷达 ;
var CROSSCIRCLE = 'img/img/flight.png';
var CROSSCIRCLEFILTER = '../img/img/flightfilter.png';
var CROSSCIRCLE_2x = '../img/img/flight_2x.png';
//民用飞机
var PLANEC = '../img/img/flight1.png';
var PLANEC_2x = '../img/img/flight1_2x.png';
//军用飞机
var PLANEM = '../img/img/flight3.png';
var PLANEM_2x = '../img/img/flight3_2x.png';
//民用圆点
var POINTC = '../img/img/flight2.png';
var POINTC_2x = '../img/img/flight2_2x.png';
//军用圆点
var POINTM = '../img/img/flight4.png';
var POINTM_2x = '../img/img/flight4_2x.png';
var flighticon = 'CROSSCIRCLE';
//是否显示标牌
var isTagShow = false;
/**
 *@property isEstFlag
 *@property 外推过滤isEstFlag
 *@property true:外推过滤；false：取消过滤
 **/
var isEstFlag = false;
var count = 0;
/**
 * updateFeatureLayer(0);
 */
var tempArr = []
function updateFeatureLayer() {

	if(step > 255) {
		forStep = 0;
		step = 0;
		clearTimeout(pauseTime);
		changetag();
		trackdistanceupdate();
		updateFlightState = "complete";
		return;
	} else {
		if(updateFlightState != "pause") {
			updateFlightState = "update"; //complete//pause
			step += modStep;
			pauseTime = setTimeout(updateFeatureLayer, 50);
		}
	}
	for(var i = forStep; i < step; i++) {
		var datalength = dataFlightsArr[i].length;
		if(dataFlightsArr[i].length < hashFlightsArr[i].length) {
			datalength = hashFlightsArr[i].length;
		}
		for(var j = 0; j < datalength; j++) {
			if(dataFlightsArr[i][j] == undefined) {
				if(hashFlightsArr[i][j] != undefined) {
					count++
					//console.log(count);
					//删除数据
					//					map2DViewer.marker({
					//						action: 'remove',
					//						guid: hashFlightsArr[i][j].guid
					//					});
					delmarker(hashFlightsArr[i][j]);
					hashFlightsArr[i][j] = undefined;
				} //continue;
			} else {
				if(hashFlightsArr[i][j] == undefined) {
					if(isEstFlag) {
						if(dataFlightsArr[i][j].estFlag) {
							hashFlightsArr[i][j] = markervalue(dataFlightsArr[i][j], null, "add");
						}
					} else {
						hashFlightsArr[i][j] = markervalue(dataFlightsArr[i][j], null, "add");
					}

				} else if(hashFlightsArr[i][j] != undefined) {
					if(isEstFlag) {
						if(dataFlightsArr[i][j].estFlag) {
							if(dataFlightsArr[i][j].tid == hashFlightsArr[i][j].tid) {
								hashFlightsArr[i][j] = markervalue(dataFlightsArr[i][j], hashFlightsArr[i][j].guid, "update");
							} else {
								delmarker(hashFlightsArr[i][j]);
								hashFlightsArr[i][j] = markervalue(dataFlightsArr[i][j], null, "add");
							}
						} else {
							//删除数据
							//							map2DViewer.marker({
							//								action: 'remove',
							//								groupId: flightGroupLayerGuid,
							//								guid: hashFlightsArr[i][j].guid
							//							});
							delmarker(hashFlightsArr[i][j]);
							hashFlightsArr[i][j] = undefined;
						}
					} else {
						if(dataFlightsArr[i][j].tid == hashFlightsArr[i][j].tid) {
							hashFlightsArr[i][j] = markervalue(dataFlightsArr[i][j], hashFlightsArr[i][j].guid, "update");
						} else {
							delmarker(hashFlightsArr[i][j]);
							hashFlightsArr[i][j] = markervalue(dataFlightsArr[i][j], null, "add");
						}
					}
				}
			}
		}

	}
	forStep = step;
}

//删除标牌
function delmarker(flight) {
	for(var m = 0; m < hashFlightsArr.length; m++) {
		for(var j = 0; j < hashFlightsArr[m].length; j++) {
			if(hashFlightsArr[m][j] != undefined) {
				if(hashFlightsArr[m][j].tid == flight.tid) {
					//删除数据
					map2DViewer.marker({
						action: 'remove',
						groupId: flightGroupLayerGuid,
						guid: hashFlightsArr[m][j].guid
					});
					hashFlightsArr[m][j] = undefined;
				}
			}
		}
	}
}

var locationflight;
/**
 * @param 新增标牌
 */
function markervalue(flight, updateguid, actions) {
	if(flight == null || flight == undefined) {
		return [];
	}
	flight.checked = false;
	flight.filter = 0;
	locationflight = {};
	locationflight.tid = flight.tid;
	locationflight.callsign = "";
	locationflight.label = flight.mode3ACode;
	locationflight.data = flight.mode3ACode;
	locationflight.mode3ACode = flight.mode3ACode;
	locationflight.latitude = flight.latitude;
	locationflight.longitude = flight.longitude;

	var marker;
	//航班/SSR
	var titlevalues = flight.mode3ACode;
	var labelvalues = flight.mode3ACode;
	if(flight.callsign) {
		labelvalues = flight.callsign;
		locationflight.label = flight.mode3ACode + "(" + flight.callsign + ")";
		locationflight.data = flight.mode3ACode + "(" + flight.callsign + ")";
		locationflight.mode3ACode = flight.mode3ACode;
		locationflight.callsign = flight.callsign;
	}

	flightarr.push(locationflight);
	labelvalues += "<br/>";
	//高度	
	if(flight.altitude) {
		labelvalues += flight.altitude + " ";
	}
	switch(flight.modeVert) {
		case "LevelFlight":
			labelvalues += "<b> → </b>";
			break;
		case "Climb":
			labelvalues += "<b> ↑ </b>";
			break;
		case "Descent":
			labelvalues += "<b> ↓ </b>";
			break;
		default:
			labelvalues += "<b> → </b>";
	}

	if(flight.climbing) {
		labelvalues += " " + flight.climbing + " ";
	}
	if(flight.velocity) {
		labelvalues += flight.velocity + " ";
	}
	labelvalues += "<br/>";
	//起飞机场
	if(flight.departure) {
		labelvalues += flight.departure + "  ";
	}
	//实际起飞时间
	if(flight.atd) {
		labelvalues += flight.atd.substr(11, 2) + flight.atd.substr(14, 2) + "  ";
	}
	//落地机场
	if(flight.arrival) {
		labelvalues += flight.arrival + " ";
	}

	//实际落地时间
	if(flight.ata) {
		labelvalues += flight.ata + "  ";
	} else {
		if(flight.estArrTime != null) {
			labelvalues += $.totime.UnixToDate(flight.estArrTime, "hh24mi") + "  ";
		} else if(flight.eta) {
			labelvalues += flight.eta.substr(11, 2) + flight.eta.substr(14, 2); + "  ";
		}
	}
	labelvalues += "<br/>";
	if(flight.type) {
		labelvalues += flight.type + "  ";
	}

	if(flight.wakeTurbulance) {
		labelvalues += flight.wakeTurbulance;
	}

	labelvalues += "<br/>"
	if(flight.warning) {
		labelvalues += flight.warning;
	}

	labelvalues += "<br/>"

	if(flight.emergency) {
		labelvalues += flight.emergency;
	}
	//console.log(labelvalues);
	var re = new RegExp("<br/>", "g");
	var bk1 = new RegExp("<b>", "g");
	var bk2 = new RegExp("</b>", "g");
	titlevalues = labelvalues.replace(re, "\n");
	titlevalues = titlevalues.replace(bk1, "");
	titlevalues = titlevalues.replace(bk2, "");
	//console.log(titlevalues)
	if(actions == "add") {
		var flightmarker = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(flight.longitude, flight.latitude),
            billboard: {
                //image: CROSSCIRCLE
				image:flighticonhandle(flight.flightNature, flight.filter),
            },
            label: {
                text: titlevalues,
                fillColor:Cesium.Color.BLACK,
                font: '16px sans-serif',
				//backgroundColor:Cesium.Color.HOTPINK,
                showBackground: false,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                pixelOffset: new Cesium.Cartesian2(5, 0.0),
                //pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5),
                translucencyByDistance : new Cesium.NearFarScalar(300000, 1.0,800000, 0.0)
            }
		})

	} else if(actions == "update") {
		map2DViewer.marker({
			action: "update",
			groupId: flightGroupLayerGuid,
			guid: updateguid,
			geojson: {
				"type": "Feature",
				"properties": {
					//					title: titlevalues,
					iconUrl: flighticonhandle(flight.flightNature, flight.filter),
					iconSize: [14, 16],
					iconAnchor: [7, 8],
					popupAnchor: [0, -8],
					height: flight.altitude,
					iconRorate: flight.heading
				},
				"geometry": {
					"type": "Point",
					"coordinates": [flight.longitude, flight.latitude]
				}
			}
		});
		marker = map2DViewer.markers[updateguid];
		flight.guid = updateguid;
	}
	tempArr.push(marker)
	if(marker && marker.bindContextMenu != undefined) {
		marker.bindContextMenu({
			contextmenu: true,
			contextmenuInheritItems: false,
			contextmenuItems: flightcontextmenuItems
		})
		marker.contextmenu = true;
		marker.contextmenuInheritItems = false;
	}
	if(marker == null) {
		return null;
	}
	marker.flight = {};
	marker.flight = flight;
	marker.on('click', function(e) {
		if(isTrackMeasureDistance) {
			trackMeasureDistance(e);
		}
	});
	marker.bindPlabel('<div><b>' + labelvalues + '</b></div>', {
		//鼠标滑过显示标牌需要设置noHide = false;
		noHide: false
	});

	if(isHideTag) {
		marker.setPlabelNoHide(false);
		marker.hidePlabel();
	} else {
		if(map2DViewer.map.getZoom() >= map23DConfig.tagZoom) {
			marker.setPlabelNoHide(true);
			marker.showPlabel();
		} else {
			marker.setPlabelNoHide(false);
			marker.hidePlabel();
		}
	}

	$.each(flightfilter, function(index, value) {
		if(value.tid == flight.tid) {
			marker.flight.filter = 1;
			flight.filter = 1;
			filterhighlighthandle(marker);
		}
	});
	return flight;
}

/**
 * 显示2D标牌
 */
function ShowTag() {
	isTagShow = true;
	isHideTag = false;
	if(map2DViewer.map.getZoom() < map23DConfig.tagZoom) {
		map2DViewer.map.setZoom(map23DConfig.tagZoom);
	}
	//	_(map2DViewer.markers).forEach(function(value, key) {
	//		value.setPlabelNoHide(true);
	//		value.showPlabel();
	//	});
}

/**标识显示隐藏**/
function mapzoomtagshowhide() {
	if(isTagShow == false && isHideTag == false && map2DViewer.map.getZoom() > 7) {
		if(mapCurrentLevel == (map2DViewer.map.getZoom() >= map23DConfig.tagZoom)) {
			return;
		}
		console.log("mapCurrentLevel:" + mapCurrentLevel);
		mapCurrentLevel = (map2DViewer.map.getZoom() >= map23DConfig.tagZoom);

		_(map2DViewer.markers).forEach(function(value, key) {
			if(map2DViewer.map.getZoom() >= map23DConfig.tagZoom) {
				value.setPlabelNoHide(true);
				value.showPlabel();
			} else {
				value.setPlabelNoHide(false);
				value.hidePlabel();
			}
		});
	}
}

/**
 * 隐藏2D标记标牌
 * filter==1不隐藏标牌
 */
function HideTag() {
	isTagShow = false;
	isHideTag = true;
	_(map2DViewer.markers).forEach(function(value, key) {
		if(value.flight && value.flight.filter && value.flight.filter > 0) {
			return;
		}
		value.setPlabelNoHide(false);
		value.hidePlabel();
	});
}

/*标牌，
		第一行：lblDisplayFlightNumber：callsign / mode3Acode
		第二行： lblAltitude: alitude,modeVert,climbing,velocity
		第三行： lblArrival: depature,atd,arrival,estArrTime
		第四行： lblType: type,wakeTurbulance
		第五行：lblWarning:warning
		第六行：lblEmergency:emergency
		*/
function tagValue(value) {
	if(value != true) {
		return;
	}

	console.log(value.callsign + value.mode3ACode);
	//航班/SSR
	var labelvalues = value.mode3ACode;
	if(value.callsign) {
		labelvalues = value.callsign;
	}
	labelvalues += "<br/>";
	//高度	
	if(value.alitude) {
		labelvalues += value.alitude + " ";
	}

	return labelvalues;
}

//显示航班icon
function flighticonhandle(flightNature, isfilter) {

	if(flighticon == 'CROSSCIRCLE') {
		//		if(isfilter > 0) {
		//			return CROSSCIRCLEFILTER;
		//		}
		return CROSSCIRCLE;
	} else {
		if(viewer.getZoom() >= map23DConfig.tagZoom) {
			if(flightNature == "C") {
				return PLANEC;
			} else {
				return PLANEM;
			}
		} else {
			if(flightNature == "C") {
				return POINTC;
			} else {
				return POINTM;
			}
		}
	}
}
//显示航班icon
function flighticonhandle_2x(flightNature) {
	if(flighticon == 'CROSSCIRCLE') {
		return CROSSCIRCLE_2x;
	} else {
		if(map2DViewer.map.getZoom() >= map23DConfig.tagZoom) {
			if(flightNature == "C") {
				return PLANEC_2x;
			} else {
				return PLANEM_2x;
			}
		} else {
			if(flightNature == "C") {
				return POINTC_2x;
			} else {
				return POINTM_2x;
			}
		}
	}
}

function changetag() {
	$.each(hashFlightsArr, function(k, item) {
		$.each(item, function(h, val) {
			if(val && val.guid) {
				map2DViewer.marker({
					action: "update",
					groupId: flightGroupLayerGuid,
					guid: val.guid,
					geojson: {
						"type": "Feature",
						"properties": {
							title: val.callsign + val.mode3ACode,
							iconUrl: flighticonhandle(val.flightNature, val.filter),
							iconSize: [14, 16],
							iconAnchor: [7, 8],
							popupAnchor: [0, -8],
							height: val.altitude,
							iconRorate: val.heading
						}
					}
				});
			}
		});
	});
}

//过滤标牌
function filterhandle(filter) {
	if(filter.tid) {
		console.log(JSON.stringify(filter));
		_(map2DViewer.markers).forEach(function(value, key) {
			if(value.flight) {
				if(value.flight.callsign) {
					if(value.flight.callsign == filter.callsign && value.flight.mode3ACode == filter.mode3ACode) {
						value.flight.filter = 1;
						flightfilter.push(value.flight);
						filterhighlighthandle(value);
						return false;
					}
				}

				if(value.flight.mode3ACode == filter.mode3ACode) {
					value.flight.filter = 1;
					flightfilter.push(value.flight);
					filterhighlighthandle(value);
				}
			}
		});
	}
}
//过滤航班数据
var flightfilter = [];
//高亮显示过滤标牌
function filterhighlighthandle(value) {
	if(value.flight) {
		value.setPlabelNoHide(true);
		value.showPlabel();
		value.plabel.setColor('#FF1493');
	}
	/*	map2DViewer.marker({
			action: 'update',
			geojson: {
				"properties": {
					iconUrl: flighticonhandle(value.flight.flightNature, value.flight.filter)
				}
			},
			guid: value.guid
		});*/
}

//删除过滤标牌
function delfilterhandle(filter) {
	$.each(flightfilter, function(index, delvalue) {
		if(delvalue==undefined){
			return false
		}
		if(delvalue.mode3ACode == filter.mode3ACode) {
			flightfilter.splice($.inArray(delvalue, flightfilter), 1);
		}
	});
	tempArr.forEach(function(value, key) {
		if(value.flight.mode3ACode == filter.mode3ACode) {
			value.flight.filter = 0;
			delfilterhighlighthandle(value);
            value.hidePlabel();
		}
	});
}
//删除高亮显示过滤标牌
function delfilterhighlighthandle(value) {
	//value.setPlabelNoHide(false);
	//value.hidePlabel();
	value.plabel.setColor('#000000');
	/*	map2DViewer.marker({
			action: 'update',
			geojson: {
				"properties": {
					iconUrl: flighticonhandle(value.flight.flightNature, value.flight.filter)
				}
			},
			guid: value.guid
		});*/
}
var distanceflight = [];
var ppoint = [];
var tpoint = [];

function pointMeasureDistance(e) {
	if(ppoint.length == 0) {
		ppoint.push(e.latlng);
	} else {
		if(ppoint[0].lat != e.latlng.lat && ppoint[0].lng != e.latlng.lng) {
			ppoint.push(e.latlng);
			//测距回调函数
			rangingkey = "Ranging.mapranging";
			//给定指定latitude:23.418167292000,longitude:101.345200668000
			map2DViewer.distanceTool.measurePoints([ppoint[0].lat, ppoint[0].lng], [ppoint[1].lat, ppoint[1].lng]);
			ppoint = [];
		}

	}
}
var trackDistanceFinished = false;

function trackMeasureDistance(e) {
	if(e.target.flight) {
		if(tpoint.length == 0) {
			tpoint.push(e.target.flight);
		} else {
			if(tpoint[0].tid != e.target.flight.tid) {
				tpoint.push(e.target.flight);
				//测距回调函数
				rangingkey = "Ranging.trackranging";
				var distanceobj = {};
				distanceobj.point = tpoint;
				distanceflight.push(distanceobj);
				tpoint = [];
				map2DViewer.distanceTool.measurePoints([distanceobj.point[0].latitude, distanceobj.point[0].longitude], [distanceobj.point[1].latitude, distanceobj.point[1].longitude], distanceobj.point);
			}
		}
	}
}

function trackdistanceupdate() {
	if(distanceflight.length > 0) {
		$.each(distanceflight, function(d, data) {
			$.each(flightarr, function(f, obj) {
				if(obj.tid == data.point[0].tid) {
					data.point[0].latitude = obj.latitude;
					data.point[0].longitude = obj.longitude;
					distanceflight[d] = data;
					rangingkey = "Ranging.trackranging";
					map2DViewer.distanceTool.updatelC(data.lC, [obj.latitude, obj.longitude], [data.point[1].latitude, data.point[1].longitude], data.point);
				}
				if(obj.tid == data.point[1].tid) {
					data.point[1].latitude = obj.latitude;
					data.point[1].longitude = obj.longitude;
					distanceflight[d] = data;
					rangingkey = "Ranging.trackranging";
					map2DViewer.distanceTool.updatelC(data.lC, [data.point[0].latitude, data.point[0].longitude], [obj.latitude, obj.longitude], data.point);
				}
			});
		});
	}
}