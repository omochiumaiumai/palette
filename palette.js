'use strict';
const { Select } = require('enquirer');

class Palette {
  constructor() {
    this.API_URL = 'http://colormind.io/api/';
    this.MODEL_URL = 'http://colormind.io/list/';
  }

  async getModels() {
    try {
      const response = await fetch(this.MODEL_URL);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(error);
    }
  }

  async getColors(model) {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model }),
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      return data.result.map((color) => {
        const [r, g, b] = color;
        const hex = this.rgbToHex(r, g, b);
        return { r, g, b, hex };
      });
    } catch (error) {
      console.error(error);
    }
  }

  output(colors) {
    for (const color of colors) {
      console.log(
        `\x1b[38;2;${color.r};${color.g};${color.b}m%s\x1b[0m #%s`,
        '■',
        color.hex
      );
    }
    console.log('Here is the palette!');
    console.log('Did you have a favorite color?');
  }

  rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

(async () => {
  const palette = new Palette();
  const models = await palette.getModels();

  const prompt = new Select({
    name: 'model',
    message: 'Choose a model:',
    choices: models,
  });
  const model = await prompt.run();

  const colors = await palette.getColors(model);
  palette.output(colors);
})();
