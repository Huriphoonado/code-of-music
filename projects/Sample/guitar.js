const all_pitches = ['A', 'As', 'B', 'C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs'];
const all_octaves = [2, 3, 4, 5, 6];
const all_dynamics = ['pianissimo', 'piano', 'forte'];
const all_types = ['normal', 'harmonics'];

// Guitar patch settings
function connect(player) {
    player.toMaster();
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
                    console.log('Bad News: ' + response.status);
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

    this.play = function(pitch=false) {
        let newPitch = pitch || all_pitches[floor(random(all_pitches.length))];
        let rand_note = floor(random(this.guitarList[newPitch].length));
        console.log(newPitch, rand_note, this.guitarList[newPitch][rand_note]);
        this.guitarList[newPitch][rand_note].play();
    }
}


function Guitar(url, pitch, octave, dynamic, type) {
    this.url = url;

    this.pitch = pitch;
    this.octave = octave;
    this.dynamic = dynamic;
    this.type = type;

    this.player = null;

    this.load = function() {
        this.player = new Tone.Player(this.url);
        connect(this.player);
    }

    this.play = function() {
        if (this.player.loaded) {
            this.player.start();
        }
    }
}
