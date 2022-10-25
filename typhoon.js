(function (window, $) {
  $.typhoon = function (viewer) {
    this.viewer = viewer;
  };

  $.extend($.typhoon, {
    prototype: {
      init: function () {
        const windCircleRadius = [
          ["30KTS", "300", "350", "380", "260"],
          ["50KTS", "130", "130", "140", "130"],
          ["64KTS", "60", "60", "60", "60"],
        ];
        const typhoonPoint = { lon: 125.1, lat: 24.3 };
        this.drawConfig(
          `lon:${typhoonPoint.lon},lat:${typhoonPoint.lat}`
        );
        this.drawWindCircle(windCircleRadius, typhoonPoint);
      },

      /**
       * 绘制台风风圈
       * @param {Array} windCircleRadius
       * @param {object} typhoonPoint
       */
      drawWindCircle: function (windCircleRadius, typhoonPoint) {
        for (let m = 0; m < windCircleRadius.length; m++) {
          const [, ...radiusArray] = windCircleRadius[m];

          const pointList = radiusArray
            .map((value, index) =>
              this.getWindCircle({
                ...typhoonPoint,
                radius: value * 1000,
                direct: ["EN", "ES", "WS", "WN"][index],
              })
            )
            .flat();

          const windType = windCircleRadius[m][0];
          let circleColor = Cesium.Color.YELLOW;
          switch (windType) {
            case "30KTS":
              circleColor = Cesium.Color.fromCssColorString("#fff400");
              break;
            case "50KTS":
              circleColor = Cesium.Color.fromCssColorString("#f37500");
              break;
            case "64KTS":
              circleColor = Cesium.Color.fromCssColorString("#a02997");
              break;
          }
          const windCircle = new Cesium.Entity({
            polygon: {
              hierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray(pointList)
              ),
              height: 0.0,
              outline: true,
              outlineColor: circleColor.withAlpha(1),
              outlineWidth: 1,
              material: circleColor.withAlpha(0.15),
            },
            type: "windcircle",
          });
          this.viewer.entities.add(windCircle);
        }
      },
      /**
       * 获取台风风圈，返回的是风圈点集数组
       * @param {object} circle
       */
      getWindCircle: function (circle) {
        //90°的扇形，四分之一圆，顺时针
        let start = 0;
        let end = 90;
        switch (circle.direct) {
          case "EN":
            start = 0;
            end = 90;
            break;
          case "ES":
            start = 90;
            end = 180;
            break;
          case "WS":
            start = 180;
            end = 270;
            break;
          case "WN":
            start = 270;
            end = 360;
            break;
        }

        let pointArr = [];
        pointArr = this.computeCirclularFlight(
          circle.lon,
          circle.lat,
          circle.radius,
          start,
          end
        );
        return pointArr;
      },
      /**
       * 计算风圈
       * @param {object} lon
       * @param {object} lat
       * @param {number} radius
       * @param {number} start
       * @param {number} end
       */
      computeCirclularFlight: function (lon, lat, radius, start, end) {
        const Ea = 6378137; //赤道半径
        const Eb = 6356725; //极半径
        const positionArr = [];
        for (let i = start; i <= end; i = i + 2) {
          const dx = radius * Math.sin((i * Math.PI) / 180.0);
          const dy = radius * Math.cos((i * Math.PI) / 180.0);

          const ec = Eb + ((Ea - Eb) * (90.0 - lat)) / 90.0;
          const ed = ec * Math.cos((lat * Math.PI) / 180);

          const BJD = lon + ((dx / ed) * 180.0) / Math.PI;
          const BWD = lat + ((dy / ec) * 180.0) / Math.PI;

          positionArr.push(BJD);
          positionArr.push(BWD);
        }
        return positionArr;
      },
      drawConfig: (config) => {
        const configView = document.querySelector("#config-overlay");
        configView.innerHTML = config;
      },
    },
  });
})(window, jQuery);
