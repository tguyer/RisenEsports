window.onload = function() {
  playerbaseStyling();
  var path = window.location.pathname;
  var page = path.split("/").pop();
  var data = page.split(".").shift();
  dataUrl = "https://raw.githubusercontent.com/tguyer/RisenEsports/master/data/" + data + ".txt";

  var request = new XMLHttpRequest();
  request.open('GET', dataUrl, true);
  request.responseType = 'blob';
  request.onload = function() {
      var reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload =  function(e){
          plainData = decode64(e.target.result.split(",")[1]);
          var processed = teamProcess(plainData);
          var teams = processed[0];
          var playerData = processed[1];

          for (var i=0; i<teams.length; i++) {
            document.getElementById("t"+i).innerHTML = teams[i];
            // Find players on the current team
            var players = playerData.filter(function(obj) {
              return obj.team == teams[i];
            });

            // Display the starters
            for (var k=0; k<5; k++) {
              document.getElementById("t"+i+"st"+k).innerHTML = "<a title='op.gg link' href = 'https://na.op.gg/summoner/userName=" +
              players[k].name + "'>" + players[k].name + "</a> <span class='pos'>" + players[k].pos + "</span>";
            }

            // Display the subs
            for (var k=0; k<2; k++) {
              if(typeof players[k+5] == 'Object') {
                document.getElementById("t"+i+"s"+k).innerHTML = "<a title='op.gg link' href = 'https://na.op.gg/summoner/userName=" +
                players[k+5].name +  "'>" + players[k+5].name + "</a>";
              } else {
                document.getElementById("t"+i+"s"+k).innerHTML = "Sub Slot "+ (k+1);
              }
            }
          }

          // Show update log
          document.getElementById("lastUpdated").innerHTML = "<a href='https://github.com/tguyer/RisenEsports/commits/master/data/" +
          data + ".txt'> Update History </a>";

      };
  };
  request.send();
}

var pos = ["Top", "Jungle", "Mid", "ADC", "Support"];

function teamProcess(plainData) {
  var teams = [];
  var playerData = [];
  var newData = plainData.split("-");
  newData = newData.filter(Boolean);
  console.log(newData);
  // Loop through the teams
  for (var i=0; i<newData.length; i++) {
    teamInfo = newData[i].split("|");
    teamInfo = teamInfo.filter(function(entry) { return entry.trim() != ''; });

    // 0 = Team name, 1 = Starters, 2 = Subs
    teams.push(teamInfo[0]); // Add team to team list
    // Add starters to playerbase
    var starters = teamInfo[1].split(":");
    for(var k=0; k<starters.length; k++) {
      var player = new Object();
      player.name = starters[k];
      player.team = teamInfo[0];
      player.pos = pos[k];
      playerData.push(player);
    }

    // Add subs to playerbase
    if(teamInfo.length > 2) {

      var subs = teamInfo[2].split(":");
      for(var k=0; k<starters.length; k++) {
        var player = new Object();
        player.name = subs[k];
        player.team = teamInfo[0];
        playerData.push(player);
      }
    }
  }
  playerbaseStyling(teams.length);
  return [teams, playerData];
}

// Generates HTML for the player base page
function playerbaseStyling(teamLen) {
  for(var j=0; j<(teamLen/5); j++) {
    var row = document.getElementById("r"+j);

    for(var i=0; i<5; i++) {
      var offset = j*5;

      // Create team components
      var teamDom = document.createElement("div");
      teamDom.className = "2u";
      var sec = document.createElement("section");
      var teamTit = document.createElement("h3");
      teamTit.id = "t" + (i+offset);
      teamTit.innerHTML = "Team " + (i+offset);
      sec.appendChild(teamTit);

      var start = document.createElement("p");
      var bold = document.createElement("b");
      bold.innerHTML = "STARTERS";
      start.appendChild(bold);
      sec.appendChild(start);

      for(var k=0; k<5; k++) {
        var player  = document.createElement("p");
        player.id = "t" + (i+offset) + "st" + k;
        player.innerHTML = "Starter " + k;
        sec.appendChild(player);
      }

      var spce = document.createElement("br");
      sec.appendChild(spce);
      var sub = document.createElement("p");
      var subold = document.createElement("b");
      subold.innerHTML = "SUBS";
      sub.appendChild(subold);
      sec.appendChild(sub);

      for(var k=0; k<2; k++) {
        var player  = document.createElement("p");
        player.id = "t" + (i+offset) + "s" + k;
        player.innerHTML = "Sub " + k;
        sec.appendChild(player);
      }

      teamDom.appendChild(sec);
      row.appendChild(teamDom);
    }
  }
}


// Decoder
var keyStr = "ABCDEFGHIJKLMNOP" +
               "QRSTUVWXYZabcdef" +
               "ghijklmnopqrstuv" +
               "wxyz0123456789+/" +
               "=";

function decode64(input) {
   var output = "";
   var chr1, chr2, chr3 = "";
   var enc1, enc2, enc3, enc4 = "";
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   var base64test = /[^A-Za-z0-9\+\/\=]/g;
   if (base64test.exec(input)) {
      alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
   }
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }

      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";

   } while (i < input.length);

   return unescape(output);
}
