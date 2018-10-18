// Willie Payne
// This script reads all the files in the guitar folder, pulls out their
// characteristics, and creates a js file with an array of them

const guitarFolder = './guitar/';
const fs = require('fs');
let guitar_list = [];

fs.readdir(guitarFolder, (err, files) => {
  files.forEach(file => {
      let new_guitar = parseFile(file);
      guitar_list.push(new_guitar);
  });
  let json = JSON.stringify(guitar_list);
  fs.writeFile('all_guitars.json', json, 'utf8', function(err) {
      if (err) throw err;
      console.log('Done writing guitars to JSON file');
  });
});

function parseFile(url) {
    splat = url.split('_');

    let folder = 'guitar/'
    let pitch = splat[1].slice(0, -1);
    let octave = splat[1].slice(-1);
    let dynamic = splat[3];
    let type = splat[4].split('.')[0];

    return {
        url: folder + url,
        pitch: pitch,
        octave: octave,
        dynamic: dynamic,
        type: type
    }
}
