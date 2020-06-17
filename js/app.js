class Calculator {

  constructor() {
    this.form = document.querySelector('.calc-form');
    this.file = '';
    this.selects = [];
    this.sum = 0;
    this.init();
  }

  getFile(url) {
    return fetch(url).then(d => d.json());
  }

  render() {
    this.form.innerHTML = '';
    for (let i = 0; i < this.selects.length; i++) {
      let select = this.selects[i];
      select.element.addEventListener('change', (event) => {
        if (select.data["link"]) {
          for (let j = 0; j < select.data["link"].length; j++) {
            let sel = new Select(this.file[select.data["link"][j]]);
            this.selects.splice(i+1, 0, sel);
          }
        }
        this.render();
        this.calc();
      });
      this.form.append(select.element);
    }

  }

  async init() {
    try {
      this.file = await this.getFile('data.json');
      for (const select in this.file) {
        if (this.file[select]["type"] === "section") {
          let sel = new Select(this.file[select]);
          this.selects.push(sel);
        }
      }
      this.render();
    }
    finally {
      console.log('Успешно');
    }
  }

  calc() {
    this.sum = 0;
    this.selects.forEach(select => {
      let selectTag = select.element.querySelector('select');
      this.sum += +selectTag.options[selectTag.selectedIndex].value;
      document.getElementById('sum').innerHTML = this.sum;
    });
  }

}

class Select {

  constructor(data) {
    this.data = data;
    this.element = '';
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'calc-item';
    let str = `
          <div class="calc-item__title">${this.data["name"]}:</div>
          <select class="calc-item__select">
    `;
    for (const option in this.data.options) {
      let opt = new Option(option, this.data.options[option]);
      str += opt.render();
    }
    str += `</select>`;
    this.element.innerHTML = str;
    return this.element;
  }

}

class Option {
  constructor(title, value) {
    this.title = title;
    this.value = value;
  }
  render() {
    return `<option value="${this.value}">${this.title}</option>`;
  }
}

let calculator = new Calculator;