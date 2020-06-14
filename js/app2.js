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

  recalculate() {}
}









// классы отдельных контролов
class PropertyControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);
  }

  onChange(e) {
    this.recalculate();
  }
}


class TaxationControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);
  }

  onChange(e) {
    this.recalculate();
  }
}












// класс всего приложения. всегда будет в одном экземпляре (но не точно))
class App {
  components;
  events = {};
  instances = [];

  sumNode;

  constructor(components) {
    this.components = components;

    this.init()
  }

  init() {
    this.sumNode = document.querySelector('.calc-price__sum');

    const elems = document.querySelectorAll(`[data-module-control]`);
    Array.from(elems).forEach((el) => {
      const component = this.components[el.getAttribute('data-module-control')];
      const cmpInstance = new component(el, this.on, this.emit);
      cmpInstance.recalculate = () => this.calculate();
      this.instances.push(cmpInstance);
    })
  }

  calculate = () => {
    const propertyValue = this.instances.find((ins) => ins.name === 'property-control').el.value;
    const taxationValue = this.instances.find((ins) => ins.name === 'taxation-control').el.value;

    const result = (+propertyValue) + (+taxationValue);
    console.log(result);
    this.sumNode.innerText = `≈ ${result} руб./мес.`
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