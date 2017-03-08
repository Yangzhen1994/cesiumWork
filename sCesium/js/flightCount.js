/**
 * Created by fc on 2017/2/9.
 */
/**15秒获取一次航班数据**/
var sqls = "";
//getScopeFlights动态获取航班雷达数据接口
//left	Double	不为空	根据地图的移动与缩放传范围参数
//bottom	Double	不为空
//right	Double	不为空
//top	Double	不为空
//status	Boolean	不为空	服务监控 RDP状态 数据源监控数据
//filterTypes	String	不为空	过滤类型：0无过滤，1高度过滤，2SSR过滤，3航空公司过滤，4机场周边过滤，5起降机场周边过滤，6国内备降过滤，7国外备降过滤, 8机场周边如果是多个用"-"隔开。如"1-5-8"
var filterTypes = "0";
//filterTexts	String	不为空	过滤条件  1高度"1000,2000;3000,4000" 5起降机场"ZBAA,ABBB" 6or7国内国际机场"ZBAA" 8机场周边"ZBAA,100;ZPPP,150"如果是多个用"-"隔开。如"1000,2000;3000,4000-ZBAA,ABBB-ZBAA,100;ZPPP,150"
var filterTexts = "0";
//byFilter	boolean	不为空	是否受过滤影响 (如果是过滤功能，传true)
var byFilter = false;
//传参示例：
//getScopeFlights?left=572422.25&bottom=4400251.11&right=1572249.83&top=4885063.79&status=false&filterTypes=8&filterTexts=ZBAA,100;ZBAA,500&byFilter=false
//监控状态
var rdpstatus = [];
//雷达数据
var dataFlightsArr = [];
////查询航班状态;
var updateFlightState = "complete"; //complete//pause

var sqlUrl = map23DConfig.serverUrl + map23DConfig.serverName + "web/";
function jsonData() {
    sqls = sqlUrl + "getScopeFlights?";

    sqls += "left=" + map23DConfig.scopes[0];
    sqls += "&bottom=" + map23DConfig.scopes[1];
    sqls += "&right=" + map23DConfig.scopes[2];
    sqls += "&top=" + map23DConfig.scopes[3];
    sqls += "&status=" + true;
    sqls += "&filterTypes=" + filterTypes;
    sqls += "&filterTexts=" + filterTexts;
    sqls += "&byFilter=" + byFilter;
    //console.log(sqls);
}
//航班查询 FlightCount
function FlightCount() {
    viewer.entities.removeAll();
    //return false;
  /*  if(updateFlightState != "complete") {
        return false;
    }*/
    jsonData();
    $.ajax({
        type: 'GET',
        url: sqls,
        data: null,
        dataType: 'json',
        contentType: 'application/json',
        success: function(result) {
//            console.info(JSON.stringify(result));
//            if(result == null || result[0] == null) {
//               return false;
//          }
            dataFlightsArr = result[0];
            console.log(dataFlightsArr);
            //(dataFlightsArr[0][0].longitude+','+dataFlightsArr[0][0].latitude);
            var countarr = result[1].split(",");
            //$('#flightcountdiv').text(languagelabel.flightcountdivlabel[0] + "：" + parseInt(parseInt(countarr[0]) + parseInt(countarr[1])) + "  " + languagelabel.flightcountdivlabel[1] + ":" + countarr[0] + " " + languagelabel.flightcountdivlabel[2] + ":" + countarr[1]);
            rdpstatus = [];
            var rows = [];
            var rdp = [];
            var obj = {
                "zoneName": "RDP",
                "state": "N",
                "amount": "-",
                "time": new Date()
            }
            if(result[3] == 0) {
                obj.state = "E";
            }
            rdp.push(obj);
            $.each(result[4], function(i, item) {
                item.state = "N";
                if(item.amount == 0) {
                    item.state = "E";
                }
                item.time = new Date();
                rows.push(item);
            });
            rdpstatus = {
                "rdp": rdp,
                "rows": rows
            };
            forStep = 0;
            step = modStep;
            count = 0;
            flightarr = [];
            updateFeatureLayer();
        },
        complete: function() {
        },
        error: function(data) {
            console.info("error:" + data.responseText);
        }
    });

   /* $.getJSON(sqlUrl + "getServerTime", function(result) {
        $('#currenttimediv').text($.totime.UnixToDate(result, "hh24:mi"))
    });*/
}