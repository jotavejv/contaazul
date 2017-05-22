//dom
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
/* .closest() polyfill */
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i,
                el = this;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {};
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

//model
if(!store.get('cars')){
    //model
    let cars = [
        {
            "combustivel": "Flex",
            "imagem": null,
            "marca": "Volkswagem",
            "modelo": "Gol",
            "placa": "FFF-5498",
            "valor": "20000"
        },
        {
            "combustivel": "Gasolina",
            "imagem": null,
            "marca": "Volkswagem",
            "modelo": "Fox",
            "placa": "FOX-4125",
            "valor": "20000"
        },
        {
            "combustivel": "Alcool",
            "imagem": "http://carros.ig.com.br/fotos/2010/290_193/Fusca2_290_193.jpg",
            "marca": "Volkswagen",
            "modelo": "Fusca",
            "placa": "PAI-4121",
            "valor": "20000"
        }
    ];
    store.set('cars', cars);
}

let cars = store.get('cars');
let carsPagination = cars;

//currency
function currencyFormat (num) {
    return (+num).toFixed(2).replace(",", ".").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}


function render (cars, search) {

    if(!search){
        if (cars.length > 5) {
            console.log('has pagination');
            $('#pagination').classList.add('active');
            carsPagination = cars;
            cars = cars.slice(0, 5);
            let carsPerPage = Math.ceil((carsPagination.length / 5)); // numero depaginaçao
            let $li = [];
            for (let i = 0; i < carsPerPage; i++) {
                $li[i] = i + 1;
            }

            let template = `
                    <ul>
                        <li><span id="prev"> << </span></li>
                        ${$li.map(page =>
                `<li><a href="#!/carros/${page}" id="page-${page}">${page}</a></li>`).join('')
                }
                        <li><span id="next"> >> </span></li>
                    </ul>
            `;
            $('#pagination').innerHTML = template;
        }else{
            console.log('no pagination');
        }
    }else{
        $('#pagination').classList.remove('active');
    }

    let template = `
${cars.map( (car, index) =>
        `<tr id="${index}">
        <td><input type="checkbox" id="check-${car.placa}"><span class="icon icon--check"></span>${car.placa} <div class="icon icon--trash"></div><div class="icon icon--pencil"></div></td>
        <td>${car.modelo}</td>
        <td>${car.marca}</td>
        <td>${car.imagem ? `<a href="${car.imagem}" class="foto">Imagem</a>` : 'Sem foto'}</td>
        <td>${car.combustivel}</td>
        <td>${currencyFormat(car.valor)}</td>
    </tr>`).join('')
        }`;
    $('#data').innerHTML = template;

    // init dom events
    Array.from($$('.foto')).forEach( foto => foto.addEventListener('click', function (e) {
        e.preventDefault();
        let source = e.target.href;
        $('.modal-foto img').src = source;
        $('.modal-foto').classList.add('active');
    }));

    Array.from($$('input[type="checkbox"]')).forEach( check => check.addEventListener('change', function (e) {
        event.target.closest('tr').classList.toggle('active');
        event.target.closest('tr').querySelector('.icon--trash').classList.toggle('active');
        event.target.closest('tr').querySelector('.icon--pencil').classList.toggle('active');
    }));

    Array.from($$('.icon--trash')).forEach( item => item.addEventListener('click', function (e) {
        if(confirm("Deseja realmente excluir este item?")){
            let index = +(e.target.closest('tr').id);
            cars = carsPagination;
            cars.splice(index, 1);
            store.set('cars', cars);
            render(cars);
        }
    }));

    Array.from($$('.icon--pencil')).forEach( item => item.addEventListener('click', function (e) {
        $('.modal--carro-update').classList.add('active');
        let index = +(e.target.closest('tr').id);
        Object.keys(carsPagination[index]).forEach(key => {
            $(`.modal--carro-update input[name=${key}]`).value = carsPagination[index][key];
        });

        $('.modal--carro-update form').addEventListener('submit', function (e) {
            e.preventDefault();
            cars = carsPagination;
            let form = new FormData(e.target);
            for (let [key, value] of form.entries()) {
                console.log(cars[index][key]);
                cars[index][key] = value;
            }
            console.info(cars[index]);
            store.set('cars', cars);
            $('.modal--carro-update').classList.remove('active');
            render(cars);
        });

    }));
}
render(cars);

$('#prev').addEventListener('click', function () {
    let currentPage = $('#pagination li.active a').textContent;
    let goPage = '#!/carros/'+(+currentPage - 1);
    if (currentPage - 1 > 0){
        router.navigate(goPage)
    }
});

$('#next').addEventListener('click', function () {
    let currentPage = $('#pagination li.active a').textContent;
    let goPage = '#!/carros/'+(+currentPage + 1);
    //if(carsPagination);
    router.navigate(goPage)
});

$('.modal-foto .close').addEventListener('click', function (e) {
    e.preventDefault();
    e.target.closest('.modal-foto').classList.remove('active');
});

$('.btn.cadastro').addEventListener('click', function () {
    //persiste dados até serem submetidos
    $('.modal--carro').classList.add('active');
});

$('.modal--carro .close').addEventListener('click', function (e) {
    e.preventDefault();
    $('.modal--carro').classList.remove('active');
});

$('.modal--carro-update .close').addEventListener('click', function (e) {
    e.preventDefault();
    $('.modal--carro-update').classList.remove('active');
});

$('.modal--carro form').addEventListener('submit', function (e) {
    e.preventDefault();
    let form = new FormData(e.target);
    let newCar = {};
    for (let [key, value] of form.entries()) {
        console.log(key, value);
        newCar[key] = value;
    }
    cars = carsPagination;
    cars.unshift(newCar);
    store.set('cars', cars);
    console.log(newCar);
    $('.modal--carro').classList.remove('active');
    render(cars);
    e.target.reset();
});

// search
const options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "combustivel",
        "marca"
    ]
};
let fuse = new Fuse(carsPagination, options); // "list" is the item array

$('.search form').addEventListener('submit', function (e) {
    e.preventDefault();
    let search = $('.search input').value;
    let result = fuse.search(search);
    console.info(result);
    render(result, true);
});

$('.search input').addEventListener('input', function (e) {
    if(!e.target.value){
        console.log("no search");
        render(carsPagination);
    }
});



//route
const root = null;
const useHash = true;
const hash = '#!';
const router = new Navigo(root, useHash, hash);
router
    .on({
        '/carros/:id': function (param){
            console.info("page ", param.id);
            if(isNaN(param.id)) router.navigate('/carros');

            let pageCars = carsPagination;
            if (param.id > 1){

                pageCars = carsPagination.slice( ((param.id*5) - 5), (param.id*5) );
                if(!pageCars.length){
                    router.navigate('/carros');
                    pageCars = carsPagination.slice(0, 5);
                    render(pageCars);
                }else{
                    render(pageCars);
                }

            }else{
                pageCars = carsPagination.slice(0, 5);
                render(pageCars);
            }

            //active page
            Array.from($$('#pagination li')).forEach( li => li.classList.remove('active'));
            $('#page-'+param.id).closest('li').classList.add('active');
        },
        'carros': function () {
            console.log('home');
        },
        '*': function () {
            router.navigate('/carros');
        }
    })
    .resolve();