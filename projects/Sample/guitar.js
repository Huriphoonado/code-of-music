const all_pitches = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
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

    this.currentGuitarList = [];

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

    this.play = function(should_pan=false) {
        if (!this.currentGuitarList.length) { return false; }

        let randNote = floor(random(this.currentGuitarList.length));
        this.currentGuitarList[randNote].play(should_pan);
    }

    this.burst = function(should_pan=false) {
        let randChords = floor(random(3, 7));
        for (let i = 0; i < randChords; i++) {
            this.play(should_pan);
        }
    }

    this.resetCurrentGuitars = function({pitches=false, octave=false, dynamic=false, type=false}={}) {
        let pitchSet = pitches || all_pitches;
        // It was 9:30PM Sunday and I got lazy - this filter code is mostly from
        // Stack Overflow:
        // https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6
        let playerList = Object.keys(this.guitarList)
        .filter(key => pitchSet.includes(key))
        .reduce((obj, key) => {
            obj[key] = this.guitarList[key];
            return Object.values(obj);
        }, []).flat();

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

        this.currentGuitarList = playerList;
        return this.currentGuitarList;
    }

    // This applies to all guitars, not just the current set
    this.randPan = function() {
        for (guitarSet in this.guitarList) {
            this.guitarList[guitarSet].forEach(function(guitar) {
                guitar.randPan();
            });
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
    this.panner = new Tone.Panner(random(-1, 1));

    this.distortion = new Tone.Chebyshev(3);
    // this.distortion = new Tone.BitCrusher(8);
    // this.distortion = new Tone.Distortion(0.1);

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

    this.play = function(should_pan=false) {
        if (this.player.loaded && (this.player.state == 'stopped')) {
            if (should_pan) { this.randPan(); }
            this.player.start();
        }
    }

    this.randPan = function() {
        this.panner.pan.value = random(-1, 1);
    }

    this.getPan = function() {
        return this.panner.pan.value;
    }

    this.getMIDIVal = function() {
        let pitch_num = all_pitches.indexOf(this.pitch);
        return (12 * this.octave) + pitch_num;
    }

    this.getMeter = function() {
        return this.meter.getLevel();
    }
}
