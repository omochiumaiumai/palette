'use strict';
const { Select } = require('enquirer');

class Palette {
  constructor() {
    this.API_URL = 'http://colormind.io/api/';
    this.MODEL_URL = 'http://colormind.io/list/';
  }

  async fetchData(url, request) {
    try {
      const response = await fetch(url, request);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getModels() {
    const models = await this.fetchData(this.MODEL_URL);
    return models;
  }

  async getColors(model) {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    };
    const colors = await this.fetchData(this.API_URL, request);
    return colors.map((color) => {
      const [r, g, b] = color;
      const hex = this.rgbToHex(r, g, b);
      return { r, g, b, hex };
    });
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
