const galleryList = document.querySelector('ul.swiper-wrapper');
const galleryData = [];

function buildGallery() {
    let galleryMarckup = '';

    for (let i = 0; i < 8; i++) {
        const altInfo = `vimeo-player-${i+1}`;
        const sourceVideo = "https://player.vimeo.com/video/824804225";
        
        galleryMarckup += `
            <li class="swiper-slide">
                <a class="link" href="${sourceVideo}">
                    <img
                        src="https://i.vimeocdn.com/video/1666894951-d3fc47ae1d5f09250c468b79e4063afa7142163b5734eacb2277ea28acd44b52-d?mw=80&q=85"
                        alt="${altInfo}"
                    />
                </a>
            </li>
        `;

        galleryData.push({ source: sourceVideo, alt: altInfo })
    };
    galleryList.insertAdjacentHTML('afterbegin', galleryMarckup);

    const swiper = new Swiper('.swiper', {
        // Optional parameters
        slidesPerView: 4,
        slidesPerGroup: 4,

        freeMode: {
            enabled: true,
        },
      
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });
}

function initDataModal(altId) {
    const initialSwiperSlide = parseInt(altId.match(/\d+/)) - 1;

    let modalMarckup = '';
    let contentModalMarckup = '';

    const players = [];

    galleryData.forEach((galleryItem) => {
        const { source, alt } = galleryItem;

        contentModalMarckup += `
            <li class="swiper-slide">
                <iframe
                    id="${alt}"
                    src="${source}"
                    width="100%"
                    height="660"
                    frameborder="0"
                    allowfullscreen
                    allow="autoplay; encrypted-media"
                ></iframe>
            </li>
        `;
    });

    modalMarckup += `
        <div class="modal">
            <div class="swiper">
                <ul class="swiper-wrapper">
                    ${contentModalMarckup}
                </ul>
                <div class="swiper-pagination"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalMarckup);
    const modalShow = document.querySelector('div.modal');
    document.addEventListener('keydown', closeModal);
    modalShow.addEventListener('click', closeModal);

    const iframes = modalShow.querySelectorAll('li iframe');
    // console.log(iframes);

    iframes.forEach((iframeItem) => {
        const player = new Vimeo.Player(iframeItem);
        players.push(player);
    });

    const swiperModal = new Swiper('.modal .swiper', {
        // Optional parameters
        slidesPerView: 1,
        initialSlide: initialSwiperSlide,

        freeMode: {
            enabled: true,
        },
      
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },

        on: {
            beforeSlideChangeStart: function (event) {
                players[event.activeIndex].pause();
            },
        },
    });
}

function openModal(event) {
    event.preventDefault();
    if (event.target.nodeName !== 'IMG') {
        return;
    }
    const { alt } = event.target;
    initDataModal(alt);
}

function closeModal(event) {
    const modal = document.querySelector('div.modal');
    if (event.code === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', closeModal);
    }
    if (event.target === event.currentTarget) {
        modal.remove();
        modal.removeEventListener('click', closeModal);
    }
}

buildGallery();
galleryList.addEventListener('click', openModal);