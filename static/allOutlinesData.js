const list = document.getElementById('allOutlines-list');

const outlinesArr = JSON.parse(localStorage.getItem('allCoursesArray'));
for (let i = 0; i < outlinesArr.length; i++) {
  const li = document.createElement('li');
  li.id = 'allOutlines-li';

  const div = document.createElement('div');
  div.id = 'allOutlines-div';

  const h1 = document.createElement('h1');
  h1.id = 'allOutlines-h1';

  const p1 = document.createElement('p');
  p1.id = 'allOutlines-p';

  const p2 = document.createElement('p');
  p2.id = 'allOutlines-p';

  h1.textContent = outlinesArr[i].courseCode;
  p1.textContent = 'Course code: ' + outlinesArr[i].courseCode;
  p2.textContent = 'Instructor: ' + outlinesArr[i].instructor;
  
  div.appendChild(h1);
  div.appendChild(p1);
  div.appendChild(p2);

  li.appendChild(div);
  list.appendChild(li);
}