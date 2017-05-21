const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// .closest() polyfill
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

// init
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

function render (cars) {
    console.log("render", cars);
    let template = `
${cars.map(car =>
        `<tr>
        <td>${car.placa}</td>
        <td>${car.modelo}</td>
        <td>${car.marca}</td>
        <td>${car.imagem ? `<a href="${car.imagem}" class="foto">Imagem</a>` : 'Sem foto'}</td>
        <td>${car.combustivel}</td>
        <td>${car.valor}</td>
    </tr>`).join('')
        }
`;
    $('#data').innerHTML = template;
}
render(cars);

Array.from($$('.foto')).forEach( foto => foto.addEventListener('click', function (e) {
    e.preventDefault();
    let source = e.target.href;
    $('.modal-foto img').src = source;
    $('.modal-foto').classList.add('active');
}));



$('.modal-foto .close').addEventListener('click', function (e) {
    console.log("close", e.target.parentNode)
    e.preventDefault();
    e.target.closest('.modal-foto').classList.remove('active');
})

$('.btn.cadastro').addEventListener('click', function () {
    $('.modal-carro').classList.add('active');
    $('.modal-carro form').addEventListener('submit', function (e) {
        e.preventDefault();
        let form = new FormData(e.target)
        let newCar = {};
        for (let [key, value] of form.entries()) {
            newCar[key] = value;
        }
        cars.unshift(newCar);
        store.set('cars', cars);
        console.log(newCar);
        $('.modal-carro').classList.remove('active');
        //alert('sucesso');
        render(cars);
    });
});
