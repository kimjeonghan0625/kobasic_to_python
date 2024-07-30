function preprocess(input) {
  const lines = input.split('\n');

  const result = lines.map(line => {
      if (tl = line.trim()) {
          if(forMatch = tl.match(/^(\d+)\s+(FOR|반복}|for)/)) {
            const number = forMatch[1];
            tl = tl.replace(number, `${number} (`)
          } else if (nextMatch = tl.match(/(\d+\s+(NEXT|다음|next) .+)/)) {
            const stmt = nextMatch[1];
            tl = tl.replace(stmt, `${stmt})`)
          } 
          return `(${tl})`;
      }
      return line;
  });

  return result.join('\n');
}

function sortArrayByLineNumber(arr) {
  const header = arr[0];
  const lines = arr.slice(1);
  
  lines.sort((a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a[0] - b[0];
    }
    return 0;
  });

  return [header, ...lines];
}

// const input = `
//   10 입력 "숫자를 적으세요"; 변수1
//   20 서브루틴 100
//   30 출력 "제곱은"; 변수2
//   40 끝
//   50   for i = 1 부터 10
//   60 출력 i
//   70    next     i

//   100 변수2 = 변수1 * 변수1
//   110 반환
// `;

// 함수 호출 및 결과 출력
// const output = preprocess(input);
// console.log(output);

module.exports = {
  preprocess, sortArrayByLineNumber
}
