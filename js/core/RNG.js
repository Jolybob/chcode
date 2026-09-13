export const rng={
  int(min,max){return Math.floor(Math.random()*(max-min+1))+min},
  float(min,max){return Math.random()*(max-min)+min},
  chance(p){return Math.random()<p}
};
