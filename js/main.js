var map;
var marker = [];
var infoWindow = [];

function initMap() {

  function success(pos) {
    var stationArea = document.getElementById('js-near-station');
    var innerHtml = "<ul>";
    var url = `https://express.heartrails.com/api/json?method=getStations&x=${pos.coords.longitude}&y=${pos.coords.latitude}`;
    fetch(url)
      .then(res => res.json())
      .then(info => {
        var stations = info.response.station;

        var markerData = [{
          name: '現在地',
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        }];

        stations.forEach(station => {
          var markerInfo = {
            name: `${station.line} ${station.name}駅`,
            position: {
              lat: station.y,
              lng: station.x
            }
          }
          innerHtml += `<li>${station.line} ${station.name}駅<br>距離：${station.distance}</li>`
          markerData.push(markerInfo);
        });
        stationArea.innerHTML = innerHtml;

        var center = {
          lat: pos.coords.latitude, // 緯度
          lng: pos.coords.longitude // 経度
        };
        map = new google.maps.Map(document.getElementById('js-map-area'), { // #sampleに地図を埋め込む
          center: center, // 地図の中心を指定
          zoom: 15 // 地図のズームを指定
        });
        markerData.forEach((pin, i) => {
          marker[i] = new google.maps.Marker({
            position: pin.position,
            map: map
          });
          infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
            content: '<div class="marker">' + pin.name + '</div>' // 吹き出しに表示する内容
          });
          markerEvent(i);
        });
      });
  }

  function fail(error) {
    window.alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
  }

  navigator.geolocation.getCurrentPosition(success, fail);
}

function markerEvent(i) {
    marker[i].addListener('click', function() { // マーカーをクリックしたとき
      infoWindow[i].open(map, marker[i]); // 吹き出しの表示
  });
}

function getExpress(position) {
  var url = `http://express.heartrails.com/api/json?method=getStations&x=${position.lng}&y=${position.lat}`;
  fetch(url)
    .then(res => res.json())
    .then(info => {
      var stations = info.response.station;
      return stations;
    });
}