function RoboPlayer(guitars) {
    let self = this;

    self.tempoMin = 60;
    self.tempoMax = 120;

    self.burstProb = 0.2;

    self.settings = {
        pitches: all_pitches,
        octave: false,
        dynamic: false,
        type: false
    }

    self.guitars = guitars;
    self.loop = new Tone.Loop(function(time) {
        let burstAttempt = ((random(100)/100) < self.burstProb);

        if (burstAttempt) { self.guitars.burst(); }
        else { self.guitars.play(); }
    }, "4n");
    self.loop.probability = 0.5;

    self.start = function() {
        Tone.Transport.bpm.value = floor(random(self.tempoMin, self.tempoMax));
        self.loop.start();
    }

    self.stop = function() {
        self.loop.stop();
    }

    self.resetSettings = function() {
        // First create new random pitch set
        let pitch_set_size = floor(random(3, 10));
        self.settings.pitches = sample_without_replace(all_pitches, pitch_set_size);

        // Reset the other settings
        self.settings.octave = false;
        self.settings.dynamic = false;
        self.settings.type = false;

        // Then potentially alter one of the other three musical elements
        // We only want to change one at a time so as not to totally limit the
        // resulting pitch set
        let rand_elem = floor(random(1, 5));
        switch (rand_elem) {
            case 1:
                self.settings.octave = ['low', 'high'][floor(random(2))];
                break;
            case 2:
                self.settings.dynamic = ['low', 'high'][floor(random(2))];
                break;
            case 3:
                self.settings.type = ['low', 'high'][floor(random(2))];
        }

        // Then, assign the new audio set
        // For animation - return the guitars we are using
        self.guitars.randPan();
        return self.guitars.resetCurrentGuitars(self.settings);
    }
}

function sample_without_replace(possible_pitches_arr, num_samps) {
    let arr = possible_pitches_arr.slice();
    let new_arr = [];

    while (num_samps) {
        let rand_index = floor(random(arr.length));
        new_arr.push(arr.splice(rand_index, 1)[0]);
        num_samps-=1
    }

    return new_arr;

}
