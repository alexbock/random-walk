function performRandomWalk(dimensions, steps) {
    var position = makeOrigin(dimensions);
    var history = [];
    for (var i = 0; i < steps; ++i) {
        bumpCoordinate(position);
        history.push(position.slice());
        if (isOrigin(position)) break;
    }
    return history;
}

function countReturningWalks(walks) {
    var returned = 0;
    for (var i = 0; i < walks.length; ++i) {
        if (doesWalkReturn(walks[i])) ++returned;
    }
    return returned;
}

function sampleWalks(dimensions, steps, trials) {
    var results = [];
    for (var i = 0; i < trials; ++i) {
        results.push(performRandomWalk(dimensions, steps));   
    }
    return results;
}

function isOrigin(coord) {
    for (var i = 0; i < coord.length; ++i) {
        if (coord[i] !== 0) return false;
    }
    return true;
}

function doesWalkReturn(walk) {
    for (var i = 0; i < walk.length; ++i) {
        if (isOrigin(walk[i])) return true;
    }
    return false;
}

function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function bumpCoordinate(coord) {
    var i = rand(0, coord.length);
    if (rand(0, 2) === 1) ++coord[i];
    else --coord[i];
}

function makeOrigin(dimensions) {
    var origin = [];
    for (var i = 0; i < dimensions; ++i) {
        origin.push(0);
    }
    return origin;
}

function process() {
    var dimensions = document.getElementById("inDimensions").value;
    var steps = document.getElementById("inSteps").value;
    var trials = document.getElementById("inTrials").value;
    var walks = sampleWalks(dimensions, steps, trials);
    
    var returningWalks = countReturningWalks(walks);
    document.getElementById("outTrialsReturned").innerHTML = returningWalks;
    document.getElementById("outTrialsTotal").innerHTML = walks.length;
    var percentage = Math.round(returningWalks / walks.length * 100);
    document.getElementById("outTrialsReturnedPercent").innerHTML = percentage;
    
    var heatmapData = [];
    for (var i = 0; i < walks.length; ++i) {
        for (var j = 0; j < walks[i].length; ++j) {
            var x = walks[i][j][0];
            var y = walks[i][j][1];
            if (!heatmapData[x]) heatmapData[x] = [];
            if (heatmapData[x][y]) {
                ++heatmapData[x][y];
            } else {
                heatmapData[x][y] = 1;   
            }
        }
    }
    
    var qs = document.getElementById("inQuadrantSize").value;
    var cs = document.getElementById("heatmapCanvas").width;
    var csh = cs / 2;

    var hmc = document.getElementById("heatmapCanvas").getContext("2d");
    hmc.fillStyle = "white";
    hmc.fillRect(0, 0, cs, cs);
    for (var x = -qs; x < qs; ++x) {
        for (var y = -qs; y < qs; ++y) {
            if (!heatmapData[x] || !heatmapData[x][y]) continue;
            var intensity = +heatmapData[x][y];
            if (intensity > 100) intensity = 100;
            intensity /= 100;
            hmc.fillStyle = "rgba(0, 0, 0, " + intensity + ")";
            hmc.fillRect(csh + x * (csh/qs), csh + y * (csh/qs), csh/qs, csh/qs);
        }
    }

    var hmp = document.getElementById("pathsCanvas").getContext("2d");
    hmp.fillStyle = "white";
    hmp.fillRect(0, 0, cs, cs);
    var colors = [ "red", "green", "blue", "black", "magenta" ];
    walks.sort(function(a, b) {
        if (a.length > b.length)  return -1;
        else if (b.length > a.length) return 1;
        else return 0;
    });
    for (var i = 0; i < walks.length && i < 5; ++i) {
        hmp.strokeStyle = colors[i];
        hmp.beginPath();
        hmp.moveTo(csh, csh);
        for (var j = 0; j < walks[i].length; ++j) {
            hmp.lineTo(csh + walks[i][j][0] * (csh/qs), csh + walks[i][j][1] * (csh/qs));
        }
        hmp.stroke();
    }
}

window.addEventListener('input', function (e) {
    process();
});

window.addEventListener('load', function() {
    process();
    document.getElementById("refresh").onclick = process;
});
