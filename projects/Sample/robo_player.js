function RoboPlayer(guitars) {
    this.tempoMin = 60;
    this.tempoMax = 120;

    this.burstProb = 0.2;

    this.guitars = guitars;
    this.loop = new Tone.Loop(function(time) {
        let burstAttempt = ((random(100)/100) < this.burstProb);
        console.log(burstAttempt);

        if (burstAttempt) { guitars.burst({octave: 'low'}); }
        else {
            guitars.play({octave: 'low'});
        }
    }, "4n");
    this.loop.probability = 0.5;

    this.start = function() {
        Tone.Transport.bpm.value = floor(random(this.tempoMin, this.tempoMax));
        this.loop.start();
    };

    this.stop = function() {
        this.loop.stop();
    };
}
