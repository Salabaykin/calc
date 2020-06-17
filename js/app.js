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

  handleEvents() {
    for (let i = 0; i < this.selects.length; i++) {
      let select = this.selects[i];
      select.element.addEventListener('change', () => this.onChange(select));
    }
  }

  onChange() {
    this.selects.forEach(select => {
      if (select.data["link"]) {
        for (const key in select.data["link"]) {
          for (let i = 0; i < select.data["link"][key].length; i++) {
            let selectTag = select.element.querySelector('select');
            let selectText = selectTag.options[selectTag.selectedIndex].text;
            let find = this.selects.find(x => x.data["id"] == select.data["link"][key][i]);
            if (selectText == key) {
              if (!find) {
                let sel = new Select(this.file[select.data["link"][key][i]]);
                sel.element.addEventListener('change', () => this.onChange());
                this.selects.push(sel);
              }
            } else {
              if (find) {
                this.selects.splice(this.selects.indexOf(find));
              }
            }
          }
        }
      }
      this.render();
      this.calc();
    });
  }

  render() {
    this.form.innerHTML = '';
    for (let i = 0; i < this.selects.length; i++) {
      let select = this.selects[i];
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
      this.handleEvents();
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

let calculator = new Calculator();