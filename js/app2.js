// базовый класс инпутов, селектов и прочих контролов
class Control {
  el;
  name;

  // event bus methods
  on() {}
  emit() {}

  constructor(el, on, emit) {
    this.el = el;
    this.on = on;
    this.emit = emit;

    this.name = el.getAttribute('data-module-control');
    this.el.addEventListener('change', (e) => this.onChange(e));

    this.on(`${this.name}:hide`, () => this.hide())
    this.on(`${this.name}:show`, () => this.show())
  }

  show() {
    this.el.closest('.calc-item').style.display = 'block'
  }

  hide() {
    this.el.closest('.calc-item').style.display = 'none';
  }
}









// классы отдельных контролов
class PropertyControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);
  }

  onChange(e) {
    this.emit('taxation-control:hide'); // просто для примера легко и удобно скрываем taxation
  }
}


class TaxationControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);
  }
}












// класс всего приложения. всегда будет в одном экземпляре (но не точно))
class App {
  components;
  events = {};

  constructor(components) {
    this.components = components;

    this.init()
  }

  init() {
    const elems = document.querySelectorAll(`[data-module-control]`);
    Array.from(elems).forEach((el) => {
      const component = this.components[el.getAttribute('data-module-control')];
      const cmpInstance = new component(el, this.on, this.emit);
    })
  }

  on = (key, handler) => {
    console.log(key);
    if (this.events[key]) {
      this.events[key].push(handler);
    } else {
      this.events[key] = [handler];
    }
  }

  emit = (key, data) => {
    console.log(this.events);
    this.events[key] && this.events[key].forEach((handler) => {
      handler(data);
    })
  }
}





// Список компонент

const components = {
  'property-control': PropertyControl,
  'taxation-control': TaxationControl
}


const app = new App(components);