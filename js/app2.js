// базовый класс инпутов, селектов и прочих контролов
class Control {
  el;
  name;
  isVisible = true;


  // event bus methods
  on() {}
  emit() {}

  constructor(el, on, emit) {
    this.el = el;
    this.on = on;
    this.emit = emit;

    this.name = el.getAttribute('data-module-control');
    this.el.addEventListener('change', (e) => this.onChange(e));

    this.on(`${this.name}:hide`, () => this.hide());
    this.on(`${this.name}:show`, () => this.show());
  }

  init() {
    this.isVisible ? this.show() : this.hide()
  }

  show() {
    this.isVisible = true;
    this.el.closest('.calc-item').style.display = 'block';
  }
  
  hide() {
    this.isVisible = false;
    this.el.closest('.calc-item').style.display = 'none';
  }

  recalculate() {}
}


// классы отдельных контролов
class PropertyControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);

    this.init();
  }

  onChange(e) {
    this.recalculate();
  }
}


class TaxationControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();

    this.on('taxation-set-value', (data) => {
      this.el.value = data;
    });
  }

  onChange(e) {
    if(this.el.value === '4000') {
      this.emit('envd-point-control:show');
      this.emit('main-taxation-control:show');
    } else {
      this.emit('envd-point-control:hide');
      this.emit('main-taxation-control:hide');
    }

    this.recalculate();
  }
}


class ENVDControl extends Control {
  isVisible = false;

  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();
  }

  onChange(e) {
    this.recalculate();
  }
}


class MainTaxationControl extends Control {
  isVisible = false;

  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();
  }

  onChange(e) {
    this.recalculate();
  }
}


class StaffControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();
  }

  onChange(e) {
    this.recalculate();
  }
}


class OborotControl extends Control {
  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();

    this.on('oborot-set-value', (data) => {
      this.el.value = data;
    });
  }

  onChange(e) {
    if(this.el.value === '1000') {
      this.emit('primary-document-control:show');
      this.emit('errands-control:show');
    } else {
      this.emit('primary-document-control:hide');
      this.emit('errands-control:hide');
      this.emit('dup-document-control:hide');
      this.emit('record-keeping-control:hide');
    }

    this.recalculate();
  }
}


class DocumentControl extends Control {
  isVisible = false;
  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();

    this.on('document-set-value', (data) => {
      this.el.value = data;
    });
  }

  onChange(e) {
    if(this.el.value != '100') {
      this.emit('dup-document-control:show');
      this.emit('record-keeping-control:show');
    } else {
      this.emit('dup-document-control:hide');
      this.emit('record-keeping-control:hide');
    }

    this.recalculate();
  }
}


class DupDocumentControl extends Control {
  isVisible = false;

  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();
  }

  onChange(e) {
    this.recalculate();
  }
}


class RecordKeepingControl extends Control {
  isVisible = false;

  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();
  }

  onChange(e) {
    this.recalculate();
  }
}


class ErrandsControl extends Control {
  isVisible = false;
  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();

    this.on('errands-set-value', (data) => {
      this.el.value = data;
    });
  }

  onChange(e) {
    if(this.el.value != '100') {
      this.emit('errands-way-control:show');
    } else {
      this.emit('errands-way-control:hide');
    }

    this.recalculate();
  }
}


class ErrandsWayControl extends Control {
  isVisible = false;

  constructor(el, on, emit) {
    super(el, on, emit);
    this.init();
  }

  onChange(e) {
    this.recalculate();
  }
}


// класс всего приложения
class App {
  components;
  events = {};
  instances = [];

  sumNode;

  constructor(components) {
    this.components = components;

    this.init();
  }

  init() {
    this.sumNode = document.querySelector('.calc-price__sum');

    const elems = document.querySelectorAll(`[data-module-control]`);
    elems.forEach((el) => {
      const component = this.components[el.getAttribute('data-module-control')];
      const cmpInstance = new component(el, this.on, this.emit);
      cmpInstance.recalculate = () => this.calculate();
      this.instances.push(cmpInstance);
    });
  }

  calculate = () => {
    const propertyValue = this.getValueOrZero('property-control');
    const taxationValue = this.getValueOrZero('taxation-control');
    const ENVDValue = this.getValueOrZero('envd-point-control');
    const mainTaxationValue = this.getValueOrZero('main-taxation-control');
    const staffValue = this.getValueOrZero('staff-control');
    const oborotValue = this.getValueOrZero('oborot-control');
    const primaryDocumentValue = this.getValueOrZero('primary-document-control');
    const dupDocumentValue = this.getValueOrZero('dup-document-control');
    const recordKeepingValue = this.getValueOrZero('record-keeping-control');
    const errandsValue = this.getValueOrZero('errands-control');
    const errandsWayValue = this.getValueOrZero('errands-way-control');

    const result = propertyValue + taxationValue + ENVDValue + mainTaxationValue + staffValue + oborotValue + primaryDocumentValue + dupDocumentValue + recordKeepingValue + errandsValue + errandsWayValue;
    this.sumNode.innerText = `≈ ${result} руб./мес.`
  }

  getValueOrZero(componentName) {
    const instance = this.instances.find((ins) => ins.name === componentName);
    return instance.isVisible ? (+instance.el.value) : 0;
  }

  on = (key, handler) => {
    if (this.events[key]) {
      this.events[key].push(handler);
    } else {
      this.events[key] = [handler];
    }
  }

  emit = (key, data) => {
    this.events[key] && this.events[key].forEach((handler) => {
      handler(data);
    })
  }
}


// Список компонент
const components = {
  'property-control': PropertyControl,
  'taxation-control': TaxationControl,
  'envd-point-control': ENVDControl,
  'main-taxation-control': MainTaxationControl,
  'staff-control': StaffControl,
  'oborot-control': OborotControl,
  'primary-document-control': DocumentControl,
  'dup-document-control': DupDocumentControl,
  'record-keeping-control': RecordKeepingControl,
  'errands-control': ErrandsControl,
  'errands-way-control': ErrandsWayControl,
}


const app = new App(components);