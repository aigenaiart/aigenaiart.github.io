const works = [...document.querySelectorAll('.work')];
const filters = [...document.querySelectorAll('[data-filter]')];
const modal = document.querySelector('.modal');
const menu = document.querySelector('.menu');
const counter = document.querySelector('[data-counter]');
let series = 'all';
let position = 0;

function currentWorks() {
  return works.filter(work => series === 'all' || work.dataset.series === series);
}

function render() {
  const visible = currentWorks();
  if (position >= visible.length) position = 0;
  works.forEach(work => work.hidden = work !== visible[position]);
  counter.textContent = `${String(position + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  filters.forEach(button => button.classList.toggle('active', button.dataset.filter === series));
}

function move(step) {
  const total = currentWorks().length;
  position = (position + step + total) % total;
  render();
}

filters.forEach(button => button.addEventListener('click', () => {
  series = button.dataset.filter;
  position = 0;
  render();
  menu.hidden = true;
  document.body.classList.remove('locked');
  document.querySelector('#works').scrollIntoView({behavior: 'smooth'});
}));

document.querySelector('[data-prev]').addEventListener('click', () => move(-1));
document.querySelector('[data-next]').addEventListener('click', () => move(1));

works.forEach(work => work.querySelector('.image-wrap').addEventListener('click', () => {
  modal.querySelector('img').src = work.dataset.img;
  modal.querySelector('img').alt = work.dataset.title;
  modal.querySelector('h2').textContent = work.dataset.title;
  modal.querySelector('p').textContent = work.dataset.en;
  modal.hidden = false;
  document.body.classList.add('locked');
}));

document.querySelector('[data-close-modal]').addEventListener('click', () => {
  modal.hidden = true;
  document.body.classList.remove('locked');
});
document.querySelector('[data-open-menu]').addEventListener('click', () => {
  menu.hidden = false;
  document.body.classList.add('locked');
});
document.querySelector('[data-close-menu]').addEventListener('click', () => {
  menu.hidden = true;
  document.body.classList.remove('locked');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    modal.hidden = true;
    menu.hidden = true;
    document.body.classList.remove('locked');
  }
  if (!modal.hidden || !menu.hidden) return;
  if (event.key === 'ArrowLeft') move(-1);
  if (event.key === 'ArrowRight') move(1);
});

render();
