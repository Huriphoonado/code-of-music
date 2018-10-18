// On guitar object creation
//  Pass in parameters or
const all_pitches = ['A', 'As', 'B', 'C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs'];
const all_octaves = [2, 3, 4, 5, 6];
const all_dynamics = ['pianissimo', 'piano', 'forte'];
const all_types = ['normal', 'harmonics'];

function Guitars(pitches=all_pitches, octaves=all_octaves, dynamics=all_dynamics, types=all_types) {
    this.pitches = pitches;
    this.octaves = octaves;
    this.dynamics = dynamics;
    this.types = types;
    this.guitars = {};

    this.loadAll = function() {
        let self = this;
        self.pitches.forEach(function(p) {
            self.octaves.forEach(function(o) {
                self.dynamics.forEach(function(d) {
                    self.types.forEach(function(t) {
                        let new_guitar = new Guitar(p, o, d, t);
                        let try_and_load = new_guitar.load();
                        console.log(try_and_load);
                        if (try_and_load) {
                            self.guitars[p] = self.guitars[p] || {};
                            self.guitars[p][o] = self.guitars[p][o] || {};
                            self.guitars[p][o][d] = self.guitars[p][o][d] || {};
                            self.guitars[p][o][d][t] = new_guitar;
                        }
                    });
                });
            });
        });
    }

    // It should take in a list of subsets
    // This still isn't ideal - we want quiet/loud, low/high
    // This is buggy since many of these things do not exist!!!
    this.playRandom = function(new_pitches, new_octaves, new_dynamics, new_types) {
        let pitches = new_pitches || this.pitches;
        let octaves = new_octaves || this.octaves;
        let dynamics = new_dynamics || this.dynamics;
        let types = new_types || this.types;

        let p = pitches[floor(random(pitches.length))];
        let o = octaves[floor(random(octaves.length))];
        let d = dynamics[floor(random(dynamics.length))];
        let t = types[floor(random(types.length))];

        this.guitars[p][o][d][t].play();
    }
}

function Guitar(pitch, octave, dynamic, type) {
    this.pitch = pitch;
    this.octave = octave;
    this.dynamic = dynamic;
    this.type = type;

    this.fileName = createFileName(pitch, octave, dynamic, type);
    this.player = null;

    this.load = function() {
        let file_exists = urlExists(this.fileName);
        if (file_exists) {
            this.player = new Tone.Player(this.fileName).toMaster();
        }
        return file_exists;
    }

    this.play = function() {
        if (this.player.loaded) {
            this.player.start();
        }
    }
}

function createFileName(pitch, octave, dynamic, type) {
    return `guitar/guitar_${pitch}${octave}_very-long_${dynamic}_${type}.mp3`;
}

function urlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}
