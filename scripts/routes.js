/***
 * ROUTES
 */
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