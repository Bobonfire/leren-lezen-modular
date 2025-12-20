function buildProblems(){
  const problems = [];
  for(let a = 0; a <= 10; a++){
    for(let b = 0; b <= 10; b++){
      const sum = a + b;
      if(sum <= 10){
        problems.push({
          a,
          b,
          answer: sum,
          label: `${a} + ${b}`,
          key: `${a}+${b}`
        });
      }
    }
  }
  return problems;
}

export const MATH_PROBLEMS = buildProblems();
