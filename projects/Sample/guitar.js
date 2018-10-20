const all_pitches = ['A', 'As', 'B', 'C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs'];
const all_octaves = [2, 3, 4, 5, 6];
const all_dynamics = ['pianissimo', 'piano', 'forte'];
const all_types = ['normal', 'harmonics'];

// let reverb = new Tone.JCReverb(0.7);
let reverb = new Tone.Freeverb(0.95, 2000);
reverb.wet.value = 0.3;

// Guitar patch settings
function globalConnect(sig_chain) {
    sig_chain.chain(reverb, Tone.Master);
}

function Guitars() {
    this.guitarList = all_pitches.reduce(function(result, item) {
        result[item] = [];
        return result;
    }, {});

    this.loadAll = function() {
        let self = this;
        fetch('./all_guitars.json').then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Bad News Bud: ' + response.status);
                    return;
                }
                response.json().then(function(allGuitars) {
                    allGuitars.forEach(function(g) {
                        let newGuitar = new Guitar(g['url'], g['pitch'],
                                                    g['octave'], g['dynamic'],
                                                    g['type']);
                        newGuitar.load();
                        self.guitarList[newGuitar.pitch].push(newGuitar);
                    });
                });
            }
        ).catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }

    this.play = function({pitches=false, octave=false, dynamic=false, type=false}={}) {
        let pitchSet = pitches || all_pitches;
        let newPitch = pitchSet[floor(random(pitchSet.length))];
        let playerList = this.guitarList[newPitch];

        if (octave) {
            if (octave == 'low') { playerList = playerList.filter(p => p.octave < 4); }
            if (octave == 'high') { playerList = playerList.filter(p => p.octave >= 4); }
        }

        if (dynamic) {
            if (dynamic == 'low') { playerList = playerList.filter(p => p.dynamic[0] == 'p'); }
            if (dynamic == 'high') { playerList = playerList.filter(p => p.dynamic[0] == 'f'); }
        }

        if (type) {
            if (type == 'normal') { playerList = playerList.filter(p => p.type[0] == 'n'); }
            if (type == 'harmonics') {
                playerList = playerList.filter(p => p.type[0] == 'h');
            }
        }

        if (!playerList.length) { return false; }
        let randNote = floor(random(playerList.length));

        playerList[randNote].play();
    }

    this.burst = function({pitches=false, octave=false, dynamic=false, type=false}={}) {
        let randChords = floor(random(3, 7));
        for (let i = 0; i < randChords; i++) {
            this.play(pitches, octave, dynamic, type);
        }
    }
}


function Guitar(url, pitch, octave, dynamic, type) {
    this.url = url;

    this.pitch = pitch;
    this.octave = octave;
    this.dynamic = dynamic;
    this.type = type;

    this.player = null;
    this.panner = new Tone.Panner();
    // this.distortion = new Tone.Distortion(0.1);
    this.distortion = new Tone.Chebyshev(3);
    // this.distortion = new Tone.BitCrusher(8);

    this.meter = new Tone.Meter();

    this.load = function() {
        this.player = new Tone.Player({
            'url': this.url,
            'fadeIn': 0.05,
            'fadeOut': 0.05,

        });
        this.player.volume.value = 0.5;
        this.player.chain(this.distortion, this.panner);
        this.player.connect(this.meter);
        globalConnect(this.panner);
    }

    this.play = function() {
        if (this.player.loaded && (this.player.state == 'stopped')) {
            this.randPan();
            this.player.start();
        }
    }

    this.randPan = function() {
        this.panner.pan.value = random(-1, 1);
    }
}
