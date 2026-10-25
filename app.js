'use strict';
const input = document.getElementById('keyword');
const cards = document.getElementById('cards');
const count = document.getElementById('count');
const message = document.getElementById('message');
let articles = [];
function appendBody(element, text, query) {
  if (!query) { element.textContent = text; return; }
  const lower = text.toLocaleLowerCase('ko');
  const needle = query.toLocaleLowerCase('ko');
  let start = 0;
  let index;
  while ((index = lower.indexOf(needle, start)) !== -1) {
    element.append(document.createTextNode(text.slice(start, index)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(index, index + query.length);
    element.append(mark);
    start = index + query.length;
  }
  element.append(document.createTextNode(text.slice(start)));
}
function render() {
  const query = input.value.trim();
  const results = articles.filter(article => article['본문'].toLocaleLowerCase('ko').includes(query.toLocaleLowerCase('ko')));
  cards.replaceChildren();
  count.textContent = '결과 ' + results.length + '건 / 전체 ' + articles.length + '건';
  message.hidden = results.length !== 0;
  message.textContent = '검색 결과가 없습니다. 다른 키워드를 입력해 주세요.';
  results.forEach(article => {
    const card = document.createElement('article'); card.className = 'card';
    const number = document.createElement('span'); number.className = 'article-number'; number.textContent = article['조'];
    const title = document.createElement('h3'); title.textContent = article['제목'];
    const body = document.createElement('p'); body.className = 'body'; appendBody(body, article['본문'], query);
    card.append(number, title, body); cards.append(card);
  });
}
input.addEventListener('input', render);
document.getElementById('clear').addEventListener('click', () => { input.value = ''; render(); input.focus(); });
fetch('./조항데이터.json').then(response => {
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}).then(data => {
  if (!Array.isArray(data) || !data.every(a => ['조','제목','본문'].every(k => typeof a[k] === 'string'))) throw new Error('Invalid data');
  articles = data; render();
}).catch(() => {
  count.textContent = '데이터를 불러오지 못했습니다.';
  message.hidden = false;
  message.textContent = '조항데이터.json의 위치를 확인해 주세요. HTML 파일을 직접 열지 말고 배포 주소 또는 로컬 웹서버로 접속해 주세요.';
});
