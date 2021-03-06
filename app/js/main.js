$(function () {
    
    $('#cityFind').styler();

    $('.jq-selectbox__dropdown ul').mCustomScrollbar({
        autoHideScrollbar: false
    })

    $('select').formSelect();

    $('.del-tag').on('click', function () {
        $(this).toggleClass('active');
    })


    function initMap(map){
        ymaps.ready(init);
        function init() {
            var myMap = new ymaps.Map(map, {
                center: [55.76, 37.64],
                zoom: 7
            });
            
            if($('#delMap').length != 0){
                document.getElementById('delMap').onclick = function () {
                    myMap.destroy();
                };
            }
            
            
            
            
            // Координаты меток на карте
            let coordinates = [
                {
                    id: 'place1',
                    main: true,  //Метка "Ваш объект"
                    coordinates: [55.71677, 37.482338]
                },
                {
                    id: 'place2',
                    main: false,
                    coordinates: [54.837789, 34.524173]
                },
                {
                    id: 'place3',
                    main: false,
                    coordinates: [56.903489, 36.805884]
                },
                {
                    id: 'place4',
                    main: false,
                    coordinates: [56.703489, 33.805884]
                },
                {
                    id: 'place5',
                    main: false,
                    coordinates: [56.703489, 38.805884]
                },
                {
                    id: 'place6',
                    main: false,
                    coordinates: [55.703489, 38.805884]
                }
            ]
            let selectedIcons = []

            function declOfNum(number, words) {  
                return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
            }
            function addAnalogsQuantity(){
                let analogs = coordinates.filter(x => x.main != true)
                let text = declOfNum(analogs.length, ['аналог', 'аналога', 'аналогов']);
                $('#analogs').text(analogs.length)
                $('#analogsText').text(text)
            }

            function printSelected(){
                if(selectedIcons.length != 0){
                    $('#selectedItems').closest('.button').removeClass('disabled')
                }else{
                    $('#selectedItems').closest('.button').addClass('disabled')
                }
                $('#selectedItems').text(selectedIcons.length)
            }

            function createMarker(option){
                let coords = option.coordinates;
                let mainMarker = option.main
                let mainMarkerID = option.id

                // Шаблон для остальных меток
                var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                    "<div class='my-marker'></div>"
                );
                // Шаблон для метки "Ваш объект"
                var MyMainIconContentLayout = ymaps.templateLayoutFactory.createClass(
                    `
                    <div class='my-marker'>
                        <p class='markerText'>Ваш объект</p>
                    </div>
                    `
                );

                let markerOptions = {
                    "iconLayout": 'default#imageWithContent',
                    "iconImageHref": 'img/png/mapMarker.png',
                    "iconImageSize": [48, 48],
                    "iconImageOffset": [0, 0],
                    "iconContentOffset": [0, 0],
                    "iconContentLayout": MyIconContentLayout,
                    "id": mainMarkerID,
                    "mainMarker": mainMarker,
                    "hideIcon": false,
                    "hideIconOnBalloonOpen": false
                }

                // Я не знаю почему, но я не могу добавить подпись к кастомной иконке:(
                let mainMarkerOptions = {
                    "iconLayout": 'default#imageWithContent',
                    "iconImageHref": 'img/png/mapMarkerMain.png',
                    "iconImageSize": [48, 48],
                    "iconImageOffset": [0, 0],
                    "iconContentOffset": [0, 0],
                    "iconContentLayout": MyMainIconContentLayout,
                    "id": mainMarkerID,
                    "mainMarker": mainMarker,
                    "hideIcon": false,
                    "hideIconOnBalloonOpen": false
                }


                let marker;

                // Если метка "Ваш объект", выбрать другой шаблон для иконки
                if(mainMarker){
                    marker = new ymaps.Placemark(coords, null, mainMarkerOptions);
                }else{
                    marker = new ymaps.Placemark(coords, {balloonContent: 'Ул.Улица<br>Дом 130'}, markerOptions);
                }
                

                marker.events.add('click', function(e) {
                    let id;
                    if(!e.get('target').options.get('mainMarker')){
                        if(e.get('target').options.get('active')){
                            id = e.get('target').options.get('id')
                            e.get('target').options.set('active', false);
                            e.get('target').options.set('iconImageHref', 'img/png/mapMarker.png');
                            let selectedItem = coordinates.find(x => x.id == id);
                            selectedIcons.pop(selectedItem)  //массив с выбранными адресами
                            printSelected();
                            
                        }else{
                            id = e.get('target').options.get('id')
                            e.get('target').options.set('active', true);
                            e.get('target').options.set('iconImageHref', 'img/png/mapMarkerSelected.png');
                            let selectedItem = coordinates.find(x => x.id == id);
                            selectedIcons.push(selectedItem) //массив с выбранными адресами
                            printSelected();
                            
                        }
                    }
                });
                return marker
            }
        
            $.each(coordinates, (i, el) => {
                myMap.geoObjects.add(createMarker(el));
            })
            addAnalogsQuantity(); 
           
            
        }
    }

    //Карта
    if ($('#map').length != 0) {
        
        let map = initMap('map');
    }

    // 
    $('.switch input').on('input', function(){
        $(this).closest('.table-row__title').toggleClass('inactive')
        $(this).closest('.table-row__title').siblings('.table-discription').toggleClass('disabled')
    })

    $('.tags-block .tag').on('click', function(){
        $(this).toggleClass('active')
    })

    $('#addAnalog').on('click', function(){
    
        $.fancybox.open({ 
            src : '#modal',
            afterShow: function(){
                initMap('madalMap', false);
            },
            afterClose: function(){
                $('#delMap').trigger('click')
            },
            touch: false
        });
    })

    $.each($('input[type="text"]:not(.select-dropdown), input[type="number"]'),(i, el)=>{
        if($(el).val()){
            $(el).addClass('notEmpty withIcon')
        }else{
            $(el).removeClass('notEmpty withIcon')

        }
    })

    $('input[type="text"]:not(.select-dropdown), input[type="number"]').on('input', function(){
        if($(this).val()){
            $(this).addClass('notEmpty withIcon')
        }else{
            $(this).removeClass('notEmpty withIcon')
        }
    })

    $.each($('.select-wrapper'), (i, el)=>{
        if(!$(el).find('.selected').hasClass('disabled')){
            $(el).addClass('no-empty')
        }
    })
   
    $('input.select-dropdown').on('input', function(){
        let selectWrapper = $(this).closest('.select-wrapper');
        if(selectWrapper.find('.selected').hasClass('disabled')){
            selectWrapper.addClass('no-empty')
        }else{
            selectWrapper.removeClass('no-empty')
        }
    })

    $("select").on('change', function() {
        $(this).closest('.select-wrapper').addClass('no-empty')
    })

  
    $(".table-container").on('scroll', function(e) { 
        var ele = $(e.currentTarget);
        var left = ele.scrollLeft();
        var top = ele.scrollTop();
        if (ele.attr("id") === 'scrollBlock1') {
          
            $("#scrollBlock2").scrollLeft(left);
        } else {
         
            $("#scrollBlock1").scrollLeft(left);
        }
    });
   
})

