// script.js
function calculate() {
  // Basic inputs
  const birthdate = document.getElementById('birthdate').value;
  const birthhour = parseInt(document.getElementById('birthhour').value);
  const gender = document.getElementById('gender').value;
  const yearBuild = parseInt(document.getElementById('yearBuild').value);
  const houseDir = document.getElementById('houseDirection').value;

  if (!birthdate || isNaN(birthhour) || isNaN(yearBuild)) {
    alert('Vui lòng nhập đầy đủ Ngày sinh, Giờ sinh và Năm xây nhà.');
    return;
  }

  // Can Chi & Element
  const birthYear = new Date(birthdate).getFullYear();
  const stems = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const branches = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  const stem = stems[(birthYear - 4) % 10];
  const branch = branches[(birthYear - 4) % 12];
  const canChi = stem + ' ' + branch;
  let element;
  if (['Giáp','Ất'].includes(stem)) element = 'Mộc';
  else if (['Bính','Đinh'].includes(stem)) element = 'Hỏa';
  else if (['Mậu','Kỷ'].includes(stem)) element = 'Thổ';
  else if (['Canh','Tân'].includes(stem)) element = 'Kim';
  else element = 'Thủy';

  // Kua calculation
  let lastTwo = birthYear % 100;
  let a = Math.floor(lastTwo/10) + (lastTwo%10);
  if (a > 9) a = Math.floor(a/10) + (a%10);
  let K = birthYear < 2000
    ? (gender==='nam'?10-a:5+a)
    : (gender==='nam'?9-a:6+a);
  if (K>9) K = Math.floor(K/10)+(K%10);
  const kuaMap = {1:'Khảm',2:'Khôn',3:'Chấn',4:'Tốn',6:'Càn',7:'Đoài',8:'Cấn',9:'Ly'};
  const kua = K === 5 ? (gender==='nam'?'Khôn':'Cấn') : kuaMap[K];
  const quaiMenh = kua + ' Mệnh';

  // Age
  const age = yearBuild - birthYear + 1;

  // Kim Lau, Tam Tai, Hoang Oc
  const kimLau = [1,3,6,8].includes(age % 9);
  const tamTaiGroups = {
    'Thân': ['Thân','Tý','Thìn'],
    'Tỵ': ['Tỵ','Dậu','Sửu'],
    'Hợi': ['Hợi','Mão','Mùi'],
    'Dần': ['Dần','Ngọ','Tuất']
  };
  let tamTai = false;
  Object.values(tamTaiGroups).forEach(arr => { if (arr.includes(branch)) tamTai = true; });
  const hoangOcSets = [['Cấn','Đoài','Càn','Khảm'], ['Ly','Khôn','Chấn','Tốn'], ['Cận','Khảm','Ly','Khôn'], ['Đoài','Chấn','Tốn','Cấn']];
  let hoangOc = hoangOcSets.some(set => set.includes(kua));

  // Read form values
  const vals = {
    slope: document.getElementById('slope').value,
    slopeDir: document.getElementById('slopeDir').value,
    road: document.getElementById('road').value,
    roadDir: document.getElementById('roadDir').value,
    waterDistance: parseFloat(document.getElementById('waterDistance').value) || Infinity,
    hospital: document.getElementById('hospital').value,
    temple: document.getElementById('temple').value,
    church: document.getElementById('church').value,
    cemetery: document.getElementById('cemetery').value
  };

  // Determine bad factors
  const bad = {
    slopeBad: vals.slope !== 'bằng phẳng',
    slopeDirBad: vals.slopeDir === 'tụ khí',
    deadEnd: vals.road === 'cụt',
    roadDirect: vals.roadDir === 'trực diện',
    waterBad: vals.waterDistance < 10,
    hospitalBad: vals.hospital !== 'không',
    templeBad: vals.temple !== 'không',
    churchBad: vals.church !== 'không',
    cemeteryBad: vals.cemetery !== 'không'
  };

  // Scoring
  let score = 100;
  if (kimLau) score -= 15;
  if (tamTai) score -= 10;
  if (hoangOc) score -= 15;
  Object.values(bad).forEach(v => { if (v) score -= 5; });
  const goodDirs = {'Kim':['Tây','Tây Bắc','Đông Bắc'],'Mộc':['Đông','Đông Nam'],'Thủy':['Bắc','Đông Nam'],'Hỏa':['Nam'],'Thổ':['Tây Nam','Đông Bắc']};
  if (goodDirs[element]?.includes(houseDir)) score += 10;

  // Render
  const resultBox = document.getElementById('result');
  const scoreBox = document.getElementById('score');
  let html = `<h2>Kết quả tra cứu phong thủy</h2>`;
  html += `<p><strong>Can Chi:</strong> ${canChi}</p>`;
  html += `<p><strong>Ngũ hành:</strong> ${element}</p>`;
  html += `<p><strong>Quái mệnh:</strong> ${quaiMenh}</p>`;
  html += `<p><strong>Tuổi xây nhà:</strong> ${age} (${kimLau?'Phạm Kim Lâu':'Không phạm Kim Lâu'}, ${hoangOc?'Phạm Hoang Ốc':'Không phạm Hoang Ốc'}, ${tamTai?'Phạm Tam Tai':'Không phạm Tam Tai'})</p>`;
  html += `<h3>Yếu tố xấu phát hiện:</h3><ul>`;
  Object.entries(bad).forEach(([k,v]) => { if(v) html += `<li>${k}</li>`; });
  html += `</ul>`;
  resultBox.innerHTML = html;
  let evalText = score>=90?'Rất tốt':score>=75?'Tốt':score>=60?'Trung bình':score>=40?'Yếu':'Rất xấu';
  scoreBox.innerHTML = `<h2>Điểm phong thủy: ${score}</h2><p>Đánh giá: ${evalText}</p>`;
}
