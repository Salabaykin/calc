document.addEventListener('DOMContentLoaded', function() {
 
    'use strict';
    
    // Параметры калькулятора
    const   DATA = {
            // Форма собственности
            calcItemProperty: [10000, 20000], 
            // Система налогообложения
            calcItemTaxation: [1000, 2000, 3000, 4000],
            // Количество точек по ЕНВД
            calcItemENVD: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
            // Основная система налогообложения:
            calcItemENVDtax: [1000, 2000, 3000],
            // Количество сотрудников
            calcItemStaff: [0, 650, 1100, 1550, 2000, 2450, 4200, 5950, 7700, 10000, 13000, 15000],
            // Нулевая или с оборотами
            calcItemOborot: [500, 5000], 
            // Количество первичных документов
            calcItemDocument: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 2000],
            // Количество платежных поручений
            calcItemErrands: [100, 200, 300, 400, 500],
            // Способ оформления платежных поручений
            calcItemErrandsWay: [1000, 2000, 3000]
    };

    const   formCalculate = document.querySelector('.form'),
            select = document.querySelectorAll('select'),
            totalPriceSum = document.querySelector('.calc-price__sum'),
            calcItemDocument = document.querySelector('.calcItemDocument'),
            calcItemErrands = document.querySelector('.calcItemErrands'),
            calcItemENVD = document.querySelector('.calcItemENVD'),
            calcItemENVDtax = document.querySelector('.calcItemENVDtax'),
            calcItemErrandsWay = document.querySelector('.calcItemErrandsWay');

    // ====================================================================================
    function showElem(elem) {
        elem.style.display = 'block';
    }
    function hideElem(elem) {
        elem.style.display = 'none';
    }

    // ====================================================================================
    function handlerCallBackForm(event) {
        const target = event.target;
        
        if (target.name === 'calcItemOborot' && target.value === 'oborot1') {
            showElem(calcItemDocument);
            showElem(calcItemErrands);
        } else if (target.name === 'calcItemOborot' && target.value === 'oborot0') {
            hideElem(calcItemDocument);
            hideElem(calcItemErrands);
            hideElem(calcItemErrandsWay);

            select.forEach(item => {
                if (item.name === 'calcItemDocument') {
                    item.options[0].selected = 'true';
                }
                if (item.name === 'calcItemErrands') {
                    item.options[0].selected = 'true';
                }
            });

        } 

        if (target.name === 'calcItemTaxation' && target.value === 'envd') {
            showElem(calcItemENVD);
            showElem(calcItemENVDtax);
        } else if (target.name === 'calcItemTaxation' && target.value === 'ysn_dohod_rashod' || target.value === 'ysn_dohod' || target.value === 'osno') {
            hideElem(calcItemENVD);
            hideElem(calcItemENVDtax);
        }

        if (target.name === 'calcItemErrands' && target.value != 'errands0' || target.value === '1x10' || target.value === '11x25' || target.value === '26x50' || target.value === '51x100') {
            showElem(calcItemErrandsWay);
        } else if (target.name === 'calcItemErrands' && target.value === 'errands0') {
            hideElem(calcItemErrandsWay);
        }
        
        if (target.classList.contains('calc-handler')) {
            priceCalculation(target);
        }

    }


    // ====================================================================================
    function priceCalculation(elem) {
        let result = 0;
        let index = 0;
        let options = [];

        switch (elem.name) {

            case 'calcItemProperty': 
                for (const item of select) {
                    if (item.value === 'ip') {
                        index = DATA.calcItemProperty.indexOf(item.value);
                        console.log(item.value);
                    } else if (item.value === 'ooo') { 
                        index = DATA.calcItemProperty.indexOf(item.value);
                        console.log(item.value);
                    }
                }
                break;

            case 'calcItemTaxation': 
                for (const item of select) {
                    if (item.value === 'osno') {
                        index = DATA.calcItemTaxation.indexOf(item.value);
                        console.log(item.value);
                    } else if (item.value === 'ysn_dohod') { 
                        index = DATA.calcItemTaxation.indexOf(item.value);
                        console.log(item.value);
                    } else if (item.value === 'ysn_dohod_rashod') { 
                        index = DATA.calcItemTaxation.indexOf(item.value);
                        console.log(item.value);
                    } else if (item.value === 'envd') { 
                        index = DATA.calcItemTaxation.indexOf(item.value);
                        console.log(item.value);
                    }
                }
                break;

            default:
                console.log('Ни один case не выполнился...');

        }

        options.push(+elem.value); 
        console.log(options);
        
        result += +elem.value;

        // totalPriceSum.textContent = `≈ ${result} руб./мес.`;

    }

    // Если какое-то событие в форме изменится, срабтает функция  
    formCalculate.addEventListener('change', handlerCallBackForm);

});