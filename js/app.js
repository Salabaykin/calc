document.addEventListener('DOMContentLoaded', function() {

    // Получаем данные с сервера
    function getFile(url) {
        return fetch(url).then(d => d.json());
    }

    // Выводим на страницу option
    async function main () {
        try {
            let data = await getFile('data.json');
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let el = document.querySelector(`select[name=${key}]`);
                    let str = '';
                    for (const option in data[key]) {
                        if (data[key].hasOwnProperty(option)) {
                            str += `<option value="${data[key][option]}">${option}</option>`;
                        }
                    }
                    el.innerHTML = str;
                }
            }
        }
        finally {
            console.log('remote FS');
        }
    }
    
    main();

});