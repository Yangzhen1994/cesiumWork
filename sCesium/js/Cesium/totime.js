(function($) {
	$.extend({
		totime: {
			/**
			 * 当前时间戳
			 * @return <int>        unix时间戳(毫秒)  
			 */
			CurTime: function() {
				return Date.parse(new Date());
			},
			/**
			 * 当前时间戳
			 * @return <boo>        false/true  
			 */
			DifferTime: function(string) {
				var f = string.split(' ', 2);
				var d = (f[0] ? f[0] : '').split('-', 3);
				var t = (f[1] ? f[1] : '').split(':', 3);
				var times = (new Date(
					parseInt(d[0], 10) || null,
					(parseInt(d[1], 10) || 1) - 1,
					parseInt(d[2], 10) || null,
					parseInt(t[0], 10) || null,
					parseInt(t[1], 10) || null,
					parseInt(t[2], 10) || null
				)).getTime();
				var now = Date.parse(new Date());
				return times < now;
			},

			/**
			 * 当前时间戳
			 * @return <int>       unix时间戳(分钟)    
			 */
			DifferTimeValue: function(string) {
				var f = string.split(' ', 2);
				var d = (f[0] ? f[0] : '').split('-', 3);
				var t = (f[1] ? f[1] : '').split(':', 3);
				var times = (new Date(
					parseInt(d[0], 10) || null,
					(parseInt(d[1], 10) || 1) - 1,
					parseInt(d[2], 10) || null,
					parseInt(t[0], 10) || null,
					parseInt(t[1], 10) || null,
					parseInt(t[2], 10) || null
				)).getTime();
				var now = Date.parse(new Date());
				return Math.floor((times - now) / 1000 / 60);
			},

			/**
			 * 判断整点
			 * @return <boo>       false/true   
			 */
			IntegralTimeValue: function(string) {
				var f = string.split(' ', 2);
				var d = (f[0] ? f[0] : '').split('-', 3);
				var t = (f[1] ? f[1] : '').split(':', 3);
				var times = new Date(string);
				var mi = times.getMinutes();
				if(mi == 0) {
					return true;
				}
				return false;
			},

			/**              
			 * 日期 转换为 Unix时间戳
			 * @param <string> 2014-01-01 20:20:20  日期格式              
			 * @return <int>        unix时间戳(毫秒)              
			 */
			DateToUnix: function(string) {
				var f = string.split(' ', 2);
				var d = (f[0] ? f[0] : '').split('-', 3);
				var t = (f[1] ? f[1] : '').split(':', 3);
				return(new Date(
					parseInt(d[0], 10) || null,
					(parseInt(d[1], 10) || 1) - 1,
					parseInt(d[2], 10) || null,
					parseInt(t[0], 10) || null,
					parseInt(t[1], 10) || null,
					parseInt(t[2], 10) || null
				)).getTime();
			},
			/**              
			 * 时间戳转换日期格式String              
			 * @param <int> unixTime    待时间戳(毫秒)              
			 * @param <string> formatString    
			 * 返回完整时间：YYYY-MM-DD hh24:mi:ss
			 * 返回日期：YYYY-MM-DD
			 * 返回时间：hh24:mi:ss
			 * 返回时间：hh24:mi
			 * @param <int>  timeZone   时区              
			 */
			UnixToDate: function(unixTime, formatString, timeZone) {
				//console.log(unixTime + " " + formatString + " " + timeZone);
				if(typeof(timeZone) == 'number') {
					unixTime = parseInt(unixTime); // + parseInt(timeZone) * 60 * 60 * 1000;
				}
				var time = new Date(unixTime);
				var ymdhis = "";
				var YYYY = time.getUTCFullYear();
				var MM = time.getUTCMonth() < 9 ? "0" + (time.getUTCMonth() + 1) : (time.getUTCMonth() + 1);
				var DD = time.getUTCDate() < 10 ? "0" + time.getUTCDate() : time.getUTCDate();
				var hh24 = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
				var mi = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
				var ss = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
				switch(formatString) {
					case "YYYY-MM-DD hh24:mi:ss":
						ymdhis = YYYY + "-" + MM + "-" + DD + " " + hh24 + ":" + mi + ":" + ss;
						break;
					case "YYYY-MM-DD":
						ymdhis = YYYY + "-" + MM + "-" + DD;
						break;
					case "hh24:mi:ss":
						ymdhis = hh24 + ":" + mi + ":" + ss;
						break;
					case "hh24:mi":
						ymdhis = hh24 + ":" + mi;
						break;
					case "hh24mi":
						ymdhis = hh24 + "" + mi;
						break;
				}
				return ymdhis;
			},

			/**              
			 * 转当前日期格式String              
			 * @param <date> dates    时间              
			 * @param <string> formatString    
			 * 返回完整时间：YYYY-MM-DD hh24:mi:ss
			 * 返回日期：YYYY-MM-DD
			 * 返回时间：hh24:mi:ss
			 * 返回时间：hh24:mi      
			 */
			ToDayDate: function(dates, formatString) {
				var time = new Date(dates);
				var ymdhis = "";
				var YYYY = time.getUTCFullYear();
				var MM = time.getUTCMonth() < 9 ? "0" + (time.getUTCMonth() + 1) : (time.getUTCMonth() + 1);
				var DD = time.getUTCDate() < 10 ? "0" + time.getUTCDate() : time.getUTCDate();
				var hh24 = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
				var mi = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
				var ss = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
				switch(formatString) {
					case "YYYY-MM-DD hh24:mi:ss":
						ymdhis = YYYY + "-" + MM + "-" + DD + " " + hh24 + ":" + mi + ":" + ss;
						break;
					case "YYYY-MM-DD":
						ymdhis = YYYY + "-" + MM + "-" + DD;
						break;
					case "hh24:mi:ss":
						ymdhis = hh24 + ":" + mi + ":" + ss;
						break;
					case "hh24:mi":
						ymdhis = hh24 + ":" + mi;
						break;
				}
				return ymdhis;
			}
		}
	});
})(jQuery);